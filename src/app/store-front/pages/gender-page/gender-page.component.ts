import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { I18nSelectPipe } from '@angular/common';


import { ProductsService } from '@product/services/products.service';


import { ProductCardComponent } from "@product/components/product-card/product-card.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, I18nSelectPipe, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  currentPage = computed(() => this.paginationService.currentPage());


  gender = toSignal<string>(this.route.params
    .pipe(
      map(({ gender }) => gender)
    ));

    genderMap = {
      'men': 'hombre',
      'women': 'mujeres',
      'kids': 'niñ@s',
      'other': 'otros'
    };

  resourceProduct = rxResource({
    params: () => ({ gender: this.gender(), page: this.currentPage() }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        gender: params.gender,
        page: params.page
      })
    }
  });




}
