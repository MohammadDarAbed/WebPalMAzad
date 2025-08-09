import { Product } from "../../products/models/product.model";
import { User } from "../../users/models/user.model";

export interface Address {
    Street: string;
    City: string;
    State: string;
    PostalCode: string;
    Country: string;
}

export interface OrderItem {
    quantity: number;
    product: Product;
}

export interface Order {
    id: number;
    address: Address;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    buyer: User;
    notes: string;
    orderDate: Date;
}