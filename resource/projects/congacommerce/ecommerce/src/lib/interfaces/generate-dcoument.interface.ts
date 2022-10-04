/**
 * An interface to create a request for generating the document for a custom object
 * @ignore
 */
export interface GenerateDocument {
    /** Id of clm template record from which document needs to be generated */
    templateId: string;

    /** Id of custom object record */
    recordId: string;

    /** API name of custom sObject */
    sObjectType: string;

    /** File format of the document */
    format: string;

    /** Access type to be assigned on document */
    accessLevel: AccessLevel;

    /** Active session id */
    sessionId: string;

    /** Draft status of the document */
    isDraft: boolean;
}
/** @ignore */
export enum AccessLevel {
    FULL_ACCESS = 'Full access'
}