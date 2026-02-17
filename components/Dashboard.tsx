import React from 'react';
import { InventoryItem } from '../types';
import { AlertTriangle, CheckCircle2, Package, TrendingDown, DollarSign, ListChecks } from 'lucide-react';

interface DashboardProps {
  items: InventoryItem[];
  onChangeView: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ items, onChangeView }) => {
  const totalItems = items.length;
  // Critical stock: Items below minStockLevel or just general low count if not set
  const lowStock = items.filter(i => i.quantity <= (i.minStockLevel || 3)).length;
  
  const expiringSoon = items.filter(i => {
    const diff = new Date(i.expiryDate).getTime() - new Date().getTime();
    const days = diff / (1000 * 3600 * 24);
    return days >= 0 && days <= 4;
  }).length;

  const expiredItems = items.filter(i => new Date(i.expiryDate) < new Date()).length;

  const cards = [
    { label: 'Total SKUs', value: totalItems, icon: Package, color: 'bg-indigo-500', sub: 'Active Inventory' },
    { label: 'Low Stock Alerts', value: lowStock, icon: AlertTriangle, color: 'bg-orange-500', sub: 'Reorder Needed' },
    { label: 'Waste Risk', value: expiringSoon, icon: TrendingDown, color: 'bg-red-500', sub: 'Items expiring < 4 days' },
    { label: 'Stock Value', value: '~$4.2k', icon: DollarSign, color: 'bg-green-600', sub: 'Estimated' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Kitchen Operations</h1>
          <p className="text-slate-500 mt-1">Shift Overview: Morning Prep</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => onChangeView('recipes')}
                className="bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-6 py-3 rounded-xl font-semibold transition-all"
            >
                Plan Specials
            </button>
            <button 
                onClick={() => onChangeView('add')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
            >
                <ListChecks size={20} /> Stock Check
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">{card.label}</p>
                        <h3 className="text-3xl font-bold text-slate-800">{card.value}</h3>
                        <p className={`text-xs mt-2 px-2 py-1 rounded-full w-fit bg-slate-100 text-slate-600`}>
                            {card.sub}
                        </p>
                    </div>
                    <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg shadow-opacity-20`}>
                        <Icon size={24} />
                    </div>
                </div>
            )
        })}
      </div>

      {/* Critical Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-500" />
                    Critical Low Stock
                </h3>
                <button className="text-indigo-600 text-sm font-medium hover:underline">Print Order Sheet</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-3 rounded-l-lg">Item</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">On Hand</th>
                            <th className="p-3 rounded-r-lg text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {items.filter(i => i.quantity <= (i.minStockLevel || 3)).slice(0, 5).map((item, i) => (
                            <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-medium text-slate-800">{item.name}</td>
                                <td className="p-3 text-slate-500">{item.location || 'N/A'}</td>
                                <td className="p-3 text-red-600 font-bold">{item.quantity} {item.unit}</td>
                                <td className="p-3 text-right">
                                    <button className="text-indigo-600 font-medium hover:underline">Reorder</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold mb-4">Chef's Notes</h3>
                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-yellow-500">
                        <p className="text-xs text-slate-400 mb-1">Alert • 2h ago</p>
                        <p className="text-sm">Health Inspector visit scheduled for next Tuesday. Ensure cold room logs are updated.</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-blue-500">
                        <p className="text-xs text-slate-400 mb-1">Delivery • 10:00 AM</p>
                        <p className="text-sm">Sysco truck arriving. Expecting 20 cases of Fries.</p>
                    </div>
                </div>
            </div>
            <button className="w-full py-3 bg-slate-800 text-slate-300 font-medium rounded-xl mt-6 hover:bg-slate-700 transition-colors">
                + Add Note
            </button>
        </div>
      </div>
    </div>
  );
};
