import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { StorefrontService, UserService, Storefront } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs';
/**
 * Installed products component is a button that links users to the installed products page.
 * The button is disabled for users who are not logged in.
 * @ignore
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/installedProductsButton.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
```typescript
import { ButtonModule } from '@congacommerce/elements';

@NgModule({
  imports: [ButtonModule, ...]
})
export class AppModule {}
```
* @example
* <apt-installed-products></apt-installed-products>
*/
@Component({
  selector: 'apt-installed-products',
  templateUrl: './installed-products.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstalledProductsComponent implements OnInit {

  /**
   * Observable instance of the storefront.
   * @ignore
   */
  storefront$: Observable<Storefront>;
  /**
   * Observable instance to get if the user is logged in.
   * @ignore
   */
  isLoggedIn$: Observable<boolean>;

  constructor(private storefrontService: StorefrontService, private userService: UserService) { }

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
    this.isLoggedIn$ = this.userService.isLoggedIn();
  }

}
