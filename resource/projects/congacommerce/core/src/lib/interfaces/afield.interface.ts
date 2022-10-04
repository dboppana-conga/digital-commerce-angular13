
export interface AFieldMetadata {
    soql?: string;
    aql?: string;
    view?: Array<'Compact' | 'Detail'>;
    compactLabel?: string;
    expand?: 'deep' | 'shallow';
    externalId?: boolean;
    aggregate?: Array<'SUM' | 'MIN' | 'MAX' | 'AVG' | 'COUNT' | 'COUNT_DISTINCT'>
}