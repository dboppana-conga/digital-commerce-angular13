import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export * from './services/index';
export * from './classes/index';

/**
 * @ignore
 */
@NgModule({
    imports: [CommonModule],
    declarations: [],
    providers: [],
    exports: []
})
export class DocGenModule { }