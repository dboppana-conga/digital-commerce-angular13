import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { get, set, map as _map, compact, flatten, isArray, defaultTo, includes, isNil, filter } from 'lodash';
import { Cart, CartItem, CartService, LineItemService } from '@congacommerce/ecommerce';
import { ExceptionService } from '../../shared/services/exception.service';
import { ProductConfigurationService } from '../product-configuration/services/product-configuration.service';
import { RevalidateCartService } from '../revalidate-cart-modal/services/revalidate-cart.service';

/**@ignore */
declare var $: any;

/**
 * The Mini Cart component is a cart icon with an associated dropdown menu. The cart icon should be displayed in a fixed header of a page so it is accessible to the user at all times. Once items have been added to the user's current cart a badge will appear next to the Mini Cart icon with the total number of items.
 *
 * When a user clicks the Mini Cart icon the associated dropdown menu will be displayed. The Mini Cart dropdown menu shows the current line items that have been added to the cart. Line items include information about the product, controls for updating the quantity of items, and a control for removing the item from the cart. A cart total price and checkout button are also shown in the Mini Cart dropdown.
 * <h3>Preview</h3>
 * <img class="jumbotron" src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/miniCart.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { MiniCartModule } from '@congacommerce/elements';

@NgModule({
  imports: [MiniCartModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-mini-cart
*               [productLink]="routeToProduct"
*               [productIdentifier]="productIdentifier"
*               [cartLink]="routeToCart"
*               [manageCartLink]="routeToManageCart"
* ></apt-mini-cart>
```
*/

// TODO: Update mini cart component taking dev branch as reference.

@Component({
    selector: 'apt-mini-cart',
    templateUrl: './mini-cart.component.html',
    styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent implements OnInit {
    @Input() productLink: string = '/products';
    @Input() productIdentifier: string = this.cartService.configurationService.get('productIdentifier');
    @Input() cartLink: string = '/checkout';
    @Input() manageCartLink: string = '/carts';

    /** @ignore */
    cartItems$: Observable<Array<CartItem>>;
    /** @ignore */
    cart$: Observable<Cart>;
    /**
     * The item count shown as a badge next to the cart icon.
     * @ignore
     */
    itemCount: number;
    /**
     * The product identifier set in the configuration file.
     * @ignore
     */
    identifier: string = 'Id';
    /** @ignore */
    entity = new CartItem();

    loading: boolean = false;
    lineItemPricePending: boolean = false;
    lineItemPriceComplete: boolean = false;
    subscription: Subscription;

    /** @ignore to disable th save changes button on error. */
    disabled$: Observable<boolean>;

    @ViewChild('btnDropdown', { static: true })
    btnDropdown: ElementRef<any>;

    constructor(private cartService: CartService,
        public sanitizer: DomSanitizer,
        private exceptionService: ExceptionService,
        private router: Router,
        private productConfigurationService: ProductConfigurationService,
        private revalidateCartService: RevalidateCartService) { }

    ngOnInit() {

        this.disabled$ = this.productConfigurationService.configurationChange.pipe(map(res => get(res, 'hasErrors')));
        this.identifier = this.cartService.configurationService.get('productIdentifier');
        this.cart$ = this.cartService.getMyCart();
        this.cartItems$ = this.cartService.getMyCart().pipe(
            map(cart => {
                this.lineItemPriceComplete = filter(cart.LineItems, r => r.PricingStatus === 'Complete').length > 0;
                this.lineItemPricePending = filter(cart.LineItems, r => r.PricingStatus === 'Pending').length > 0 || ((cart.IsPricePending || get(cart, 'IsPriced')) && get(cart.LineItems, 'length') > 0);
                const primaryLines = compact(flatten(_map(LineItemService.groupItems(isArray(cart) ? defaultTo(get(cart, '[0].LineItems'), []) : defaultTo(get(cart, 'LineItems'), [])), 'PrimaryLines')));
                return primaryLines;
            })
        );
    }

    /** @ignore */
    trackById(index, record: CartItem): string {
        return get(record, 'Id');
    }

    /**
     * Removes the provided CartItem from the user's current active cart.
     *
     * @param item CartItem instance to remove from cart.
     * @param evt Event associated with the user action.
     * @fires CartService.removeCartItem()
     * @ignore
     */
    removeCartItem(item: CartItem, evt) {
        set(item, '_metadata.deleting', true);
        evt.stopPropagation();
        this.cartService.removeCartItem(item).subscribe(() => {
            this.revalidateCartService.setRevalidateLines();
            if (includes(this.router.url, get(item, 'Id')))
                this.router.navigate(['/products', get(item, 'Product.Id')]);
        });
    }
    /**
     * Changes the quantity of the cart item passed to this method.
     *
     * @param cartItem Cart item reference to change quantity.
     * @param event The event object
     * @fires CartService.updateCartItems()
     * @ignore
     */
    changeItemQuantity(cartItem: CartItem) {
        if (!cartItem.Quantity || cartItem.Quantity <= 0) {
            cartItem.Quantity = cartItem.get('Quantity');
            this.exceptionService.showError('INVALID_QUANTITY');
        }
        else {
            this.cartService.updateCartItems([cartItem]).pipe(take(1)).subscribe(() => cartItem.set('Quantity', cartItem.Quantity));
        }
    }
    navigateToCart() {
        this.router.navigate(['/carts', 'active']);
    }

    dropdown(evt: string) {
        if (this.btnDropdown)
            $(this.btnDropdown.nativeElement).dropdown(evt);
    }
    saveChanges(relatedTo: CartItem, isEmbedded: boolean, productId: string) {
        this.loading = true;
        const obsv$ = relatedTo ? this.cartService.updateItem(null, null, isEmbedded) :
            this.cartService.addItem(null);

        obsv$.subscribe(res => {
            relatedTo = isNil(relatedTo) ?
                res.find(r => get(r, 'Product.Id') === productId && r.LineType === 'Product/Service') :
                relatedTo;
            if (!isNil(relatedTo))
                this.router.navigate(['/products', productId, relatedTo.Id]);
            else
                this.router.navigate(['/products', productId]);

            this.loading = false;
        });
    }
}