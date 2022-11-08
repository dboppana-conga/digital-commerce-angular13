import { UserService } from "../services/user.service";
import { TestBed } from "@angular/core/testing";
import { ApttusModule, ConfigurationService, ApiService, AObject } from "@congacommerce/core";
import { CommerceModule } from "../../../ecommerce.module";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { Users, User1, UserLocale, User2, User3 } from './mock/index';
import { TranslateModule } from "@ngx-translate/core";
import { take } from 'rxjs/operators';
import { User } from "./../classes/user.model";


describe('UserService', () => {
    let userService: UserService, httpClient: HttpClient
    let httpMock: HttpTestingController;
    let configurationService: ConfigurationService;
    let apiServiceSpy = jasmine.createSpyObj<ApiService>(['refreshToken', 'put', 'get', 'post', 'delete'])
    apiServiceSpy.refreshToken.and.returnValue(of(null));
    let aObjectSpy = jasmine.createSpyObj<AObject>(['strip'])
    aObjectSpy.strip.and.returnValue(null);


    beforeEach(() => {

        let store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            }
        };
        spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);

        TestBed.configureTestingModule({
            imports: [ApttusModule, CommerceModule.forRoot({}),
                TranslateModule.forRoot(), HttpClientTestingModule],
            providers: [UserService,
                { provide: ApiService, useValue: apiServiceSpy },
                { provide: AObject, useValue: aObjectSpy }]
        });
        userService = TestBed.inject(UserService);
        configurationService = TestBed.inject(ConfigurationService);
        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);

    });
    it('publish() to update the state of BehaviorSubject', () => {
        let user = Users;
        userService['state'].next(user);
        userService['state'].pipe(take(1)).subscribe(r => {
            expect(r).toEqual(user)
        })
        userService.publish(User1);
        userService['state'].pipe(take(1)).subscribe(r => {
            expect(r).toEqual(User1)
        })
    });

    it('active() returns the active User', () => {
        let user: any;
        userService['state'].next(Users);
        userService.active().pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual(Users);
    });

    it('getCurrentUser() to fetch current active user', () => {
        let user: any;
        spyOn(userService, 'active').and.returnValue(of(User1));
        userService.getCurrentUser().pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual(User1);
    });

    it('me() for retrieving the current user record', () => {
        let user: any;
        spyOn(userService, 'getCurrentUser').and.returnValue(of(User2));
        userService.me().pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toBeInstanceOf(User)
        expect(user).toEqual(User2);
    });

    it('isGuest() for determining if the current user is a guest user. returns true if guest user else false', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(User1));
        userService.isGuest().pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual(true);
    });

    it('isGuest() for determining if the current user is a guest user. returns false if its not a guest user', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(User2));
        userService.isGuest().pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual(false);
    });

    it('getLanguage when user.Language is set from me method', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(Users));
        spyOn(configurationService, 'get').and.returnValue('en_US')
        userService.getLanguage().pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual('en_US');
    });

    it('getLanguage when user.Language is set from configurationservice.get method', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(User3));
        spyOn(configurationService, 'get').and.returnValue('enUS')
        userService.getLanguage().pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual('enUS');
    });

    it('getLanguage when user.Language is not set in the user object and we get from "defaultlanguage"', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(User3));
        spyOn(userService, 'getBrowserLocale').and.returnValue('User3');
        spyOn(configurationService, 'get').and.returnValue(null)
        userService.getLanguage().pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual('User3');
    });

    it('getBrowserLocale Retrieves the browser locale for the current user when set to true, will replace dash - with an underscore _', () => {
        let user: any;
        spyOn(configurationService, 'get').and.returnValue('en-US')
        user = userService.getBrowserLocale(true)
        expect(user).toEqual('en_US');
    });

    it('getBrowserLocale getBrowserLocale Retrieves the browser locale for the current user when set to false, return with dash -', () => {
        let user: any;
        spyOn(configurationService, 'get').and.returnValue('en-US')
        user = userService.getBrowserLocale(false)
        expect(user).toEqual('en-US');
    });

    it('getCurrentUserLocale Retrieves the current user locale, when set to false, returns with dash -', () => {
        let user: any;
        spyOn(userService, 'getLocale').and.returnValue(of('en_US'));
        userService.getCurrentUserLocale(false).pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual('en-US');
    });

    it('getCurrentUserLocale Retrieves the current user locale, when set to true, will replace dash - with an underscore _', () => {
        let user: any;
        spyOn(userService, 'getLocale').and.returnValue(of('en-US'));
        userService.getCurrentUserLocale(true).pipe(take(1)).subscribe(c => {
            user = c;
        })
        expect(user).toEqual('en_US');
    });

    xit('getLocale returns the local of the user', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(Users));
        spyOn(configurationService, 'get').and.returnValue('en-US')
        userService.getLocale().pipe(take(1)).subscribe(c => {
            user = c
        })
        expect(user).toEqual('en-US');
    });

    it('getLocale returns the local of the user, when Locale is not available in userobject we get it from configurationservice.get method', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(User3));
        spyOn(configurationService, 'get').and.returnValue('enUS')
        userService.getLocale().pipe(take(1)).subscribe(c => {
            user = c
        })
        expect(user).toEqual('enUS');
    });

    it('getLocale returns the local of the user, when Locale is not available in userobject we get it from defaultLanguage', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(User3));
        spyOn(userService, 'getBrowserLocale').and.returnValue('User3');
        spyOn(configurationService, 'get').and.returnValue(null)
        userService.getLocale().pipe(take(1)).subscribe(c => {
            user = c
        })
        expect(user).toEqual('User3');
    });

    it('initializeGuestUser Method is used to create a guest user record prior to  defaults ', () => {
        let user: any;
        spyOn(userService, 'getBrowserLocale').and.returnValue('enUS');
        spyOn(configurationService, 'get').and.returnValue('US')
        userService.initializeGuestUser().pipe(take(1)).subscribe(c => {
            user = c
        })
        expect(user.Alias).toEqual('guest'); expect(user.CountryCode).toEqual('US'); expect(user.Language).toEqual('enUS'); expect(user.EmailEncodingKey).toEqual('UTF-8');
    });

    it('setAlias generates an alias for the current record based on the first name and last name', () => {
        userService.setAlias(Users);
        expect(Users.Alias).toBe('tuser');
    });

    it('setAlias generates sets alias for the current record as "" ', () => {
        userService.setAlias(User3);
        expect(User3.Alias).toEqual('');
    });

    it('setTimezone sets the timezonesidkey for a given user record', () => {
        spyOn(configurationService, 'get').and.returnValue('America/New_York')
        userService.setTimezone(Users);
        expect(Users.TimeZoneSidKey).toBe('America/New_York');
    });

    it('setUserDefaults sets the defaults like language, locale & email encoding type for user', () => {
        userService.setUserDefaults(Users);
        expect(Users.Language).toBe('en_US');
        expect(Users.LocaleSidKey).toBe('en_US');
        expect(Users.EmailEncodingKey).toBe('UTF-8');
    });

    it('setLocale with commit set as true', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(User1));
        spyOn(userService, 'update').and.returnValue(of([User1]));
        userService.setLocale('en_US', true).pipe(take(1)).subscribe(res => {
            user = res;
        })
        expect(user).toBeNull();
    });

    it('setLocale with commit set as false', () => {
        let user: any;
        spyOn(userService, 'me').and.returnValue(of(User1));
        spyOn(userService, 'update').and.returnValue(of([User1]));
        userService.setLocale('en_US', false).pipe(take(1)).subscribe(res => {
            user = res;
        })
        expect(user).toBeNull();
    });

    it('refresh', () => {
        spyOn(userService, 'publish');
        localStorage.setItem('userId', 'sample123');
        apiServiceSpy.get.and.returnValue(of(Users))
        userService.refresh();
        expect(localStorage.getItem('userId')).toEqual('12345')
        expect(userService.publish).toHaveBeenCalled()
        expect(apiServiceSpy.get).toHaveBeenCalled()
        expect(apiServiceSpy.refreshToken).toHaveBeenCalled()
    });

    it('register', () => {
        let value:any;
        spyOn(userService, 'setAlias');
        spyOn(userService, 'setTimezone');
        spyOn(userService, 'setUserDefaults');
        apiServiceSpy.post.and.returnValue(of(Users))
        value= userService.register(Users)
        value.pipe(take(1)).subscribe(c=>{
            expect(c.Id).toEqual('12345')
        })
        expect(userService.setAlias).toHaveBeenCalled()
        expect(userService.setTimezone).toHaveBeenCalled()
        expect(userService.setUserDefaults).toHaveBeenCalled()
        expect(apiServiceSpy.post).toHaveBeenCalled()
    });

    it('sendPasswordResetEmail', () => {
        let value:any;
        apiServiceSpy.post.and.returnValue(of(Users))
        value= userService.sendPasswordResetEmail('Users')
        value.pipe(take(1)).subscribe(c=>{
            expect(c.Id).toEqual('12345')
        })
    });

    it('setPassword(', () => {
        let value:any;
        apiServiceSpy.post.and.returnValue(of(Users))
        value= userService.setPassword('Users')
        value.pipe(take(1)).subscribe(c=>{
            expect(c.Id).toEqual('12345')
        })
    });

})