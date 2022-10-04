import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class AuthProviderService {

  constructor(private httpClient: HttpClient) { }

  getMe(){
    return this.httpClient.get('https://graph.microsoft.com/v1.0/me');
  }

  revoke(){
    // return this.getMe().pipe(
    //     switchMap(data => this.platformService.post('revoke', { provider: 'Dynamics', remoteIdentifier: _.get(data, 'id')}, 'AuthDispatcher', false, 0, ''))
    // );
  }
}
