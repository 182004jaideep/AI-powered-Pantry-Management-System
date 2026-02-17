export enum Category {
  DRY_STORAGE = 'Dry Storage',
  COLD_ROOM = 'Cold Room',
  FREEZER = 'Freezer',
  MEAT_SEAFOOD = 'Meat & Seafood',
  PRODUCE = 'Produce',
  DAIRY = 'Dairy & Eggs',
  ALCOHOL = 'Alcohol & Bar',
  SUPPLIES = 'Cleaning & Supplies'
}

export enum Unit {
  CASE = 'Case',
  KG = 'kg',
  L = 'L',
  BOTTLE = 'Bottle',
  CAN = 'Can (#10)',
  PACK = 'Pack',
  UNIT = 'Unit'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  location?: string; // e.g., "Shelf A2", "Walk-in 1"
  addedDate: string; // ISO Date
  expiryDate: string; // ISO Date
  minStockLevel?: number; // Reorder point
}

export interface Recipe {
  id: string;
  title: string;
  type: 'Daily Special' | 'Staff Meal' | 'Soup of Day';
  ingredientsUsed: string[];
  profitMarginPotential: 'High' | 'Medium' | 'Low';
  notes: string;
}
