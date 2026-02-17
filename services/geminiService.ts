import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, Category, Unit, Recipe } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePantryImage = async (base64Image: string): Promise<Partial<InventoryItem>[]> => {
  try {
    const modelId = "gemini-2.5-flash-image"; 
    
    const prompt = `
      Analyze this image of a hotel kitchen pantry or delivery area. 
      Identify distinct commercial food items or packaging (crates, cases, #10 cans, whole cuts of meat).
      
      For each item, provide:
      1. A commercial product name (e.g., "Whole Milk 4L", "San Marzano Tomatoes Case").
      2. The category: Dry Storage, Cold Room, Freezer, Meat & Seafood, Produce, Dairy & Eggs, Alcohol & Bar, Cleaning & Supplies.
      3. Estimated quantity (count distinct units/cases).
      4. Commercial unit: Case, kg, L, Bottle, Can (#10), Pack, Unit.
      5. Estimated shelf life in days from now (be conservative for food safety).
      
      Return ONLY a raw JSON array.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              daysUntilExpiry: { type: Type.NUMBER }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const parsed = JSON.parse(text);
    
    return parsed.map((item: any) => ({
      name: item.name,
      category: mapCategory(item.category),
      quantity: item.quantity,
      unit: mapUnit(item.unit),
      expiryDate: new Date(Date.now() + (item.daysUntilExpiry || 7) * 86400000).toISOString(),
      addedDate: new Date().toISOString(),
      minStockLevel: 0 // Default
    }));

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

export const generateSmartRecipes = async (inventory: InventoryItem[]): Promise<Recipe[]> => {
  try {
    const modelId = "gemini-3-flash-preview";

    // Filter for items expiring soon or overstocked
    const priorityItems = inventory
        .filter(i => {
            const daysLeft = (new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24);
            return daysLeft < 4;
        })
        .map(i => `${i.quantity} ${i.unit} ${i.name}`);

    const prompt = `
      You are the Head Chef of a hotel.
      We have the following items expiring soon that need to be used to reduce waste cost:
      ${priorityItems.join(', ')}

      Suggest 3 "Daily Specials" or "Staff Meals" to use these up.
      
      Return JSON format.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['Daily Special', 'Staff Meal', 'Soup of Day'] },
              ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
              profitMarginPotential: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
              notes: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);

  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
}

// Helpers
function mapCategory(cat: string): Category {
  // Loose matching for AI output
  const c = cat.toLowerCase();
  if (c.includes('meat') || c.includes('fish') || c.includes('sea')) return Category.MEAT_SEAFOOD;
  if (c.includes('dry') || c.includes('pantry') || c.includes('grain')) return Category.DRY_STORAGE;
  if (c.includes('cold') || c.includes('fridge')) return Category.COLD_ROOM;
  if (c.includes('freeze')) return Category.FREEZER;
  if (c.includes('produce') || c.includes('veg') || c.includes('fruit')) return Category.PRODUCE;
  if (c.includes('dairy') || c.includes('egg') || c.includes('milk')) return Category.DAIRY;
  if (c.includes('alcohol') || c.includes('bar') || c.includes('wine')) return Category.ALCOHOL;
  return Category.SUPPLIES;
}

function mapUnit(unit: string): Unit {
  const u = unit.toLowerCase();
  if (u.includes('case') || u.includes('box') || u.includes('crate')) return Unit.CASE;
  if (u.includes('kg') || u.includes('kilo')) return Unit.KG;
  if (u.includes('l') || u.includes('liter')) return Unit.L;
  if (u.includes('bottle')) return Unit.BOTTLE;
  if (u.includes('can') || u.includes('tin')) return Unit.CAN;
  if (u.includes('pack') || u.includes('bag')) return Unit.PACK;
  return Unit.UNIT;
}
