import { BasicItem, basicMenu, Categories } from "./menuModel";

export enum Status {
  prepairng = "prepairng",
  delivering = "delivering",
  delivered = "delivered",
}

export interface Order {
  id: number;
  status: Status;
  items: BasicItem[];
}

export interface Cart {
  id: string;
  menuId: string;
  items: any[];
  category?: Categories[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  orders?: Order[];
  cart?: Cart;
  token?: string;
  menu?: basicMenu;
}
