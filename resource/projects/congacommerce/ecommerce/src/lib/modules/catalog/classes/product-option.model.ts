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
    Name: string | null= null;

    @Expose({ name: 'ContentType' })
    ContentType: string | null= null;

    @Expose({ name: 'Sequence' })
    Sequence: number | null= null;

    @Expose({ name: 'ProductOptions' })
    @Type(() => ProductOptionComponent)
    Options: Array<ProductOptionComponent> | null= null;

    @Expose({ name: 'OptionGroup' })
    @Type(() => Category)
    OptionGroup: Category | null= null;

    @Expose({ name: 'DetailPage' })
    DetailPage: string | null= null;

    @Expose({ name: 'IsHidden' })
    IsHidden: boolean = false;

    @Expose({ name: 'IsLeaf' })
    IsLeaf: boolean = false;

    @Expose({ name: 'IsPicklist' })
    IsPicklist: boolean = false;

    @Expose({ name: 'Left' })
    Left: number | null= null;

    @Expose({ name: 'Level' })
    Level: number | null= null;

    @Expose({ name: 'MaxOptions' })
    MaxOptions: number | null= null;

    @Expose({ name: 'MaxTotalQuantity' })
    MaxTotalQuantity: number | null= null;

    @Expose({ name: 'MaxTotalQuantityExpression' })
    MaxTotalQuantityExpression: string | null= null;

    @Expose({ name: 'MinOptions' })
    MinOptions: number | null= null;

    @Expose({ name: 'MinTotalQuantity' })
    MinTotalQuantity: number | null= null;

    @Expose({ name: 'MinTotalQuantityExpression' })
    MinTotalQuantityExpression: string | null= null;

    @Expose({ name: 'ModifiableType' })
    ModifiableType: string | null= null;

    @Expose({ name: 'ParentOptionGroup' })
    @Type(() => Category)
    ParentOptionGroup: Category | null= null;

    @Expose({ name: 'Product' })
    @Type(() => Product)
    Product: Product | null= null;

    @Expose({ name: 'ProductAttributeGroupMember' })
    ProductAttributeGroupMember: string | null= null;

    @Expose({ name: 'Right' })
    Right: number | null= null;

    @Expose({ name: 'RootOptionGroup' })
    @Type(() => Category)
    RootOptionGroup: Category | null= null;

    @Expose({ name: 'RootSequence' })
    RootSequence: number | null= null;

    Label: string = '';
    RootId: string = '';

    validate(): void {
        this.clearError();
        const options = compact(map(get(this, 'Options'), o => get(o, 'ComponentProduct').get('item')));
        const total = sumBy(options, 'Quantity');
        // Validate Max quantity
        if (!get(this, 'IsHidden')) {
            const reference = { key: this.Id, value: this.Name };
            let childErrors: any = [];
            forEach(get(this, 'ChildOptionGroups'), g => {
                childErrors = concat(childErrors, g.errors);
            });
            if (!isEmpty(compact(childErrors)))
                this.setError('ERROR.OPTION_GROUP.ERROR', null, 'error', childErrors, reference);

            if (!isNil(get(this, 'MaxTotalQuantity')) && total > (this.MaxTotalQuantity as number))
                this.setError('ERROR.OPTION_GROUP.MAX_TOTAL_QUANTITY', { value: this.MaxTotalQuantity }, 'error', null, reference);

            // Validate Max Quantity
            if (!isNil(get(this, 'MinTotalQuantity')) && total < (this.MinTotalQuantity as number))
                this.setError('ERROR.OPTION_GROUP.MIN_TOTAL_QUANTITY', { value: this.MinTotalQuantity }, 'error', null, reference);

            // Validate min options
            if (!isNil(get(this, 'MinOptions')) && get(options, 'length', 0) < (this.MinOptions as number))
                this.setError('ERROR.OPTION_GROUP.MIN_OPTIONS', { value: this.MinOptions }, 'error', null, reference);

            // Validate max options
            if (!isNil(get(this, 'MaxOptions')) && get(options, 'length', 0) > (this.MaxOptions as number))
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
    Name: string | null= null;

    @Expose({ name: 'ParentProduct' })
    @Type(() => Product)
    ParentProduct: Product | null= null;

    @Expose({ name: 'ComponentProduct' })
    @Type(() => Product)
    ComponentProduct: Product;

    @Expose({ name: 'ProductOptionGroup' })
    @Type(() => ProductOptionGroup)
    ProductOptionGroup: ProductOptionGroup | null= null;

    @Expose({ name: 'MinQuantity' })
    MinQuantity: number | null= null;

    @Expose({ name: 'AllowCloning' })
    AllowCloning: boolean =false;

    @Expose({ name: 'AutoUpdateQuantity' })
    AutoUpdateQuantity: boolean =false;

    @Expose({ name: 'ConfigType' })
    ConfigType: string | null= null;

    @Expose({ name: 'IsDefault' })
    Default: boolean =false;

    @Expose({ name: 'DefaultQuantity' })
    DefaultQuantity: number | null= null;

    @Expose({ name: 'DefaultQuantityExpression' })
    DefaultQuantityExpression: string | null= null;

    @Expose({ name: 'InclusionCriteria' })
    InclusionCriteria: string | null= null;

    @Expose({ name: 'MaxQuantity' })
    MaxQuantity: number | null= null;

    @Expose({ name: 'MaxQuantityExpression' })
    MaxQuantityExpressionId: number | null= null;

    @Expose({ name: 'MinQuantityExpression' })
    MinQuantityExpressionId: string | null= null;

    @Expose({ name: 'IsModifiable' })
    IsModifiable: boolean = false;

    @Expose({ name: 'RelationshipType' })
    RelationshipType: string | null= null;

    @Expose({ name: 'IsRequired' })
    IsRequired: boolean = false;

    @Expose({ name: 'Sequence' })
    Sequence: number | null= null;

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
    AdjustmentAmount: number | null= null;

    @Expose({ name: 'AdjustmentType' })
    AdjustmentType: string | null= null;

    @Expose({ name: 'AllocateGroupAdjustment' })
    AllocateGroupAdjustment: boolean = false;

    @Expose({ name: 'AllowManualAdjustment' })
    AllowManualAdjustment: boolean = false;

    @Expose({ name: 'ChargeType' })
    ChargeType: string | null= null;

    @Expose({ name: 'ContractPrice' })
    ContractPrice: number | null= null;

    @Expose({ name: 'HideInvoiceDisplay' })
    HideInvoiceDisplay: boolean = false;

    @Expose({ name: 'IsQuantityReadOnly' })
    IsQuantityReadOnly: boolean = false;

    @Expose({ name: 'IsSellingTermReadOnly' })
    IsSellingTermReadOnly: boolean = false;

    @Expose({ name: 'PriceIncludedInBundle' })
    PriceIncludedInBundle: boolean = false;

    @Expose({ name: 'PriceListId' })
    PriceListId: string | null= null;

    @Expose({ name: 'PriceOverride' })
    PriceOverride: number | null= null;

    @Expose({ name: 'ProductOptionId' })
    ProductOptionId: string | null= null;

    @Expose({ name: 'RollupPriceMethod' })
    RollupPriceMethod: string | null= null;

    @Expose({ name: 'Sequence' })
    Sequence: number | null= null;
}