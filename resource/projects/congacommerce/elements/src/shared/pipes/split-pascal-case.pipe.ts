import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts/Splits pascal case string to regular form
 * Usage:
 *   value | splitPascalCase
 * Example:
 *   {{ PascalCase | splitPascalCase }}
 *   converts to: Pascal Case
*/
@Pipe({
  name: 'splitPascalCase'
})

export class SplitPascalCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.split(/(?=[A-Z])/).join(' ');
  }
}