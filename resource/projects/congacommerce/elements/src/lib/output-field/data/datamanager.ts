import { Order, Account, Contact } from '@congacommerce/ecommerce'
import { FieldLabel, OutputFieldView } from '../output-field.component';
const metadata: any ={
    'type': 'datetime'
};
 const metadata2: any={
    'type': 'date'
 }
 
const orderInstance = new Order();
 orderInstance.Name='orcerDemo';

const fieldMetadata={
    "BillingAddress": {
        "soql": "BillingAddress",
        "view": [
            "Compact"
        ],
        "compactLabel": "Billing Address"
    }
}

const fieldMetadata2={
    "FirstName": {
        "soql": "FirstName",
        "view": [
            "Compact"
        ]
    }
}

const accountValue= new Account()
accountValue.ShippingStateCode='peachroad';
accountValue.Id='test123';

const contactValue = new Contact();
contactValue.Id='1234'

const fieldvalue: FieldLabel={
    field:'string',
    label:'String'
}

export const outputfield: OutputFieldView={
    metadata: 'any',
    recordMetadata:'any',
    value: 'string',
    label: 'stringValue',
    field: 'Id',
    recordInstance: contactValue,
    referenceFieldInstance: contactValue,
    popoverFields: [fieldvalue],
    route: 'string/string',
}
export { metadata, metadata2, orderInstance, fieldMetadata, fieldMetadata2, accountValue, contactValue }