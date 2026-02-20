import React, { useState, useMemo } from 'react';
import { CATEGORY_ORDER, TABLE_LIST, STAFF_LIST } from '../constants';
import { Reservation, Order, MenuItem } from '../types';

interface ReservationModalProps {
    data: Reservation | null;
    selectedDate: string;
    categorizedMenus: Record<string, MenuItem[]>;
    onClose: () => void;
    onSave: (data: any) => void;
    allReservations: Reservation[];
}

const ReservationModal: React.FC<ReservationModalProps> = ({ data, selectedDate, categorizedMenus, onClose, onSave, allReservations }) => {
    // Modal for creating or editing reservations
    const [step, setStep] = useState(1); 
    const [customerName, setCustomerName] = useState(data?.customerName || '');
    const [adultCount, setAdultCount] = useState(data?.adultCount || 2);
    const [childCount, setChildCount] = useState(data?.childCount || 0);
    const [phone, setPhone] = useState(data?.phone || '');
    const [tableNumber, setTableNumber] = useState<string | number>(data?.tableNumber || ''); 
    const [note, setNote] = useState(data?.note || '');
    const [orders, setOrders] = useState<Order[]>(data?.orders || []);
    const [recordedBy, setRecordedBy] = useState(data?.recordedBy || '');

    const totalPrice = useMemo(() => {
        return orders.reduce((sum, item) => {
            const priceVal = parseFloat(item.price.replace('.', '').replace(',', '.'));
            return sum + (priceVal * item.quantity);
        }, 0);
    }, [orders]);

    const handleAddItem = (item: MenuItem) => {
        const existing = orders.find(o => o.name === item.name);
        if (existing) {
            setOrders(orders.map(o => o.name === item.name ? { ...o, quantity: o.quantity + 1 } : o));
        } else {
            setOrders([...orders, { ...item, quantity: 1 }]);
        }
    };

    const handleRemoveItem = (name: string) => {
        const existing = orders.find(o => o.name === name);
        if (existing && existing.quantity > 1) {
            setOrders(orders.map(o => o.name === name ? { ...o, quantity: o.quantity - 1 } : o));
        } else {
            setOrders(orders.filter(o => o.name !== name));
        }
    };

    const handleQuantityChange = (name: string, val: string) => {
        // Eğer boşsa 0 olarak kabul et (kullanıcının silmesine izin ver)
        const qty = val === '' ? 0 : parseInt(val);
        
        if (!isNaN(qty) && qty >= 0) {
                setOrders(orders.map(o => o.name === name ? { ...o, quantity: qty } : o));
        }
    };

    const sortedMenuCategories = useMemo(() => {
        return Object.entries(categorizedMenus).sort(([a], [b]) => {
            const indexA = CATEGORY_ORDER.indexOf(a);
            const indexB = CATEGORY_ORDER.indexOf(b);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        });
    }, [categorizedMenus]);

    // Validation Helper
    const validateFields = () => {
        if (!customerName || !phone || !tableNumber || (!adultCount && adultCount !== 0)) {
            alert("Lütfen zorunlu alanları doldurunuz:\n- Misafir Ad Soyad\n- Yetişkin Sayısı\n- Masa Seçimi\n- İletişim Telefonu");
            return false;
        }
        
        // Telefon Numarası Kontrolü (10 hane veya 3 hane dahili)
        if (phone.length !== 10 && phone.length !== 3) {
            alert("Telefon numarası başında 0 olmadan 10 hane (5xxxxxxxxx) veya 3 hane (dahili) olmalıdır.");
            return false;
        }

        if (!recordedBy) {
            alert("Lütfen rezervasyonu kayıt alan personeli seçiniz.");
            return false;
        }

        return true;
    };

    const handleNextStep = () => {
        if (validateFields()) {
            setStep(2);
        }
    };

    const handleFinalSave = () => {
        if (validateFields()) {
            // Adedi 0 olan ürünleri kaydetme
            const validOrders = orders.filter(o => o.quantity > 0);
            onSave({
                customerName, adultCount, childCount, phone, tableNumber, note, orders: validOrders, date: selectedDate, recordedBy
            });
        }
    };

    const formatTableDisplay = (tableVal: string | number) => {
        if (tableVal === "IHLARA") return "IHLARA";
        return `G-${tableVal.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in no-print">
            <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-2xl flex flex-col h-[90vh]">
                <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center flex-none">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <i className={`fas ${data?.id ? 'fa-edit' : 'fa-calendar-plus'} text-amber-500`}></i>
                        {data?.id ? 'Rezervasyonu Düzenle' : 'Yeni Rezervasyon'}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={() => setStep(1)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${step === 1 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}>1. Misafir Bilgileri</button>
                        <button onClick={handleNextStep} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${step === 2 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}>2. Sipariş Oluştur</button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden p-8 flex flex-col">
                    {step === 1 ? (
                        <div className="space-y-3 max-w-xl mx-auto w-full overflow-y-auto custom-scrollbar pr-2">
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/50 font-black uppercase tracking-widest ml-1">Misafir Ad Soyad <span className="text-red-500">*</span></label>
                                <input required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" placeholder="Örn: Ahmet Yılmaz" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/50 font-black uppercase tracking-widest ml-1">Yetişkin Sayısı <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" value={adultCount} onChange={e => setAdultCount(parseInt(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/50 font-black uppercase tracking-widest ml-1">Çocuk Sayısı</label>
                                    <input type="number" min="0" value={childCount} onChange={e => setChildCount(parseInt(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/50 font-black uppercase tracking-widest ml-1">Masa Seçimi <span className="text-red-500">*</span></label>
                                    <select value={tableNumber} onChange={e => setTableNumber(e.target.value === "IHLARA" ? "IHLARA" : parseInt(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white">
                                        <option value="" disabled>Seçiniz</option>
                                        {TABLE_LIST.map(n => (
                                            <option 
                                                key={n} 
                                                value={n} 
                                                disabled={data?.tableNumber !== n && allReservations.some(r => r.tableNumber === n)} 
                                                className="bg-slate-900"
                                            >
                                                {formatTableDisplay(n)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/50 font-black uppercase tracking-widest ml-1">İletişim Telefonu (Başında 0 olmadan) <span className="text-red-500">*</span></label>
                                    <input 
                                        required 
                                        type="tel"
                                        value={phone} 
                                        onChange={e => {
                                            // Sadece rakamları al
                                            let val = e.target.value.replace(/\D/g, '');
                                            // Başında 0 varsa sil
                                            if (val.startsWith('0')) val = val.substring(1);
                                            // Maksimum 10 hane
                                            setPhone(val.slice(0, 10));
                                        }} 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white font-mono" 
                                        placeholder="5xxxxxxxxx veya Dahili" 
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/50 font-black uppercase tracking-widest ml-1">Kayıt Alan Personel <span className="text-red-500">*</span></label>
                                <select value={recordedBy} onChange={e => setRecordedBy(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white">
                                    <option value="" disabled>Seçiniz</option>
                                    {STAFF_LIST.map(s => (
                                        <option key={s} value={s} className="bg-slate-900">{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/50 font-black uppercase tracking-widest ml-1">Özel Notlar</label>
                                <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-white resize-none outline-none focus:border-amber-500" placeholder="Alerji, çocuk sandalyesi vb."></textarea>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full overflow-hidden">
                            <div className="md:col-span-8 flex flex-col h-full overflow-hidden">
                                <div className="flex items-center gap-4 mb-4 flex-none">
                                    <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.2em]">Restoran Menüsü</h3>
                                    <div className="flex-1 h-px bg-slate-800"></div>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-10">
                                    {sortedMenuCategories.map(([cat, items]) => (
                                        <div key={cat} className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <h4 className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em]">{cat}</h4>
                                                <div className="flex-1 h-px bg-slate-800/30 border-dashed border-t"></div>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                {items.map((item, idx) => (
                                                    <button 
                                                        key={idx} 
                                                        onClick={() => handleAddItem(item)} 
                                                        className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800 hover:border-amber-500/50 transition-all group text-left"
                                                    >
                                                        <span className="flex-1 text-sm font-medium text-white group-hover:text-amber-500 transition-colors">{item.name}</span>
                                                        <div className="flex items-center gap-1 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                                            <span className="text-xs text-slate-500 font-bold">₺</span>
                                                            <span className="text-emerald-400 text-right text-xs font-mono font-bold">{item.price}</span>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                            <i className="fas fa-plus text-[10px]"></i>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-4 flex flex-col h-full bg-slate-950/40 rounded-3xl border border-slate-700/50 p-6 shadow-inner overflow-hidden">
                                <div className="flex items-center justify-between mb-4 flex-none">
                                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <i className="fas fa-receipt"></i> Siparişler
                                    </h3>
                                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full">{orders.length} Kalem</span>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                                    {orders.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm text-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                                                <i className="fas fa-shopping-basket text-2xl text-slate-700"></i>
                                            </div>
                                            Henüz ürün seçilmedi.<br/>Soldaki menüden ürün ekleyin.
                                        </div>
                                    ) : (
                                        orders.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800 animate-fade-in">
                                                <div className="flex flex-col flex-1 min-w-0 pr-2">
                                                    <span className="text-sm text-white font-semibold truncate">{item.name}</span>
                                                    <span className="text-sm text-emerald-400 font-mono font-bold">{item.price} ₺</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 flex-none">
                                                    <button onClick={() => handleRemoveItem(item.name)} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-minus text-[10px]"></i></button>
                                                    <input 
                                                        type="text" 
                                                        inputMode="numeric"
                                                        className="w-8 bg-transparent text-center text-xs font-bold text-white outline-none border-b border-transparent focus:border-amber-500 transition-colors"
                                                        value={item.quantity} 
                                                        onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <button onClick={() => handleAddItem(item)} className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"><i className="fas fa-plus text-[10px]"></i></button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2 flex-none">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GENEL TOPLAM</span>
                                        <span className="text-2xl font-black text-amber-500 font-mono">₺{totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-8 py-6 border-t border-slate-800 flex justify-between gap-4 flex-none bg-slate-900/50">
                    <button onClick={onClose} className="px-8 text-white/30 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all">İptal Et</button>
                    <div className="flex gap-4">
                        {step === 1 ? (
                            <button onClick={handleNextStep} className="bg-slate-800 hover:bg-slate-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all">
                                Ürün ve Sipariş Seçimine Geç <i className="fas fa-chevron-right text-[10px]"></i>
                            </button>
                        ) : (
                            <>
                                <button onClick={() => setStep(1)} className="border border-slate-700 hover:bg-slate-800 text-white/50 font-black py-4 px-10 rounded-2xl uppercase tracking-widest text-[10px] transition-all">
                                    <i className="fas fa-chevron-left text-[10px] mr-3"></i> Bilgileri Düzenle
                                </button>
                                <button onClick={handleFinalSave} className="bg-amber-600 hover:bg-amber-500 text-white font-black py-4 px-12 rounded-2xl shadow-xl uppercase tracking-widest text-[10px] transition-all transform hover:scale-[1.02]">
                                    <i className="fas fa-check mr-2"></i> Rezervasyonu Kaydet
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
