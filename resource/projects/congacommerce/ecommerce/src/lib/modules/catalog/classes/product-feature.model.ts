import { Expose, Type } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'FeatureSet'
})
export class FeatureSet extends AObject {

    @Expose({ name: 'Name' })
    Name: string | null= null;

    @Expose({ name: 'Description' })
    Description: string | null= null;

    @Expose({ name: 'Sequence' })
    Sequence: number | null= null;
}

@ATable({
    sobjectName: 'Feature'
})
export class Feature extends AObject {

    @Expose({ name: 'Name' })
    Name: string | null= null;

    @Expose({ name: 'Description' })
    Description: string | null= null;

    @Type(() => FeatureSet)
    @Expose({ name: 'FeatureSet' })
    FeatureSet: FeatureSet = new FeatureSet();

    @Expose({ name: 'Sequence' })
    Sequence: number | null= null;

    @Expose({ name: 'FeatureSetId' })
    FeatureSetId: string | null= null;
}
@ATable({
    sobjectName: 'ProductFeatureValue'
})
export class ProductFeatureValue extends AObject {

    @Expose({ name: 'Value' })
    Value: string | null= null;

    @Expose({ name: 'ProductId' })
    ProductId: string | null= null;

    @Expose({ name: 'IsIncluded' })
    IsIncluded: boolean = false;

    @Type(() => Feature)
    @Expose({ name: 'Feature' })
    Feature: Feature = new Feature();
}