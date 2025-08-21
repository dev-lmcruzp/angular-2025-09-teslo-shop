import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@product/components/product-card/product-card.component';
import { ProductsService } from '@product/services/products.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';
// import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productService = inject(ProductsService);
  paginationService = inject(PaginationService);
  currentPage = computed(() => this.paginationService.currentPage());

  productResource = rxResource({
    params: () => ({
      page: this.currentPage()
    }),
    stream: ({ params }) => {
      return this.productService.getProducts(params);
    }
  });
}
