export interface Order {
    name: string;
    price: string;
    quantity: number;
}

export interface Reservation {
    id: string;
    customerName: string;
    adultCount: number;
    childCount: number;
    phone: string;
    tableNumber: number | string;
    note: string;
    orders: Order[];
    date: string;
    recordedBy: string;
}

export interface MenuItem {
    name: string;
    price: string;
}

export interface MenuCategory {
    [key: string]: MenuItem[];
}

export interface Stats {
    totalPeople: number;
    count: number;
}
