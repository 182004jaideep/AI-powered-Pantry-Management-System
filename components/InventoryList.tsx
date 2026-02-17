import React, { useState, useMemo } from 'react';
import { InventoryItem, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Search, Filter, Trash2, Edit2, AlertCircle } from 'lucide-react';

interface InventoryListProps {
  items: InventoryItem[];
  onDelete: (id: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ items, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'expiry' | 'name' | 'added'>('expiry');

  const getDaysUntilExpiry = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (days: number) => {
    if (days < 0) return { label: 'Expired', color: 'bg-red-500 text-white' };
    if (days <= 3) return { label: 'Expiring Soon', color: 'bg-orange-500 text-white' };
    return { label: 'Fresh', color: 'bg-green-500 text-white' };
  };

  const filteredItems = useMemo(() => {
    return items
      .filter(item => 
        (filterCategory === 'All' || item.category === filterCategory) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'expiry') return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      });
  }, [items, searchTerm, filterCategory, sortBy]);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory</h2>
          <p className="text-slate-500">Manage your pantry items and track freshness.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-64"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="All">All Categories</option>
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm font-semibold border-b border-slate-200">
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Quantity</th>
                <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => setSortBy('expiry')}>
                  Status / Expiry
                </th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No items found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  const status = getExpiryStatus(daysLeft);
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 font-medium text-slate-800">{item.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category]}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {item.quantity} <span className="text-slate-400 text-sm">{item.unit}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="text-sm text-slate-500">
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} days ago` : `in ${daysLeft} days`}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => onDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};