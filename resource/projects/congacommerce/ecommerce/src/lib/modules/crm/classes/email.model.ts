/** @ignore */
export interface MailContent {
    toAddresses: string[];
    ccAddresses?: string[];
    replyTo?: string;
    displayName?: string;
    subject: string;
    bccSender?: boolean;
    useSignature?: boolean;
    plainBody?: string;
    htmlBody?: string;
    templateName?: string;
    contactId?: string;
    whatId?: string;
    attachmentIds?: string[];
}

/** @ignore */
export function MailFactory(toAddresses: string[], subject: string, plainBody: string): MailContent {
    return {
        toAddresses: toAddresses,
        ccAddresses: null,
        replyTo: null,
        displayName: null,
        subject: subject,
        bccSender: false,
        useSignature: false,
        plainBody: plainBody,
        htmlBody: null,
        templateName: null,
        contactId: null,
        whatId: null
    } as MailContent;
}

/** @ignore */
export function TemplateMailFactory(templateName: string, whatId: string, contactId: string, toAddresses: string[], ccAddresses?: string[], attachmentIds?: string[]) {
    return {
        toAddresses: toAddresses,
        ccAddresses: ccAddresses,
        replyTo: null,
        displayName: null,
        subject: null,
        bccSender: false,
        useSignature: false,
        plainBody: null,
        htmlBody: null,
        templateName: templateName,
        contactId: contactId,
        whatId: whatId,
        attachmentIds: attachmentIds
    } as MailContent;
}