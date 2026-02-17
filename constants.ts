import { Category, InventoryItem, Unit } from './types';

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Basmati Rice (Royal)',
    category: Category.DRY_STORAGE,
    quantity: 12,
    unit: Unit.KG,
    location: 'Shelf B-04',
    addedDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 180 * 86400000).toISOString(),
    minStockLevel: 20
  },
  {
    id: '2',
    name: 'Heavy Cream 35%',
    category: Category.DAIRY,
    quantity: 4,
    unit: Unit.L,
    location: 'Walk-in Fridge 1',
    addedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    minStockLevel: 6
  },
  {
    id: '3',
    name: 'Ribeye Loin (Whole)',
    category: Category.MEAT_SEAFOOD,
    quantity: 3,
    unit: Unit.KG,
    location: 'Meat Locker',
    addedDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    minStockLevel: 5
  },
  {
    id: '4',
    name: 'San Marzano Tomatoes',
    category: Category.DRY_STORAGE,
    quantity: 18,
    unit: Unit.CAN,
    location: 'Shelf A-02',
    addedDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
    minStockLevel: 12
  },
  {
    id: '5',
    name: 'Atlantic Salmon Filets',
    category: Category.MEAT_SEAFOOD,
    quantity: 8,
    unit: Unit.KG,
    location: 'Fish Fridge',
    addedDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(), // Expiring soon
    minStockLevel: 5
  },
  {
    id: '6',
    name: 'Grey Goose Vodka',
    category: Category.ALCOHOL,
    quantity: 14,
    unit: Unit.BOTTLE,
    location: 'Bar Storage',
    addedDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 700 * 86400000).toISOString(),
    minStockLevel: 10
  }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.PRODUCE]: 'bg-green-100 text-green-800',
  [Category.DAIRY]: 'bg-yellow-100 text-yellow-800',
  [Category.MEAT_SEAFOOD]: 'bg-red-100 text-red-800',
  [Category.DRY_STORAGE]: 'bg-orange-100 text-orange-800',
  [Category.FREEZER]: 'bg-cyan-100 text-cyan-800',
  [Category.ALCOHOL]: 'bg-purple-100 text-purple-800',
  [Category.SUPPLIES]: 'bg-gray-100 text-gray-800',
  [Category.COLD_ROOM]: 'bg-blue-100 text-blue-800',
};
