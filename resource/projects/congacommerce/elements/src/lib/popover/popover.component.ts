import { Component, Input, OnChanges, TemplateRef } from '@angular/core';

/**
 * This component can be used to show popover on an element, to provide information based on the popoverContent passed.
 * The popoverContent is the template reference to be shown inside the popover.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/popover.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { PopoverModule } from '@congacommerce/elements';

@NgModule({
  imports: [PopoverModule, ...]
})
export class AppModule {}
 ```
* @example

* <apt-popover
*             [popoverContent]="popoverTemplate"
*             [title]="'My Popover'"
*             [placement]="'right'"
*             [adaptivePosition]="true"
*             [container]="'body'"
*             [containerClass]="Popover"
*             [delay]="10"
*             [triggers]="mouseenter:mouseleave focus:blur"
*             [outsideClick]="true"
* ></apt-popover>
*
<ng-template #popoverTemplate>
  <div class="popoverHeader">
    <h6 class="font-weight-bold">My Popover header</h6>
  </div>
  <div class="popoverBody">
    <span>My Popover message.</span>
  </div>
</ng-template>
*/
@Component({
  selector: 'apt-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})

export class PopoverComponent implements OnChanges {

  /** Content to be displayed inside popover. Content can be string or a template reference passed. */
  @Input() popoverContent: string | TemplateRef<any>;

  /** Placement decides where the popover is positioned. Default position is set to auto.
   * Possible values are auto, top, bottom, left, right.
   */
  @Input() placement: string = 'auto';

  /** Flag enables popover to auto adjust its positioning based on available screen space. */
  @Input() adaptivePosition = true;

  /** selector specifying the element the popover should be appended to. */
  @Input() container: string = 'body';

  /** Styling class to be applied to the popover container. */
  @Input() containerClass: string = 'Popover';

  /** Closes the popover if there is a mouse click outside. Defaulted to true. */
  @Input() outsideClick: boolean = true;

  /** Delay in milliseconds before the popover is shown. */
  @Input() delay: number = 0;

  /** Title to be shown on the popover */
  @Input() title: string = '';

  /**
   * Specifies the events that should trigger the popover.
   * Supports a space separated list of events, with click event as the default.
   */
  @Input() triggers: string = 'click';

  constructor() { }

  ngOnChanges() { }

}