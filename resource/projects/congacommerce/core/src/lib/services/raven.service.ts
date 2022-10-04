import { ErrorHandler, Injectable } from '@angular/core';
import * as Raven from 'raven-js';
import * as _ from 'lodash';
import { ConfigurationService } from './configuration.service';
import { CacheService } from './cache.service';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RavenErrorHandler extends ErrorHandler implements ErrorHandler {
    errorDebounce: boolean = false;
    debounceTime: number = 10000;

    constructor(private configurationService: ConfigurationService, private cacheService: CacheService) {
        super();
        if (this.configurationService.get('sentryDsn')) {
            if (this.configurationService.get('enableErrorLogging') || this.configurationService.get('enableErrorReporting')) {
                const raven = _.bind(Raven.config, Raven);
                raven(this.configurationService.get('sentryDsn')).install();
                this.embedStyle();
            }
        }
    }
    handleError(err: any): void {
        if (this.configurationService.get('enableErrorPrinting') !== false)
            super.handleError(err);

        if (!this.errorDebounce && this.configurationService.get('sentryDsn')) {
            this.errorDebounce = true;
            if (this.configurationService.get('enableErrorLogging') !== false) {
                const capture = _.bind(Raven.captureException, Raven);
                capture(err);
            }
            if (this.configurationService.get('enableErrorReporting')) {
                const report = _.bind(Raven.showReportDialog, Raven);
                report({
                    eventId: event,
                    dsn: this.configurationService.get('sentryDsn')
                });
            }
            setTimeout(() => this.errorDebounce = false, this.debounceTime);
        }
    }

    embedStyle() {
        const css = '.sentry-error-embed{position: absolute; left: 25%; top: 15%;}',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        // To DO:
        // if (style['styleSheet']) {
        //     style['styleSheet'].cssText = css;
        // } else {
            style.appendChild(document.createTextNode(css));
       // }

        head.appendChild(style);
    }
}