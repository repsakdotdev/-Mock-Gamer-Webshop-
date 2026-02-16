import { Product } from "./product.model";

export interface CartItemRendered {
    cartItemId: number,
    product: Product,
    quantity: number,
}