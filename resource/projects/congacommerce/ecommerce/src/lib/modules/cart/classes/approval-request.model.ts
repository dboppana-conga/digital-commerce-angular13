import { Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'Approval_Request'
})
export class ApprovalRequest extends AObject {

    @Expose({ name: 'Action_Approve_Id' })
    Action_Approve_Id: string | null = null;

    @Expose({ name: 'Action_Reassign_Id' })
    Action_Reassign_Id: string | null = null;

    @Expose({ name: 'Active' })
    Active: boolean = false;

    @Expose({ name: 'Actual_Approver' })
    Actual_Approver: string | null = null;

    @Expose({ name: 'ActualApproverName' })
    ActualApproverName: string | null = null;

    @Expose({ name: 'Action' })
    Action: string | null = null;

    @Expose({ name: 'Action_Prefix' })
    Action_Prefix: string | null = null;

    @Expose({ name: 'ApprovalCount' })
    ApprovalCount: number | null = null;

    @Expose({ name: 'Request_Comments' })
    Request_Comments: string | null = null;

    @Expose({ name: 'ApprovalFromEmail' })
    ApprovalFromEmail: boolean = false;

    @Expose({ name: 'ApprovalPercent' })
    ApprovalPercent: number | null = null;

    @Expose({ name: 'ApprovalPolicy' })
    ApprovalPolicy: string | null = null;

    @Expose({ name: 'Approval_Process' })
    Approval_Process: string | null = null;

    @Expose({ name: 'ProcessInstanceId' })
    ProcessInstanceId: string | null = null;

    @Expose({ name: 'Approval_Status' })
    Approval_Status: string | null = null;

    @Expose({ name: 'Approver_Comments' })
    Approver_Comments: string | null = null;

    @Expose({ name: 'Assigned_To_Link' })
    Assigned_To_Link: string | null = null;

    @Expose({ name: 'Assigned_To_Name' })
    Assigned_To_Name: string | null = null;

    @Expose({ name: 'Assigned_To_Id' })
    Assigned_To_Id: string | null = null;

    @Expose({ name: 'Assigned_To_Type' })
    Assigned_To_Type: string | null = null;

    @Expose({ name: 'Auto_Complete' })
    Auto_Complete: boolean = false;

    @Expose({ name: 'AutoEscalate' })
    AutoEscalate: boolean = false;

    @Expose({ name: 'AutoReapprove' })
    AutoReapprove: boolean = false;

    @Expose({ name: 'Backup_From_User' })
    Backup_From_User: string | null = null;

    @Expose({ name: 'CanEscalate' })
    CanEscalate: boolean = false;

    @Expose({ name: 'ChildObjectId' })
    ChildObjectId: string | null = null;

    @Expose({ name: 'ChildObjectLink' })
    ChildObjectLink: string | null = null;

    @Expose({ name: 'ChildObjectName' })
    ChildObjectName: string | null = null;

    @Expose({ name: 'ChildObjectType' })
    ChildObjectType: string | null = null;

    @Expose({ name: 'ContinuePolicyApprovalOnAReject', })
    ContinuePolicyApprovalOnAReject: boolean =false;

    @Expose({ name: 'CriteriaFieldNames', })
    CriteriaFieldNames: string | null = null;

    @Expose({ name: 'Date', })
    Date: Date | null = null;

    @Expose({ name: 'DateApproved', })
    DateApproved: Date | null = null;

    @Expose({ name: 'DateAssigned' })
    DateAssigned: Date | null = null;

    @Expose({ name: 'DateCancelled' })
    DateCancelled: Date | null = null;

    @Expose({ name: 'DateEscalated' })
    DateEscalated: Date | null = null;

    @Expose({ name: 'DateReassigned' })
    DateReassigned: Date | null = null;

    @Expose({ name: 'DateRejected' })
    DateRejected: Date | null = null;

    @Expose({ name: 'DelegateApprover' })
    DelegateApprover: string | null = null;

    @Expose({ name: 'DelegateApproverIds' })
    DelegateApproverIds: string | null = null;

    @Expose({ name: 'DependsOn' })
    DependsOn: string | null = null;

    @Expose({ name: 'EscalatedToHighestLevel' })
    EscalatedToHighestLevel: boolean = false;

    @Expose({ name: 'EscalateToChain' })
    EscalateToChain: string | null = null;

    @Expose({ name: 'EscalateToId' })
    EscalateToId: string | null = null;

    @Expose({ name: 'EscalateToName' })
    EscalateToName: string | null = null;

    @Expose({ name: 'EscalateToType' })
    EscalateToType: string | null = null;

    @Expose({ name: 'ExpectedCompletionDate' })
    ExpectedCompletionDate: Date | null = null;

    @Expose({ name: 'ExpectedDaysToComplete' })
    ExpectedDaysToComplete: number | null = null;

    @Expose({ name: 'ExpectedHoursToComplete' })
    ExpectedHoursToComplete: number | null = null;

    @Expose({ name: 'ExpectedMinutesToComplete' })
    ExpectedMinutesToComplete: number | null = null;

    @Expose({ name: 'Group' })
    Group: string | null = null;

    @Expose({ name: 'Group_Unique_Id' })
    Group_Unique_Id: string | null = null;

    @Expose({ name: 'HasAttachments' })
    HasAttachments: boolean = false;

    @Expose({ name: 'HasDelegateApprover' })
    HasDelegateApprover: boolean = false;

    @Expose({ name: 'InEscalation' })
    InEscalation: boolean = false;

    @Expose({ name: 'Initial_Submitter' })
    Initial_Submitter: string | null = null;

    @Expose({ name: 'Internal_Comments' })
    Internal_Comments: string | null = null;

    @Expose({ name: 'IsAdhoc' })
    IsAdhoc: boolean = false;

    @Expose({ name: 'IsAutoReapprovalEnabled' })
    IsAutoReapprovalEnabled: boolean = false;

    @Expose({ name: 'IsSubprocess' })
    IsSubprocess: boolean = false;

    @Expose({ name: 'Notify_Only' })
    Notify_Only: boolean = false;

    @Expose({ name: 'Object_Id' })
    Object_Id: string | null = null;

    @Expose({ name: 'Object_Id_Link' })
    Object_Id_Link: string | null = null;

    @Expose({ name: 'Object_Name' })
    Object_Name: string | null = null;

    @Expose({ name: 'Object_Type' })
    Object_Type: string | null = null;

    @Expose({ name: 'Parent_Agreement' })
    Parent_Agreement: string | null = null;

    @Expose({ name: 'ParentRequestId' })
    ParentRequestId: string | null = null;

    @Expose({ name: 'PrevAssignedToName' })
    PrevAssignedToName: string | null = null;

    @Expose({ name: 'PrevAssignedToId' })
    PrevAssignedToId: string | null = null;

    @Expose({ name: 'PrevAssignedToType' })
    PrevAssignedToType: string | null = null;

    @Expose({ name: 'Assigned_To' })
    Assigned_To: string | null = null;

    @Expose({ name: 'Rejection_Action' })
    Rejection_Action: string | null = null;

    @Expose({ name: 'Related_Agreement' })
    Related_Agreement: string | null = null;

    @Expose({ name: 'AgreementLineItemId' })
    AgreementLineItemId: string | null = null;

    @Expose({ name: 'Related_Agreement_Owner' })
    Related_Agreement_Owner: string | null = null;

    @Expose({ name: 'Related_Agreement_Requestor' })
    Related_Agreement_Requestor: string | null = null;

    @Expose({ name: 'Related_Agreement_Term_Exception' })
    Related_Agreement_Term_Exception: string | null = null;

    @Expose({ name: 'Related_Opportunity' })
    Related_Opportunity: string | null = null;

    @Expose({ name: 'Related_Opportunity_Owner' })
    Related_Opportunity_Owner: string | null = null;

    @Expose({ name: 'RequestType' })
    RequestType: string | null = null;

    @Expose({ name: 'Send_Email' })
    Send_Email: boolean = false;

    @Expose({ name: 'StepSequenceString' })
    StepSequenceString: string | null = null;

    @Expose({ name: 'StepSequence' })
    StepSequence: number | null = null;

    @Expose({ name: 'Status_Link' })
    Status_Link: string | null = null;

    @Expose({ name: 'StepNameLink' })
    StepNameLink: string | null = null;

    @Expose({ name: 'Step' })
    Step: string | null = null;

    @Expose({ name: 'Step_Group_Seq_Number' })
    Step_Group_Seq_Number: number | null = null;

    @Expose({ name: 'StepLabel' })
    StepLabel: string | null = null;

    @Expose({ name: 'Step_Name' })
    Step_Name: string | null = null;

    @Expose({ name: 'SubmissionComment1' })
    SubmissionComment1: string | null = null;

    @Expose({ name: 'SubmissionComment2' })
    SubmissionComment2: string | null = null;

    @Expose({ name: 'SubmissionComment3' })
    SubmissionComment3: string | null = null;

    @Expose({ name: 'SubprocessDependsOn' })
    SubprocessDependsOn: string | null = null;

    @Expose({ name: 'SubprocessName' })
    SubprocessName: string | null = null;

    @Expose({ name: 'SubprocessSequence' })
    SubprocessSequence: number | null = null;

    @Expose({ name: 'Sequence' })
    Sequence: string | null = null;

    @Expose({ name: 'SubstepDependsOn' })
    SubstepDependsOn: string | null = null;

    @Expose({ name: 'SubstepName' })
    SubstepName: string | null = null;

    @Expose({ name: 'SubstepSequence' })
    SubstepSequence: number | null = null;

    @Expose({ name: 'Workflow_Trigger_Added_Comments' })
    Workflow_Trigger_Added_Comments: boolean = false;
}