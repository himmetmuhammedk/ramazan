import { TABLE_LIST } from '../constants';
import { formatTableDisplay } from '../utils';

interface TableChangeModalProps {
    currentTable: string | number;
    onClose: () => void;
    onSelect: (targetTable: string | number) => void;
}

export default function TableChangeModal({ currentTable, onClose, onSelect }: TableChangeModalProps) {
    // Modal for changing tables
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-xl font-bold text-white">
                        Masa Değişimi <span className="text-amber-500">({formatTableDisplay(currentTable)})</span>
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                        {TABLE_LIST.map((table) => (
                            <button
                                key={table}
                                onClick={() => onSelect(table)}
                                disabled={table === currentTable}
                                className={`
                                    p-3 rounded-xl border text-sm font-bold transition-all
                                    ${table === currentTable 
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-500 cursor-default opacity-50' 
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 hover:text-white hover:shadow-lg hover:scale-105'
                                    }
                                `}
                            >
                                {formatTableDisplay(table)}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center">
                    <p className="text-xs text-slate-400">
                        Hedef masada rezervasyon varsa, iki masanın rezervasyonları yer değiştirir.
                    </p>
                </div>
            </div>
        </div>
    );
}
