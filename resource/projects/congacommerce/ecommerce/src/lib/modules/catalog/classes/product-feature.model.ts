import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'FeatureSet'
})
export class FeatureSet extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;
}

@ATable({
    sobjectName: 'Feature'
})
export class Feature extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;

    @Expose({ name: 'Description' })
    Description: string = null;

    @Type(() => FeatureSet)
    @Expose({ name: 'FeatureSet' })
    FeatureSet: FeatureSet = new FeatureSet();

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'FeatureSetId' })
    FeatureSetId: string = null;
}
@ATable({
    sobjectName: 'ProductFeatureValue'
})
export class ProductFeatureValue extends AObject {

    @Expose({ name: 'Value' })
    Value: string = null;

    @Expose({ name: 'ProductId' })
    ProductId: string = null;

    @Expose({ name: 'IsIncluded' })
    IsIncluded: boolean = null;

    @Type(() => Feature)
    @Expose({ name: 'Feature' })
    Feature: Feature = new Feature();
}