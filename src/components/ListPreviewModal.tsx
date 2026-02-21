import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Reservation, Stats } from '../types';
import { chunkListDynamic, formatTableDisplay } from '../utils';

interface ListPreviewModalProps {
    reservations: Reservation[];
    selectedDate: string;
    stats: Stats;
    onClose: () => void;
    onConfirmPrint: () => void;
}

const ListPreviewModal: React.FC<ListPreviewModalProps> = ({ reservations, selectedDate, stats, onClose, onConfirmPrint }) => {
    // Modal for previewing the reservation list
    // Dinamik sayfalama kullanarak listeyi böl
    const chunkedList = chunkListDynamic(reservations);
    const printRef = useRef<HTMLDivElement>(null);

    const handleSaveImage = async () => {
        if (!printRef.current) return;
        try {
            // Sadece ilk sayfayı yakalar (html2canvas sınırlaması)
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                useCORS: true, 
                backgroundColor: '#ffffff'
            });
            
            const link = document.createElement('a');
            link.download = `Rezervasyon_Listesi_${selectedDate}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Görüntü oluşturulamadı", err);
            alert("Görüntü kaydedilirken bir hata oluştu.");
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex flex-col bg-slate-950/95 backdrop-blur-xl animate-fade-in no-print p-4 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 flex-none">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <i className="fas fa-print text-amber-500"></i> Baskı Önizleme (Liste)
                </h2>
                <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 rounded-xl text-white/50 hover:text-white font-bold transition-all">Kapat</button>
                        <button onClick={handleSaveImage} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-amber-500 border border-slate-700 rounded-xl font-bold shadow-lg flex items-center gap-2">
                            <i className="fas fa-save"></i> İlk Sayfayı Kaydet
                        </button>
                        <button onClick={onConfirmPrint} className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">
                            <i className="fas fa-print"></i> Yazdır
                        </button>
                </div>
            </div>
            
            {/* Preview Area (Scrollable) - A4 Portrait Simulation with Pagination */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50 rounded-3xl border border-slate-700 p-8 flex justify-center">
                <div className="flex flex-col gap-8 items-center">
                {chunkedList.map((pageItems, pageIndex) => (
                    <div key={pageIndex} ref={pageIndex === 0 ? printRef : null} className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl text-black flex flex-col relative box-border">
                        
                        {/* Header Section (Portrait Design - Compact) */}
                        <div className="border-b-4 border-black pb-2 mb-2 flex flex-col gap-2">
                            <div className="text-center">
                                <h1 className="text-[18pt] font-black text-black font-serif uppercase tracking-widest whitespace-normal leading-tight">ULUIRMAK UYGULAMA OTELİ</h1>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="text-left">
                                    <div className="text-[8pt] font-bold text-black uppercase tracking-widest">TARİH</div>
                                    <div className="text-[11pt] font-black text-black leading-none mt-1">{selectedDate.split('-').reverse().join('.')}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8pt] font-bold text-black uppercase tracking-widest">YAZDIRMA SAATİ</div>
                                    <div className="text-[11pt] font-bold text-black leading-none mt-1">{new Date().toLocaleString('tr-TR')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section (Sadece İlk Sayfada Göster) */}
                        {pageIndex === 0 && (
                            <div className="flex justify-between items-center bg-white border-y-2 border-black py-2 px-4 mb-2 text-[10pt] text-black">
                                <div><strong>Toplam Masa:</strong> {stats.count}</div>
                                <div className="px-6 border-x border-black"><strong>Toplam Misafir:</strong> {stats.totalPeople}</div>
                                <div>{reservations.reduce((a,b)=>a+(b.adultCount||0),0)} Yet. / {reservations.reduce((a,b)=>a+(b.childCount||0),0)} Çoc.</div>
                            </div>
                        )}

                        {/* Table Section */}
                        <table className="w-full border-collapse text-[9pt]">
                            <thead>
                                <tr className="bg-gray-100 border-b-2 border-black">
                                    <th className="border border-black p-1 text-left font-extrabold uppercase w-[50px] text-black">Masa</th>
                                    <th className="border border-black p-1 text-left font-extrabold uppercase w-[25%] text-black">Misafir</th>
                                    <th className="border border-black p-1 text-center font-extrabold uppercase w-[15%] text-black">Kişi</th>
                                    <th className="border border-black p-1 text-left font-extrabold uppercase w-[30%] text-black">Siparişler</th>
                                    <th className="border border-black p-1 text-left font-extrabold uppercase w-[20%] text-black">Notlar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageItems.map((res: Reservation) => (
                                    <tr key={res.id}>
                                        <td className="border border-black p-1 align-top text-[14pt] font-bold text-black">{formatTableDisplay(res.tableNumber)}</td>
                                        <td className="border border-black p-1 align-top">
                                            <div className="font-[900] text-[10pt] uppercase text-black">{res.customerName}</div>
                                            <div className="text-[8pt] mt-1 text-black">{res.phone}</div>
                                        </td>
                                        <td className="border border-black p-1 align-middle text-center text-[9pt] text-black">
                                            {res.adultCount} Yet.
                                            {res.childCount > 0 && <><br/>{res.childCount} Çoc.</>}
                                        </td>
                                        <td className="border border-black p-1 align-top text-black">
                                            {res.orders && res.orders.length > 0 ? (
                                                <div className="text-[8pt] text-black leading-tight">
                                                    {res.orders.map(o => `${o.quantity}x ${o.name}`).join(', ')}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="border border-black p-1 align-top italic text-[8pt] text-black">{res.note || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="mt-auto pt-4 text-center text-[8pt] text-black font-bold">
                            Sayfa {pageIndex + 1} / {chunkedList.length}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default ListPreviewModal;
