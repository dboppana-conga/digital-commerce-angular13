import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ApiService } from '../services/api.service';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class AuthProviderInterceptor implements HttpInterceptor{
    private providerName: string = 'Dynamics';
    private _accessToken: string ='123';

    constructor(private apiService: ApiService){}


   // To DO:
    private get accessToken(): Observable<string> {
        return of();
        // if (!_.isNil(this._accessToken))
        //     return of(this._accessToken);
        // else
        //     return this.apiService.post('getAccessToken', { provider: this.providerName }, 'AuthDispatcher', false, 0)
        //         .pipe(tap(token => this._accessToken = token));
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return this.accessToken
            .pipe(
                switchMap(accessToken => {
                    request = request.clone({headers: request.headers.set('Authorization', `Bearer ${accessToken}`)});
                    return next.handle(request)
                        .pipe(
                            catchError(e => {
                                if(e.status === 401){
                                    return this.refreshToken().pipe(
                                        switchMap(newToken => {
                                            request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${newToken}`) });
                                            return next.handle(request);
                                        })
                                    );
                                }else{
                                    return throwError(e);
                                }
                            })
                        );
                })
            );
    }
//To Do:
    private refreshToken(): Observable<string> {
        return this.apiService.post('refreshToken', { provider: this.providerName, accessToken: this._accessToken })
            .pipe(
                map(data => _.get(data, 'AccessToken'))
              //  tap(token => this._accessToken = token)
            );
    }
}