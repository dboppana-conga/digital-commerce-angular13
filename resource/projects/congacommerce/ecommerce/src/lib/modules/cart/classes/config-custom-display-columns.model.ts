import { Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'ConfigCustomDisplayColumns'
})
export class ConfigCustomDisplayColumns extends AObject {

    @Expose({ name: 'DisplayType' })
    DisplayType: string = null;

    @Expose({ name: 'FieldName' })
    FieldName: string = null;

    @Expose({ name: 'Flow' })
    Flow: string = null;

    @Expose({ name: 'HeaderStyle' })
    HeaderStyle: string = null;

    @Expose({ name: 'IsEditable' })
    IsEditable: boolean = null;

    @Expose({ name: 'IsPricePoint' })
    IsPricePoint: boolean = null;

    @Expose({ name: 'IsSortable' })
    IsSortable: boolean;

    @Expose({ name: 'Sequence' })
    Sequence: number = null;

    @Expose({ name: 'Style' })
    Style: string = null;

    @Expose({ name: 'StyleClass' })
    StyleClass: string = null;
}