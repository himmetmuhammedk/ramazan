import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MENU_DATABASE, IFTAR_TIMES } from '../constants';
import { Stats } from '../types';

interface SidebarProps {
    stats: Stats;
    onNewReservation: () => void;
    onShowAllMenus: () => void;
    onOpenMenuManagement: () => void;
    selectedDate: string;
}

const Sidebar: React.FC<SidebarProps> = ({ stats, onNewReservation, onShowAllMenus, onOpenMenuManagement, selectedDate }) => {
    const [isEditingMenu, setIsEditingMenu] = useState(false);
    const [menuItems, setMenuItems] = useState<string[]>(["...", "...", "...", "..."]);
    const [timeLeft, setTimeLeft] = useState("");

    const iftarTime = IFTAR_TIMES[selectedDate] || "18:45";

    useEffect(() => {
        const menuId = `menu_${selectedDate}`;
        const menuDoc = doc(db, 'settings', menuId);
        const unsubscribe = onSnapshot(menuDoc, (snap) => {
            if (snap.exists()) setMenuItems(snap.data().items);
            else setMenuItems(MENU_DATABASE[selectedDate] || ["Günün Menüsü", "Henüz Belirlenmedi", "", ""]);
        }, () => {
            setMenuItems(MENU_DATABASE[selectedDate] || ["Günün Menüsü", "Henüz Belirlenmedi", "", ""]);
        });
        return () => unsubscribe();
    }, [selectedDate]);

    useEffect(() => {
        // Timer Logic
        const target = new Date(`${selectedDate}T${iftarTime}:00`);
        
        const updateTimer = () => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("İFTAR VAKTİ!");
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                if (days > 0) {
                    setTimeLeft(`${days}g ${hours}s ${minutes}dk`);
                } else {
                    setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                }
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [selectedDate, iftarTime]);

    const saveMenu = async () => {
        try {
            await setDoc(doc(db, 'settings', `menu_${selectedDate}`), { items: menuItems });
            setIsEditingMenu(false);
        } catch (e) {
            alert("Kayıt başarısız!");
        }
    };

    return (
        <aside className="w-full md:w-80 h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto no-print">
            <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 p-2 rounded-lg">
                    <i className="fas fa-moon text-amber-500 text-2xl"></i>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">İftar Rezervasyon</span>
            </div>

            <div className="space-y-3">
                <button onClick={onNewReservation} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg">
                    <i className="fas fa-calendar-plus"></i> Rezervasyon Al
                </button>
                
                <button onClick={onOpenMenuManagement} className="w-full bg-slate-800 hover:bg-slate-700 text-amber-500 font-bold py-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 text-base">
                    <i className="fas fa-utensils"></i> Menüler
                </button>
            </div>

            <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">İstatistikler</h3>
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/30 flex justify-between items-center">
                    <p className="text-white text-sm">Toplam Kişi</p>
                    <span className="text-emerald-400 font-bold text-xl">{stats.totalPeople}</span>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/30 flex justify-between items-center">
                    <p className="text-white text-sm">Dolu Masa</p>
                    <span className="text-amber-400 font-bold text-xl">{stats.count}</span>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-800/50">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30 rounded-xl p-4 mb-4 text-center shadow-lg shadow-amber-900/10">
                    <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">İFTAR VAKTİ</div>
                    <div className="text-3xl font-black text-white font-mono tracking-tight leading-none mb-1">{iftarTime}</div>
                    <div className="h-px w-full bg-slate-700/50 my-2"></div>
                        <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">KALAN SÜRE</div>
                    <div className="text-xl font-bold text-white font-mono">{timeLeft}</div>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">Günün Menüsü</h3>
                    <div className="flex gap-2">
                        <button onClick={onShowAllMenus} title="Tüm Ramazan Menülerini Gör" className="text-slate-400 hover:text-amber-500 transition-colors">
                            <i className="fas fa-list-ul"></i>
                        </button>
                        <button onClick={() => isEditingMenu ? saveMenu() : setIsEditingMenu(true)} className="text-amber-500 text-sm hover:text-amber-400">
                            <i className={`fas ${isEditingMenu ? 'fa-save' : 'fa-pen-to-square'}`}></i>
                        </button>
                    </div>
                </div>
                <div className="bg-slate-800/50 p-5 rounded-xl border border-amber-500/10">
                    <ul className="space-y-4">
                        {menuItems.map((item, idx) => (
                            <li key={idx} className="text-base text-white list-none flex items-center">
                                {isEditingMenu ? (
                                    <input type="text" className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-full text-sm text-white" value={item} onChange={(e) => {
                                        const newMenu = [...menuItems]; newMenu[idx] = e.target.value; setMenuItems(newMenu);
                                    }} />
                                ) : (
                                    <span className={`${idx === 1 ? "font-bold text-amber-400 text-lg" : "text-white"}`}>{item}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
