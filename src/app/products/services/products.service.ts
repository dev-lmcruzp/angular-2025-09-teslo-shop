import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment.development';
import { Gender, Product, ProductsResponse } from '@product/interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';


export interface Params {
  limit?: number;
  page?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  // TanStack Query ==> manejo de cache
  constructor() { }
  private http = inject(HttpClient)
  private envs = environment;
  private productsCache = new Map<string, ProductsResponse>()
  private productCache = new Map<string, Product>()

  getProducts(params: Params): Observable<ProductsResponse> {
    const { limit = 10, page = 1, gender = '' } = params;
    const key = `${limit}-${page}-${gender}`;
    if (this.productsCache.has(key))
      return of(this.productsCache.get(key)!);

    return this.http.get<ProductsResponse>(`${this.envs.baseUrl}/products`,
      {
        params: {
          limit: limit,
          offset: (page - 1) * limit,
          gender
        }
      })
      .pipe(
        tap(resp => this.productsCache.set(key, resp)
        ),
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productsCache.has(idSlug))
      return of(this.productCache.get(idSlug)!);

    return this.http.get<Product>(`${this.envs.baseUrl}/products/${idSlug}`)
      .pipe(
        tap(resp => this.productCache.set(idSlug, resp)),
      );
  }

  getProductById(id: string): Observable<Product> {
    if(id === 'new') return of(emptyProduct);

    if (this.productsCache.has(id))
      return of(this.productCache.get(id)!);

    return this.http.get<Product>(`${this.envs.baseUrl}/products/${id}`)
      .pipe(
        tap(resp => this.productCache.set(id, resp)),
      );
  }

  // : Observable<Product>
  updateProduct(id: string, productLike: Partial<Product>,
    images?: FileList): Observable<Product> {
    const currentImages = productLike.images ?? [];
    return this.uploadImages(images)
      .pipe(
        map(imageNames => ({
          ...productLike,
          images: [...imageNames, ...currentImages]
        })),
        switchMap((updatedProduct) => {
          return this.http.patch<Product>(`${this.envs.baseUrl}/products/${id}`, updatedProduct)
        }),
        tap((product) => this.updateProductCache(product))
      )
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    this.productCache.set(product.id, product);
    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(currentProduct =>
        currentProduct.id === productId ? product : currentProduct
      )
    });
  }

  createProduct(productLike: Partial<Product>,
    images?: FileList): Observable<Product> {

      const currentImages = productLike.images ?? [];
      return this.uploadImages(images)
      .pipe(
        map(imageNames => ({
          ...productLike,
          images: [...currentImages, ...imageNames]
        })),
        switchMap(createdProduct => {
          return this.http.post<Product>(`${this.envs.baseUrl}/products`,
            createdProduct
          )
        }),
        tap(resp => this.productCache.set(resp.id, resp)),
      )
    return this.http.post<Product>(`${this.envs.baseUrl}/products`,
      productLike
    ).pipe(
      tap(resp => this.productCache.set(resp.id, resp)),
    );
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map(
      image => this.updaloadImage(image)
    );

    return forkJoin(uploadObservables).pipe(
      tap((images) => console.log({
        images
      }))
    );
  }

  updaloadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post<{fileName: string}>(`${this.envs.baseUrl}/files/product`, formData)
      .pipe(
        map((resp: any) => resp.fileName),
      );
  }
}
