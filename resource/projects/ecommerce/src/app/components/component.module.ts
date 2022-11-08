import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaddaModule } from 'angular2-ladda';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {
  MiniProfileModule, MiniCartModule, OutputFieldModule, ButtonModule,
  DirectivesModule, ProductSearchModule, IconModule, ConstraintRuleModule
} from '@congacommerce/elements';
import { HeaderComponent } from './header/header.component';
import { CategoryCarouselComponent } from './category-carousel/category-carousel.component';
import { ApttusModule } from '@congacommerce/core';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    MiniProfileModule,
    MiniCartModule,
    LaddaModule,
    IconModule,
    RouterModule,
    ConstraintRuleModule,
    NgScrollbarModule,
    TooltipModule.forRoot(),
    ToastrModule.forRoot({ onActivateTick: true }),
    OutputFieldModule,
    ButtonModule,
    DirectivesModule,
    ProductSearchModule,
    ApttusModule
  ],
  exports: [
    HeaderComponent,
    LaddaModule,
    ToastrModule,
    FooterComponent,
  ],
  declarations: [
    HeaderComponent,
    CategoryCarouselComponent,
    FooterComponent
  ]
})
export class ComponentModule { }
