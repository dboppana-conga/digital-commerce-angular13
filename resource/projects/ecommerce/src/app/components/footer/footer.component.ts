import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Storefront, StorefrontService } from '@congacommerce/ecommerce';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  storefront$: Observable<Storefront>;
  currentYear: string = null;
  apttusCopyright: string;

  constructor(private storefrontService: StorefrontService, private translateService: TranslateService) { }

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
    this.currentYear = new Date().getFullYear().toString();
    this.translateService.stream('FOOTER.APTTUS_COPYRIGHT', { currentYear: this.currentYear }).subscribe((
      copyrightMessage: string) => {
      this.apttusCopyright = copyrightMessage;
    });
  }

}
