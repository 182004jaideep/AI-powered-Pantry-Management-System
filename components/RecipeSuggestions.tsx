import React, { useState } from 'react';
import { InventoryItem, Recipe } from '../types';
import { generateSmartRecipes } from '../services/geminiService';
import { ChefHat, Clock, TrendingUp, Loader2, UtensilsCrossed } from 'lucide-react';

interface RecipeSuggestionsProps {
  items: InventoryItem[];
}

export const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ items }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateSmartRecipes(items);
    setRecipes(result);
    setLoading(false);
    setGenerated(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
            <UtensilsCrossed size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Daily Specials Planner</h2>
        <p className="text-slate-500 mb-8">
            Identify expiring stock and generate profitable specials or staff meals to reduce food cost.
        </p>
        
        {!generated && (
            <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-3 mx-auto"
            >
                {loading ? <Loader2 className="animate-spin" /> : <ChefHat />}
                {loading ? 'Analyzing Inventory...' : 'Generate Daily Specials'}
            </button>
        )}
      </div>

      {generated && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.length > 0 ? recipes.map((recipe, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{recipe.title}</h3>
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{recipe.type}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-6">
                            <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                                recipe.profitMarginPotential === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                <TrendingUp size={14} /> {recipe.profitMarginPotential} Margin
                            </span>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wider">Utilizing</h4>
                            <div className="flex flex-wrap gap-2">
                                {recipe.ingredientsUsed.map((ing, i) => (
                                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md border border-indigo-100">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                            "{recipe.notes}"
                        </div>
                    </div>
                </div>
            )) : (
                 <div className="col-span-full text-center py-12 text-slate-500">
                    <p>No critical inventory found for specials today. Good job!</p>
                 </div>
            )}
            
            <div className="col-span-full flex justify-center mt-8">
                 <button 
                    onClick={handleGenerate} 
                    className="text-indigo-600 font-medium hover:underline flex items-center gap-2"
                >
                    <Loader2 size={16} /> Regenerate options
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
