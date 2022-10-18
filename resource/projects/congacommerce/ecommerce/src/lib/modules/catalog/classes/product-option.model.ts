import { Type, Expose } from 'class-transformer';
import { get, compact, map, isNil, forEach, concat, isEmpty, sumBy, filter, some } from 'lodash';
import { AObject, ATable } from '@congacommerce/core';
import { Category } from './category.model';
import { Product } from './product.model';
import { LineStatus } from '../../cart/enums';
@ATable({
    sobjectName: 'ProductOptionGroup'
})
export class ProductOptionGroup extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'ContentType' })
    ContentType: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'ProductOptions' })
    @Type(() => ProductOptionComponent)
    Options: Array<ProductOptionComponent> = null;

    @Expose({ name: 'OptionGroup' })
    @Type(() => Category)
    OptionGroup: Category = null;

    @Expose({ name: 'DetailPage' })
    DetailPage: string = null;

    @Expose({ name: 'IsHidden' })
    IsHidden: boolean = null;

    @Expose({ name: 'IsLeaf' })
    IsLeaf: boolean = null;

    @Expose({ name: 'IsPicklist' })
    IsPicklist: boolean = null;

    @Expose({ name: 'Left' })
    Left: number = null;

    @Expose({ name: 'Level' })
    Level: number = null;

    @Expose({ name: 'MaxOptions' })
    MaxOptions: number = null;

    @Expose({ name: 'MaxTotalQuantity' })
    MaxTotalQuantity: number = null;

    @Expose({ name: 'MaxTotalQuantityExpression' })
    MaxTotalQuantityExpression: string = null;

    @Expose({ name: 'MinOptions' })
    MinOptions: number = null;

    @Expose({ name: 'MinTotalQuantity' })
    MinTotalQuantity: number = null;

    @Expose({ name: 'MinTotalQuantityExpression' })
    MinTotalQuantityExpression: string = null;

    @Expose({ name: 'ModifiableType' })
    ModifiableType: string = null;

    @Expose({ name: 'ParentOptionGroup' })
    @Type(() => Category)
    ParentOptionGroup: Category = null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product = null;

    @Expose({ name: 'ProductAttributeGroupMember' })
    ProductAttributeGroupMember: string = null;

    @Expose({ name: 'Right' })
    Right: number = null;

    @Expose({ name: 'RootOptionGroup' })
    @Type(() => Category)
    RootOptionGroup: Category = null;

    @Expose({ name: 'RootSequence' })
    RootSequence: number = null;

    Label: string;
    RootId: string;

    validate(): void {
        this.clearError();
        const options = compact(map(get(this, 'Options'), o => get(o, 'ComponentProduct').get('item')));
        const total = sumBy(options, 'Quantity');
        // Validate Max quantity
        if (!get(this, 'IsHidden')) {
            const reference = { key: this.Id, value: this.Name };
            let childErrors = [];
            forEach(get(this, 'ChildOptionGroups'), g => {
                childErrors = concat(childErrors, g.errors);
            });
            if (!isEmpty(compact(childErrors)))
                this.setError('ERROR.OPTION_GROUP.ERROR', null, 'error', childErrors, reference);

            if (!isNil(get(this, 'MaxTotalQuantity')) && total > this.MaxTotalQuantity)
                this.setError('ERROR.OPTION_GROUP.MAX_TOTAL_QUANTITY', { value: this.MaxTotalQuantity }, 'error', null, reference);

            // Validate Max Quantity
            if (!isNil(get(this, 'MinTotalQuantity')) && total < this.MinTotalQuantity)
                this.setError('ERROR.OPTION_GROUP.MIN_TOTAL_QUANTITY', { value: this.MinTotalQuantity }, 'error', null, reference);

            // Validate min options
            if (!isNil(get(this, 'MinOptions')) && get(options, 'length', 0) < this.MinOptions)
                this.setError('ERROR.OPTION_GROUP.MIN_OPTIONS', { value: this.MinOptions }, 'error', null, reference);

            // Validate max options
            if (!isNil(get(this, 'MaxOptions')) && get(options, 'length', 0) > this.MaxOptions)
                this.setError('ERROR.OPTION_GROUP.MAX_OPTIONS', { value: this.MaxOptions }, 'error', null, reference);

            // Validate Required options
            let requiredProdOptionCom = filter(this.Options, (o) => o.IsRequired);
            if (some(requiredProdOptionCom, (reqCom) => !(!isNil(get(reqCom, 'ComponentProduct._metadata.item')) && get(reqCom, 'ComponentProduct._metadata.item.LineStatus') !== LineStatus.Cancel))) {
                let prodMissing = Array<string>();
                forEach(requiredProdOptionCom,
                    (reqCom) => {
                        if (!(!isNil(get(reqCom, 'ComponentProduct._metadata.item')) && get(reqCom, 'ComponentProduct._metadata.item.LineStatus') !== LineStatus.Cancel))
                            prodMissing.push(get(reqCom, 'ComponentProduct.Name'));
                    });
                this.setError('ERROR.OPTION_GROUP.REQUIRED_OPTION_MISSING', { value: prodMissing.toString() }, 'error', null, reference);

            }
        }
    }
}

@ATable({
    sobjectName: 'ProductOptionComponent'
})
export class ProductOptionComponent extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'ParentProduct' })
    @Type(() => Product)
    ParentProduct: Product = null;

    @Expose({ name: 'ComponentProduct' })
    @Type(() => Product)
    ComponentProduct: Product;

    @Expose({ name: 'ProductOptionGroup' })
    @Type(() => ProductOptionGroup)
    ProductOptionGroup: ProductOptionGroup = null;

    @Expose({ name: 'MinQuantity' })
    MinQuantity: number = null;

    @Expose({ name: 'AllowCloning' })
    AllowCloning: boolean = null;

    @Expose({ name: 'AutoUpdateQuantity' })
    AutoUpdateQuantity: boolean = null;

    @Expose({ name: 'ConfigType' })
    ConfigType: string = null;

    @Expose({ name: 'IsDefault' })
    Default: boolean = null;

    @Expose({ name: 'DefaultQuantity' })
    DefaultQuantity: number = null;

    @Expose({ name: 'DefaultQuantityExpression' })
    DefaultQuantityExpression: string = null;

    @Expose({ name: 'InclusionCriteria' })
    InclusionCriteria: string = null;

    @Expose({ name: 'MaxQuantity' })
    MaxQuantity: number = null;

    @Expose({ name: 'MaxQuantityExpression' })
    MaxQuantityExpressionId: number = null;

    @Expose({ name: 'MinQuantityExpression' })
    MinQuantityExpressionId: string = null;

    @Expose({ name: 'IsModifiable' })
    IsModifiable: boolean = null;

    @Expose({ name: 'RelationshipType' })
    RelationshipType: string = null;

    @Expose({ name: 'IsRequired' })
    IsRequired: boolean = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'OptionPrices' })
    @Type(() => ProductOptionPrice)
    OptionPrices: Array<ProductOptionPrice> = [new ProductOptionPrice()];

    _isOpen: boolean = false;
}

@ATable({
    sobjectName: 'ProductOptionPrice'
})
export class ProductOptionPrice extends AObject {

    @Expose({ name: 'AdjustmentAmount' })
    AdjustmentAmount: number = null;

    @Expose({ name: 'AdjustmentType' })
    AdjustmentType: string = null;

    @Expose({ name: 'AllocateGroupAdjustment' })
    AllocateGroupAdjustment: boolean = null;

    @Expose({ name: 'AllowManualAdjustment' })
    AllowManualAdjustment: boolean = null;

    @Expose({ name: 'ChargeType' })
    ChargeType: string = null;

    @Expose({ name: 'ContractPrice' })
    ContractPrice: number = null;

    @Expose({ name: 'HideInvoiceDisplay' })
    HideInvoiceDisplay: boolean = null;

    @Expose({ name: 'IsQuantityReadOnly' })
    IsQuantityReadOnly: boolean = null;

    @Expose({ name: 'IsSellingTermReadOnly' })
    IsSellingTermReadOnly: boolean = null;

    @Expose({ name: 'PriceIncludedInBundle' })
    PriceIncludedInBundle: boolean = null;

    @Expose({ name: 'PriceListId' })
    PriceListId: string = null;

    @Expose({ name: 'PriceOverride' })
    PriceOverride: number = null;

    @Expose({ name: 'ProductOptionId' })
    ProductOptionId: string = null;

    @Expose({ name: 'RollupPriceMethod' })
    RollupPriceMethod: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;
}