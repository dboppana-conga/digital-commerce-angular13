import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaxBreakup } from '../classes/tax-breakup.model';
import { ProposalTaxBreakup } from '../classes/proposal-tax-breakup.model';
import { OrderTaxBreakup } from '../classes/order-tax-breakup.model';
import { TaxServiceCore, ProposalTaxBreakupService, OrderTaxBreakupService } from './tax.core.service';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * Responsible to calculating Tax using CPQ's computeTaxForCart(cartId) API
 * <h3>Usage</h3>
 *
 ```typescript
 import { TaxService, AObjectService } from '@congacommerce/ecommerce';

 constructor(private taxService: TaxService) {}

 // or

 export class MyService extends AObjectService {
     private taxService: TaxService = this.injector.get(TaxService);
  }
 ```
 */
@Injectable({
    providedIn: 'root'
})
export class TaxService extends TaxServiceCore {
    /**
     * Method to compute tax using 'computeTaxForCart(cartId)' CPQ API
     *
     *  ### Example:
```typescript
import { TaxService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private taxService: TaxService){}
    ngOnInit(){
        this.taxService.computeTaxForCart().subscribe(taxResults => {...});
    }
}
```
     * @override
     */
    public computeTaxForCart(): Observable<any> {
        return super.computeTaxForCart();
    }

    /**
     * Retrieves Tax Breakup for a perticular line item.
     *  ### Example:
```typescript
import { TaxService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private taxService: TaxService){}
    ngOnInit(){
        this.taxService.getTaxBreakupForLineItem(lineItemId).subscribe(taxResults => {...});
    }
}
```
     * @param lineItemId string identifier of the line item to retrieve tax breakups for.
     * @override
     * @return an observable containing list of tax breakup items for a given line item.
     */
    public getTaxBreakupForLineItem(lineItemId: string): Observable<Array<TaxBreakup>> {
        return super.getTaxBreakupForLineItem(lineItemId);
    }

    /**
   * Retrieves Tax Breakup for current configuration
   *  ### Example:
```typescript
import { TaxService } from '@congacommerce/ecommerce';
export class MyComponent implements OnInit{
    constructor(private taxService: TaxService){}
    ngOnInit(){
        this.taxService.getTaxBreakUpsForConfiguration().subscribe(taxResults => {...});
    }
}
```
   * @override
   * @returns an observable containing list of tax breakup items for the active cart.
   */
    public getTaxBreakUpsForConfiguration(): Observable<Array<TaxBreakup>> {
        return super.getTaxBreakUpsForConfiguration();
    }
}

/**
 * @ignore
 */@Injectable({
    providedIn: 'root'
})
export class ProposalTaxService extends ProposalTaxBreakupService {
    public getTaxBreakupForQuote(quoteId: string): Observable<Array<ProposalTaxBreakup>> {
        return super.getTaxBreakupForQuote(quoteId);
    }
}

/**
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class OrderTaxService extends OrderTaxBreakupService {
    public getTaxBreakupForOrder(orderId: string): Observable<Array<OrderTaxBreakup>> {
        return super.getTaxBreakupForOrder(orderId);
    }
}