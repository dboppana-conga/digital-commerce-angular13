import { Directive, AfterViewInit, ElementRef } from '@angular/core';
/**
 * Auto Focus directive for focusing on elements after the view has been loaded.
 * @example
 ```typescript
 * <input type="text" aptAutoFocus/>
 ```
 */
@Directive({
  selector: '[aptAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.element.nativeElement.focus();
    });
  }
}