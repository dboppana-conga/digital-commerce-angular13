export interface FavoriteItemRequest {
  /**
   * string representing product identifier.
   */
  ProductId: string;
  /**
   * number representing units of product to be added as a favorite.
   */
  Quantity: number;
}

export interface FavoriteRequest {
  /**
   * string representing favorite identifier.
   */
  FavoriteId: string;
}