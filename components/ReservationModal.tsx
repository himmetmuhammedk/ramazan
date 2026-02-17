
import React, { useState, useEffect } from 'react';
import { Reservation } from '../types';

interface ReservationModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<Reservation, 'id' | 'timestamp'>) => void;
  initialData?: Reservation;
  selectedTableNumber: number | null;
  reservedTableNumbers: number[];
}

const ReservationModal: React.FC<ReservationModalProps> = ({ 
  onClose, 
  onSubmit, 
  initialData, 
  selectedTableNumber, 
  reservedTableNumbers 
}) => {
  // Added 'date' property to formData state to match Omit<Reservation, 'id' | 'timestamp'>
  const [formData, setFormData] = useState({
    customerName: '',
    peopleCount: 2,
    phone: '',
    tableNumber: 1,
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      // Synchronize 'date' from initialData when editing
      setFormData({
        customerName: initialData.customerName,
        peopleCount: initialData.peopleCount,
        phone: initialData.phone,
        tableNumber: initialData.tableNumber,
        note: initialData.note || '',
        date: initialData.date
      });
    } else if (selectedTableNumber) {
      setFormData(prev => ({ ...prev, tableNumber: selectedTableNumber }));
    }
  }, [initialData, selectedTableNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.tableNumber || !formData.date) return;
    onSubmit(formData);
  };

  // Logic: A table is "disabled" if it's already reserved, 
  // EXCEPT if it's the table we are currently editing.
  const isTableOccupied = (num: number) => {
    if (initialData && num === initialData.tableNumber) return false;
    return reservedTableNumbers.includes(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className={`fas ${initialData ? 'fa-edit' : 'fa-calendar-check'} text-amber-500`}></i>
            {initialData ? 'Rezervasyonu Düzenle' : 'Yeni Rezervasyon'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Müşteri Ad Soyad</label>
            <input 
              required
              type="text" 
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              value={formData.customerName}
              onChange={e => setFormData({...formData, customerName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rezervasyon Tarihi</label>
              <input 
                required
                type="date" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Telefon Numarası</label>
              <input 
                required
                type="tel" 
                placeholder="05xx xxx xx xx"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Kişi Sayısı</label>
              <input 
                required
                type="number" 
                min="1" 
                max="20"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={formData.peopleCount}
                onChange={e => setFormData({...formData, peopleCount: parseInt(e.target.value) || 1})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Masa No</label>
              <select 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={formData.tableNumber}
                onChange={e => setFormData({...formData, tableNumber: parseInt(e.target.value)})}
              >
                {Array.from({length: 30}, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} disabled={isTableOccupied(num)}>
                    Masa {num} {isTableOccupied(num) ? '(Dolu)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Not (Opsiyonel)</label>
            <textarea 
              rows={2}
              placeholder="Özel istekler veya notlar..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
            >
              {initialData ? 'Değişiklikleri Kaydet' : 'Kaydı Tamamla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
