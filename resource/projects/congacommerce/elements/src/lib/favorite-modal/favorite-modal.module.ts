import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaddaModule } from 'angular2-ladda';
import { TranslateModule } from '@ngx-translate/core';
import { FavoriteModalComponent } from './favorite-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconModule } from '../icon/icon.module';
import { InputFieldModule } from '../input-field/input-field.module';

export * from './favorite-modal.component';

/**
 * @ignore
 */
@NgModule({
  declarations: [
    FavoriteModalComponent
  ],
  imports: [
    CommonModule,
    InputFieldModule,
    NgSelectModule,
    LaddaModule,
    IconModule,
    TranslateModule.forChild()
  ],
  exports: [FavoriteModalComponent]
})
export class FavoriteModalModule { }



