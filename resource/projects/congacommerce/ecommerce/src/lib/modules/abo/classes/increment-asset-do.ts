/** @ignore */
export interface IncrementAssetDO {
    AssetId: string;
    NewStartDate: string;
    NewEndDate: string;
    Quantity: number;
    LineAction: IncrementLineAction;
}

/**
 * 'Increment and Merge' updates the existing asset. 'Increment' does not update the existing asset.
 * @ignore
 */
export enum IncrementLineAction{
    INCREMENT_AND_MERGE = 'Increment and Merge',
    INCREMENT = 'Increment',
}
