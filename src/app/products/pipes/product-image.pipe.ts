import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[], basePath: string): any {
    if (!value || value?.length === 0) {
      return './assets/images/no-image.jpg'
    }

    const image = Array.isArray(value) ? value[0] : value;

    return image.startsWith('blob:http')
      ? image
      : `${basePath}/files/product/${image}`;
  }
}