export interface basicMenu {
  id: string;
  name: string;
  category: Categories[];
  items?: Item[];
}
export interface meta {
  id: string;
  name: string;
  category: Categories[];
}
export interface Item {
  id: number;
  name: string;
  description: string;
}
export enum Categories {
  pizza = "pizza",
  burger = "burger",
  pasta = "pasta",
  dessert = "dessert",
  drinks = "drinks",
}
export interface BasicItem {
  id: number;
  name: string;
  description: string;
}

export interface meta {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
