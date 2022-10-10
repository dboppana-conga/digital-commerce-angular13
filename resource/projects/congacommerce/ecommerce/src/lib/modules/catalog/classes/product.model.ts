import { Expose, Type } from 'class-transformer';
import { isEmpty, concat, filter, get, forEach } from 'lodash';
import { AObject, ATable } from '@congacommerce/core';
import { PriceListItem } from '../../pricing/classes/price-list-item.model';
import { ProductCategory } from './product-category.model';
import { ProductTranslation } from '../../translation/classes/product-translation.model';
import { ProductFeatureValue } from './product-feature.model';
import { ProductGroupMember } from './product-group.model';
import { AssetLineItemExtended } from '../../abo/classes/asset-item.model';
import { ProductOptionGroup, ProductOptionComponent } from './product-option.model';
import { ProductAttributeMatrixView } from '../../constraint-rules/classes/attribute-value-matrix/product-attribute-matrix-view.model';
import { ProductAttributeGroup } from './product-attribute-group.model';
@ATable({
    sobjectName: 'Product',
    route: 'products'
})
export class Product extends AObject {

    @Expose({ name: 'ImageURL' })
    IconId: string | null= null;

    @Expose({ name: 'Name' })
    Name: string | null= null;

    @Expose({ name: 'ConfigurationType' })
    ConfigurationType: string | null= null;

    @Expose({ name: 'Uom' })
    Uom: string | null= null;

    @Expose({ name: 'Description' })
    Description: string | null= null;

    @Expose({ name: 'Family' })
    Family: string | null= null;

    @Expose({ name: 'ProductCode' })
    ProductCode: string | null= null;

    @Expose({ name: 'IsActive' })
    IsActive: boolean = false;

    @Expose({ name: 'HasAttributes' })
    HasAttributes: boolean = false;

    @Expose({ name: 'HasDefaults' })
    HasDefaults: boolean = false;

    @Expose({ name: 'HasOptions' })
    HasOptions: boolean = false;

    @Expose({ name: 'ExpirationDate' })
    ExpirationDate: Date | null= null;

    @Expose({ name: 'EffectiveStartDate' })
    EffectiveStartDate: Date | null= null;

    @Expose({ name: 'EffectiveDate' })
    EffectiveDate: Date | null= null;

    @Expose({ name: 'Version' })
    Version: number | null= null;

    @Type(() => ProductCategory)
    @Expose({ name: 'Categories' })
    Categories: Array<ProductCategory> | null= null;

    @Type(() => PriceListItem)
    @Expose({ name: 'Prices' })
    PriceLists: Array<PriceListItem> | null= null;

    @Type(() => ProductFeatureValue)
    @Expose({ name: 'ProductFeatureValues' })
    ProductFeatureValues: Array<ProductFeatureValue> | null= null;

    @Type(() => AssetLineItemExtended)
    @Expose({ name: 'AssetLineItems' })
    AssetLineItems?: Array<AssetLineItemExtended> | null= null;

    @Type(() => ProductOptionGroup)
    @Expose({ name: 'ProductOptionGroups' })
    OptionGroups: Array<ProductOptionGroup> | null= null;

    @Type(() => ProductAttributeGroup)
    @Expose({ name: 'ProductAttributeGroups' })
    AttributeGroups: Array<ProductAttributeGroup> | null= null;

    @Type(() => ProductGroupMember)
    @Expose({ name: 'ProductGroups' })
    ProductGroups: Array<ProductGroupMember> | null= null;

    @Type(() => ProductAttributeMatrixView)
    @Expose({ name: 'ProductAttributeMatrixViews' })
    ProductAttributeMatrixViews: Array<ProductAttributeMatrixView> | null= null;

    @Type(() => ProductTranslation)
    @Expose({ name: 'Translation' })
    Translation: Array<ProductTranslation> | null= null;

    validate(): void {
        const errors = this.get('error');
        this.clearError();
        let childErrors : any= [];
        const handleComponent = (c: ProductOptionComponent) => {
            if (filter(this.get('cartItems'), item => get(item, 'ProductOption.ComponentProduct.Id') === get(c, 'ComponentProduct.Id') && get(item, 'ProductOption.ProductOptionGroup.Id') === get(c, 'ProductOptionGroup.Id')).length > 0)
                forEach(get(c, 'ComponentProduct.OptionGroups', []), handleGroup);
        };

        const handleGroup = (g: ProductOptionGroup) => {
            if (get(g, 'hasErrors')) childErrors = concat(g.errors);
            forEach(get(g, 'ChildOptionGroups', []), handleGroup);
            forEach(get(g, 'Options'), handleComponent);
        };
        forEach(get(this, 'OptionGroups', []), (og) => handleGroup(og));

        if (!isEmpty(childErrors) || !isEmpty(errors)) {
            this.setError('ERROR.PRODUCT.HAS_ERRORS', null, 'error', childErrors ? childErrors : errors);
        }
    }
}

export class ProductResult {

    @Type(() => Product)
    @Expose({ name: 'Products' })
    Products: Array<Product> | null= null;

    @Expose({ name: 'TotalCount' })
    TotalCount: number | null= null;
}