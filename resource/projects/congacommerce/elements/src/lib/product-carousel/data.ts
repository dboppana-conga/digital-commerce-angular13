import { Product } from "@congacommerce/ecommerce";
import { Component, OnChanges, Input, ViewEncapsulation, ChangeDetectionStrategy, QueryList, ViewChildren } from '@angular/core';
import { CarouselComponent } from 'ngx-bootstrap/carousel';

export const product= new Product();
product.Id='234';

export const result= new Array<QueryList<CarouselComponent>>();