export type Payment = {
  type: string;
  address?: string;
  creditCardNumber?: number;
};

export type Delivery = {
  type?: string;
  address?: string;
};
