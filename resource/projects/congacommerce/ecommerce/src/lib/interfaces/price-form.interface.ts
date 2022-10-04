import { ProductAttributeValue } from '../modules/catalog/classes/product-attribute-value.model';
import { PriceMatrix } from '../modules/pricing/classes/price-matrix.model';

/** @ignore */
export interface PriceForm {
    quantity: number;
    priceMatrices?: Array<PriceMatrix>;
    attributeValueList?: Array<ProductAttributeValue>;
}
