/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { TABLE_LIST, MENU_DATABASE, CATEGORY_ORDER } from './constants';
import { Reservation, MenuItem } from './types';
import { formatTableDisplay } from './utils';
import Sidebar from './components/Sidebar';
import ReservationModal from './components/ReservationModal';
import MenuManagementModal from './components/MenuManagementModal';
import PrintPreviewModal from './components/PrintPreviewModal';
import ListPreviewModal from './components/ListPreviewModal';
import PrintTemplates from './components/PrintTemplates';
import TableChangeModal from './components/TableChangeModal';

export default function App() {
    // Main App Component
    const [selectedDate, setSelectedDate] = useState('2026-02-19');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [categorizedMenus, setCategorizedMenus] = useState<Record<string, MenuItem[]>>({});
    const [modal, setModal] = useState<{ open: boolean; data: Reservation | null }>({ open: false, data: null });
    const [changingTable, setChangingTable] = useState<string | number | null>(null);
    const [showAllMenus, setShowAllMenus] = useState(false);
    const [showMenuManagement, setShowMenuManagement] = useState(false);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [showListPreview, setShowListPreview] = useState(false);
    const [menuPhone, setMenuPhone] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'default', direction: 'asc' });
    
    // Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Ref for Date Picker
    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribe1 = onSnapshot(collection(db, 'reservations'), (snap) => {
            setReservations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Reservation)));
        });
        const unsubscribe2 = onSnapshot(doc(db, 'settings', 'categorized_menus_v6'), (snap) => {
            if (snap.exists()) setCategorizedMenus(snap.data().content);
        });
        return () => { unsubscribe1(); unsubscribe2(); };
    }, []);

    const filtered = useMemo(() => {
        return reservations.filter(r => r.date === selectedDate).sort((a, b) => {
            if (a.tableNumber === "IHLARA" && b.tableNumber !== "IHLARA") return -1;
            if (a.tableNumber !== "IHLARA" && b.tableNumber === "IHLARA") return 1;
            return a.customerName.localeCompare(b.customerName, 'tr');
        });
    }, [reservations, selectedDate]);

    const stats = { totalPeople: filtered.reduce((a, b) => a + (b.adultCount || 0) + (b.childCount || 0), 0), count: filtered.length };

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedTableList = useMemo(() => {
        // Base Data Preparation
        let data = TABLE_LIST.map(tableVal => {
            const res = filtered.find(r => String(r.tableNumber) === String(tableVal));
            return { tableVal, res };
        });

        // Filter by Search Term if active
        if (searchTerm) {
            data = data.filter(item => {
                if (item.tableVal === "IHLARA") return true; 
                return item.res && item.res.customerName.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'));
            });
        }

        // Sorting Logic
        data.sort((a, b) => {
                // RULE: IHLARA ALWAYS TOP
                if (a.tableVal === "IHLARA") return -1;
                if (b.tableVal === "IHLARA") return 1;

                const modifier = sortConfig.direction === 'asc' ? 1 : -1;

                // 1. Sort by Table Number (Numerik)
                if (sortConfig.key === 'tableNumber') {
                    const valA = typeof a.tableVal === 'number' ? a.tableVal : 0;
                    const valB = typeof b.tableVal === 'number' ? b.tableVal : 0;
                    return (valA - valB) * modifier;
                }

                // 2. Sort by Customer Name (Alfabetik)
                if (sortConfig.key === 'customerName') {
                    if (a.res && !b.res) return -1;
                    if (!a.res && b.res) return 1;
                    
                    if (!a.res && !b.res) {
                        const valA = typeof a.tableVal === 'number' ? a.tableVal : 0;
                        const valB = typeof b.tableVal === 'number' ? b.tableVal : 0;
                        return (valA - valB);
                    }
                    return (a.res!.customerName.localeCompare(b.res!.customerName, 'tr')) * modifier;
                }

                // 3. Sort by People Count
                if (sortConfig.key === 'peopleCount') {
                    if (a.res && !b.res) return -1;
                    if (!a.res && b.res) return 1;
                    
                    if (!a.res && !b.res) {
                        const valA = typeof a.tableVal === 'number' ? a.tableVal : 0;
                        const valB = typeof b.tableVal === 'number' ? b.tableVal : 0;
                        return (valA - valB);
                    }

                    const totalA = (a.res!.adultCount || 0) + (a.res!.childCount || 0);
                    const totalB = (b.res!.adultCount || 0) + (b.res!.childCount || 0);
                    return (totalA - totalB) * modifier;
                }

                // 4. Default Sort (Occupied first, then Table Number)
                if (a.res && !b.res) return -1;
                if (!a.res && b.res) return 1;

                const valA = typeof a.tableVal === 'number' ? a.tableVal : 0;
                const valB = typeof b.tableVal === 'number' ? b.tableVal : 0;
                return (valA - valB);
        });

        return data;
    }, [filtered, sortConfig, searchTerm]);
    
    // Yazdırma işlemi için ekrandaki sıralamanın aynısını içeren rezervasyon listesi
    const sortedReservationsForPrint = useMemo(() => {
        return sortedTableList
            .map(item => item.res)
            .filter((res): res is Reservation => res !== undefined);
    }, [sortedTableList]);

    const handleSave = async (data: any) => {
        try {
            if (modal.data?.id) await updateDoc(doc(db, 'reservations', modal.data.id), data);
            else await addDoc(collection(db, 'reservations'), data);
            setModal({ open: false, data: null });
        } catch (e) { alert("Hata!"); }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Bu rezervasyonu silmek istediğinize emin misiniz?")) {
            try {
                await deleteDoc(doc(db, 'reservations', id));
            } catch (e) {
                console.error("Silme hatası:", e);
                alert("Silme işlemi başarısız oldu. Lütfen tekrar deneyin.");
            }
        }
    };

    const handlePrint = (mode: 'list' | 'cards') => {
        document.body.classList.remove('print-mode-list', 'print-mode-cards');
        document.body.classList.add(`print-mode-${mode}`);
        setTimeout(() => {
            window.print();
        }, 500);
    };

    const handleConfirmPrintCards = () => {
        setShowPrintPreview(false);
        setTimeout(() => handlePrint('cards'), 100);
    };

    const handleConfirmPrintList = () => {
        setShowListPreview(false);
        setTimeout(() => handlePrint('list'), 100);
    };

    const sendWhatsAppMessage = (res: Reservation) => {
        let cleanPhone = res.phone.replace(/\D/g, '');

        if (cleanPhone.length === 3) {
            alert("Dahili numaralara WhatsApp mesajı gönderilemez.");
            return;
        }

        // Helper for Title Case (e.g. GÜNÜN MENÜSÜ -> Günün Menüsü)
        const toTitleCase = (str: string) => {
            if (!str) return "";
            return str.toLocaleLowerCase('tr-TR').split(' ').map(word => 
                word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1)
            ).join(' ');
        };

        // Helper for Customer Name (e.g. HİMMET MUHAMMED KILIÇ -> Himmet Muhammed KILIÇ)
        const formatCustomerName = (str: string) => {
            if (!str) return "";
            const words = str.trim().split(/\s+/);
            if (words.length === 0) return "";
            
            return words.map((word, index) => {
                // Son kelime (Soyisim) -> TAMAMI BÜYÜK
                if (index === words.length - 1) {
                    return word.toLocaleUpperCase('tr-TR');
                }
                // Diğerleri (İsim) -> Baş harfi büyük
                return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
            }).join(' ');
        };

        const formattedDate = res.date.split('-').reverse().join('.');
        const dateObj = new Date(res.date + 'T12:00:00'); 
        const dayName = dateObj.toLocaleDateString('tr-TR', { weekday: 'long' });
        
        let peopleInfo = `${res.adultCount} Kişi`;
        if (res.childCount > 0) {
            peopleInfo += `\n${res.childCount} Çocuk`;
        }
        
        let orderText = "";
        if (res.orders && res.orders.length > 0) {
            // Siparişleri Kategori Sırasına Göre Dizme
            const sortedOrders = [...res.orders].sort((a, b) => {
                let indexA = 999;
                let indexB = 999;

                CATEGORY_ORDER.forEach((cat, idx) => {
                    if (categorizedMenus[cat] && categorizedMenus[cat].some(item => item.name === a.name)) {
                        indexA = idx;
                    }
                });

                CATEGORY_ORDER.forEach((cat, idx) => {
                    if (categorizedMenus[cat] && categorizedMenus[cat].some(item => item.name === b.name)) {
                        indexB = idx;
                    }
                });

                return indexA - indexB;
            });

            orderText = "\n\nSipariş Detayları:\n" + sortedOrders.map(o => {
                return `* ${toTitleCase(o.name)} (${o.quantity} Adet)`;
            }).join('\n');
        }

        const message = `Sayın ${formatCustomerName(res.customerName)},

${formattedDate}
${dayName}

Gelveri
${peopleInfo}${orderText}

İftar yemeği rezervasyonunuz oluşturulmuştur.

İlgi ve nezaketiniz için teşekkür eder, iyi günler dileriz.
Saygılarımızla.

Uluırmak Turizm MTAL
Uygulama Oteli`;

        
        if (cleanPhone.startsWith('0')) cleanPhone = '90' + cleanPhone.substring(1);
        window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`, '_blank');
    };

    const sendMenuLink = () => {
        if (!menuPhone || menuPhone.length < 10) {
            alert("Lütfen geçerli bir telefon numarası giriniz.");
            return;
        }
        let cleanPhone = menuPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
        cleanPhone = '90' + cleanPhone;

        const message = `Merhaba, menülerimize aşağıda bulunan linkten ulaşabilirsiniz.
Rezervasyon ve sipariş işlemleri için lütfen telefon numaralarımızdan bizleri arayınız.

Menümüz:
https://www.kisa.link/YrRiq

İlgi ve nezaketiniz için teşekkür eder, iyi günler dileriz.

Saygılarımızla.

Uluırmak Turizm MTAL\nUygulama Oteli`;

        window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`, '_blank');
        setMenuPhone('');
    };

    const handleTableChange = async (targetTable: string | number) => {
        if (!changingTable) return;
        
        try {
            const sourceRes = reservations.find(r => r.date === selectedDate && String(r.tableNumber) === String(changingTable));
            const targetRes = reservations.find(r => r.date === selectedDate && String(r.tableNumber) === String(targetTable));

            if (sourceRes && targetRes) {
                // Swap
                await updateDoc(doc(db, 'reservations', sourceRes.id), { tableNumber: targetTable });
                await updateDoc(doc(db, 'reservations', targetRes.id), { tableNumber: changingTable });
            } else if (sourceRes) {
                // Move source to target
                await updateDoc(doc(db, 'reservations', sourceRes.id), { tableNumber: targetTable });
            } else if (targetRes) {
                // Move target to source (effectively moving occupied to empty)
                await updateDoc(doc(db, 'reservations', targetRes.id), { tableNumber: changingTable });
            }
            
            setChangingTable(null);
        } catch (e) {
            console.error("Masa değişimi hatası:", e);
            alert("Masa değişimi sırasında bir hata oluştu.");
        }
    };

    const weeklyMenus = useMemo(() => {
        const entries = Object.entries(MENU_DATABASE).sort(([a], [b]) => a.localeCompare(b));
        if (entries.length === 0) return [];
        const firstDate = new Date(entries[0][0]);
        let firstDayIndex = firstDate.getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6;
        const paddedEntries = Array(firstDayIndex).fill(null).concat(entries);
        const weeks = [];
        for (let i = 0; i < paddedEntries.length; i += 7) weeks.push(paddedEntries.slice(i, i + 7));
        return weeks;
    }, []);

    return (
        <div className="flex h-screen w-full bg-slate-950 text-white overflow-hidden">
            <PrintTemplates 
                reservations={sortedReservationsForPrint} 
                selectedDate={selectedDate} 
                stats={stats} 
            />

            <main className="flex-1 p-8 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center mb-8 no-print">
                    <div className="flex items-center gap-4">
                        <img src="https://res.cloudinary.com/dejx0brol/image/upload/v1771331131/logo_j1rcjm.png" alt="Uluırmak Logo" className="h-14 w-auto object-contain drop-shadow-lg" />
                        <h1 className="text-4xl font-bold text-amber-500 tracking-tight">Uluırmak Uygulama Oteli</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-phone text-slate-500 text-xs"></i>
                                </div>
                                <input 
                                    type="tel" 
                                    className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg block w-32 pl-8 p-2.5 outline-none focus:border-amber-500 transition-colors" 
                                    placeholder="5xxxxxxxxx"
                                    maxLength={10}
                                    value={menuPhone}
                                    onChange={(e) => setMenuPhone(e.target.value.replace(/\D/g, '').slice(0,10))}
                                />
                            </div>
                            <button 
                                onClick={sendMenuLink}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-all shadow-lg flex items-center gap-2"
                            >
                                <i className="fab fa-whatsapp text-lg"></i> Menü Gönder
                            </button>
                        </div>
                        <button onClick={() => setShowListPreview(true)} className="bg-slate-800 hover:bg-slate-700 text-amber-500 border border-slate-700 p-3 rounded-2xl shadow-xl transition-all flex items-center gap-2 font-bold px-5">
                            <i className="fas fa-print"></i> Liste Yazdır
                        </button>
                        <button onClick={() => setShowPrintPreview(true)} className="bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-2xl shadow-xl transition-all flex items-center gap-2 font-bold px-5">
                            <i className="fas fa-id-card"></i> Rezerve Yazdır
                        </button>
                        <div 
                            className="flex items-center gap-4 bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-xl cursor-pointer group hover:border-amber-500/50 transition-colors"
                            onClick={() => {
                                try {
                                    dateInputRef.current?.showPicker();
                                } catch (e) {
                                    dateInputRef.current?.focus();
                                }
                            }}
                        >
                            <i className="fas fa-calendar-day text-amber-500 ml-2"></i>
                            <input 
                                ref={dateInputRef}
                                type="date" 
                                className="bg-transparent border-none text-white font-bold outline-none cursor-pointer" 
                                value={selectedDate} 
                                onChange={e => setSelectedDate(e.target.value)} 
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl main-reservation-list">
                    <div className="grid grid-cols-12 gap-4 px-8 py-3 border-b border-slate-800 bg-slate-800/40 text-[10px] font-black text-white uppercase tracking-widest select-none">
                        <div className="col-span-1 cursor-pointer flex items-center gap-2 hover:text-amber-500 transition-colors" onClick={() => handleSort('tableNumber')}>
                            Masa
                            {sortConfig.key === 'tableNumber' && <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-amber-500`}></i>}
                            {sortConfig.key !== 'tableNumber' && <i className="fas fa-sort text-slate-600"></i>}
                        </div>
                        <div className="col-span-3 flex items-center gap-2">
                            {showSearch ? (
                                <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden h-7">
                                    <input 
                                        type="text" 
                                        className="w-full bg-transparent border-none text-white text-xs px-2 py-1 outline-none uppercase placeholder-slate-600"
                                        placeholder="İsim ara..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={() => { setShowSearch(false); setSearchTerm(''); }} className="px-2 text-slate-500 hover:text-red-500">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 cursor-pointer flex items-center gap-2 hover:text-amber-500 transition-colors" onClick={() => handleSort('customerName')}>
                                    Misafir
                                    {sortConfig.key === 'customerName' && <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-amber-500`}></i>}
                                    {sortConfig.key !== 'customerName' && <i className="fas fa-sort text-slate-600"></i>}
                                </div>
                            )}
                            {!showSearch && (
                                <button onClick={() => setShowSearch(true)} className="text-slate-500 hover:text-white transition-colors">
                                    <i className="fas fa-search"></i>
                                </button>
                            )}
                        </div>
                        <div className="col-span-1 text-center cursor-pointer flex items-center justify-center gap-1 hover:text-amber-500 transition-colors" onClick={() => handleSort('peopleCount')}>
                            Kişi
                            {sortConfig.key === 'peopleCount' && <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-amber-500`}></i>}
                            {sortConfig.key !== 'peopleCount' && <i className="fas fa-sort text-slate-600"></i>}
                        </div>
                        <div className="col-span-3">Sipariş</div>
                        <div className="col-span-2">Notlar</div>
                        <div className="col-span-1">Kayıt</div>
                        <div className="col-span-1 text-right">İşlem</div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-800">
                        {sortedTableList.map(({ tableVal, res }) => (
                            <div key={tableVal} onClick={() => setModal({ open: true, data: res || { tableNumber: tableVal } as any })} className={`grid grid-cols-12 gap-4 px-8 py-2 items-center table-row-hover cursor-pointer ${res ? 'bg-amber-500/[0.03]' : ''}`}>
                                <div className="col-span-1" onClick={(e) => { e.stopPropagation(); setChangingTable(tableVal); }}>
                                    <span className={`text-xl font-black ${res ? 'text-amber-500' : 'text-white/20'} hover:text-white transition-colors`}>
                                        {formatTableDisplay(tableVal)}
                                    </span>
                                </div>
                                <div className="col-span-3">{res ? <div className="flex flex-col"><span className="font-bold text-sm">{res.customerName}</span><span className="text-xs text-white/50">{res.phone}</span></div> : <span className="text-xs text-white/10">-</span>}</div>
                                <div className="col-span-1 text-center">
                                    {res ? (
                                        <div className="flex flex-col items-center justify-center -space-y-1">
                                            <div className="flex items-center gap-1 text-emerald-400">
                                                <span className="text-sm font-black">{res.adultCount}</span>
                                                <span className="text-[8px] font-bold uppercase opacity-60">Y</span>
                                            </div>
                                            {res.childCount > 0 && (
                                                <div className="flex items-center gap-1 text-cyan-400">
                                                    <span className="text-[11px] font-black">{res.childCount}</span>
                                                    <span className="text-[8px] font-bold uppercase opacity-60">Ç</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : "-"}
                                </div>
                                <div className="col-span-3">
                                    {res && res.orders?.length > 0 ? (
                                        <span className="text-xs text-white/60">{res.orders.map(o => `${o.quantity}x ${o.name}`).join(', ')}</span>
                                    ) : <span className="text-xs text-white/10">-</span>}
                                </div>
                                <div className="col-span-2">
                                    {res && res.note ? (
                                        <span className="text-xs text-amber-500/80 italic line-clamp-2" title={res.note}>
                                            <i className="fas fa-sticky-note mr-1 opacity-50"></i>{res.note}
                                        </span>
                                    ) : <span className="text-xs text-white/10">-</span>}
                                </div>
                                <div className="col-span-1">{res ? <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{res.recordedBy}</span> : <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">-</span>}</div>
                                <div className="col-span-1 text-right flex justify-end gap-2">
                                    {res && <button onClick={(e) => { e.stopPropagation(); sendWhatsAppMessage(res); }} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><i className="fab fa-whatsapp"></i></button>}
                                    {res && <button onClick={(e) => { e.stopPropagation(); handleDelete(res.id); }} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash-alt"></i></button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Sidebar stats={stats} selectedDate={selectedDate} onNewReservation={() => setModal({ open: true, data: null })} onShowAllMenus={() => setShowAllMenus(true)} onOpenMenuManagement={() => setShowMenuManagement(true)} />

            {modal.open && (
                <ReservationModal data={modal.data} selectedDate={selectedDate} categorizedMenus={categorizedMenus} allReservations={reservations.filter(r => r.date === selectedDate)} onClose={() => setModal({ open: false, data: null })} onSave={handleSave} />
            )}
            {showAllMenus && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in no-print">
                    <div className="w-full max-w-7xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3"><i className="fas fa-scroll text-amber-500"></i> Ramazan Menü Kartı</h2>
                            <button onClick={() => setShowAllMenus(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                <div className="flex flex-row md:flex-col pt-0 md:pt-[52px] gap-2 w-full md:w-28 flex-none mb-4 md:mb-0">
                                    {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map(day => <div key={day} className="h-auto md:h-[120px] flex-1 md:flex-none flex items-center justify-center md:justify-end md:pr-3 text-[10px] text-white/30 font-black uppercase tracking-widest border border-slate-800 md:border-none p-1 rounded-lg">{day}</div>)}
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 flex-1">
                                    {weeklyMenus.map((week, weekIdx) => (
                                        <div key={weekIdx} className="flex flex-col gap-2">
                                            <div className="text-center h-8 md:h-10 border-b-2 border-amber-500/20 text-[10px] md:text-[11px] font-black text-amber-500 uppercase tracking-widest">{weekIdx + 1}. HAFTA</div>
                                            {week.map((entry, idx) => (
                                                <div key={idx} className="h-[100px] md:h-[120px]">
                                                    {entry ? (
                                                        <div className="bg-slate-800/40 p-2 md:p-3 rounded-xl border border-slate-700 h-full overflow-hidden flex flex-col"><span className="text-[11px] font-mono text-amber-500 mb-1">{entry[0].split('-').reverse().join('.')}</span>{entry[1].map((item, i) => <p key={i} className={`text-[14px] md:text-[16px] truncate leading-tight ${i === 1 ? 'font-bold text-white' : 'text-white/70'}`}>{item}</p>)}</div>
                                                    ) : <div className="h-full border border-dashed border-slate-800/30 rounded-xl"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showPrintPreview && (
                <PrintPreviewModal 
                    reservations={sortedReservationsForPrint} 
                    onClose={() => setShowPrintPreview(false)} 
                    onConfirmPrint={handleConfirmPrintCards} 
                />
            )}
            {showListPreview && (
                <ListPreviewModal 
                    reservations={sortedReservationsForPrint} 
                    selectedDate={selectedDate}
                    stats={stats}
                    onClose={() => setShowListPreview(false)} 
                    onConfirmPrint={handleConfirmPrintList} 
                />
            )}
            {showMenuManagement && <MenuManagementModal onClose={() => setShowMenuManagement(false)} />}
            {changingTable && (
                <TableChangeModal 
                    currentTable={changingTable} 
                    onClose={() => setChangingTable(null)} 
                    onSelect={handleTableChange} 
                />
            )}
        </div>
    );
}

