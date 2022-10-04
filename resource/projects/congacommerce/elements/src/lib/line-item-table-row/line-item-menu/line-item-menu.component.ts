import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItemView } from '../interfaces/line-item-view.interface';
import { UserViewMappingService } from '../services/user-view-mapping.service';

/**
 * <strong> This component is a work in progress</strong>
 * Line item menu component is used to display configurable view of cart item fields for a user on cart page.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/line-item-menu.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
 import { LineItemTableRowModule } from '@congacommerce/elements';

 @NgModule({
  imports: [LineItemTableRowModule, ...]
})
 export class AppModule {}
 ```
 * @example
 ```typescript
 * <apt-line-item-menu></apt-line-item-menu>
 ```
 */
@Component({
  selector: 'apt-line-item-menu',
  templateUrl: './line-item-menu.component.html',
  styleUrls: ['./line-item-menu.component.scss']
})
export class LineItemMenuComponent implements OnInit {

  menuItems$: BehaviorSubject<Array<CartItemView>>;

  constructor(private mappingService: UserViewMappingService) { }

  ngOnInit(): void {
    this.menuItems$ = this.mappingService.getCurrentView();
  }

  saveSelections(): void {
    this.mappingService.saveUserSelections(this.menuItems$.value);
  }

  handleCheckbox(item: CartItemView) {
    item.isSelected = !item.isSelected;
  }
}
