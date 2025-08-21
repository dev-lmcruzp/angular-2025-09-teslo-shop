import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ProductCarouselComponent } from "@product/components/product-carousel/product-carousel.component";
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";

import { Product } from '@product/interfaces/product.interface';
import { FormUtils } from '@utils/form-utils';
import { ProductsService } from '@product/services/products.service';

@Component({
  selector: 'admin-product-details',
  imports: [ReactiveFormsModule, ProductCarouselComponent, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  router = inject(Router);
  fb = inject(FormBuilder);

  wasSave = signal<boolean>(false);
  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;

  allImages = computed(() => {
    return [
      ...this.tempImages(),
      ...(this.product().images ?? [])
    ];
  });

  productService = inject(ProductsService);

  myForm = this.fb.group({
    title: [, [Validators.required],],
    description: [, [Validators.required],],
    slug: [, [Validators.required, Validators.pattern(FormUtils.slugPattern)],],
    price: [, [Validators.required, Validators.min(0)],],
    stock: [, [Validators.required, Validators.min(0)],],
    sizes: [[''], [Validators.required],],
    images: [[],],
    tags: ['',],
    gender: ['',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],],
  });

  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  genders = [
    { value: 'men', label: 'Masculino', cssClass: 'btn-primary' },
    { value: 'women', label: 'Femenino', cssClass: 'btn-accent' },
    { value: 'kid', label: 'Kid', cssClass: 'btn-warning' },
    { value: 'unisex', label: 'Unisex', cssClass: 'btn-secondary' }
  ];

  onFilesChanged(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    this.imageFileList = files ?? undefined;
    this.tempImages.set([]);

    const imageUrls = Array.from(files ?? []).map((file) => {
      return URL.createObjectURL(file);
    });

    this.tempImages.set(imageUrls);
    // this.tempImages.update((tempImages) => [...tempImages, ...imageUrls]);
  }

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.myForm.reset(formLike as any);
    this.myForm.patchValue({
      tags: formLike.tags?.join(',') || '',
    });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.myForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.myForm.patchValue({
      sizes: currentSizes,
    });
  }

  async onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    }

    const formValue = this.myForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: this.myForm.value.tags
        ?.toLowerCase()
        ?.split(',').map((tag: string) => tag.trim()) || [],
    };


    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      );
      this.router.navigate(['/admin/products', product.id]);



      // this.productService.createProduct(productLike)
      //   .subscribe((product) => {
      //     this.router.navigate(['/admin/products', product.id]);
      //   });
    } else {
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
      // this.productService.updateProduct(this.product().id, productLike)
      //   .subscribe({
      //     next: (product) => {
      //       console.log("ACTUALIZADO");
      //     },
      //     error: (error) => {
      //       console.log(error);
      //     },
      //   });
    }

    this.wasSave.set(true);

    setTimeout(() => {
      this.wasSave.set(false);
    }, 3000);

  }

}
