import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService, PlatformConstants } from '@congacommerce/core';
import { UserService } from '../../modules/crm/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, take } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
/**
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class AppLoader {
    constructor(
        private translationService: TranslateService,
        private userService: UserService,
        private httpClient: HttpClient,
        private configService: ConfigurationService) { }

    init() {
        const defaultLang = this.userService.getBrowserLocale(true),
            cachedLang = localStorage.getItem(PlatformConstants.PREFERRED_LANGUAGE),
            cachedTranslations = new Map<string, any>(Object.entries(JSON.parse(localStorage.getItem(PlatformConstants.TRANSLATION_LABELS)) || {}));

        this.httpClient.get(`${this.configService.resourceLocation()}assets/i18n/${defaultLang}.json`)
            .pipe(
                switchMap(translations => {
                    this.translationService.setTranslation(defaultLang, translations);
                    cachedTranslations.has(cachedLang) && this.translationService.setTranslation(cachedLang, cachedTranslations.get(cachedLang));
                    this.translationService.setDefaultLang(defaultLang);
                    this.translationService.use(cachedLang || defaultLang);
                    return this.userService.getLocale();
                }),
                take(1),
                switchMap(locale => combineLatest([this.userService.getLanguage(), this.translationService.currentLoader.getTranslation(locale)]))
            )
            .subscribe(([lang, translations]) => {
                this.translationService.setTranslation(lang, translations);
                this.translationService.use(lang);
                const translationsMap = new Map<string, any>(Object.entries(JSON.parse(localStorage.getItem(PlatformConstants.TRANSLATION_LABELS)) || {}));
                translationsMap.set(lang, translations);
                localStorage.setItem(PlatformConstants.PREFERRED_LANGUAGE, lang);
                localStorage.setItem(PlatformConstants.TRANSLATION_LABELS, JSON.stringify(Array.from(translationsMap).reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {})));
            });
    }
}
