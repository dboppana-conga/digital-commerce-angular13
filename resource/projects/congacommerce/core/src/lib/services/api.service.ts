import { Injectable, EventEmitter, SecurityContext } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { from, Observable, of, throwError, timer } from 'rxjs';
import { get, startsWith, isNil, set, split, last , map as _map} from 'lodash';
import {
  map,
  switchMap,
  tap,
  catchError,
  mergeMap,
  finalize,
  retryWhen
} from 'rxjs/operators';
import { ClassType } from 'class-transformer/ClassTransformer';
import { plainToClass } from 'class-transformer';
import { PlatformConstants } from '../classes';
import { ConfigurationService } from './configuration.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  onRefresh: EventEmitter<string> = new EventEmitter<string>();
  apiVersion: string = '1';

  constructor(
    protected configService: ConfigurationService,
    protected httpClient: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  callout(method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', endpoint: string, payload?: any, responseType: 'arraybuffer' | 'blob' | 'json' = 'json'): Observable<any> {
    const accountId = localStorage.getItem('account');
    const userId = localStorage.getItem('userId');
    const priceListId = localStorage.getItem('pricelistId');
    const isRevoke = endpoint.indexOf('/users/token') >= 0 && method === 'DELETE';

    let headers = new HttpHeaders({
      'OrganizationId': this.configService.get('organizationId'),
      'StorefrontId': this.configService.get('storefrontId')
    });

    if (!isNil(accountId)) headers = headers.set('AccountId', accountId);

    if (!isNil(userId)) headers = headers.set('UserId', userId);

    if (!isNil(priceListId)) headers = headers.set('PriceListId', priceListId);

    return this.httpClient.request(method, endpoint, { body: payload, responseType: responseType, headers: headers, observe: 'response' });
  }

  get(location: string, type?: ClassType<any>, ignoreDecorators: boolean = true) {
    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.URL, location);
    return this.getEndpoint(sanitizedUrl)
      .pipe(
        switchMap(url => this.callout('GET', url)),
        retryWhen(
          genericRetryStrategy({
            scalingDuration: 500,
            maxRetryAttempts: 1,
            excludedStatusCodes: [500],
            onError: this.onError()
          })
        ),
        catchError(error => {
            const errorMsg = this.getServerErrorMessage(error);
            return throwError(errorMsg);
        }),
        map(res => this.mapResult(res)),
        map(data => (!isNil(type) ? plainToClass(type, data, { ignoreDecorators: ignoreDecorators }) : data))
      );
  }

  post(location: string, payload: any = {}, type?: ClassType<any>, retry: boolean = true, ignoreDecorators: boolean = true) {
    let post$ = this.getEndpoint(location).pipe(
      switchMap(url => this.callout('POST', url, payload))
    );

    if (retry)
      post$ = post$.pipe(
        retryWhen(
          genericRetryStrategy({
            scalingDuration: 500,
            maxRetryAttempts: 1,
            excludedStatusCodes: [500],
            onError: this.onError()
          })
        )
      );

    return post$.pipe(
      catchError(error => {
        const errorMsg = this.getServerErrorMessage(error);
        return throwError(errorMsg);
    }),
      map(res => this.mapResult(res)),
      map(data => (!isNil(type) ? plainToClass(type, data, { ignoreDecorators: ignoreDecorators }) : data))
    );
  }

  put(location: string, payload: any = {}, type?: ClassType<any>, ignoreDecorators: boolean = true) {
    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.URL, location);
    return this.getEndpoint(sanitizedUrl)
      .pipe(
        switchMap(url => this.callout('PUT', url, payload)),
        catchError(error => {
          const errorMsg = this.getServerErrorMessage(error);
          return throwError(errorMsg);
      }),
        map(res => this.mapResult(res)),
        map(data => (!isNil(type) ? plainToClass(type, data, { ignoreDecorators: ignoreDecorators }) : data))
      );
  }

  patch(location: string, payload: any = {}, type?: ClassType<any>, ignoreDecorators: boolean = true) {
    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.URL, location);
    return this.getEndpoint(sanitizedUrl)
      .pipe(
        switchMap(url => this.callout('PATCH', url, payload)),
        catchError(error => {
          const errorMsg = this.getServerErrorMessage(error);
          return throwError(errorMsg);
      }),
        map(res => this.mapResult(res)),
        map(data => (!isNil(type) ? plainToClass(type, data, { ignoreDecorators: ignoreDecorators }) : data))
      );
  }

  delete(location: string, payload: any = {}, type?: ClassType<any>, ignoreDecorators: boolean = true) {
    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.URL, location);
    return this.getEndpoint(sanitizedUrl)
      .pipe(
        switchMap(url => this.callout('DELETE', url, payload)),
        catchError(error => {
          const errorMsg = this.getServerErrorMessage(error);
          return throwError(errorMsg);
      }),
        map(res => this.mapResult(res)),
        map(data => (!isNil(type) ? plainToClass(type, data, { ignoreDecorators: ignoreDecorators }) : data))
      );
  }

  refreshToken(username?: string, password?: string): Observable<any> {
    if (localStorage.getItem(PlatformConstants.ACCESS_TOKEN) && arguments.length === 0) {
      return of(null);
    }
    let attempts = 0;
    return this.encryptCredentials(username, password).pipe(
      switchMap((credentials: string) =>
        // TODO: Integrate with RLP API
        // this.post(`/users/token`, credentials, null, false)
        of(null)
      ),
      retryWhen(errors =>
        errors.pipe(
          map(error => {
            attempts += 1;
            if (get(error, 'status') === 400 || attempts >= 2)
              throw error;
            else {
              localStorage.removeItem(PlatformConstants.ACCESS_TOKEN);
              localStorage.removeItem(PlatformConstants.USER_INFO);
              return error;
            }
          })
        )
      ),
      tap(creds => {
        if (creds && !isNil(get(creds, 'accessToken'))) {
          localStorage.setItem(
            PlatformConstants.ACCESS_TOKEN,
            get(creds, 'accessToken')
          );
          this.onRefresh.emit(get(creds, 'accessToken'));
          if (!isNil(get(creds, 'LoginURL'))) {
            const authenticationUrl = decodeURIComponent(get(creds, 'LoginURL'));
            let url = authenticationUrl.replace('#URL#', encodeURIComponent(window.location.toString()));
            url = `${this.configService.endpoint()}/secur/logout.jsp?retUrl=${encodeURIComponent(url)}`;
            setTimeout(() => window.location.replace(url));
          }
        }
      })
    );
  }

  revokeToken(): Observable<boolean> {
    const token = localStorage.getItem(PlatformConstants.ACCESS_TOKEN);
    if (isNil(token))
      return of(false);
    else {
      return this.delete(`/users/token/${token}`)
        .pipe(
          catchError(() => of(true)),
          tap(success => {
            if (success)
              localStorage.removeItem(PlatformConstants.ACCESS_TOKEN);
          })
        );
    }
  }


  private encryptCredentials(
    username?: string,
    password?: string
  ): Observable<string> {
    if (isNil(username) || isNil(password)) return of(null);
    else {
      return this.getAuthKey().pipe(
        switchMap(key => {
          // Initialization Vector for CBC algorithm
          const iv = window.crypto.getRandomValues(new Uint8Array(16));

          // Raw customer credential data
          const clientCredentials = {
            key: username,
            value: password
          };

          // Supporting function to convert the hex key into an ArrayBuffer object
          const hexToArrayBuffer = (hex: string) => {
            const typedArray = new Uint8Array(
              _map(hex.match(/[\da-f]{2}/gi), (h) => {
                return parseInt(h, 16);
              })
            );
            return typedArray.buffer;
          };

          // Supporting function converts a string into an ArrayBuffer
          const getUtf8Bytes = (str: string) =>
            new Uint8Array(
              [...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))
            );

          return from(
            crypto.subtle
              .importKey(
                'raw',
                hexToArrayBuffer(key),
                {
                  // this is the algorithm options
                  name: 'AES-CBC',
                  length: 256
                },
                false, // whether the key is extractable (i.e. can be used in exportKey)
                ['encrypt', 'decrypt'] // key can be used for encryption and decryption
              )
              .then(keyImport => {
                return crypto.subtle.encrypt(
                  {
                    name: 'AES-CBC',
                    // Don't re-use initialization vectors!
                    // Always generate a new iv every time your encrypt!
                    iv: iv,
                    length: 256
                  },
                  keyImport, // CryptoKey object generated from hex key
                  getUtf8Bytes(JSON.stringify(clientCredentials)) // ArrayBuffer of client credentials
                );
              })
              .then(encrypted => {
                // The result from the promise will contain encrypted customer credentials.
                // In order to decrypt the request, the IV used must be prepended to the body
                const requestData = btoa(
                  String.fromCharCode(...iv) +
                  String.fromCharCode(...new Uint8Array(encrypted))
                );
                return requestData;
              })
          ) as Observable<string>;
        })
      );
    }
  }

  public mapResult(result: any): any {
    const data = get(result.body, 'Data') ? get(result.body, 'Data') : result.body;
    const count = last(split(result.headers.get('content-range'), '/'));
    if (count) set(data, 'TotalCount', count);
    if (get(result.body, 'RecordCount')) set(data, 'total_records', get(result.body, 'RecordCount'))// TO DO:
    return data;
  }

  public getEndpoint(location: string): Observable<string> {
    location = this.sanitizer.sanitize(SecurityContext.URL, location) as string;
    if (!startsWith(location, '/')) location = '/' + location;
    const endpoint = `${this.configService.endpoint()}/api${location}`;
    return of(endpoint);
  }

  private getAuthKey(): Observable<string> {
    return this.get('/users/key');
  }

  private onError(): Observable<any> {
    return this.revokeToken()
      .pipe(
        switchMap(() => this.refreshToken())
      )
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 404: {
            return `Not Found: ${error.message}`;
        }
        case 403: {
            return `Access Denied: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
        default: {
            return `Server Error: ${error.message}`;
        }

    }
  }
}

export const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = [],
  onError = of(null)
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
  onError?: Observable<any>;
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.find(e => e === error.status)
      ) {
        return throwError(error);
      } else {
        if (error.name === 'HttpErrorResponse' && onError)
          return onError.pipe(switchMap(() => timer(retryAttempt * scalingDuration)));
        else
          return timer(retryAttempt * scalingDuration);
      }
    }),
    finalize(() => console.log('Api Callout Done'))
  );
};
