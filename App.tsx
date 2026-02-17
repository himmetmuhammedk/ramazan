
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ReservationList from './components/ReservationList';
import ReservationModal from './components/ReservationModal';
import { Reservation, TableStatus } from './types';

const INITIAL_RESERVATIONS: Reservation[] = [];

const App: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const totalTables = 30;
  
  const tables: TableStatus[] = useMemo(() => {
    return Array.from({ length: totalTables }, (_, i) => {
      const tableNumber = i + 1;
      const reservation = reservations.find(r => r.tableNumber === tableNumber);
      return {
        tableNumber,
        isReserved: !!reservation,
        reservation
      };
    });
  }, [reservations]);

  const stats = useMemo(() => {
    const reservedCount = reservations.length;
    const totalPeople = reservations.reduce((acc, r) => acc + r.peopleCount, 0);
    return { reservedCount, totalPeople };
  }, [reservations]);

  const handleOpenNewModal = (tableNum?: number) => {
    setEditingReservation(null);
    setSelectedTableNumber(tableNum || null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setSelectedTableNumber(reservation.tableNumber);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTableNumber(null);
    setEditingReservation(null);
  };

  const handleSaveReservation = (data: Omit<Reservation, 'id' | 'timestamp'>) => {
    if (editingReservation) {
      setReservations(prev => prev.map(r => 
        r.id === editingReservation.id ? { ...r, ...data } : r
      ));
    } else {
      const newRes: Reservation = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date()
      };
      setReservations(prev => [...prev, newRes]);
    }
    handleCloseModal();
  };

  const handleCancelReservation = (tableNumber: number) => {
    if (window.confirm(`${tableNumber} numaralı masanın rezervasyonunu iptal etmek istediğinize emin misiniz?`)) {
      setReservations(prev => prev.filter(r => r.tableNumber !== tableNumber));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Main Content (Left side) */}
      <main className="flex-1 p-4 md:p-6 flex flex-col min-w-0 order-1 overflow-hidden">
        <header className="flex-none mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-500 mb-1">Ramazan Sofrası</h1>
            <p className="text-slate-400 text-sm md:text-base">Rezervasyon ve Masa Yönetim Paneli</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 md:p-4 rounded-xl flex items-center gap-4 self-start lg:self-auto">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Kalan Masa</p>
              <p className="text-xl md:text-2xl font-bold text-emerald-400">{totalTables - stats.reservedCount}</p>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Dolan Masa</p>
              <p className="text-xl md:text-2xl font-bold text-amber-400">{stats.reservedCount}</p>
            </div>
          </div>
        </header>

        {/* Scrollable List Container */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar">
          <ReservationList 
            tables={tables} 
            onTableClick={(table) => {
              if (table.isReserved && table.reservation) {
                handleOpenEditModal(table.reservation);
              } else {
                handleOpenNewModal(table.tableNumber);
              }
            }}
            onCancel={handleCancelReservation}
          />
        </div>
      </main>

      {/* Sidebar (Right side) */}
      <Sidebar 
        stats={stats} 
        onNewReservation={() => handleOpenNewModal()} 
        className="order-2 md:order-2 border-t md:border-t-0 md:border-l"
      />

      {isModalOpen && (
        <ReservationModal 
          onClose={handleCloseModal} 
          onSubmit={handleSaveReservation}
          initialData={editingReservation || undefined}
          selectedTableNumber={selectedTableNumber}
          reservedTableNumbers={reservations.map(r => r.tableNumber)}
        />
      )}
    </div>
  );
};

export default App;
