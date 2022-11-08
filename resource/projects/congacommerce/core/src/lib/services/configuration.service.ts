import { Injectable, Inject } from '@angular/core';
import { Configuration } from '../classes/configuration.model';
import * as _ from 'lodash';
import { PlatformLocation } from '@angular/common';

declare var window: any;
let vfConfig = window.sv || {};

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    private _config: Configuration;
    constructor(@Inject('configuration') protected config: Configuration, private platformLocation: PlatformLocation) {
        this._config = Object.assign({}, new Configuration(), config);
    }

    proxyEndpoint() {
        const endpoint = this.endpoint();
        const proxy = this.get('proxy');
        if (proxy && proxy.endsWith('/'))
            return this.get('proxy') + endpoint;
        else
            return ((proxy != null) ? proxy + '/' : '') + endpoint;
    }
    endpoint() {
        return this.get('endpoint') != null && this.get('endpoint') !== 'null' ? this.get('endpoint') : `https://${window.location.hostname}${window.location.pathname}`;
    }

    resourceLocation() {
        let location = `${window.location.protocol}//${window.location.host}${_.get(vfConfig, 'resource', this.platformLocation.getBaseHrefFromDOM())}`;
        return !_.endsWith(location, '/') ? `${location}/` : location;
    }

    get(key, defaultValue?: any) {
        return _.get(this._config, key, defaultValue);
    }

    platform() {
        return _.get(this._config, 'type', 'Salesforce');
    }
}
