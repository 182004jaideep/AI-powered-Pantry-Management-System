import React from 'react';
import { InventoryItem, Category } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalyticsViewProps {
  items: InventoryItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ items }) => {
  // 1. Items by Category
  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    value: items.filter(i => i.category === cat).length
  })).filter(d => d.value > 0);

  // 2. Expiry Timeline (Mocked timeline based on real data)
  const expiryTimelineData = items
    .map(i => {
        const date = i.expiryDate.split('T')[0];
        return { date, count: 1 };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate by date
  const aggTimeline: Record<string, number> = {};
  expiryTimelineData.forEach(d => {
      aggTimeline[d.date] = (aggTimeline[d.date] || 0) + 1;
  });
  
  const lineChartData = Object.keys(aggTimeline).map(date => ({
      date,
      expiring: aggTimeline[date]
  })).slice(0, 7); // Show next 7 unique expiry dates for brevity

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Inventory Analytics</h2>
            <p className="text-slate-500">Visualizing your consumption habits and stock levels.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Distribution Pie Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-6">Category Distribution</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                    {categoryData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-xs text-slate-600">{entry.name} ({entry.value})</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expiry Bar Chart */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-6">Upcoming Expirations</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip cursor={{fill: '#f1f5f9'}} />
                            <Bar dataKey="expiring" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Mock Consumption Trend */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-700">Estimated Waste Reduction</h3>
                <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">+12% vs last month</span>
             </div>
             
             <div className="h-64 w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
                 <p className="text-slate-400 font-medium">Accumulating more data points...</p>
             </div>
         </div>
    </div>
  );
};
