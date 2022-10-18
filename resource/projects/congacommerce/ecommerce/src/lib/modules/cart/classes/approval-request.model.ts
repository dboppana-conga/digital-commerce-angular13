import { Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'Approval_Request'
})
export class ApprovalRequest extends AObject {

    @Expose({ name: 'Action_Approve_Id' })
    Action_Approve_Id: string = null;

    @Expose({ name: 'Action_Reassign_Id' })
    Action_Reassign_Id: string = null;

    @Expose({ name: 'Active' })
    Active: boolean = null;

    @Expose({ name: 'Actual_Approver' })
    Actual_Approver: string = null;

    @Expose({ name: 'ActualApproverName' })
    ActualApproverName: string = null;

    @Expose({ name: 'Action' })
    Action: string = null;

    @Expose({ name: 'Action_Prefix' })
    Action_Prefix: string = null;

    @Expose({ name: 'ApprovalCount' })
    ApprovalCount: number = null;

    @Expose({ name: 'Request_Comments' })
    Request_Comments: string = null;

    @Expose({ name: 'ApprovalFromEmail' })
    ApprovalFromEmail: boolean = null;

    @Expose({ name: 'ApprovalPercent' })
    ApprovalPercent: number = null;

    @Expose({ name: 'ApprovalPolicy' })
    ApprovalPolicy: string = null;

    @Expose({ name: 'Approval_Process' })
    Approval_Process: string = null;

    @Expose({ name: 'ProcessInstanceId' })
    ProcessInstanceId: string = null;

    @Expose({ name: 'Approval_Status' })
    Approval_Status: string = null;

    @Expose({ name: 'Approver_Comments' })
    Approver_Comments: string = null;

    @Expose({ name: 'Assigned_To_Link' })
    Assigned_To_Link: string = null;

    @Expose({ name: 'Assigned_To_Name' })
    Assigned_To_Name: string = null;

    @Expose({ name: 'Assigned_To_Id' })
    Assigned_To_Id: string = null;

    @Expose({ name: 'Assigned_To_Type' })
    Assigned_To_Type: string = null;

    @Expose({ name: 'Auto_Complete' })
    Auto_Complete: boolean = null;

    @Expose({ name: 'AutoEscalate' })
    AutoEscalate: boolean = null;

    @Expose({ name: 'AutoReapprove' })
    AutoReapprove: boolean = null;

    @Expose({ name: 'Backup_From_User' })
    Backup_From_User: string = null;

    @Expose({ name: 'CanEscalate' })
    CanEscalate: boolean = null;

    @Expose({ name: 'ChildObjectId' })
    ChildObjectId: string = null;

    @Expose({ name: 'ChildObjectLink' })
    ChildObjectLink: string = null;

    @Expose({ name: 'ChildObjectName' })
    ChildObjectName: string = null;

    @Expose({ name: 'ChildObjectType' })
    ChildObjectType: string = null;

    @Expose({ name: 'ContinuePolicyApprovalOnAReject', })
    ContinuePolicyApprovalOnAReject: boolean = null;

    @Expose({ name: 'CriteriaFieldNames', })
    CriteriaFieldNames: string = null;

    @Expose({ name: 'Date', })
    Date: Date = null;

    @Expose({ name: 'DateApproved', })
    DateApproved: Date = null;

    @Expose({ name: 'DateAssigned' })
    DateAssigned: Date = null;

    @Expose({ name: 'DateCancelled' })
    DateCancelled: Date = null;

    @Expose({ name: 'DateEscalated' })
    DateEscalated: Date = null;

    @Expose({ name: 'DateReassigned' })
    DateReassigned: Date = null;

    @Expose({ name: 'DateRejected' })
    DateRejected: Date = null;

    @Expose({ name: 'DelegateApprover' })
    DelegateApprover: string = null;

    @Expose({ name: 'DelegateApproverIds' })
    DelegateApproverIds: string = null;

    @Expose({ name: 'DependsOn' })
    DependsOn: string = null;

    @Expose({ name: 'EscalatedToHighestLevel' })
    EscalatedToHighestLevel: boolean = null;

    @Expose({ name: 'EscalateToChain' })
    EscalateToChain: string = null;

    @Expose({ name: 'EscalateToId' })
    EscalateToId: string = null;

    @Expose({ name: 'EscalateToName' })
    EscalateToName: string = null;

    @Expose({ name: 'EscalateToType' })
    EscalateToType: string = null;

    @Expose({ name: 'ExpectedCompletionDate' })
    ExpectedCompletionDate: Date = null;

    @Expose({ name: 'ExpectedDaysToComplete' })
    ExpectedDaysToComplete: number = null;

    @Expose({ name: 'ExpectedHoursToComplete' })
    ExpectedHoursToComplete: number = null;

    @Expose({ name: 'ExpectedMinutesToComplete' })
    ExpectedMinutesToComplete: number = null;

    @Expose({ name: 'Group' })
    Group: string = null;

    @Expose({ name: 'Group_Unique_Id' })
    Group_Unique_Id: string = null;

    @Expose({ name: 'HasAttachments' })
    HasAttachments: boolean = null;

    @Expose({ name: 'HasDelegateApprover' })
    HasDelegateApprover: boolean = null;

    @Expose({ name: 'InEscalation' })
    InEscalation: boolean = null;

    @Expose({ name: 'Initial_Submitter' })
    Initial_Submitter: string = null;

    @Expose({ name: 'Internal_Comments' })
    Internal_Comments: string = null;

    @Expose({ name: 'IsAdhoc' })
    IsAdhoc: boolean = null;

    @Expose({ name: 'IsAutoReapprovalEnabled' })
    IsAutoReapprovalEnabled: boolean = null;

    @Expose({ name: 'IsSubprocess' })
    IsSubprocess: boolean = null;

    @Expose({ name: 'Notify_Only' })
    Notify_Only: boolean = null;

    @Expose({ name: 'Object_Id' })
    Object_Id: string = null;

    @Expose({ name: 'Object_Id_Link' })
    Object_Id_Link: string = null;

    @Expose({ name: 'Object_Name' })
    Object_Name: string = null;

    @Expose({ name: 'Object_Type' })
    Object_Type: string = null;

    @Expose({ name: 'Parent_Agreement' })
    Parent_Agreement: string = null;

    @Expose({ name: 'ParentRequestId' })
    ParentRequestId: string = null;

    @Expose({ name: 'PrevAssignedToName' })
    PrevAssignedToName: string = null;

    @Expose({ name: 'PrevAssignedToId' })
    PrevAssignedToId: string = null;

    @Expose({ name: 'PrevAssignedToType' })
    PrevAssignedToType: string = null;

    @Expose({ name: 'Assigned_To' })
    Assigned_To: string = null;

    @Expose({ name: 'Rejection_Action' })
    Rejection_Action: string = null;

    @Expose({ name: 'Related_Agreement' })
    Related_Agreement: string = null;

    @Expose({ name: 'AgreementLineItemId' })
    AgreementLineItemId: string = null;

    @Expose({ name: 'Related_Agreement_Owner' })
    Related_Agreement_Owner: string = null;

    @Expose({ name: 'Related_Agreement_Requestor' })
    Related_Agreement_Requestor: string = null;

    @Expose({ name: 'Related_Agreement_Term_Exception' })
    Related_Agreement_Term_Exception: string = null;

    @Expose({ name: 'Related_Opportunity' })
    Related_Opportunity: string = null;

    @Expose({ name: 'Related_Opportunity_Owner' })
    Related_Opportunity_Owner: string = null;

    @Expose({ name: 'RequestType' })
    RequestType: string = null;

    @Expose({ name: 'Send_Email' })
    Send_Email: boolean = null;

    @Expose({ name: 'StepSequenceString' })
    StepSequenceString: string = null;

    @Expose({ name: 'StepSequence' })
    StepSequence: number = null;

    @Expose({ name: 'Status_Link' })
    Status_Link: string = null;

    @Expose({ name: 'StepNameLink' })
    StepNameLink: string = null;

    @Expose({ name: 'Step' })
    Step: string = null;

    @Expose({ name: 'Step_Group_Seq_Number' })
    Step_Group_Seq_Number: number = null;

    @Expose({ name: 'StepLabel' })
    StepLabel: string = null;

    @Expose({ name: 'Step_Name' })
    Step_Name: string = null;

    @Expose({ name: 'SubmissionComment1' })
    SubmissionComment1: string = null;

    @Expose({ name: 'SubmissionComment2' })
    SubmissionComment2: string = null;

    @Expose({ name: 'SubmissionComment3' })
    SubmissionComment3: string = null;

    @Expose({ name: 'SubprocessDependsOn' })
    SubprocessDependsOn: string = null;

    @Expose({ name: 'SubprocessName' })
    SubprocessName: string = null;

    @Expose({ name: 'SubprocessSequence' })
    SubprocessSequence: number = null;

    @Expose({ name: 'Sequence' })
    Sequence: string = null;

    @Expose({ name: 'SubstepDependsOn' })
    SubstepDependsOn: string = null;

    @Expose({ name: 'SubstepName' })
    SubstepName: string = null;

    @Expose({ name: 'SubstepSequence' })
    SubstepSequence: number = null;

    @Expose({ name: 'Workflow_Trigger_Added_Comments' })
    Workflow_Trigger_Added_Comments: boolean = null;
}