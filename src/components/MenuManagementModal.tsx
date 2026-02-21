import React, { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { INITIAL_MENU_STRUCTURE, CATEGORY_ORDER } from '../constants';
import { MenuItem } from '../types';

interface MenuManagementModalProps {
    onClose: () => void;
}

const MenuManagementModal: React.FC<MenuManagementModalProps> = ({ onClose }) => {
    const [menus, setMenus] = useState<Record<string, MenuItem[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sürüm v6 olarak güncellendi, böylece yeni menü yapısı zorlanacak
        const docRef = doc(db, 'settings', 'categorized_menus_v6');
        const unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const dbContent = snap.data().content || {};
                const mergedContent = { ...INITIAL_MENU_STRUCTURE, ...dbContent };
                setMenus(mergedContent);
            } else {
                setDoc(docRef, { content: INITIAL_MENU_STRUCTURE });
                setMenus(INITIAL_MENU_STRUCTURE);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateItemName = async (category: string, index: number, value: string) => {
        const newContent = { ...menus };
        newContent[category][index].name = value;
        setMenus(newContent);
        // Sürüm v6 olarak güncellendi
        await setDoc(doc(db, 'settings', 'categorized_menus_v6'), { content: newContent });
    };

    const sortedMenus = useMemo(() => {
        return Object.entries(menus).sort(([a], [b]) => {
            const indexA = CATEGORY_ORDER.indexOf(a);
            const indexB = CATEGORY_ORDER.indexOf(b);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        });
    }, [menus]);

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in no-print">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-[2.5rem] p-8 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <div className="bg-amber-500/20 p-3 rounded-2xl">
                            <i className="fas fa-utensils text-amber-500"></i>
                        </div>
                        Restoran Menüleri
                    </h2>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-red-500 transition-all border border-slate-700">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-10">
                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Menüler Yükleniyor...</div>
                    ) : (
                        sortedMenus.map(([category, items]) => (
                            <section key={category} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-black text-amber-500 uppercase tracking-[0.2em]">{category}</h3>
                                    <div className="flex-1 h-px bg-slate-800"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all group">
                                            <input type="text" className="flex-1 bg-transparent border-none text-white text-sm font-medium focus:ring-0 outline-none" value={item.name} onChange={(e) => updateItemName(category, idx, e.target.value)} />
                                            <div className="flex items-center gap-1 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                                <span className="text-xs text-slate-500 font-bold">₺</span>
                                                <span className="text-emerald-400 text-right text-xs font-mono font-bold select-none cursor-default">{item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))
                    )}
                </div>
                <div className="mt-8 flex justify-end"><button onClick={onClose} className="px-10 bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-sm">Tamam</button></div>
            </div>
        </div>
    );
};

export default MenuManagementModal;
