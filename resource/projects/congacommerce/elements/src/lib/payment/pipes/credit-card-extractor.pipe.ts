import { Pipe, PipeTransform } from '@angular/core';

/**
 * @ignore
 */
@Pipe({
  name: 'creditCardExtractor'
})

export class CreditCardExtractorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(/x/g, "");
  }

}
