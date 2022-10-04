import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigurationService } from '../services/configuration.service';
import * as _ from 'lodash';

let _windowConfig = (<any>window).sv;

@Pipe({
    name: 'image',
    pure: false
})
export class ImagePipe implements PipeTransform {

    constructor(public configurationService: ConfigurationService, private dss: DomSanitizer) { }

    public url: string = null;

    transform(attachmentId: string, asset: boolean = true, defaultImage: boolean = true, productId?: string): string {
        const random = Math.floor(Math.random() * 50) + 1;
        if (this.url)
            return this.url;
        else {
            const absoluteUrlRegExp = new RegExp('^(?:[a-z]+:)?//', 'i');
            let endpoint = this.configurationService.endpoint();
            
            const resource = this.configurationService.resourceLocation();

            let defaultImageSrc = (this.configurationService.get('defaultImageSrc') != null) ? this.configurationService.get('defaultImageSrc') : './assets/images/placeholder.png';
            defaultImageSrc += `?random=${random}`

            this.url = (asset) ? resource + defaultImageSrc : defaultImageSrc;

            let _temp = this.url;
            if (attachmentId && attachmentId.indexOf('/') === 0)
                _temp = (asset) ? resource + attachmentId : attachmentId;
            else if (attachmentId && absoluteUrlRegExp.test(attachmentId))
                _temp = attachmentId;
            else if (attachmentId && attachmentId.indexOf('/') > 0 && this.configurationService.get('type') === 'AIC') {
                _temp = `https://${this.configurationService.get('storageAccount')}.blob.core.windows.net/tenant${this.configurationService.get('tenantId')}-public/${attachmentId}`;
                defaultImage = false;
            }
            else if (attachmentId && attachmentId.indexOf('/') > 0)
                _temp = (asset) ? resource + `${!_.endsWith(resource, '/') ? '/' : ''}` + attachmentId : attachmentId;
            else if (attachmentId && productId && this.configurationService.get('type') === 'AIC') {
                _temp = `https://${this.configurationService.get('storageAccount')}.azureedge.net/tenant${this.configurationService.get('tenantId')}-public/productinformation/${productId}/attachments/${attachmentId}`;
                defaultImage = false;
            }
            else if (attachmentId)
                _temp = endpoint + '/servlet/servlet.FileDownload?file=' + attachmentId;

            _temp = _temp.substring(_temp.lastIndexOf('http'));
            if (defaultImage)
                this.checkImage(_temp, () => this.url = this.dss.sanitize(SecurityContext.URL, _temp), () => this.url = this.dss.sanitize(SecurityContext.URL, defaultImageSrc));
            else
                this.url = _temp;
            return this.dss.sanitize(SecurityContext.URL, this.url);
        }
    }

    private checkImage(url, success, failure) {
        let img = new Image(),
            loaded = false,
            errors = {},
            errored = false;

        // Run only once, when `loaded` is false. If `success` is a
        // function, it is called with `img` as the context.
        img.onload = () => {
            if (loaded) {
                return;
            }

            loaded = true;

            if (success && success.call) {
                success.call(img);
            }
        };

        // Run only once, when `errored` is false. If `failure` is a
        // function, it is called with `img` as the context.
        img.onerror = () => {
            if (errored) {
                return;
            }

            errors[url] = errored = true;

            if (failure && failure.call) {
                failure.call(img);
            }
        };

        // If `url` is in the `errors` object, trigger the `onerror`
        // callback.
        if (errors[url]) {
            img.onerror.call(img);
            return;
        }

        // Set the img src to trigger loading
        img.src = url;

        // If the image is already complete (i.e. cached), trigger the
        // `onload` callback.
        if (img.complete) {
            img.onload.call(img);
        }
    }
}