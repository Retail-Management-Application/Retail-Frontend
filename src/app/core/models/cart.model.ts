export interface CartItem {
  cartItemId:  number;
  productId:   number;
  productName: string;
  price:       number;
  quantity:    number;
  subtotal:    number;
}

export interface Cart {
  cartId: number;
  items:  CartItem[];
  total:  number;
}

