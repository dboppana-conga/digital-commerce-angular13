import { Component, OnChanges, ElementRef, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import * as Chart from 'chart.js';
import { get, first, keys, values, find } from 'lodash';
import { combineLatest, Subscription } from 'rxjs';

import { ConfigurationService } from '@congacommerce/core';
import { ConversionService, CurrencyType, UserService } from '@congacommerce/ecommerce';
import { map as rmap } from 'rxjs/operators';
/**
 * <strong>This component is a work in progress.</strong>
 * 
 * Chart component displays the data as a chart based on the configuration passed in to this component.
 * <h3>Preview</h3>
 * <strong>Bar Chart</strong>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/barChart.png" style="max-width: 100%">
 * <strong>Doughnut Chart</strong>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/doughnutChart.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { ChartModule } from '@congacommerce/elements';
@NgModule({
  imports: [ChartModule, ...]
})
export class AppModule {}
 ```
*
* @example
* // Basic Usage.
```typescript
* <apt-chart
*             [data]="chartData"
*             [type]="chartType"
* ></apt-chart>
```
*
* // Chart with override settings.
```typescript
* <apt-chart
*             [data]="chartData"
*             [type]="chartType"
*             [chartTitle]="myTitle"
*             [colorPalette]="colors"
*             [showLegend]="flag"
*             [legendPosition]="'top'"
*             [currencyConversionCode]="'USD'"
* ></apt-chart>
```
*/
@Component({
  selector: 'apt-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * Dataset to be displayed on the chart.
   */
  @Input() data: Object;
  /**
   * Type of the chart to be rendered.
   */
  @Input() type: string;
  /**
   * Title to be displayed for the chart.
   */
  @Input() chartTitle: string;
  /**
   * List of colors to be used on the chart.
   */
  @Input() colorPalette: Array<string>;
  /**
   * Flag to show/hide legend on the chart.
   */
  @Input() showLegend: boolean = true;
  /**
   * Position of legend on the chart.
   */
  @Input() legendPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  /**
   * Value to be displayed in the center of chart.
   */
  @Input() centerText: any;
  /**
   * String to specify what the data on chart label needs to be transformed to.
   * Can take values like 'currency' etc.
   */
  @Input() labelDataTransform: string;
  /**
   * Object used to display the total dollar amount within the tooltip for bar charts.
   */
  @Input() amountsByStatus: Object;
  /**
   * A string value representing ISO 4217 currency code to convert the currency values to.
   */
  @Input() currencyConversionCode: string;
  /**
   * Chart configuration options object.
   * @ignore
   */
  chartOptions: ChartOptions;
  /**
   * Instace of the chart component.
   * @ignore
   */
  myChart: Chart;
  /** @ignore */
  customTooltipClass: string;
  /** @ignore */
  tooltipTitle: string;
  /** @ignore */
  tooltipAmount: number;
  /** @ignore */
  tooltipTotal: number;
  /** @ignore */
  currencyType: CurrencyType;
  /** @ignore */
  userLocale: string;
  /** @ignore */
  subscription: Subscription;
  /** @ignore */
  tooltip: any;
  /** @ignore */
  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  /** @ignore */
  @ViewChild('customTooltip', { static: false }) customTooltip: ElementRef;

  constructor(private conversionService: ConversionService,
    private currencyPipe: CurrencyPipe,
    private userService: UserService,
    private configService: ConfigurationService) { }

  ngOnInit() {
    const currencyType$ = (this.currencyConversionCode) ? this.conversionService.getConversionRates().pipe(rmap(rates => find(rates, r => r != null && r.IsoCode === this.currencyConversionCode))) : this.conversionService.getCurrencyTypeForPricelist();
    this.subscription = combineLatest([currencyType$, this.userService.getLocale()])
      .subscribe(([currency, locale]) => {
        this.currencyType = currency
        this.userLocale = locale;
      });
  }

  ngOnChanges() {
    if (this.data && this.type) {
      this.renderChartWithData(this.chartRef, this.data);
    }
  }
  /**
   * @ignore
   */
  private renderChartWithData(chartRef: ElementRef, chartDataset: any) {
    if (this.myChart) this.myChart.destroy();
    const data: ChartInterface = {} as ChartInterface;
    this.chartOptions = this.getDefaultChartOptions();

    // Define custom options for doughnut chart.
    if (this.type === 'doughnut') {
      this.chartOptions.animation = {
        animateScale: true
      };
      this.chartOptions.center = {
        text: this.centerText,
        color: 'rgba(111, 111, 111, 1)',
        sidePadding: 30
      };
      this.chartOptions.tooltips = {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: (tooltipItem, value) => {
            const label = value.labels[tooltipItem.index];
            const dataset = value.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            const datasetLabel = (this.labelDataTransform === 'currency') ? this.transformCurrency(dataset) : dataset;
            return label + ': ' + datasetLabel;
          }
        }
      };
      this.chartOptions['onClick'] = (evt, item) => {
        this.myChart.update();
        const model = get(first(item), '_model') as unknown as any;
        if (get(item, 'length') > 0 && model) model.outerRadius += 8;
      }
    }

    // Define custom options for bar chart.
    if (this.type === 'bar') {
      this.chartOptions.scales = this.getScaleOptions();
      this.chartOptions.tooltips = {
        enabled: false,
        custom: tooltipModel => {
          if (tooltipModel.dataPoints) {
            this.tooltipTitle = tooltipModel.dataPoints[0].xLabel.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            this.tooltipAmount = tooltipModel.dataPoints[0].yLabel;
          }
          this.tooltipTotal = get(this.amountsByStatus, this.tooltipTitle);
          this.customTooltipClass = tooltipModel.yAlign;
          if (tooltipModel.opacity === 0) {
            this.customTooltip.nativeElement.style.opacity = 0;
            this.customTooltip.nativeElement.style.zIndex = -1;
            return;
          }

          this.customTooltip.nativeElement.style.opacity = .95;
          this.customTooltip.nativeElement.style.zIndex = 2;
          this.customTooltip.nativeElement.style.position = 'absolute';
          this.customTooltip.nativeElement.style.left = tooltipModel.caretX + 16 + 'px';
          this.customTooltip.nativeElement.style.top = tooltipModel.caretY - 32 + 'px';
        }
      }
    }
    // Load chart dataset
    data.datasets = new Array({
      data: values(chartDataset),
      backgroundColor: (this.colorPalette) ? this.colorPalette : this.getDefaultColorPalette(chartDataset)
    });
    // Set data labels
    data.labels = keys(chartDataset).map(res => res.toUpperCase());

    // Create chart component.
    this.myChart = new Chart(chartRef.nativeElement, {
      type: this.type,
      data: data,
      options: this.chartOptions
    });
    this.myChart.update();
  }

  /**
   * @ignore
   */
  private getDefaultChartOptions(): ChartOptions {
    return {
      title: {
        text: this.chartTitle,
        display: (this.chartTitle) ? true : false
      },
      legend: {
        display: this.showLegend,
        position: this.legendPosition,
        labels: {
          usePointStyle: true
        }
      },
      tooltips: null,
      responsive: true
    }
  }

  /**
   * @ignore
   */
  private getDefaultColorPalette(data): Array<string> {
    let colors = [];
    keys(data).map(res => colors.push('rgba(59, 161, 217, 1)'));
    return colors;
  }

  /**
   * @ignore
   */
  private getScaleOptions() {
    return {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0,
          autoSkip: false,
          userCallback: (label) => {
            // Return labels with no decimals.
            if (Math.floor(label) === label) {
              return label;
            }
          },
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },
        gridLines: {
          display: false
        }
      }]
    }
  }

  /**
   * @ignore
   */
  private transformCurrency(value: number): string {
    const conversionRate = (this.currencyType && this.currencyType.ConversionRate) ? this.currencyType.ConversionRate : 1;
    const convertedValue = value * conversionRate;
    return this.currencyPipe.transform(convertedValue, get(this.currencyType, 'IsoCode', this.configService.get('defaultCurrency', 'USD')), 'symbol-narrow', '1.' + get(this.currencyType, 'DecimalPlaces', 2) + '-' + get(this.currencyType, 'DecimalPlaces', 2), this.userLocale);
  }

  /**
   * @ignore
   */
  handleMouseEnter() {
    this.customTooltip.nativeElement.style.opacity = 1;
    this.customTooltip.nativeElement.style.zIndex = 2;
  }

  /**
   * @ignore
   */
  handleMouseLeave() {
    this.customTooltip.nativeElement.style.opacity = 0;
    this.customTooltip.nativeElement.style.zIndex = -1;
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

}

// Set animation speed in milliseconds to render the chart faster.
Chart.defaults.global.animation.duration = 150;

// Chart plugin to show text at the center of the chart.
Chart.pluginService.register({
  beforeDraw: function (c) {
    if (get(c, 'config.options.center')) {
      // Get ctx from chart
      let ctx = get(c, 'chart.ctx');
      // Get options from the center object in options
      let centerConfig = get(c, 'config.options.center');
      let fontStyle = centerConfig.fontStyle || 'Arial';
      let txt = centerConfig.text;
      let color = centerConfig.color || '#000';
      let sidePadding = centerConfig.sidePadding || 20;
      let sidePaddingCalculated = (sidePadding / 100) * (get(c, 'innerRadius') * 2);
      // Start with a base font of 30px
      ctx.font = '34px ' + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      let stringWidth = ctx.measureText(txt).width;
      let elementWidth = (get(c, 'innerRadius') * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      let widthRatio = elementWidth / stringWidth;
      let newFontSize = Math.floor(30 * widthRatio);
      let elementHeight = (get(c, 'innerRadius') * 1.8);

      // Pick a new font size so it will not be larger than the height of label.
      let fontSizeToUse = Math.min(newFontSize, elementHeight);

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let centerX = ((c.chartArea.left + c.chartArea.right) / 2);
      let centerY = ((c.chartArea.top + c.chartArea.bottom) / 2) + 10;
      ctx.font = fontSizeToUse + 'px ' + fontStyle;
      ctx.fillStyle = color;

      // Draw text in center
      if (txt) ctx.fillText(txt, centerX, centerY);
    }
  }
});
export interface ChartInterface {
  datasets: Array<{ data: any; backgroundColor: Array<string> }>;
  labels: Array<string>
}
export interface ChartOptions {
  title: Object;
  legend: Object;
  tooltips: Object;
  center?: Object;
  responsive?: boolean;
  animation?: Object;
  scales?: Object
}
