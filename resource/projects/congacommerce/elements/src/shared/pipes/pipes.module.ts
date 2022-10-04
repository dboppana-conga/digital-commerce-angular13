import { NgModule } from '@angular/core';
import { SplitPascalCasePipe } from './split-pascal-case.pipe';

export * from '../pipes/split-pascal-case.pipe';

/**
 * @ignore
 */
@NgModule({
    imports: [],
    declarations: [
        SplitPascalCasePipe
    ],
    exports: [
        SplitPascalCasePipe
    ]
})
export class PipesModule { }