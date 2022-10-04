import { RecordCollection } from './record-collection.interface';

/**
 * Lookup Value interface
 * Records in a lookup relationship organized by object type
 * @ignore
 */
export interface LookupValue {
    objectApiName: string;
    recordCollection: RecordCollection;
}
