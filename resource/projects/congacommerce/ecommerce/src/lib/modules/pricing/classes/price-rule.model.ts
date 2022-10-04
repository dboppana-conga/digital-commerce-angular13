import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
import { PriceDimension } from './price-dimension.model';
import { Incentive } from '../../promotion/classes/incentive.model';
import { PriceList } from './price-list.model';
import { ProductGroup } from '../../catalog/classes/product-group.model';

@ATable({
    sobjectName: 'PriceRuleset'
})
export class PriceRuleSet extends AObject {
    @Expose({
        name: 'IsActive'
    })
    Active: boolean = null;
    @Expose({
        name: 'UseType'
    })
    UseType: 'Line Item' | 'Bundle' | 'Aggregate' = null;
    @Expose({
        name: 'ApplicationMethod'
    })
    ApplicationMethod: string = null;
    @Expose({
        name: 'Category'
    })
    Category: string = null;
    @Expose({
        name: 'ChargeType'
    })
    ChargeType: string = null;
    @Expose({
        name: 'Description'
    })
    Description: string = null;
    @Expose({
        name: 'EffectiveDate'
    })
    EffectiveDate: Date = null;
    @Expose({
        name: 'ExpirationDate'
    })
    ExpirationDate: Date = null;
    @Expose({
        name: 'HasCriteria'
    })
    HasCriteria: boolean = null;
    @Expose({
        name: 'Incentive'
    })
    @Type(() => Incentive)
    Incentive: Incentive = null;
    @Expose({
        name: 'PriceList'
    })
    @Type(() => PriceList)
    PriceList: PriceList = null;
    @Expose({
        name: 'ProductCategory'
    })
    ProductCategory: string = null;
    @Expose({
        name: 'ProductFamily'
    })
    ProductFamily: string = null;
    @Expose({
        name: 'ProductGroup'
    })
    @Type(() => ProductGroup)
    ProductGroup: ProductGroup = null;
    @Expose({
        name: 'Criteria'
    })
    Criteria: string = null;
    @Expose({
        name: 'ExclusionCriteria'
    })
    ExclusionCriteria: string = null;
    @Expose({
        name: 'Sequence'
    })
    Sequence: number = null;
    @Expose({
        name: 'StopProcessingMoreRules'
    })
    StopProcessingMoreRules: boolean = null;
    @Expose({
        name: 'Type'
    })
    Type: string = null;
}

@ATable({
    sobjectName: 'PriceRule'
})
export class PriceRule extends AObject {
    @Expose({
        name: 'IsActive'
    })
    Active: boolean = null;
    @Expose({
        name: 'AdjustmentAppliesTo'
    })
    AdjustmentAppliesTo: string = null;
    @Expose({
        name: 'AdjustmentChargeType'
    })
    AdjustmentChargeType: string = null;
    @Expose({
        name: 'AllowableAction'
    })
    AllowableAction: string = null;
    @Expose({
        name: 'AllowRemovalOfAdjustment'
    })
    AllowRemovalOfAdjustment: boolean = null;
    @Expose({
        name: 'BeneficiaryType'
    })
    BeneficiaryType: string = null;
    @Expose({
        name: 'BenefitType'
    })
    BenefitType: string = null;
    @Expose({
        name: 'ChargeTypeCriteria'
    })
    ChargeTypeCriteria: string = null;
    @Expose({
        name: 'ChargeTypeCriteriaOper'
    })
    ChargeTypeCriteriaOper: string = null;
    @Expose({
        name: 'CountryCriteria'
    })
    CountryCriteria: string = null;
    @Expose({
        name: 'CountryCriteriaOper'
    })
    CountryCriteriaOper: string = null;
    @Expose({
        name: 'CustomPricePointSource'
    })
    CustomPricePointSource: string = null;
    @Expose({
        name: 'Description'
    })
    Description: string = null;
    @Expose({
        name: 'EffectiveDate'
    })
    EffectiveDate: Date = null;
    @Expose({
        name: 'ExpirationDate'
    })
    ExpirationDate: Date = null;
    @Expose({
        name: 'MetricValueSource'
    })
    MetricValueSource: string = null;
    @Expose({
        name: 'MilestoneCriteria'
    })
    MilestoneCriteria: string = null;
    @Expose({
        name: 'MilestoneStatusCriteriaOper'
    })
    MilestoneStatusCriteriaOper: string = null;
    @Expose({
        name: 'PriceListCriteria'
    })
    PriceListCriteria: string = null;
    @Expose({
        name: 'PriceListCriteriaOper'
    })
    PriceListCriteriaOper: string = null;
    @Expose({
        name: 'ProductCriteria'
    })
    ProductCriteria: string = null;
    @Expose({
        name: 'ProductCriteriaOper'
    })
    ProductCriteriaOper: string = null;
    @Expose({
        name: 'ProductFamilyCriteria'
    })
    ProductFamilyCriteria: string = null;
    @Expose({
        name: 'ProductFamilyCriteriaOper'
    })
    ProductFamilyCriteriaOper: string = null;
    @Expose({
        name: 'ProductGroupCriteria'
    })
    ProductGroupCriteria: string = null;
    @Expose({
        name: 'ProductGroupCriteriaOper'
    })
    ProductGroupCriteriaOper: string = null;
    @Expose({
        name: 'RegionCriteria'
    })
    RegionCriteria: string = null;
    @Expose({
        name: 'RegionCriteriaOper'
    })
    RegionCriteriaOper: string = null;
    @Expose({
        name: 'Criteria'
    })
    Criteria: string = null;
    /*     @Expose({
            name : 'RulesetId',
        })
        RulesetId: string = null; */
    @Expose({
        name: 'Ruleset'
    })
    Ruleset: PriceRuleSet = new PriceRuleSet();
    @Expose({
        name: 'RuleSubType',
    })
    RuleSubType: string = null;
    @Expose({
        name: 'RuleType'
    })
    RuleType: string = null;
    @Expose({
        name: 'Sequence'
    })
    Sequence: number = null;
    @Expose({
        name: 'TierMetricRollupDuration'
    })
    TierMetricRollupDuration: string = null;
    @Expose({
        name: 'TierMetricType'
    })
    TierMetricType: string = null;
    @Expose({
        name: 'RuleEntries',
    })
    @Type(() => PriceRuleEntry)
    RuleEntries: Array<PriceRuleEntry> = [new PriceRuleEntry()];
    @Expose({
        name: 'Dimension1'
    })
    Dimension1: PriceDimension = new PriceDimension();
    @Expose({
        name: 'Dimension1ValueType'
    })
    Dimension1ValueType: string = null;
    @Expose({
        name: 'Dimension2'
    })
    Dimension2: PriceDimension = new PriceDimension();
    @Expose({
        name: 'Dimension2ValueType'
    })
    Dimension2ValueType: string = null;

    @Expose({
        name: 'Dimension3'
    })
    Dimension3: PriceDimension = new PriceDimension();
    @Expose({
        name: 'Dimension3ValueType'
    })
    Dimension3ValueType: string = null;
    @Expose({
        name: 'Dimension4'
    })
    Dimension4: PriceDimension = new PriceDimension();
    @Expose({
        name: 'Dimension4ValueType'
    })
    Dimension4ValueType: string = null;

    @Expose({
        name: 'Dimension5'
    })
    Dimension5: PriceDimension = new PriceDimension();
    @Expose({
        name: 'Dimension5ValueType'
    })
    Dimension5ValueType: string = null;

    @Expose({
        name: 'Dimension6'
    })
    Dimension6: PriceDimension = new PriceDimension();
    @Expose({
        name: 'Dimension6ValueType'
    })
    Dimension6ValueType: string = null;
    @Expose({
        name: 'ForEveryXCriteriaDimension'
    })
    ForEveryXCriteriaDimension: PriceDimension = null;
    @Expose({
        name: 'ForEveryXCriteriaDimensionType'
    })
    ForEveryXCriteriaDimensionType: string = null;
    @Expose({
        name: 'ForEveryXCriteriaDimensionValue'
    })
    ForEveryXCriteriaDimensionValue: number = null;
    @Expose({
        name: 'FutureBenefitValidityOffset'
    })
    FutureBenefitValidityOffset: number = null;
    @Expose({
        name: 'FutureBenefitValidityType'
    })
    FutureBenefitValidityType: string = null;
    @Expose({
        name: 'NumberOfEntries'
    })
    NumberOfEntries: number = null;
}

@ATable({
    sobjectName: 'PriceRuleEntry'
})
export class PriceRuleEntry extends AObject {
    @Expose({
        name: 'AdjustmentAmount'
    })
    AdjustmentAmount: number = null;
    @Expose({
        name: 'AdjustmentReason'
    })
    AdjustmentReason: string = null;
    @Expose({
        name: 'AdjustmentType'
    })
    AdjustmentType: string = null;
    @Expose({
        name: 'AdjustmentValueSource'
    })
    AdjustmentValueSource: string = null;
    @Expose({
        name: 'AdjustmentValueType'
    })
    AdjustmentValueType: string = null;
    @Expose({
        name: 'BandSize'
    })
    BandSize: number = null;
    @Expose({
        name: 'ChargeTypes'
    })
    ChargeTypes: string = null;
    @Expose({
        name: 'Condition'
    })
    Condition: string = null;
    @Expose({
        name: 'EndFactor'
    })
    EndFactor: number = null;
    @Expose({
        name: 'InclusionMethod'
    })
    InclusionMethod: string = null;
    @Expose({
        name: 'LoyaltyLevel'
    })
    LoyaltyLevel: string = null;
    @Expose({
        name: 'MatchInAsset'
    })
    MatchInAsset: boolean = null;
    @Expose({
        name: 'MatchProductGroup'
    })
    @Type(() => ProductGroup)
    MatchProductGroup: ProductGroup = null;
    @Expose({
        name: 'MaxProducts'
    })
    MaxProducts: number = null;
    @Expose({
        name: 'MaxQuantity'
    })
    MaxQuantity: number = null;
    @Expose({
        name: 'MinProducts'
    })
    MinProducts: number = null;
    @Expose({
        name: 'MinQuantity'
    })
    MinQuantity: number = null;
    @Expose({
        name: 'PriceOverride'
    })
    PriceOverride: number = null;
    @Expose({
        name: 'PriceRule'
    })
    @Type(() => PriceRule)
    PriceRule: PriceRule = null;
    @Expose({
        name: 'ProductCategory'
    })
    ProductCategory: string = null;
    @Expose({
        name: 'ProductFamilies'
    })
    ProductFamilies: string = null;
    @Expose({
        name: 'ProductFamily'
    })
    ProductFamily: string = null;
    @Expose({
        name: 'ProductGroup'
    })
    @Type(() => ProductGroup)
    ProductGroup: ProductGroup = null;
    @Expose({
        name: 'ProductGroups'
    })
    ProductGroups: string = null;
    @Expose({
        name: 'Products'
    })
    Products: string = null;
    @Expose({
        name: 'Quantity'
    })
    Quantity: number = null;
    @Expose({
        name: 'Sequence'
    })
    Sequence: number = null;
    @Expose({
        name: 'StartFactor'
    })
    StartFactor: number = null;
    @Expose({
        name: 'Term'
    })
    Term: number = null;
    @Expose({
        name: 'TermPeriodStart'
    })
    TermPeriodStart: string = null;
    @Expose({
        name: 'Dimension1ListValue'
    })
    Dimension1ListValue: string = null;
    @Expose({
        name: 'Dimension1Value'
    })
    Dimension1Value: string = null;
    @Expose({
        name: 'Dimension2ListValue'
    })
    Dimension2ListValue: string = null;
    @Expose({
        name: 'Dimension2Value'
    })
    Dimension2Value: string = null;
    @Expose({
        name: 'Dimension3ListValue'
    })
    Dimension3ListValue: string = null;
    @Expose({
        name: 'Dimension3Value'
    })
    Dimension3Value: string = null;
    @Expose({
        name: 'Dimension4ListValue'
    })
    Dimension4ListValue: string = null;
    @Expose({
        name: 'Dimension4Value'
    })
    Dimension4Value: string = null;
    @Expose({
        name: 'Dimension5ListValue'
    })
    Dimension5ListValue: string = null;
    @Expose({
        name: 'Dimension5Value'
    })
    Dimension5Value: string = null;
    @Expose({
        name: 'Dimension6ListValue'
    })
    Dimension6ListValue: string = null;
    @Expose({
        name: 'Dimension6Value'
    })
    Dimension6Value: string = null;
}