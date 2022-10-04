
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Product Drawer service is used to check Drawer status(open/close).
 * <h3>Usage</h3>
 *
 ```typescript
import { ProductDrawerService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private productDrawerService: ProductDrawerService)
}
// or
export class MyService extends AObjectService {
     private productDrawerService: ProductDrawerService = this.injector.get(ProductDrawerService);
 }
```
 */
@Injectable({
  providedIn: 'root'
})

export class ProductDrawerService {

  private _drawerShowing = new BehaviorSubject<boolean>(false);

  /**
   * check drawer is open or close
   * ### Example:
```typescript
import { ProductDrawerService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    isOpen$: Observable<boolean>;
    isOpen: boolean;

    constructor(private productDrawerService: ProductDrawerService){}

    isDrawerOpen(){
       this.productDrawerService.isDrawerOpen().subscribe(a => this.isOpen = a);
        // or
        this.isOpen$ = this.productDrawerService.isDrawerOpen();
    }
}
```
   * @returns Observable<boolean> true if drawer is open and false if it is close
  */
  public isDrawerOpen(): Observable<boolean> {
    return this._drawerShowing;
  }

  /**
   * toggle the drawer action. close if it is open or vice versa
   * ### Example:
```typescript
import { ProductDrawerService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    constructor(private productDrawerService: ProductDrawerService){}

    toggleDrawer(){
         this.productDrawerService.toggleDrawer();
    }
}
```
   */
  public toggleDrawer() {
    this._drawerShowing.pipe(take(1)).subscribe(drawerShowing => {
      if (drawerShowing) this.closeDrawer();
      else this.openDrawer();
    });
  }

  /**
   * TO open the drawer
   * ### Example:
```typescript
import { ProductDrawerService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    constructor(private productDrawerService: ProductDrawerService){}

    openDrawer(){
         this.productDrawerService.openDrawer();
    }
}
```
   */
  public openDrawer() {
    this._drawerShowing.next(true);
  }

  /**
   * To close the drawer
   * ### Example:
```typescript
import { ProductDrawerService } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    constructor(private productDrawerService: ProductDrawerService){}

    closeDrawer(){
         this.productDrawerService.closeDrawer();
    }
}
```
   */
  public closeDrawer() {
    this._drawerShowing.next(false);
  }

}
