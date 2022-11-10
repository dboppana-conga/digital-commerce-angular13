import { TestBed } from "@angular/core/testing";
import { ApttusModule, ApiService } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { OrderService } from "../services/index";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { orderMockData, filter, last7DaysFilter, payload, orderWithLineItems, items } from "../test/data/dataManager";
import { CartItemProductService } from '../../cart/services/cart-item-product.service';
import { of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { take } from "rxjs/operators";
import { get, size, first } from 'lodash';
import * as moment from "moment";

/** @ignore */
const _moment = moment();

describe('OrderService', () => {
    let service: OrderService;
    let httpMock: HttpTestingController;
    let apiSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'patch', 'get', 'post', 'delete'])
    apiSpy.refreshToken.and.returnValue(of(null));
    let cartItemSpy = jasmine.createSpyObj<CartItemProductService>(['addProductInfoToLineItems'])

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ApttusModule, CommerceModule.forRoot({}), TranslateModule.forRoot()],
            providers: [OrderService,
                { provide: ApiService, useValue: apiSpy },
                { provide: CartItemProductService, useValue: cartItemSpy }],
        });

        service = TestBed.inject(OrderService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('getOrder() should return order record, without lineitems, when the ID is passed', () => {
        const Id: string = '14479644-cf0a-4c15-ad04-32eaa6cddeec';
        cartItemSpy.addProductInfoToLineItems.and.returnValue(of(null));
        apiSpy.get.and.returnValue(of(orderMockData[0]))
        service.getOrder(Id).pipe(take(1)).subscribe((res) => {
            expect(res).toEqual(orderMockData[0]);
            expect(res.Id).toEqual(Id);
            expect(size(get(res, 'Items'))).toEqual(0)
            expect(res.Name).toEqual(orderMockData[0].Name);
        });
    });

    it('getOrder() should return order record, with lineitems, when the ID is passed', () => {
        const Id: string = 'f399a819-2650-444a-b741-c9fd74b60284';
        cartItemSpy.addProductInfoToLineItems.and.returnValue(of(items[0]));
        apiSpy.get.and.returnValue(of(orderWithLineItems))
        service.getOrder(Id).subscribe((res) => {
            expect(res).toEqual(orderWithLineItems);
            expect(get(get(res, 'Items'), 'Product.Name')).toBe('1410-16 Switch')
            expect(res.Name).toEqual(orderWithLineItems.Name);
        });
    });

    it('getAllOrders() should return all the orders where Account equals "Alpha Corporation"', () => {
        const filterData = filter;
        apiSpy.get.and.returnValue(of(orderMockData));
        service.getAllOrders(filterData).pipe(take(1)).subscribe((res) => {
            expect(res).toEqual(orderMockData);
            expect(res[0].Id).toEqual(orderMockData[0].Id);
            expect(res[0].SoldToAccount.Name).toEqual(orderMockData[0].SoldToAccount.Name);
        });
    })

    it('getAllOrders() should return all the orders where Account equals "Alpha Corporation"; here the filter is string', () => {
        apiSpy.get.and.returnValue(of(orderMockData));
        service.getAllOrders('filterData').pipe(take(1)).subscribe((res) => {
            expect(res).toEqual(orderMockData);
            expect(res[0].Id).toEqual(orderMockData[0].Id);
            expect(res[0].SoldToAccount.Name).toEqual(orderMockData[0].SoldToAccount.Name);
        });
    })

    it('getAllOrders() should return all the orders created in Last 7 days where Account equals "Alpha Corporation"', () => {
        const last7Days = last7DaysFilter;
        apiSpy.get.and.returnValue(of(orderMockData));
        service.getAllOrders(last7Days).pipe(take(1)).subscribe((res) => {
            const todayDate = new Date("2022-09-08");
            const testDate = new Date(res[1].CreatedDate);
            const seventhDay = new Date("2022-09-02");
            expect(res[1].SoldToAccount.Name).toEqual(orderMockData[1].SoldToAccount.Name);
            if (testDate.getTime() <= todayDate.getTime() && testDate.getTime() >= seventhDay.getTime()) {
                expect(res[1].CreatedDate).toBeTruthy()
            }
        });
    })

    it('updateOrder() should update the Order fields such as BillToAccount, ShipToAccount, Primary Contact, Title ', () => {
        const Id = '1bfdd963-63d8-40b9-8cf8-8ef3a1742fcd';
        const updatedValues = payload
        apiSpy.patch.and.returnValue(of(orderMockData));
        service.updateOrder(Id, updatedValues).subscribe((res) => {
            expect(res[2].ShipToAccount).toEqual(orderMockData[2].ShipToAccount);
            expect(res[2].BillToAccount).toEqual(orderMockData[2].BillToAccount);
            expect(res[2].PrimaryContact).toEqual(orderMockData[2].PrimaryContact);
            expect(res[2].Description).toEqual(orderMockData[2].Description);
        });
    })

    it('acceptOrder() should change the Order status to confirmed and have generated Proposal details ', () => {
        const Id = 'f399a819-2650-444a-b741-c9fd74b60284';
        apiSpy.post.and.returnValue(of(orderWithLineItems));
        service.acceptOrder(Id).subscribe((res) => {
            expect(res.Status).toEqual('Confirmed');
            expect(res.Proposal).toEqual(orderWithLineItems.Proposal)
        });
    })

    it('getOrderByQuote returns the order object ', () => {
        const Id = 'f399a819-2650-444a-b741-c9fd74b60284';
        apiSpy.get.and.returnValue(of([orderWithLineItems]));
        service.getOrderByQuote(Id).pipe(take(1)).subscribe((res) => {
            expect(res.Status).toEqual('Confirmed');
            expect(res.Proposal).toEqual(orderWithLineItems.Proposal)
        });
    })

})