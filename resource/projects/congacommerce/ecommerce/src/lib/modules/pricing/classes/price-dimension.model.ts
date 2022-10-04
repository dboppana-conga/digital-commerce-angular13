import { AObject, ATable } from '@congacommerce/core';
import { Incentive } from '../../promotion/classes/incentive.model';
import { Expose } from 'class-transformer';
import { ProductAttributeGroup } from '../../catalog/classes/product-attribute-group.model';


@ATable({
    sobjectName : 'PriceDimension'
})
export class PriceDimension extends AObject {
    @Expose({
        name : 'Attribute'
    })
    Attribute: ProductAttributeGroup = null;
    @Expose({
        name : 'BusinessObject'
    })
    BusinessObject: string = null;
    @Expose({
        name : 'childFilterName'
    })
    ChildFilterName: string = null;
    @Expose({
        name : 'contextType'
    })
    ContextType: string = null;
    @Expose({
        name : 'Description'
    })
    Description: string = null;
    @Expose({
        name : 'Datasource'
    })
    Datasource: string = null;
    @Expose({
        name : 'Incentive'
    })
    Incentive: Incentive = null;
    @Expose({
        name : 'RelationType'
    })
    RelationType: string = null;
    @Expose({
        name : 'Type'
    })
    Type: string = null;

    @Expose({
        name : 'CumulativeDimension'
    })
    CumulativeDimension: PriceDimension = null;
}