import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@environments/environment.development';
import { Product } from '@product/interfaces/product.interface';
import { ProductImagePipe } from '@product/pipes/product-image.pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();
  private envs = environment;
  imageBasePath = this.envs.baseUrl;
}
