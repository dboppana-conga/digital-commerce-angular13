import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { get, merge, forEach, isNil, isEmpty, assign, pick, keys, find, has, map as _map, filter, first, split } from 'lodash';
import { AObject, ConfigurationService, ApiService } from '@congacommerce/core';
import { Product } from '../modules/catalog/classes/product.model';
import { ProductAttributeGroup } from '../modules/catalog/classes/product-attribute-group.model';
import { Category } from '../modules/catalog/classes/category.model';
import { ProductTranslation } from '../modules/translation/classes/product-translation.model';
import { AttributeGroupTranslation } from '../modules/translation/classes/attribute-translation.model';
import { CategoryTranslation } from '../modules/translation/classes/category-translation.model';
import { ProductOptionComponent } from '../modules/catalog/classes/product-option.model';
import { StorefrontService } from '../modules/store/services/storefront.service';
import { UserService } from '../modules/crm/services/user.service';

/**
 * <strong> This service is a work in progress</strong>
 * This service is responsible to provide locale data translation for categories, products and product attribute groups based on salesforce translation object.
 * It also provides support for language translation of labels based on the salesforce locale settings.
 * <h3>Usage</h3>
 *
 ```typescript
 import { TranslatorLoaderService } from '@congacommerce/ecommerce';

 constructor(private translateService: TranslatorLoaderService) {}

 // or

 export class MyService extends AObjectService {
     private translateService: TranslatorLoaderService = this.injector.get(TranslatorLoaderService);
  }
 */
@Injectable({
    providedIn: 'root'
})
export class TranslatorLoaderService implements TranslateLoader {

    constructor(private apiService: ApiService,
        protected storefrontService: StorefrontService,
        private userService: UserService,
        private httpClient: HttpClient,
        private configService: ConfigurationService) { }

    translationModule = 'Digital Commerce';

    /**
     * This method returns the translation module set in the application for static text translations.
     * ### Example:
    ```typescript
    import { TranslatorLoaderService, User } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';

    export class MyComponent implements OnInit{
        translate:string;
        constructor(private translatorLoaderService: TranslatorLoaderService){}
        
          getTranslationModule(){
              this.translate= this.translatorLoaderService.getTranslationModule();
           }
       }
   ```
     * @returns string representing the translation module.
     */
    getTranslationModule(): string {
        return this.translationModule;
    }

    /**
     * This method sets the translation module in the application as defined by platform admin.
     * ### Example:
    ```typescript
    import { TranslatorLoaderService, User } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';

    export class MyComponent implements OnInit{
        constructor(private translatorLoaderService: TranslatorLoaderService){}
        
          setTranslationModule(moduleName: string){
              this.translatorLoaderService.setTranslationModule(moduleName);
           }
       }
   ```
     * @param moduleName string value representing the translation module.
     */
    setTranslationModule(moduleName: string) {
        this.translationModule = moduleName;
    }

    /**
     * Retrieves translated labels based on current user's locale.
     * ### Example:
     ```typescript
    import { TranslatorLoaderService, object } from '@congacommerce/ecommerce';
    import { Observable } from 'rxjs/Observable';

    export class MyComponent implements OnInit{
        translations$:Observable<object>
        translations:object
        constructor(private translatorLoaderService: TranslatorLoaderService){}
        
          getTranslation(locale: string){
              this.translations$ = this.translatorLoaderService.getTranslation(locale);
              //or
              this.translatorLoaderService.getTranslation(locale).subscribe(c=> this.translations= c);
           }
     ```
     * @param locale parameter specifying the locale for translation.
     * @returns an Observable containing the json string with translations.
     * To Do:
     */
    getTranslation(locale: string): Observable<object> {

        const localTranslation$ = this.httpClient.get(`${this.configService.resourceLocation()}assets/i18n/${first(split(locale, '-'))}.json`);

        const externalTranslation$ = this.apiService.get(`/plat-admin/v1/translations/${locale}/${this.translationModule}/${locale}`)
            .pipe(map(res => !isNil(get(res, 'Value')) ? JSON.parse(res.Value) : []));

        return combineLatest([localTranslation$, externalTranslation$])
            .pipe(
                switchMap(([local, remote]) => of(merge(local, remote))),
                // If an error occurs, use the local sdk translation files
                catchError(err => localTranslation$)
            );
    }

    /**
     * @ignore
     */
    private isValidURL(value) {
        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(value);
    }


    /**
     * Method provides locale data translation for categories, products and product attribute groups based on the salesforce translation object.
     * Also translates product data, with data translations for underlying attribute groups, option groups and product option components for complex bundles.
     * ### Example:
     ```typescript
     import { TranslatorLoaderService } from '@congacommerce/ecommerce';
     export class MyComponent implements OnInit{
         data: Array<any>;
         data$:  Observable<Array<any>>;
         constructor(private translateService: TranslatorLoaderService) {}
         
         getTranslation(record){
              this.translateService.translateData(record).subscribe(user => this.data = user);
                // or
              this.data$ = this.translateService.translateData(record);
            }
     }
     ```
     * @param recordList An array of Category, Product or Product Attribute Group data to be translated.
     * @param categories Category list to translate option groups for a bundle.
     * @returns an observable containing an array of translated Categories, Products or Product Attribute Groups.
     */
    translateData(recordList: Array<AObject>, categories: Array<Category> = null): Observable<Array<any>> {
        return this.userService.me().pipe(
            map(user => {
                const language = get(user, 'Language');
                this.translateRecords(recordList, language, categories);
                return recordList;
            })
        );
    }

    /**
     * @ignore
     */
    private translateRecords(recordList: Array<AObject>, language: string, categories: Array<Category> = null) {
        const getTranslations = (recordList: Array<AObject>) => {
            forEach(recordList, record => {
                if (record instanceof Product) {
                    this.translateProduct(record, language, categories);
                }
                if (record instanceof Category || record instanceof ProductAttributeGroup) {
                    this.applyTranslation(record, get(record, 'Translation', []), language);
                }
                if (has(record, 'Categories')) {
                    getTranslations(_map(get(record, 'Categories'), cat => cat.Classification));
                }
            })
        };
        getTranslations(recordList);
    }

    /**
     * @ignore
     */
    private applyTranslation(record: AObject, translationRecords: Array<CategoryTranslation | ProductTranslation | AttributeGroupTranslation>, language: string): AObject {
        if (!(isEmpty(translationRecords) || isNil(language))) {
            const translationRecord = find(translationRecords, res => !isNil(get(res, 'Language')) && res.Language.toLowerCase() === language.toLocaleLowerCase());
            if (translationRecord) {
                assign(record, pick(translationRecord, filter(keys(record), item => item !== 'Id')));
            }
        }
        return record;
    }

    /**
     * @ignore
     */
    private translateProduct(product: Product, language: string, categories: Array<Category>) {
        const optionGroups = get(product, 'OptionGroups', []);
        const attributeGroups = _map(get(product, 'AttributeGroups', []), 'AttributeGroup');

        // Translate product data
        this.applyTranslation(product, get(product, 'Translation', []), language);

        // Translate product option groups
        forEach(optionGroups, group => {
            const category = find(categories, cat => cat.Id === group.OptionGroupId)
            if (!isEmpty(category) && !isEmpty(category.Translation)) {
                this.applyTranslation(get(group, 'OptionGroup'), get(category, 'Translation', []), language);
            }
        });

        // Translate product attribute groups
        this.translateRecords(attributeGroups, language);

        // Recursively translate attribute groups, option groups and product option components for a bundle.
        if (!isEmpty(optionGroups)) {
            forEach(optionGroups, group => {
                forEach(get(group, 'Options', []), (option: ProductOptionComponent) => {
                    this.translateProduct(get(option, 'ComponentProduct'), language, categories);
                });
            });
        }
    }
}