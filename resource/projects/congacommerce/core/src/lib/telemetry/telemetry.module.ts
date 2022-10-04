import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from '../services/configuration.service';
import { get } from 'lodash';


const panoptos = get(window, 'panoptos');

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})


export class TelemetryModule { 
  constructor(configService: ConfigurationService) {
      panoptos.panoptos.init({
        service: {
          serviceName: 'dc',
          ServiceNamespace: 'frontEnd'
        },
        environment: configService.get('organizationId'),
        userId : localStorage.getItem('userId'),
        organizationId: configService.get('organizationId'),
        clientId: configService.get('clientId'),
        enableLogging: true,
        enableMetrics: false,
        enableTracing: true,
        propagateTraceHeaderCorsUrls: [/rlp-dev.congacloud.io/,/rlp-qa.congacloud.io/,/rlp-stg.congacloud.io/],
        collectorUrl:'https://signals.prod-sodium.conga-panoptos.com',
        console: false,
        ignoreUrls: [/signals.prod-sodium.conga-panoptos.com/],
        useBeacon: false,
        instrumentations: panoptos.defaultInstrumentations,
        providers: panoptos.defaultProviders
      });
  }
}
