import React from 'react';
import { Reservation, Stats } from '../types';
import { chunkArray, chunkListDynamic, calculateFontSize, formatTableDisplay } from '../utils';

interface PrintTemplatesProps {
    reservations: Reservation[];
    selectedDate: string;
    stats: Stats;
}

const PrintTemplates: React.FC<PrintTemplatesProps> = ({ reservations, selectedDate, stats }) => {
    // Templates for printing
    const chunkedReservationsForPrintList = chunkListDynamic(reservations);
    const chunkedReservationsForCards = chunkArray(reservations, 8);

    return (
        <>
            {/* Liste Yazdırma Şablonu (Servis ve Mutfak İçin) - Sayfalı */}
            <div className="print-list-page">
                {chunkedReservationsForPrintList.map((pageItems, pageIndex) => (
                    <div key={pageIndex} className="print-list-page-item">
                        
                        {/* Header Section */}
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

                        {/* Stats Section (Sadece İlk Sayfada) */}
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
                            Sayfa {pageIndex + 1} / {chunkedReservationsForPrintList.length}
                        </div>
                    </div>
                ))}
            </div>

            {/* PDF Stilinde İsim Kartları Yazdırma Şablonu */}
            <div className="name-cards-container">
                {chunkedReservationsForCards.map((page, pageIndex) => (
                    <div key={pageIndex} className="name-cards-page">
                        {page.map((res: Reservation) => (
                            <div key={res.id} className="name-card">
                                <div className="name-card-title">SAYIN</div>
                                <div className="name-card-name" style={{fontSize: calculateFontSize(res.customerName)}}>{res.customerName.toLocaleUpperCase('tr-TR')}</div>
                                <img src="https://res.cloudinary.com/dejx0brol/image/upload/v1771331131/logo_j1rcjm.png" alt="Logo" className="name-card-logo" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default PrintTemplates;
