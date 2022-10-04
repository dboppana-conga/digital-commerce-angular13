import { NgModule } from '@angular/core';
import { AutoFocusDirective } from './auto-focus.directive';

export * from '../directives/auto-focus.directive';
/**
 * @ignore
 */
@NgModule({
    imports:[],
    declarations: [
        AutoFocusDirective
    ],
    exports: [
        AutoFocusDirective
    ]
})
export class DirectivesModule {}