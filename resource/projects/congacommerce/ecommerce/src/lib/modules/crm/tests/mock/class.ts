import { AObjectService } from "@congacommerce/core";
import { Observable, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { AccountLocation} from "../../classes/index";
import { AccountService } from "../../services";
import { accountLocation } from "./data";

export class AccountLocationTest extends AccountLocation {}


export class MockAccountLocationService extends AObjectService {
    accountService: AccountService;

    saveLocationToAccount(location: AccountLocation): Observable<Array<AccountLocation>>{
        return of(accountLocation);
    }
}