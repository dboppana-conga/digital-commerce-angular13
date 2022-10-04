import { Component, Input } from '@angular/core';

/**
 * Animated blinking dots built from the bootstrap library to be used to show loading status.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/loadingDots.png" style="max-width: 100%">
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
* // Basic Usage
 ```typescript
* <apt-dots></apt-dots>
 ```
*
* // Larger size dots
 ```typescript
* <apt-dots [large]="true"></apt-dots>
 ```
*
* // Change color of dots with bootstrap text color class
 ```typescript
* <apt-dots color="text-warning"></apt-dots>
 ```
*/
@Component({
  selector: 'apt-dots',
  templateUrl: './dots.component.html',
  styles: []
})
export class DotsComponent {
  /**
   * Flag to set the dots to a larger size.
   */
  @Input() large: boolean = false;
  /**
   * Bootstrap text color class to set the color of the dots.
   */
  @Input() color: 'text-primary' | 'text-secondary' | 'text-success' | 'text-danger' | 'text-warning' | 'text-info' | 'text-light' | 'text-dark' = 'text-primary';

}
