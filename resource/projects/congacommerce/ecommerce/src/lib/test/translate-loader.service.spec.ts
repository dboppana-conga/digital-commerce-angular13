import { TestBed } from "@angular/core/testing";
import { ApttusModule } from "@congacommerce/core";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { TranslatorLoaderService } from "../services";
import { CommerceModule } from "../ecommerce.module";
import { TRANSLATED_DATA, TRANSLATION_EN_US } from "./data-manager";

describe('TranslatorLoaderService', () => {
    let service: TranslatorLoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [TranslatorLoaderService],
        });
        service = TestBed.inject(TranslatorLoaderService);
    });

    it('getTranslationModule() should not return translation module name', () => {
        service['translationModule'] = null;
        const result = service.getTranslationModule();
        expect(result).toBeNull();
    });

    it('getTranslationModule() should return translation module name', () => {
        service['translationModule'] = 'Digital Commerce';
        const result = service.getTranslationModule();
        expect(result).toEqual('Digital Commerce');
    });

    it('setTranslationModule() should set translation module name', () => {
        const result = service.setTranslationModule('Digital Commerce');
        expect(service['translationModule']).toEqual('Digital Commerce');
    });

})