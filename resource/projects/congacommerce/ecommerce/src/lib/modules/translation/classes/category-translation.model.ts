import { AObject, ATable } from '@congacommerce/core';
import { Expose } from 'class-transformer';

@ATable({
    sobjectName : 'CategoryTranslation'
})
export class CategoryTranslation extends AObject {
   
    @Expose({ name: 'CategoryHierarchy'})
    CategoryHierarchy: string = null;
   
    @Expose({ name: 'Label'})
    Label: string = null;
   
    @Expose({ name: 'Language'})
    Language: string = null;
    
    @Expose({ name: 'Name'})
    Name: string = null;
}