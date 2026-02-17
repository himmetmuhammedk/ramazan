
import React from 'react';

interface SidebarProps {
  stats: { reservedCount: number; totalPeople: number };
  onNewReservation: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ stats, onNewReservation, className }) => {
  return (
    <aside className={`w-full md:w-80 h-full bg-slate-900 border-slate-800 p-6 flex flex-col gap-8 overflow-y-auto ${className}`}>
      <div className="flex items-center gap-3 flex-none">
        <div className="bg-amber-500/20 p-2 rounded-lg">
          <i className="fas fa-moon text-amber-500 text-2xl"></i>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">İftar Rezervasyon</span>
      </div>

      <button 
        onClick={onNewReservation}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 flex-none"
      >
        <i className="fas fa-plus"></i>
        Rezervasyon Al
      </button>

      <div className="space-y-4 flex-none">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Canlı İstatistikler</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-sm">Toplam Masa</p>
            <p className="text-2xl font-bold text-white">30</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-sm">Dolu Masalar</p>
            <p className="text-2xl font-bold text-amber-400">{stats.reservedCount}</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-sm">Beklenen Kişi</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.totalPeople}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-4 flex-none pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Geleneksel İftar Menüsü</h3>
        </div>
        
        <div className="bg-gradient-to-br from-amber-900/40 to-slate-800 p-5 rounded-2xl border border-amber-500/20">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <i className="fas fa-bowl-hot text-amber-500 mt-1"></i>
              <span className="text-slate-200">Süzme Mercimek Çorbası</span>
            </li>
            <li className="flex gap-2">
              <i className="fas fa-utensils text-amber-500 mt-1"></i>
              <span className="text-slate-200 font-medium">Hünkar Beğendi</span>
            </li>
            <li className="flex gap-2">
              <i className="fas fa-bread-slice text-amber-500 mt-1"></i>
              <span className="text-slate-200">Tereyağlı Pirinç Pilavı</span>
            </li>
            <li className="flex gap-2">
              <i className="fas fa-cookie text-amber-500 mt-1"></i>
              <span className="text-slate-200">Sütlü Nuriye veya Güllaç</span>
            </li>
            <li className="flex gap-2">
              <i className="fas fa-glass-water text-amber-500 mt-1"></i>
              <span className="text-slate-200 italic">Ev Yapımı Osmanlı Şerbeti</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
