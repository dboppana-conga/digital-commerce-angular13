import { TestBed } from "@angular/core/testing";
import { ApttusModule, AObjectService } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { PriceListItemService } from '../../pricing/services/price-list-item.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { ChargeType } from '../enums';
import {
    productOptionComponent, pricelist, Users, storefront1, storefront, conversion1, conversion2, productValue, productValue1, productValue2
} from "./dataManager";

describe('PriceListItemService', () => {
    let service: PriceListItemService;
    let httpMock: HttpTestingController;
    let aOSpy = jasmine.createSpyObj<AObjectService>(['describe'])

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [PriceListItemService,
                { provide: AObjectService, useValue: aOSpy },
            ],

        });

        service = TestBed.inject(PriceListItemService)
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('getPriceListItemForProduct returns pricelistItem', () => {
        let value:any;
        value= PriceListItemService.getPriceListItemForProduct(productValue,ChargeType.StandardPrice)
        expect(value).toEqual(productValue.PriceLists[1])
    });

    it('getPriceListItemForProduct returns pricelistItem', () => {
        let value:any;
        value= PriceListItemService.getPriceListItemForProduct(productValue1)
        expect(value).toEqual(productValue1.PriceLists[0]);
    });

    it('getPriceListItemForProduct returns pricelistItem', () => {
        let value:any;
        value= PriceListItemService.getPriceListItemForProduct(productValue2)
        expect(value).toEqual(productValue2.PriceLists[0]);
    });

    
});
