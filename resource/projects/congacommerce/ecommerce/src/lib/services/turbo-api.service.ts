import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiService, ConfigurationService } from "@congacommerce/core";
import { Observable } from "rxjs";
import { StorefrontService } from "../modules/store/services/storefront.service";
import { startsWith } from 'lodash';
import { map } from "rxjs/operators";

/**
 * @ignore
 * The service is responsible for turbo API call out.
 */
@Injectable({ providedIn: 'root' })
export class TurboApiService extends ApiService {
    constructor(private storefrontService: StorefrontService, configurationService: ConfigurationService, _httpClient: HttpClient, sanitizer: DomSanitizer) {
        super(configurationService, _httpClient, sanitizer);
    }

    /**
     * The method takes the API path and returns the API path by adding the turbo endpoint.
     */
    public getEndpoint(location: string): Observable<string> {
        if (!startsWith(location, '/')) location = '/' + location;
        return this.storefrontService.getTurboEnvironment()
            .pipe(
                map(url => url + location)
            );
    }

    /** @ignore  */
    public mapResult(result): any {
        return result;
    }
}