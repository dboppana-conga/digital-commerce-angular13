import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ImagePipe, FileSizePipe, TruncatePipe } from './pipes/index';
import { RavenErrorHandler } from './services/raven.service';
import { TranslateModule } from '@ngx-translate/core';

export * from './services/index';
export * from './classes/index';
export * from './pipes/index';
export * from './interfaces/index';
export * from './decorators/index';
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule.forChild()
    ],
    declarations: [
        ImagePipe, FileSizePipe, TruncatePipe
    ],
    exports: [
        ImagePipe, FileSizePipe, TruncatePipe, TranslateModule
    ],
    providers: [
        { provide: ErrorHandler, useClass: RavenErrorHandler }
    ]
})
export class ApttusModule {
}
