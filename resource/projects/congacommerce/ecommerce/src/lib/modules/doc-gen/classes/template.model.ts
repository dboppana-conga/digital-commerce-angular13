import { Expose, Type } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
import { User } from '../../crm/classes/user.model';
@ATable({
    sobjectName: 'APTS_Template'
})
export class Template extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'ActivateVersion' })
    ActivateVersion: string = null;

    @Expose({ name: 'ActiveVersionId' })
    ActiveVersionId: string = null;

    @Expose({ name: 'Agreement_Types' })
    Agreement_Types: string = null;

    @Expose({ name: 'BusinessObject' })
    BusinessObject: 'Order' | 'Proposal' | 'Agreement' | 'Proposal' = null;

    @Expose({ name: 'Category' })
    Category: string = null;

    @Expose({ name: 'CheckoutBy' })
    @Type(()=> User)
    CheckoutBy: User = null;

    @Expose({ name: 'CheckoutDate' })
    CheckoutDate: Date = null;

    @Expose({ name: 'CheckoutVersion' })
    @Type(()=> TemplateVersion)
    CheckoutVersion: TemplateVersion = null;

    @Expose({ name: 'ClonedFrom' })
    ClonedFrom: Template = null;

    @Expose({ name: 'ClonedFromReferenceId' })
    ClonedFromReferenceId: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'EnableAgreementClauseTracking' })
    EnableAgreementClauseTracking: boolean = null;

    @Expose({ name: 'ExcludedMergeChildObjects' })
    ExcludedMergeChildObjects: string = null;

    @Expose({ name: 'FrameworkFormat' })
    FrameworkFormat: string = null;

    @Expose({ name: 'Guidance' })
    Guidance: string = null;

    @Expose({ name: 'IsActive' })
    IsActive: boolean = null;

    @Expose({ name: 'IsTransient' })
    IsTransient: boolean = null;

    @Expose({ name: 'Keywords' })
    Keywords: string = null;

    @Expose({ name: 'Language' })
    Language: string = null;

    @Expose({ name: 'Locale' })
    Locale: string = null;

    @Expose({ name: 'Mergefields2' })
    Mergefields2: string = null;

    @Expose({ name: 'Mergefields' })
    Mergefields: string = null;

    @Expose({ name: 'NeedsPublishing' })
    NeedsPublishing: boolean = null;

    @Expose({ name: 'NextRevisionDate' })
    Next_Revision_Date: Date = null;

    @Expose({ name: 'NumberOfClauses' })
    NumberOfClauses: number = null;

    @Expose({ name: 'OutputPage' })
    OutputPage: string = null;

    @Expose({ name: 'Publish' })
    Publish: string = null;

    @Expose({ name: 'PublishedDate' })
    PublishedDate: Date = null;

    @Expose({ name: 'PubDocId' })
    PubDocId: string = null;

    @Expose({ name: 'PublishStatus' })
    PublishStatus: string = null;

    @Expose({ name: 'ReferenceId' })
    ReferenceId: string = null;

    @Expose({ name: 'Subcategory' })
    Subcategory: string = null;

    @Expose({ name: 'TermExceptionId' })
    TermExceptionId: string = null;

    @Expose({ name: 'TextContent' })
    TextContent: string = null;

    @Expose({ name: 'Type' })
    Type: string = null;

    @Expose({ name: 'Unpublish' })
    Unpublish: string = null;
}

@ATable({
    sobjectName: 'TemplateVersion',
})

export class TemplateVersion extends AObject {
    @Expose({ name: 'Name' })
    Name: string = null;
}