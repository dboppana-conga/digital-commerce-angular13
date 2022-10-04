import { AObjectService } from '@congacommerce/core';
import { Injectable } from '@angular/core';
import { Template } from '../classes/template.model';
import { Observable } from 'rxjs';

/**
 * @ignore
 * A template service provides methods for the proposal and agreement templates within Apttus. Use this to retrieve template records.
 */
@Injectable({
    providedIn : 'root'
})
export class TemplateService extends AObjectService{
    type = Template;

    /**
     * Method is used to retrieve active templates within Apttus
     * ### Example:
```typescript
import { TemplateService, Template } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    templateList: Array<Template>;
    templateList$: Observable<Array<Template>>;

    constructor(private templateService: TemplateService){}

    ngOnInit(){
        this.templateService.getActiveTemplates().subscribe(t => this.templateList = t);
        // or
        this.templateList$ = this.templateService.getActiveTemplates();
    }
}
```
     * @param type the type of templates to pull (Proposal or Agreement)
     * @returns an observable array of active templates
     * TO DO:
     */
    getActiveTemplates(type: 'Proposal' | 'Agreement' | 'Apttus_Config2__Order__c' | 'Apttus_Proposal__Proposal__c'): Observable<Array<Template>>{
        // return this.where(`Apttus__IsActive__c = TRUE AND Apttus__PublishStatus__c = 'Published' AND Apttus__Type__c = '` + type + `'`);
        // return this.where(
        //     [
        //         new ACondition(this.type, 'IsActive', 'Equal', true),
        //         new ACondition(this.type, 'PublishStatus', 'Equal', 'Published'),
        //         new ACondition(this.type, 'BusinessObject', 'Equal',  type ),
        //     ]
        // );
        return null;
    }
}