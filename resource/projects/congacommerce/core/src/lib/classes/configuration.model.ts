export class Configuration {
    production?: boolean;
    endpoint: string='';
    authenticationEndpoint?: string = '';
    organizationId?: string;
    defaultImageSrc: string='';
    defaultCountry?: string = 'US';
    defaultLanguage?: string = 'en-US';
    defaultCurrency?: string = 'USD';
    productIdentifier?: string = 'Id';
    proxy?: string;
    sentryDsn?: string;
    storefrontId: string | null = null;
    hashRouting?: boolean = false;
    clientId: string | null = null;
    authority: string | null= null;
}
export interface Provider {
    provide: any;
    useClass?: any;
    useValue?: any;
}

export enum PlatformConstants{
    KEY = 'credentials',
    ACCESS_TOKEN = 'access_token',
    REFRESH_TOKEN = 'refresh_token',
    USER_INFO = 'user_info',
    SV = 'u/Gu5posvwDsXUnV5Zaq4g==',
    IV = '5D9r9ZVzEYYgha93/aUK2w==',
    PREFERRED_LANGUAGE = 'preferred_language',
    TRANSLATION_LABELS = 'translation_labels'
}
