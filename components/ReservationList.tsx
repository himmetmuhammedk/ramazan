
import React from 'react';
import { TableStatus } from '../types';

interface ReservationListProps {
  tables: TableStatus[];
  onTableClick: (table: TableStatus) => void;
  onCancel: (tableNumber: number) => void;
}

const ReservationList: React.FC<ReservationListProps> = ({ tables, onTableClick, onCancel }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-widest">
        <div className="col-span-1">Masa</div>
        <div className="col-span-2">Durum</div>
        <div className="col-span-4">Müşteri Bilgisi</div>
        <div className="col-span-2">Kişi</div>
        <div className="col-span-3 text-right">İşlemler</div>
      </div>
      <div className="divide-y divide-slate-800">
        {tables.map((table) => (
          <div
            key={table.tableNumber}
            onClick={() => onTableClick(table)}
            className={`group grid grid-cols-1 md:grid-cols-12 items-center gap-4 px-6 py-4 transition-all cursor-pointer hover:bg-slate-800/40 ${
              table.isReserved ? 'bg-amber-500/[0.03]' : ''
            }`}
          >
            {/* Table Number */}
            <div className="col-span-1 flex items-center gap-3">
              <span className={`text-xl font-black ${table.isReserved ? 'text-amber-500' : 'text-slate-400'}`}>
                #{table.tableNumber.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-2">
              {table.isReserved ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                  Dolu
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                  Boş
                </span>
              )}
            </div>

            {/* Customer Info */}
            <div className="col-span-4">
              {table.isReserved ? (
                <div className="flex flex-col">
                  <p className="text-white font-semibold text-sm group-hover:text-amber-400 transition-colors">
                    {table.reservation?.customerName}
                  </p>
                  <p className="text-slate-500 text-xs font-mono">{table.reservation?.phone}</p>
                </div>
              ) : (
                <span className="text-slate-600 text-sm italic">Masa şu an müsait</span>
              )}
            </div>

            {/* People Count */}
            <div className="col-span-2">
              {table.isReserved && (
                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 w-fit px-3 py-1 rounded-lg border border-slate-700/50">
                  <i className="fas fa-users text-amber-600 text-xs"></i>
                  <span className="font-bold text-sm">{table.reservation?.peopleCount}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="col-span-3 text-right flex justify-end gap-2">
              {table.isReserved ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTableClick(table);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition-all border border-slate-700"
                    title="Düzenle"
                  >
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(table.tableNumber);
                    }}
                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all border border-red-500/20"
                    title="İptal Et"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </>
              ) : (
                <button
                  className="bg-amber-600/10 group-hover:bg-amber-600 text-amber-600 group-hover:text-white px-4 py-2 rounded-lg transition-all text-xs font-bold border border-amber-600/20"
                >
                  <i className="fas fa-calendar-plus mr-2"></i>
                  Rezervasyon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
