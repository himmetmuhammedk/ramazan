
export interface Reservation {
  id: string;
  tableNumber: number;
  customerName: string;
  peopleCount: number;
  phone: string;
  note?: string;
  timestamp: any;
}

export interface TableStatus {
  tableNumber: number;
  isReserved: boolean;
  reservation?: Reservation;
}

export interface IftarMenu {
  soup: string;
  mainCourse: string;
  side: string;
  dessert: string;
  drink: string;
}
