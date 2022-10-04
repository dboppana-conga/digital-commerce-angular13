import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/**
 * An animated spinner built from the bootstrap library to be used to show loading status.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/loadingSpinner.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { IconModule } from '@congacommerce/elements';

@NgModule({
  imports: [IconModule, ...]
})
export class AppModule {}
 ```
*
* @example
* // Basic usage
 ```typescript
* <apt-spinner></apt-spinner>
 ```
*
* // Small spinner
 ```typescript
* <apt-spinner [large]="false"></apt-spinner>
 ```
*
* // Change color of spinner with bootstrap text color class.
 ```typescript
* <apt-spinner color="text-warning"></apt-spinner>
 ```
*/
@Component({
  selector: 'apt-spinner',
  template: `
    <div
      [class]="'spinner-border ' + color"
      [class.spinner-border-sm]="!large"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  /**
   * Flag to set the dots to a larger size.
   */
  @Input() large: boolean = true;
  /**
   * Bootstrap text color class to set the color of the dots.
   */
  @Input() color: 'text-primary' | 'text-secondary' | 'text-success' | 'text-danger' | 'text-warning' | 'text-info' | 'text-light' | 'text-dark' = 'text-primary';
}
