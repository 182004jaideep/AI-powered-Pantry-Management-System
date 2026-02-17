import React, { useState, useRef } from 'react';
import { Camera, Type, ScanBarcode, Upload, X, Loader2, Plus, Check } from 'lucide-react';
import { InventoryItem, Category, Unit } from '../types';
import { analyzePantryImage } from '../services/geminiService';

interface AddItemModalProps {
  onAdd: (items: InventoryItem[]) => void;
  onClose: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onAdd, onClose }) => {
  const [mode, setMode] = useState<'manual' | 'camera' | 'barcode'>('manual');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Form State
  const [manualItem, setManualItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: Category.DRY_STORAGE,
    quantity: 1,
    unit: Unit.UNIT,
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });

  // Camera/Image Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      setPreviewImage(base64);
      setLoading(true);

      try {
        const detectedItems = await analyzePantryImage(base64Data);
        if (detectedItems.length > 0) {
           // Assign IDs
           const itemsWithIds = detectedItems.map(item => ({
             ...item,
             id: Math.random().toString(36).substr(2, 9),
             addedDate: new Date().toISOString()
           })) as InventoryItem[];
           
           onAdd(itemsWithIds);
           onClose();
        } else {
          alert("No items detected. Try another image.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to analyze image.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualItem.name) return;

    onAdd([{
      ...manualItem,
      id: Math.random().toString(36).substr(2, 9),
      addedDate: new Date().toISOString(),
      expiryDate: new Date(manualItem.expiryDate!).toISOString()
    } as InventoryItem]);
    onClose();
  };

  const handleBarcodeSim = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        const randomItem: InventoryItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Scanned Item " + Math.floor(Math.random() * 100),
            category: Category.DRY_STORAGE,
            quantity: 1,
            unit: Unit.PACK,
            addedDate: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 90 * 86400000).toISOString()
        };
        onAdd([randomItem]);
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Add New Items</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setMode('manual')}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${mode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Type size={20} /> Manual
                </button>
                <button 
                  onClick={() => setMode('camera')}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${mode === 'camera' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Camera size={20} /> AI Scan
                </button>
                <button 
                  onClick={() => setMode('barcode')}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${mode === 'barcode' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ScanBarcode size={20} /> Barcode
                </button>
            </div>

            {mode === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., Bananas"
                            value={manualItem.name}
                            onChange={(e) => setManualItem({...manualItem, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={manualItem.category}
                                onChange={(e) => setManualItem({...manualItem, category: e.target.value as Category})}
                            >
                                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                            <input 
                                type="date" 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={manualItem.expiryDate as string}
                                onChange={(e) => setManualItem({...manualItem, expiryDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                            <input 
                                type="number" 
                                min="1"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={manualItem.quantity}
                                onChange={(e) => setManualItem({...manualItem, quantity: parseInt(e.target.value)})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                            <select 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={manualItem.unit}
                                onChange={(e) => setManualItem({...manualItem, unit: e.target.value as Unit})}
                            >
                                {Object.values(Unit).map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 mt-4 transition-colors">
                        <Plus size={20} /> Add Item
                    </button>
                </form>
            )}

            {mode === 'camera' && (
                <div className="text-center py-8">
                     <div 
                        className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer relative"
                        onClick={() => fileInputRef.current?.click()}
                     >
                         <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                        
                        {loading ? (
                            <div className="flex flex-col items-center text-blue-600">
                                <Loader2 size={48} className="animate-spin mb-4" />
                                <p className="font-medium">Analyzing with Gemini AI...</p>
                                <p className="text-sm text-slate-500 mt-2">Identifying items & checking expiry</p>
                            </div>
                        ) : previewImage ? (
                             <div className="relative">
                                <img src={previewImage} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg text-white font-medium opacity-0 hover:opacity-100 transition-opacity">
                                    Change Image
                                </div>
                             </div>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400">
                                <Upload size={48} className="mb-4" />
                                <p className="font-medium text-slate-600">Click to Upload or Take Photo</p>
                                <p className="text-sm mt-2">Supports JPG, PNG</p>
                            </div>
                        )}
                     </div>
                </div>
            )}

            {mode === 'barcode' && (
                 <div className="text-center py-12">
                     {loading ? (
                          <div className="flex flex-col items-center text-blue-600">
                            <Loader2 size={48} className="animate-spin mb-4" />
                            <p className="font-medium">Lookup in progress...</p>
                        </div>
                     ) : (
                         <div className="flex flex-col items-center gap-6">
                            <div className="relative w-64 h-32 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
                                <div className="absolute w-full h-1 bg-red-500 top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
                                <span className="text-slate-500 text-xs mt-16">Camera Feed Simulator</span>
                            </div>
                            <button 
                                onClick={handleBarcodeSim}
                                className="px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 flex items-center gap-2"
                            >
                                <ScanBarcode size={20} /> Simulate Scan
                            </button>
                             <p className="text-sm text-slate-400 max-w-xs">
                                In a real device, this would activate the camera to scan UPC/EAN codes.
                            </p>
                         </div>
                     )}
                 </div>
            )}

        </div>
      </div>
    </div>
  );
};