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
    IconId: string = null;

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'ConfigurationType' })
    ConfigurationType: string = null;

    @Expose({ name: 'Uom' })
    Uom: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'Family' })
    Family: string = null;

    @Expose({ name: 'ProductCode' })
    ProductCode: string = null;

    @Expose({ name: 'IsActive' })
    IsActive: boolean = null;

    @Expose({ name: 'HasAttributes' })
    HasAttributes: boolean = null;

    @Expose({ name: 'HasDefaults' })
    HasDefaults: boolean = null;

    @Expose({ name: 'HasOptions' })
    HasOptions: boolean = null;

    @Expose({ name: 'ExpirationDate' })
    ExpirationDate: Date = null;

    @Expose({ name: 'EffectiveStartDate' })
    EffectiveStartDate: Date = null;

    @Expose({ name: 'EffectiveDate' })
    EffectiveDate: Date = null;

    @Expose({ name: 'Version' })
    Version: number = null;

    @Type(() => ProductCategory)
    @Expose({ name: 'Categories' })
    Categories: Array<ProductCategory> = null;

    @Type(() => PriceListItem)
    @Expose({ name: 'Prices' })
    PriceLists: Array<PriceListItem> = null;

    @Type(() => ProductFeatureValue)
    @Expose({ name: 'ProductFeatureValues' })
    ProductFeatureValues: Array<ProductFeatureValue> = null;

    @Type(() => AssetLineItemExtended)
    @Expose({ name: 'AssetLineItems' })
    AssetLineItems?: Array<AssetLineItemExtended> = null;

    @Type(() => ProductOptionGroup)
    @Expose({ name: 'ProductOptionGroups' })
    OptionGroups: Array<ProductOptionGroup> = null;

    @Type(() => ProductAttributeGroup)
    @Expose({ name: 'ProductAttributeGroups' })
    AttributeGroups: Array<ProductAttributeGroup> = null;

    @Type(() => ProductGroupMember)
    @Expose({ name: 'ProductGroups' })
    ProductGroups: Array<ProductGroupMember> = null;

    @Type(() => ProductAttributeMatrixView)
    @Expose({ name: 'ProductAttributeMatrixViews' })
    ProductAttributeMatrixViews: Array<ProductAttributeMatrixView> = null;

    @Type(() => ProductTranslation)
    @Expose({ name: 'Translation' })
    Translation: Array<ProductTranslation> = null;

    validate(): void {
        const errors = this.get('error');
        this.clearError();
        let childErrors = [];
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
    Products: Array<Product> = null;

    @Expose({ name: 'TotalCount' })
    TotalCount: number = null;
}