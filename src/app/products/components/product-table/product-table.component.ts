import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@environments/environment';
import { Product } from '@product/interfaces/product.interface';
import { ProductImagePipe } from '@product/pipes/product-image.pipe';

@Component({
  selector: 'product-table',
  imports: [RouterLink, ProductImagePipe, CurrencyPipe],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  products = input.required<Product[]>();
  private envs = environment;
  imageBasePath = this.envs.baseUrl;

}
