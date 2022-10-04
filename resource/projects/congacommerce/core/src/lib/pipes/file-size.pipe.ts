import { Pipe, PipeTransform } from '@angular/core';

/**
 * Core pipe to convert bytes into largest possible unit.
 * ### Example:
 ```html
    <!-- Formats to 1 KB for users -->
    <span>{{1024 | fileSize}}</span>
 ```
 */
@Pipe({
    name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

    private units = ['bytes', 'KB', 'MB', 'GB', 'TB'];

    transform(bytes: number=0):string{
        if(isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) return '';
        let unit=0;
        while(bytes >= 1024){
            bytes /= 1024;
            unit ++;
        }
        return Math.round(bytes)+' '+this.units[unit];
    }
}