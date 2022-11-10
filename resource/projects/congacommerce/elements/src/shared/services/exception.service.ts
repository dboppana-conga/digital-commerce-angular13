
import { take, debounceTime } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CartService, CartError } from '@congacommerce/ecommerce';
import { ConstraintRuleService } from '@congacommerce/ecommerce';
import { PromotionService } from '@congacommerce/ecommerce';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@congacommerce/core';

/**
 * The service is used to show the toaster message based on the message type.
 * <h3>Usage</h3>
 *
 ```typescript
import { ExceptionService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private exceptionService: ExceptionService)
}
// or
export class MyService extends AObjectService {
     private exceptionService: ExceptionService = this.injector.get(ExceptionService);
 }
```
 */
@Injectable({ providedIn: 'root' })
export class ExceptionService {

    private timeout;


    constructor(private cartService: CartService, private constraintRuleService: ConstraintRuleService, private promotionService: PromotionService, private toastr: ToastrService, private translateService: TranslateService, private apiService: ApiService) {
        /* TO DO :  */
        // this.cartService.onCartError.subscribe(e => this.showError(e));
        this.apiService.onApiError.subscribe(e => this.showError(e));
    }

    /**
     * Show error message in the toaster.
     * ### Example:
```typescript
import { ExceptionService, CartError } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    showError(error: CartError | Error | string){
        this.exceptionService.showError(error);
    }
}
```
     * @param error message is of type Error or CartError or string
     */
    showError(error: CartError | Error | string, title: string = 'ERROR.APPLICATION_ERROR_TOASTR_TITLE', positionClass: ToasterPosition = ToasterPosition.BOTTOM_LEFT) {
        this.translateService.stream([`ERROR.${error}`, title]).pipe(take(1)).subscribe(val => this.toastr.error(val[`ERROR.${error}`], val[title], { positionClass }));
    }

    /**
     * Show success message in the toaster.
     * ### Example:
```typescript
import { ExceptionService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    showSuccess(message: string){
        this.exceptionService.showSuccess(message);
    }
}
```
     * @param message success message to be displayed on the toaster.
     * @param title success title on the toaser.
     * @param data is optional; required to return stream of translated values of a 
     * key which updates whenever language change.
     */
    showSuccess(message: string, title: string = 'SUCCESS.TITLE', data?: any, positionClass: ToasterPosition = ToasterPosition.BOTTOM_LEFT) {
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.translateService.stream([message, title], data).pipe(take(1)).subscribe(val => this.toastr.success(val[message], val[title], { positionClass })), 200);
    }

    /**
     * Show info message in the toaster.
     * ### Example:
```typescript
import { ExceptionService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    showInfo(message: string){
        this.exceptionService.showInfo(message);
    }
}
```
     * @param message info message to be displayed on the toaster.
     * @param title info title on the toaser.
     * @param data is optional; required to return stream of translated values of a 
     * key which updates whenever language change.
     */
    showInfo(message: string, title: string = 'COMMON.INFO_ALERT', data?: any, positionClass: ToasterPosition = ToasterPosition.BOTTOM_LEFT) {
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.translateService.stream([message, title], data).pipe(take(1)).subscribe(val => this.toastr.info(val[message], val[title], { positionClass })), 200);
    }

    /**
     * Show warning message in the toaster.
     * ### Example:
```typescript
import { ExceptionService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{

    showWarning(message: string){
        this.exceptionService.showWarning(message);
    }
}
```
     * @param message warning message to be displayed on the toaster.
     * @param title warning title on the toaser.
     * @param data is optional; required to return stream of translated values of a 
     * key which updates whenever language change.
     */
    showWarning(message: string, title: string = 'COMMON.INFO_ALERT', data?: any, positionClass: ToasterPosition = ToasterPosition.BOTTOM_LEFT) {
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.translateService.stream([message, title], data).pipe(take(1)).subscribe(val => this.toastr.warning(val[message], val[title], { positionClass })), 200);
    }
}

/**@ignore */
export enum ToasterPosition {
    TOP_RIGHT = 'toast-top-right',
    TOP_CENTER = 'toast-top-center',
    TOP_LEFT = 'toast-top-left',
    BOTTOM_RIGHT = 'toast-bottom-right',
    BOTTOM_CENTER = 'toast-bottom-center',
    BOTTOM_LEFT = 'toast-bottom-left',
}