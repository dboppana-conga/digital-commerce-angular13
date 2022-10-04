import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Params } from '@angular/router';
import { Observable, throwError, combineLatest, of } from 'rxjs';
import { UserService } from '../../modules/crm/services/user.service';
import * as _ from 'lodash';
import { tap, map, switchMap, catchError, take } from 'rxjs/operators';
import { StorefrontService, Storefront } from '../../modules/store/index';

/**
 * <strong>This guard is a work in progress.</strong>
 * When user tries to hit the application with the URl directly the guard checks if the user is loggedIn user 
 * or not. If user is not loggedIn then it redirects to login screen, otherwise it redirects to the page which user was trying to load.
 */
@Injectable({
    providedIn: 'root',
})
export class LoginGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router, private storefrontService: StorefrontService, private ngZone: NgZone) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {

        return this.userService.isLoggedIn()
            .pipe(
                switchMap(loggedIn => {
                    // If not logged in, redirect to login without error
                    if(!loggedIn)
                        return this.redirectToLogin(route, state.url);
                    else
                        return this.storefrontService.getStorefront();
                }),
                switchMap((storefront: boolean | Storefront) => {
                    if(!storefront)
                        return this.redirectToLogin(route);
                    else
                        return of(true);
                }),
                catchError(e => {
                    // If there is an error logout and redirect to login page.
                    return this.redirectToLogin(route, null, e);
                })
            );
    }
    /**
     * Redirects users to the login page after logging them out and displays an optional error message.
     * @param route The route snapshot.
     * @param error The optional error message to show.
     * @ignore
     */
    private redirectToLogin(route: ActivatedRouteSnapshot, redirectUrl?: string, error?: string): Observable<boolean> {
        return this.userService.logout()
            .pipe(
                map(() => {
                    let myRoute;
                    let params: Params;
                    if (!_.isNil(_.get(route, `data.redirectUrl`)))
                        myRoute = `${_.get(route, 'data.redirectUrl')}`;
                    else
                        myRoute = '/u/login';
                    if (!_.isNil(error)) {
                        params = {errorMessage: error};
                        _.assign(params, route.queryParams);
                    }
                    if (!_.isNil(redirectUrl)) {
                        params = {redirectUrl: window.location.href};
                    }
                    this.ngZone.run(() => {
                        this.router.navigate([myRoute], {
                            queryParams: params ? params : route.queryParams,
                            fragment: route.fragment
                        });
                    });
                    return false;
                })
            );
    }
}

/**
 * <strong>This guard is a work in progress.</strong>
 * This guard is for guest users, When user tries to hit the application with the URl directly the guard checks if the user is guest user 
 * or not.Then it redirects to  the page which user was trying to load.
 */
@Injectable({
    providedIn: 'root',
})
export class GuestGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router, private ngZone: NgZone) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.userService.isLoggedIn()
            .pipe(
                map(loggedIn => {
                    if (!_.isNil(_.get(route, `data.redirectUrl`)) && loggedIn) {
                        this.ngZone.run(() => {
                            this.router.navigate([`${_.get(route, 'data.redirectUrl')}`], {
                                queryParams: route.queryParams,
                                fragment: route.fragment
                            });
                        });
                    }
                    return !loggedIn;
                }),
                catchError(e => {
                    return throwError(e);
                })
            );
    }
}