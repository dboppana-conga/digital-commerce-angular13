import { Expose } from 'class-transformer';
import { AObject, ATable } from '@congacommerce/core';
@ATable({
    sobjectName: 'ConfigCustomDisplayColumns'
})
export class ConfigCustomDisplayColumns extends AObject {

    @Expose({ name: 'DisplayType' })
    DisplayType: string | null = null;

    @Expose({ name: 'FieldName' })
    FieldName: string | null = null;

    @Expose({ name: 'Flow' })
    Flow: string | null = null;

    @Expose({ name: 'HeaderStyle' })
    HeaderStyle: string | null = null;

    @Expose({ name: 'IsEditable' })
    IsEditable: boolean | null = null;

    @Expose({ name: 'IsPricePoint' })
    IsPricePoint: boolean | null = null;

    @Expose({ name: 'IsSortable' })
    IsSortable: boolean = false;

    @Expose({ name: 'Sequence' })
    Sequence: number | null = null;

    @Expose({ name: 'Style' })
    Style: string | null = null;

    @Expose({ name: 'StyleClass' })
    StyleClass: string | null = null;
}