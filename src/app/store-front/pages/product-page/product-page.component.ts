import { Component, inject, linkedSignal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@product/services/products.service';
import { ProductCarouselComponent } from "@product/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  // idSlug = inject(ActivatedRoute).snapshot.paramMap.get('idSlug');
  idSlug: string = inject(ActivatedRoute).snapshot.params['idSlug'];
  productService = inject(ProductsService);
  productResource = rxResource({
    params: () => ({id: this.idSlug}),
    stream: ({params}) => {
      return this.productService.getProductByIdSlug(params.id);
    }
  })
}
