import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from "@product/components/product-table/product-table.component";
import { ProductsService } from '@product/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [RouterLink, DecimalPipe, ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  paginationService = inject(PaginationService);
  productsService = inject(ProductsService);
  currentPage = computed(() => this.paginationService.currentPage());

  productsPerPage = signal(10);
  productsResource = rxResource({
    params: () => ({
      page: this.currentPage(),
      limit: this.productsPerPage()
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        page: params.page,
        limit: params.limit
      })
    }
  });

}
