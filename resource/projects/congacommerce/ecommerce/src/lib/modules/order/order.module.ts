import { NgModule } from '@angular/core';
import { CommerceModule } from '../../ecommerce.module';
import { TranslateModule } from '@ngx-translate/core';

export * from './services/index';
export * from './classes/index';
export * from './guard/index';

/**
 * @ignore
 */
@NgModule({
    imports: [CommerceModule, TranslateModule.forChild()],
    declarations: [],
    providers: [],
    exports: []
})
export class OrderModule { }
