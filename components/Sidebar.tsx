import React from 'react';
import { LayoutDashboard, Package, PlusCircle, ChefHat, BarChart3, Settings, LogOut, ClipboardList } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Kitchen Ops', icon: LayoutDashboard },
    { id: 'inventory', label: 'Stock List', icon: ClipboardList },
    { id: 'add', label: 'Stock Intake', icon: PlusCircle },
    { id: 'recipes', label: 'Daily Specials', icon: ChefHat },
    { id: 'analytics', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-700">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg">
          K
        </div>
        <span className="font-bold text-xl hidden md:block tracking-tight">KitchenOps</span>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-2 md:px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="hidden md:block font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden md:block"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        <button className="flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white w-full transition-colors">
          <Settings size={22} />
          <span className="hidden md:block font-medium">Settings</span>
        </button>
        <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 w-full transition-colors rounded-lg"
        >
          <LogOut size={22} />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
