import { DependentPicklistView } from "./dependent-picklist.component";

export const view: DependentPicklistView={
    parentDescribe:'1',
    fieldDescribe:'2'
}

const picklistValues1={
picklistValues:[{
    label:'1',
    value:'1'
    },
    {
    label:'2',
    value:'2'
    }]
}

const picklistValues2={
    picklistValues:[{
        value:'1'
        },
        {
        value:''
        }]
    }

    const picklistValues3={
        picklistValues:[
            {
            validFor:'Test'
            }]
        }

export const view2: DependentPicklistView={
    parentDescribe:picklistValues1,
    fieldDescribe:picklistValues2,
    parentValue:'2',
    value:'1'
}

export const view3: DependentPicklistView={
    parentDescribe:picklistValues1,
    fieldDescribe:picklistValues3,
    parentValue:'2',
    value:'1'
}