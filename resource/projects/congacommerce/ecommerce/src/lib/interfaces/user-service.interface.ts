import { User } from '../modules/crm/classes/user.model';
import { Observable } from 'rxjs';

/** @ignore */
export interface IUserService{
    login(username: string, password: string): Observable<void>;
    logout(): Observable<void>;
    isLoggedIn(): Observable<boolean>;
}