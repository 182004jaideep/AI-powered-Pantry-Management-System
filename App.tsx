import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { InventoryList } from './components/InventoryList';
import { AddItemModal } from './components/AddItemModal';
import { RecipeSuggestions } from './components/RecipeSuggestions';
import { AnalyticsView } from './components/AnalyticsView';
import { MOCK_INVENTORY } from './constants';
import { InventoryItem } from './types';
import { Lock } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem('hotel_pantry_items');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(MOCK_INVENTORY);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
        localStorage.setItem('hotel_pantry_items', JSON.stringify(items));
    }
  }, [items]);

  const handleAddItem = (newItems: InventoryItem[]) => {
    setItems(prev => [...newItems, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                  <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4">
                        <Lock size={32} />
                      </div>
                      <h1 className="text-2xl font-bold text-slate-800">Staff Portal</h1>
                      <p className="text-slate-500">Kitchen Operations & Inventory</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Staff ID</label>
                          <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter ID..." />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Passcode</label>
                          <input type="password" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••" />
                      </div>
                      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                          Access Portal
                      </button>
                  </form>
                  <p className="text-center text-xs text-slate-400 mt-6">Authorized Personnel Only</p>
              </div>
          </div>
      )
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard items={items} onChangeView={setCurrentView} />;
      case 'inventory':
        return <InventoryList items={items} onDelete={handleDeleteItem} />;
      case 'recipes':
        return <RecipeSuggestions items={items} />;
      case 'analytics':
        return <AnalyticsView items={items} />;
      case 'add':
         setTimeout(() => {
            setShowAddModal(true);
            setCurrentView('inventory');
         }, 0);
         return <div className="p-8 text-center">Loading Module...</div>;
      default:
        return <Dashboard items={items} onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} onLogout={() => setIsLoggedIn(false)} />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 transition-all duration-300">
        <header className="flex justify-between items-center mb-6 md:hidden">
            <span className="font-bold text-xl text-slate-800">KitchenOps</span>
        </header>

        {renderContent()}
      </main>

      {showAddModal && (
        <AddItemModal 
            onAdd={handleAddItem} 
            onClose={() => setShowAddModal(false)} 
        />
      )}
    </div>
  );
}

export default App;
