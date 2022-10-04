import { AObject, ATable } from '@congacommerce/core';
import { Expose, Type } from 'class-transformer';
import { PriceDimension } from './price-dimension.model';
import { PriceListItem } from './price-list-item.model';

@ATable({
    sobjectName: 'PriceMatrix'
})
export class PriceMatrix extends AObject {
    @Expose({
        name : 'Description'
    })
    Description: string = null;
    @Expose({
        name : 'EnableDateRange'
    })
    EnableDateRange: boolean = null;
    @Expose({
        name : 'MatrixType'
    })
    MatrixType: string = null;
    @Expose({
        name : 'PriceListItem'
    })
    @Type(() => PriceListItem)
    PriceListItem: PriceListItem = null;
    @Expose({
        name : 'Sequence'
    })
    Sequence: number = null;
    @Expose({
        name : 'StopProcessingMoreMatrices'
    })
    StopProcessingMoreMatrices: boolean = null;
    @Expose({
        name : 'MatrixEntries'
    })
    @Type(() => PriceMatrixEntry)
    MatrixEntries: Array<PriceMatrixEntry> = null;
    @Expose({
        name : 'Dimension1'
    })
    Dimension1: PriceDimension = new PriceDimension();
    @Expose({
        name : 'Dimension1ValueType'
    })
    Dimension1ValueType: string = null;
    @Expose({
        name : 'Dimension2'
    })
    Dimension2: PriceDimension = new PriceDimension();
    @Expose({
        name : 'Dimension2ValueType'
    })
    Dimension2ValueType: string = null;
    @Expose({
        name : 'Dimension3'
    })
    Dimension3: PriceDimension = new PriceDimension();
    @Expose({
        name : 'Dimension3ValueType'
    })
    Dimension3ValueType: string = null;
    @Expose({
        name : 'Dimension4'
    })
    Dimension4: PriceDimension = new PriceDimension();
    @Expose({
        name : 'Dimension4ValueType'
    })
    Dimension4ValueType: string = null;
    @Expose({
        name : 'Dimension5'
    })
    Dimension5: PriceDimension = new PriceDimension();
    @Expose({
        name : 'Dimension5ValueType'
    })
    Dimension5ValueType: string = null;
    @Expose({
        name : 'Dimension6'
    })
    Dimension6: PriceDimension = new PriceDimension();
    @Expose({
        name : 'Dimension6ValueType'
    })
    Dimension6ValueType: string = null;
    @Expose({
        name : 'InitialRows'
    })
    InitialRows: number = null;
}

@ATable({
    sobjectName: 'PriceMatrixEntry',
    aqlName: 'cpq_PriceMatrixEntry'
})
export class PriceMatrixEntry extends AObject {
    @Expose({
        name : 'AdjustmentAmount'
    })
    AdjustmentAmount: number = null;
    @Expose({
        name : 'AdjustmentType'
    })
    AdjustmentType: string = null;
    @Expose({
        name : 'BandSize'
    })
    BandSize: number = null;
    @Expose({
        name : 'condition'
    })
    condition: string = null;
    @Expose({
        name : 'PeriodEndDate'
    })
    PeriodEndDat: Date = null;
    @Expose({
        name : 'EndFactor'
    })
    EndFactor: number = null;
    @Expose({
        name : 'EntryKey'
    })
    EntryKey: string = null;
    @Expose({
        name : 'FlatPrice'
    })
    FlatPrice: number = null;
    @Expose({
        name : 'TierStartValue'
    })
    TierStartValue: number = null;
    @Expose({
        name : 'IsIncluded'
    })
    @Expose({
        name : 'PriceMatrix'
    })
    @Type(() => PriceMatrix)
    PriceMatrix: PriceMatrix = null;
    @Expose({
        name : 'PriceOverride'
    })
    PriceOverride: number = null;
    @Expose({
        name : 'Sequence'
    })
    Sequence: number = null;
    @Expose({
        name : 'PeriodStartDate'
    })
    PeriodStartDate: Date = null;
    @Expose({
        name : 'StartFactor'
    })
    StartFactor: number = null;
    @Expose({
        name : 'TierEndValue'
    })
    TierEndValue: number = null;
    @Expose({
        name : 'UsageRate'
    })
    UsageRate: number = null;
    @Expose({
        name : 'Dimension1Value'
    })
    Dimension1Value: string = null;
    @Expose({
        name : 'Dimension2Value'
    })
    Dimension2Value: string = null;
    @Expose({
        name : 'Dimension3Value'
    })
    Dimension3Value: string = null;
    @Expose({
        name : 'Dimension4Value'
    })
    Dimension4Value: string = null;
    @Expose({
        name : 'Dimension5Value'
    })
    Dimension5Value: string = null;
    @Expose({
        name : 'Dimension6Value'
    })
    Dimension6Value: string = null;
}