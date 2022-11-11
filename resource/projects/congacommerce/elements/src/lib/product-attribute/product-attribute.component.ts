import { Component, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { combineLatest, of, Observable } from 'rxjs';
import { AObject } from '@congacommerce/core';
import {
    AttributeValueMatrixService, AllowedValues, ProductAttributeValue,
    ProductAttributeGroupMember, ProductAttributeMatrixView, AttributeRuleService,
    AttributeRuleResult, Product, ProductOptionService, ProductAttributeGroup, ProductAttribute
} from '@congacommerce/ecommerce';
/**
 * Product attribute component is used to configure attributes on a product.
 * @ignore
 * <h3>Usage</h3>
 *
 ```typescript
 import { ProductAttributeModule } from '@congacommerce/elements';

 @NgModule({
  imports: [ProductAttributeModule, ...]
})
 export class AppModule {}
 ```
 *
 * @example
 * <apt-product-attribute
 *             [product]="product"
 *             [container]="productContainer"
 *             lineType="Option"
 *             [(productAttributeValue)]="productAttributeValue"
 *             (productAttributeValueChange)="handleAttributeValueChange($event)"
 * ></apt-product-attribute>
 */
@Component({
    selector: 'apt-product-attribute',
    templateUrl: './product-attribute.component.html',
    styleUrls: ['./product-attribute.component.scss']
})
export class ProductAttributeComponent implements OnChanges, OnDestroy {
    /**
     * Bundle product to get attributes for.
     */
    @Input() product: string | Product;
    /**
     * Container string
     */
    @Input() container: string;
    /**
     * Sets what type of line this is. Either Product or Option.
     */
    @Input() lineType: 'Product' | 'Option' = 'Product';
    /**
     * 2-way data bind [(productAttributeValue)]
     */
    @Input() productAttributeValue: ProductAttributeValue;
    /**
     * Property binding to control expand/collapse multiple attribute groups.
     */
    @Input() accordion: boolean = true;
    /**
     * Property binding to control expand/collapse of attribute groups.
     */
    @Input() collapseAll: boolean = true;
    /**
     * Event emitter for when the attribute value changes.
     */
    @Output() productAttributeValueChange: EventEmitter<ProductAttributeValue> = new EventEmitter<ProductAttributeValue>();
    /**
    * Event emitter with the boolean value when the attribute value changes.
    */
    @Output() attributeValueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /** @ignore */
    attrRuleInfo: Array<AttributeRuleResult>;
    metadata: any;
    attributeGroupList: Array<ProductAttributeGroup>;
    attributeValueCopy: ProductAttributeValue = new ProductAttributeValue();
    subscription: any;
    userselected = {};
    usercleared = {};
    lastTouched;
    attrClicked: boolean = false;
    timer: any;

    /** @ignore */
    product$: Observable<Product>;
    metadata$: Observable<any>;
    attributeRules$: Observable<Array<AttributeRuleResult>>;


    constructor(private attributeValueMatrixService: AttributeValueMatrixService,
        private productOptionService: ProductOptionService,
        private attributeRuleService: AttributeRuleService) { }

    ngOnChanges() {
        this.product$ = _.isString(this.product) ? this.productOptionService.getProductOptionTree(this.product as string) : of(this.product as Product);
        // TO DO : Uncomment when RLP  PAR and AVM are available
        // if (!this.metadata$)
        //     this.metadata$ = this.attributeValueMatrixService.describe(ProductAttributeValue);

        // this.attributeRules$ = _.isString(this.product) ? this.attributeRuleService.getAttributeRulesForProducts([this.product as string]) : this.attributeRuleService.getAttributeRulesForProducts([this.product as Product]);
        // this.attributeValueCopy = _.cloneDeep(this.productAttributeValue);
        // this.subscription = combineLatest(this.attributeRules$, this.metadata$, this.product$)
        //     .subscribe(([ruleInfo, metadata, product]) => {
        //         if (_.get(ruleInfo, 'length') > 0) {
        //             this.attrRuleInfo = ruleInfo as Array<AttributeRuleResult>;
        //             const attributes = _.flatten(_.map(_.flatten(_.map(product.AttributeGroups, r => _.get(r, 'AttributeGroup'))), r => r.ProductAttributes));
        //             this.applyRule(this.attrRuleInfo, attributes, this.productAttributeValue, metadata);
        //         }
        //         if (_.get(product.ProductAttributeMatrixViews, 'length') > 0) {
        //             const matrixResult = this.attributeValueMatrixService.processAttributeMatrices(product.ProductAttributeMatrixViews, metadata, this.productAttributeValue, this.userselected, this.lastTouched, this.usercleared, this.attributeValueCopy);
        //             this.applyMatrixViews(matrixResult, product.AttributeGroups, this.productAttributeValue);
        //             this.attributeValueCopy = _.cloneDeep(this.productAttributeValue);
        //         }
        //         this.productAttributeValueChange.emit(this.productAttributeValue);
        //     });
    }

    trackById(index, record: AObject): string {
        return _.get(record, 'Id');
    }

    /**
     * Method gets invoked whenever there is change in the attribute value and set the ProductAttributeValue object, 
     * after validating ProductAttributeRule/ ProductAttributeMatrixview if set any.
     * @param attrValue is an instance of product attribute value.
     * @param field is of type string the value of the field.
     * @param attributeGroupList is an Array of Product Attribute group member object.
     * @param matrixView optional paramenter to pass Array of Product Attribute matrix view if exist.
     * @param metadata optional paramenter to pass the metadata of the attribute if available.
     * @param attribute optional paramenter is an instance of Product Attributeis exists.
     */
    attributeChange(attrValue: ProductAttributeValue, field: string, attributeGroupList: Array<ProductAttributeGroup>, matrixView?: Array<ProductAttributeMatrixView>, metadata?: any, attribute?: ProductAttribute): void {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.productAttributeValue = attrValue;
            // if (!_.isEqual(this.productAttributeValue[field], this.attributeValueCopy[field]) && _.get(this.attrRuleInfo, 'length') > 0) {
            //     const fieldType = metadata.fields.find(r => r.name === field).type;
            //     const attrVal = _.get(attrValue, `${field}`);
            //     if (_.get(attribute, '_metadata.rules.isDefaultAction') || _.get(attribute, '_metadata.rules.isConstraintAction')) {
            //         if ((!attrVal || _.get(attrVal, 'length') === 0) && _.get(attribute, '_metadata.rules.isReset')) {
            //             const val = _.get(attribute, '_metadata.rules.resetValues');
            //             if (fieldType === 'multipicklist') _.set(this.productAttributeValue, `${attribute.Field}`, val);
            //             else
            //                 _.set(this.productAttributeValue, `${attribute.Field}`, val[0]);
            //         }
            //     }
            //     if (_.get(matrixView, 'length') > 0) {
            //         if (!_.isEqual(this.productAttributeValue[field], this.attributeValueCopy[field]) && _.get(matrixView, 'length') > 0 && metadata) {
            //             const columnList = _.cloneDeep(matrixView.map(k => k.Columns));
            //             let availableColumns = [];
            //             columnList.forEach(r => availableColumns.push(Object.values(JSON.parse(r).columns)));
            //             availableColumns = _.uniq(availableColumns).join().split(',');
            //             if (availableColumns.find(k => k === field)) {
            //                 if ((typeof _.get(this.productAttributeValue, `${field}`) === 'string' && _.get(this.productAttributeValue, `${field}`)) || (_.get(this.productAttributeValue, `${field}`) instanceof Array && _.get(this.productAttributeValue, `${field}.length`) > 0)) {
            //                     this.userselected[field] = true;
            //                 } else {
            //                     this.userselected[field] = false;
            //                     this.usercleared[field] = true;
            //                 }
            //                 this.lastTouched = field;
            //             }
            //             const matrixResult = this.attributeValueMatrixService.processAttributeMatrices(matrixView, metadata, this.productAttributeValue, this.userselected, this.lastTouched, this.usercleared, this.attributeValueCopy);
            //             this.applyMatrixViews(matrixResult, attributeGroupList, attrValue);
            //         }
            //     }
            // }
            const attrChanged = !_.isEqual(this.attributeValueCopy, this.productAttributeValue);
            this.attributeValueCopy = _.cloneDeep(this.productAttributeValue);
            if (attrChanged && this.attrClicked) this.attributeValueChange.emit(this.attrClicked);
            this.productAttributeValueChange.emit(this.productAttributeValue);
        }, 10)
    }

    /**
     * @ignore
     */
    applyMatrixViews(matrixResult: Array<AllowedValues>, attributeGroupList: Array<ProductAttributeGroup>, attrValue: ProductAttributeValue) {
        const attributes = _.flatten(attributeGroupList.map(r => _.get(r, 'AttributeGroup')).map(r => _.get(r, 'ProductAttributes'))) as Array<ProductAttribute>;
        _.forEach(matrixResult, (view) => {
            if (view.allowedValues && !_.isEmpty(view.resetValues)) {
                const resttemp = Object.keys(view.resetValues);
                for (let i = 0; i < resttemp.length; i++) {
                    const resetValues = _.get(view.resetValues, `${resttemp[i]}`);
                    if (_.get(resetValues, 'length') > 0) {
                        _.forEach(attributes.filter(r => r.Field === resttemp[i]), attribute => {
                            _.set(attribute, '_metadata.picklist', view.resetValues[resttemp[i]]);
                            _.set(attribute, '_metadata.enableValues', view.resetValues[resttemp[i]]);
                        });
                        if (!_.isEqual(_.get(attrValue, `${resttemp[i]}`), view.items.value)) _.set(this.productAttributeValue, `${resttemp[i]}`, view.items.value);
                        if (((typeof _.get(attrValue, `${resttemp[i]}`) === 'string' || typeof _.get(attrValue, `${resttemp[i]}`) === 'object') && !_.get(attrValue, `${resttemp[i]}`)) || (_.get(attrValue, `${resttemp[i]}`) instanceof Array && _.get(attrValue, `${resttemp[i]}.length`) === 0)) {
                            this.userselected[resttemp[i]] = false;
                        } else {
                            this.userselected[resttemp[i]] = true;
                        }
                    }
                }
            } else {
                if (view.allowedValues && !_.isEmpty(view.constraints)) {
                    const temp = Object.keys(view.constraints);
                    for (let i = 0; i < temp.length; i++) {
                        _.forEach(attributes.filter(r => r.Field === temp[i]), attribute => {
                            _.set(attribute, '_metadata.picklist', view.constraints[temp[i]]);
                            _.set(attribute, '_metadata.enableValues', view.constraints[temp[i]]);
                        });
                        if (!_.isEqual(_.get(attrValue, `${temp[i]}`), view.items.value)) _.set(this.productAttributeValue, `${temp[i]}`, view.items.value);
                        if (((typeof _.get(attrValue, `${temp[i]}`) === 'string' || typeof _.get(attrValue, `${temp[i]}`) === 'object') && !_.get(attrValue, `${temp[i]}`)) || (_.get(attrValue, `${temp[i]}`) instanceof Array && _.get(attrValue, `${temp[i]}.length`) === 0)) {
                            this.userselected[temp[i]] = false;
                            this.usercleared[temp[i]] = true;
                        } else {
                            this.userselected[temp[i]] = true;
                            this.usercleared[temp[i]] = false;
                        }
                        // if (this.usercleared.hasOwnProperty(temp[i])) this.usercleared[temp[i]] = false;
                    }
                }
                if (view.allowedValues && !_.isEmpty(view.forceSets)) {
                    const forcesettemp = Object.keys(view.forceSets);
                    for (let i = 0; i < forcesettemp.length; i++) {
                        _.forEach(attributes.filter(r => r.Field === forcesettemp[i]), attribute => {
                            _.set(attribute, '_metadata.picklist', []);
                        });
                        if (!_.isEqual(_.get(attrValue, `${forcesettemp[i]}`), view.items.value)) _.set(this.productAttributeValue, `${forcesettemp[i]}`, view.items.value);
                        if (((typeof _.get(attrValue, `${forcesettemp[i]}`) === 'string' || typeof _.get(attrValue, `${forcesettemp[i]}`) === 'object') && !_.get(attrValue, `${forcesettemp[i]}`)) || (_.get(attrValue, `${forcesettemp[i]}`) instanceof Array && _.get(attrValue, `${forcesettemp[i]}.length`) === 0)) {
                            this.userselected[forcesettemp[i]] = false;
                            this.usercleared[forcesettemp[i]] = true;
                        } else {
                            this.userselected[forcesettemp[i]] = true;
                            this.usercleared[forcesettemp[i]] = false;
                        }
                    }
                }
                if (view.allowedValues && !_.isEmpty(view.defaults)) {
                    const defaulttemp = Object.keys(view.defaults);
                    for (let i = 0; i < defaulttemp.length; i++) {
                        _.forEach(attributes.filter(r => r.Field === defaulttemp[i]), attribute => {
                            _.set(attribute, '_metadata.picklist', []);
                        });
                        if (_.get(this.userselected, `${defaulttemp[i]}`)) this.usercleared[defaulttemp[i]] = false;
                        if (!_.isEqual(_.get(attrValue, `${defaulttemp[i]}`), view.items.value)) _.set(this.productAttributeValue, `${defaulttemp[i]}`, view.items.value);
                    }
                }
            }
        });
    }


    /**
     * @ignore
     */
    applyRule(ruleActions: Array<AttributeRuleResult>, attributes: Array<ProductAttribute>, attrValue: ProductAttributeValue, metadata?: any) {
        attributes.forEach(attribute => {
            if (ruleActions && ruleActions.find(action => action.field === attribute.Field)) {
                _.set(attribute, '_metadata.rules', ruleActions.find(action => action.field === attribute.Field));
                const ruleVal = _.get(attribute, '_metadata.rules.values');
                const defaultVal = _.get(attribute, '_metadata.rules.defaultValue');
                const resetVal = _.get(attribute, '_metadata.rules.resetValues');
                const resetAction = _.get(attribute, '_metadata.rules.isReset');
                const defaultAction = _.get(attribute, '_metadata.rules.isDefaultAction');
                const allowAction = _.get(attribute, '_metadata.rules.isConstraintAction');
                const requiredAction = _.get(attribute, '_metadata.rules.isRequiredAction');
                const hiddenAction = _.get(attribute, '_metadata.rules.isHiddenAction');
                // checking if rule applied for the attriute is hidden the reset the value to null.
                if (hiddenAction) _.set(this.productAttributeValue, `${attribute.Field}`, null);
                if (!_.get(attribute, '_metadata.rules.sfDefaultValue')) {
                    // checking if rule applied for the attribute is required then set the value as empty on load if no default value is set.
                    if (requiredAction && ruleVal) _.set(this.productAttributeValue, `${attribute.Field}`, null);
                }

                // checking if rule applied for the attribute has  Default action then set default
                // value as default value for the attribute if default action from the rule has no value then check if Rest action is true
                // then set the reset value as default on load.
                if (defaultAction && (!_.get(attrValue, `${attribute.Field}`) || !attrValue.hasOwnProperty(attribute.Field))) {
                    if (defaultVal) _.set(this.productAttributeValue, `${attribute.Field}`, defaultVal.join(';'));
                    else if (resetAction) _.set(this.productAttributeValue, `${attribute.Field}`, resetVal.join(';'));
                }


                // checking if rule applied for the attribute Allow then check if Rest action is true set reset
                // value as default value for the attribute if reset false is false then set first value as default value.
                // if allow action has no value then set default value as reset value.
                if (allowAction) {
                    if (ruleVal && (!_.get(attrValue, `${attribute.Field}`) || !attrValue.hasOwnProperty(attribute.Field))) {
                        if (resetAction) {
                            _.set(this.productAttributeValue, `${attribute.Field}`, resetVal.join(';'));
                            attribute._metadata.filterValues = resetAction;
                        } else {
                            _.set(this.productAttributeValue, `${attribute.Field}`, ruleVal.join(';'));
                            attribute._metadata.filterValues = ruleVal;
                        }
                    } else {
                        if (ruleVal) attribute._metadata.filterValues = ruleVal;
                        else if (resetAction) attribute._metadata.filterValues = resetAction;
                    }
                }
            }
        });
        this.attributeValueCopy = _.cloneDeep(this.productAttributeValue);
    }

    ngOnDestroy() {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
}
