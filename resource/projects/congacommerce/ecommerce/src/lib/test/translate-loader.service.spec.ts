import { TestBed } from "@angular/core/testing";
import { AObject, ApttusModule } from "@congacommerce/core";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { of } from "rxjs";
import { TranslatorLoaderService } from "../services";
import { CommerceModule } from "../ecommerce.module";
import { TRANSLATED_DATA, TRANSLATION_EN_US } from "./data-manager";

describe('TranslatorLoaderService', () => {
    let service: TranslatorLoaderService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [TranslatorLoaderService],
        });
        service = TestBed.inject(TranslatorLoaderService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('getTranslation() should return translation based on passed locale', () => {
        spyOn(service, 'getTranslation').withArgs('en_Us').and.returnValue(of(TRANSLATION_EN_US));
        service.getTranslation('en_Us').pipe(take(1)).subscribe((res) => {
            expect(res).toEqual(TRANSLATION_EN_US);
            expect(res).toContain(jasmine.objectContaining(TRANSLATED_DATA));
            expect(Object.keys(res[0])).toContain('ERROR');
        });
    });

})