export interface ATableMetadata {
    sobjectName: string;
    aqlName?: string;
    defaultFields?: boolean;
    dynamic?: boolean;
    route?: string;
}