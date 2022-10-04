import { get } from 'lodash';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'ProductAttributeValue',
    dynamic: true
})
export class ProductAttributeValue extends AObject {

    public LineItem: string = null;

    get LineItemId(): string {
        return get(this, 'LineItem');
    }
}