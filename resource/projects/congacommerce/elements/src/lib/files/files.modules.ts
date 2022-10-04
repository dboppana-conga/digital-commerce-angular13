import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApttusModule } from '@congacommerce/core';
import { FilesComponent } from './files.component';
export * from './files.component';

/**
 * @ignore
 */
@NgModule({
  imports: [
    CommonModule,
    ApttusModule,
    TranslateModule.forChild()
  ],
  declarations: [FilesComponent],
  exports: [FilesComponent]
})
export class FilesModule { }
