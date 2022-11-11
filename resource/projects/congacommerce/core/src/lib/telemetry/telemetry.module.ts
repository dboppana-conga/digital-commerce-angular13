import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { get } from 'lodash';
import { ConfigurationService } from '../services/configuration.service';

const panoptos = get(window, 'panoptos') || null;
@NgModule({
  declarations: [],
  imports: [CommonModule]
})
export class TelemetryModule {
  constructor(configService: ConfigurationService) {
     panoptos.panoptos.init({
        service: {
          serviceName: 'dc',
          ServiceNamespace: 'frontEnd',
        },
        userId: localStorage.getItem('userId'),
        clientId: configService.get('clientId'),
        enableLogging: true,
        enableMetrics: false,
        enableTracing: true,
        propagateTraceHeaderCorsUrls: [
          /rlp-dev.congacloud.io/,
          /rlp-qa.congacloud.io/,
          /rlp-stg.congacloud.io/,
        ],
        collectorUrl: 'https://signals.prod-sodium.conga-panoptos.com',
        console: false,
        ignoreUrls: [/signals.prod-sodium.conga-panoptos.com/],
        useBeacon: false,
        instrumentations: get(panoptos, 'defaultInstrumentations'),
        providers: get(panoptos, 'defaultProviders'),
      });
  }
}
