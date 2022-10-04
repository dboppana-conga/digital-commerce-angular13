import { Category } from '../modules/catalog/classes/category.model';
import { Product } from '../modules/catalog/classes/product.model';

/**
 * The results returned from a product search using the search service.
 */
export interface SearchResults {
    /**
     * Filtered product list.
     */
    productList: Array<Product>;
    /**
     * Related categories.
     */
    relatedCategories: Array<Category>;
    /**
     * Subcategories.
     */
    subcategories: Array<Category>;
    /**
     * Aggregate data for results without filters applied.
     */
    totals: any;
    /**
     * Aggregate data for results with filters applied.
     */
    filteredTotals: any;
}