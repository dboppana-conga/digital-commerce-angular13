import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { ProductDrawerService } from './product-drawer.service';


describe('ProductDrawerService', () => {
    let service: ProductDrawerService;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [ProductDrawerService
            ]
        });
        service = TestBed.inject(ProductDrawerService);
    });

    it('service to have been created', () => {
        expect(service).toBeTruthy()
    });

    it('isDrawerOpen returns true when state returns true', () => {
        let result:any;
        service['_drawerShowing'].next(false);
        result=service.isDrawerOpen();
        result.pipe(take(1)).subscribe(c=>{
            expect(c).toBeFalsy();
        })
        service['_drawerShowing'].next(true);
        result=service.isDrawerOpen();
        result.pipe(take(1)).subscribe(c=>{
            expect(c).toBeTruthy();
        })
    });

    it('openDrawer() sets the state as true', () => {
        service['_drawerShowing'].next(false);
        expect(service['_drawerShowing'].value).toBeFalsy()
        service.openDrawer();
        expect(service['_drawerShowing'].value).toBeTruthy()
    });

    it('closeDrawer() sets the state as false', () => {
        service['_drawerShowing'].next(true);
        expect(service['_drawerShowing'].value).toBeTruthy()
        service.closeDrawer();
        expect(service['_drawerShowing'].value).toBeFalsy()
        
    });

    it('toggleDrawer() when the state is true calls closedrawer; else opendrawer', () => {
        service['_drawerShowing'].next(true);
        spyOn(service,'closeDrawer');
        service.toggleDrawer();
        expect(service.closeDrawer).toHaveBeenCalledTimes(1)
        
    });

    it('toggleDrawer() when the state is true calls closedrawer; else opendrawer', () => {
        service['_drawerShowing'].next(false);
        spyOn(service,'openDrawer');
        service.toggleDrawer();
        expect(service.openDrawer).toHaveBeenCalledTimes(1)
        
    });
});
