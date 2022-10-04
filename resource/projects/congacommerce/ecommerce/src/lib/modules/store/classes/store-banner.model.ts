import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName: 'StorefrontBanner'
})
export class StoreBanner extends AObject {
    @Expose({
        name: 'Link'
    })
    Link: string = null;

    @Expose({
        name: 'StorefrontId'
    })
    StorefrontId: string = null;

    @Expose({
        name: 'Subtitle'
    })
    Subtitle: string = null;

    @Expose({
        name: 'Title'
    })
    Title: string = null;

    @Expose({
        name: 'Image'
    })
    Image: string = null;
}