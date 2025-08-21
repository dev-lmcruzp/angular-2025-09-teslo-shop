import { Component, effect, inject, linkedSignal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@product/services/products.service';
import { map, of } from 'rxjs';
import { ProductDetailsComponent } from "./product-details/product-details.component";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);

  productService = inject(ProductsService);

  productId = toSignal(
    this.activateRoute
      .paramMap.pipe(
        map((paramMap) => paramMap.get('idSlug'))
      )
  );

  productResource = rxResource({
    params: () => ({
      id: this.productId() ?? 'new'
    }),
    stream: ({ params }) => {
      return this.productService.getProductById(params.id!);
    }
  });

  redirectEffect = effect(() =>{
    if(this.productResource.error()){
      this.router.navigate(['/admin/products']);
    }
  });

}
