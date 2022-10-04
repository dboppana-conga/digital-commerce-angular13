import { NgModule, ModuleWithProviders, Optional, SkipSelf, APP_INITIALIZER, Provider } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApttusModule } from '@congacommerce/core';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { TranslateModule } from '@ngx-translate/core';
import { AppLoader } from './services/index';

export * from './interfaces/index';
export * from './services/index';

/**
 * @ignore
 */
export function init(service: AppLoader){
    return () => service.init();
}

/**
 * @ignore
 */
@NgModule({
    imports: [
        CommonModule,
        ApttusModule,
        FormsModule,
        LaddaModule,
        RouterModule,
        TranslateModule.forChild()
    ],
    declarations: [],
    providers: [],
    exports: [ApttusModule, CommonModule, LaddaModule, RouterModule, FormsModule, TranslateModule]
})
export class CommerceModule {
    static forRoot(config: any, providers: Array<Provider> = []): ModuleWithProviders<CommerceModule> {
        return {
            ngModule: CommerceModule,
            providers: [
                { provide: 'configuration', useValue: config },
                { provide: APP_INITIALIZER, useFactory: init, deps: [AppLoader], multi: true }
            ]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: CommerceModule) {
        if (parentModule) {
            throw new Error(
                'CommerceModule is already loaded. Import it in the AppModule only');
        }
    }
}
