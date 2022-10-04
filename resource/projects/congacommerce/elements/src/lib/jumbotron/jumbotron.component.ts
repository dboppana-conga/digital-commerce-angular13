import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { isNil } from 'lodash';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '@congacommerce/core';
import { Storefront, StorefrontService } from '@congacommerce/ecommerce';


/**
 * Jumbotron component is used to showcase key marketing messages on the site.
 * <h3>Preview</h3>
 * <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/jumbotron.png" style="max-width: 100%">
 * <h3>Usage</h3>
 *
 ```typescript
import { JumbotronModule } from '@congacommerce/elements';

@NgModule({
  imports: [JumbotronModule, ...]
})
export class AppModule {}
 ```
* @example
* // Basic Usage.
 ```typescript
* <apt-jumbotron
*               [storefront]="storefront"
* ><apt-jumbotron>
 ```
*
* // Implementation with custom options.
 ```typescript
* <apt-jumbotron
*               [storefront]="storefront"
*               [height]="height"
*               [imagePosition]="center"
*               [brightness]="brightness"
* ></apt-jumbotron>
 ```
*/
@Component({
    selector: 'apt-jumbotron',
    templateUrl: './jumbotron.component.html',
    styles: [`
        :host {
            display: block;
        }
        .carousel {
            margin-bottom: 4rem;
            min-height: 320px;
        }
        /* Since positioning the image, we need to help out the caption */
        .carousel-caption {
            bottom: 3rem;
            z-index: 10;
            max-width: 35%;
            left: inherit;
        }
        /* Declare heights because of positioning of img element */
        .carousel-item {
            overflow-x: hidden;
        }
        .carousel-item > img {
            height: 100%;
            overflow-y: hidden;
            width: 100%;
        }
    `]
})
export class JumbotronComponent implements OnInit {
    /**
     * storefront is an object having banner title,pricelist,logo, storebanner and more.
     */
    @Input() storefront: Storefront;
    /**
     * height for jumbotron it's type is string.
     */
    @Input() height: string = '20rem';
    /**
     * specify image postion.
     */
    @Input() imagePosition: 'left' | 'center' | 'right';
    /**
     *  brightness it's type is number to set the brightness of jumbotron.
     */
    @Input() brightness: number = 40;
    /** @ignore */
    @HostBinding('style')

    storefront$: Observable<Storefront>;
    //TODO When storefront object is available this will be removed
    storefrontValue: any = {
        "StoreBanners": [
            {
             
                "Image": 'None',
            }
        ]
    };
    /**
     * set the height for the jumbotron using height property.
     * @ignore
     */
    get heightStyle(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle('height: ' + this.height);
    }

    /**
     * set the visual efffects  for the jumbotron using filter property.
     * @ignore
     */
    get filterStyle(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle('filter: brightness(' + this.brightness + '%)');
    }

    constructor(public sanitizer: DomSanitizer, private storefrontService: StorefrontService, private configurationService: ConfigurationService) { }

    ngOnInit() {
         this.storefront$ = isNil(this.storefront) ? this.storefrontService.getStorefront() : of(this.storefront);
        
    }

}
