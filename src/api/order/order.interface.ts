import { ShortUserView } from "../user/user.interface";
import { ShortProductView } from "../product/product.interface";

export interface OrderView {
  id: number;
  userId: number;
  productIds: string[];
}

export interface ProductOrdersView {
  id: number;
  user: ShortUserView;
  products: ShortProductView[];
}
