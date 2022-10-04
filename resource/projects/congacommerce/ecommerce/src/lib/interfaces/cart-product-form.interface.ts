/**
 * Special type for holding product codes and their associated quantity. Used for bulk adding products to the cart.
 */
export interface CartProductForm {
    /**
     * The code for the product.
     */
    productCode: string;
    /**
     * The quantity of this product to add to the cart.
     */
    quantity: number;
}