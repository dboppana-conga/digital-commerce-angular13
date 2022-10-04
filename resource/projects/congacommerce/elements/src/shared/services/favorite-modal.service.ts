import { Injectable } from '@angular/core';
import { CartItem, Product } from '@congacommerce/ecommerce';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FavoriteModalComponent } from '../../lib/favorite-modal/favorite-modal.component';

/**
 * Favorite modal service is used to open favorite modals.
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})
export class FavoriteModalService {

  constructor(private modalService: BsModalService) {}
  
  /**
   * Opens the Add Existing /Add New Favorite in the modal.
   * @param items accepts list of Product or cartItems.
   */
  public openExistingFavModal(items: Array<Product|CartItem>) {
    this.modalService.show(FavoriteModalComponent, {initialState: { _items: items}, class: 'modal-md'});
  }
}
