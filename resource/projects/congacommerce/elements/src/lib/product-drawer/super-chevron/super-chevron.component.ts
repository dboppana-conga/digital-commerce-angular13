import { Component, Input } from '@angular/core';

/**
 * A super awesome animated chevron used in the product drawer component.
 * @ignore
 */
@Component({
  selector: 'apt-super-chevron',
  templateUrl: './super-chevron.component.html',
  styleUrls: ['./super-chevron.component.scss']
})
export class SuperChevronComponent {
  /**
   * The direction to set the chevron pointing.
   */
  @Input() direction: string;
}
