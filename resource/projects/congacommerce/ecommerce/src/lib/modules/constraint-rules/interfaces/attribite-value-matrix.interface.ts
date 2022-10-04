/** @ignore */
export interface MatrixResult {
    defaults: Object;
    constraints: Object;
    forceSets: Object;
    reset: Object;
    items?: Array<MatrixMetadata>;

}
/** @ignore */
export interface MatrixMetadata {
    Name: string;
    Id: string;
    value: string;
    columnValue: string;
    isMultiSelect: boolean;
    isSelectType: boolean;
    isWildcard: boolean;
}
/** @ignore */
export interface AllowedValues {
    allowedValues: boolean | Array<Object>;
    resetValues: Object;
    defaults: Object;
    constraints: Object;
    forceSets: Object;
    items?: MatrixMetadata;
}