import { Configuration } from '@congacommerce/core';

export const environment: Configuration = {
  production: false,
  defaultImageSrc: 'https://loremflickr.com/320/240/hardware',
  defaultCountry: 'US',
  defaultLanguage: 'en-US',
  defaultCurrency: 'USD',
  productIdentifier: 'Id',
  hashRouting: true,
  endpoint: 'https://rlp-dev.congacloud.io',
  storefrontId: 'a8407757-18d8-45de-951a-b629d82742db',
  clientId: 'rlp-dev-dc-spa',
  authority: 'https://login.congacloud.io/int/api/v1/auth'
};