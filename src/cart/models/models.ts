export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CartItem = {
  productId: string;
  count: number;
  price: number;
};

export type CartResponse = {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  status: CartStatuses;
  items: CartItem[];
};
