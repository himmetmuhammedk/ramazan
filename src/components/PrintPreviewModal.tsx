import React from 'react';
import { Reservation } from '../types';
import { chunkArray, calculateFontSize } from '../utils';

interface PrintPreviewModalProps {
    reservations: Reservation[];
    onClose: () => void;
    onConfirmPrint: () => void;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ reservations, onClose, onConfirmPrint }) => {
    // Modal for previewing name cards
    const chunkedReservations = chunkArray(reservations, 8);

    return (
        <div className="fixed inset-0 z-[80] flex flex-col bg-slate-950/95 backdrop-blur-xl animate-fade-in no-print p-4 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 flex-none">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <i className="fas fa-print text-amber-500"></i> Baskı Önizleme (İsim Kartları)
                </h2>
                <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 rounded-xl text-white/50 hover:text-white font-bold transition-all">Kapat</button>
                        <button onClick={onConfirmPrint} className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">
                            <i className="fas fa-print"></i> Yazdır
                        </button>
                </div>
            </div>
            
            {/* Preview Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50 rounded-3xl border border-slate-700 p-8 flex justify-center">
                <div className="flex flex-col gap-8 items-center">
                    {chunkedReservations.map((page, pageIndex) => (
                        <div key={pageIndex} className="bg-white w-full max-w-[210mm] h-[297mm] p-[10mm] shadow-2xl grid grid-cols-2 grid-rows-4 gap-[10px] box-border">
                            {page.map((res: Reservation) => (
                                <div key={res.id} 
                                    style={{
                                        border: '4px double black',
                                        display: 'grid',
                                        gridTemplateRows: '60px 1fr 100px',
                                        alignItems: 'center',
                                        justifyItems: 'center',
                                        textAlign: 'center',
                                        overflow: 'hidden',
                                        height: '100%',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <div style={{fontFamily: '"Playfair Display", serif', fontSize: '28pt', fontStyle: 'italic', color: 'black', alignSelf: 'end', paddingBottom: '5px'}}>SAYIN</div>
                                    <div style={{
                                        fontFamily: '"Playfair Display", serif', 
                                        fontWeight: '900', 
                                        lineHeight: '1.5', 
                                        color: 'black', 
                                        width: '90%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        fontSize: calculateFontSize(res.customerName),
                                        whiteSpace: 'nowrap',
                                        wordBreak: 'normal',
                                        overflow: 'visible',
                                        paddingTop: '0px',
                                        paddingBottom: '40px'
                                    }}>
                                        {res.customerName.toLocaleUpperCase('tr-TR')}
                                    </div>
                                    <img src="https://res.cloudinary.com/dejx0brol/image/upload/v1771331131/logo_j1rcjm.png" alt="Logo" style={{width: '100px', height: '100px', objectFit: 'contain', alignSelf: 'center', paddingTop: '0'}} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default PrintPreviewModal;
