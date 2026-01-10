import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductPaginationOptions } from '@products/interfaces/product-pagination-options.interface';
import {
  DEFAULT_EMPTY_PRODUCT_ID,
  emptyProduct,
  Product,
  ProductResponse,
} from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductCacheService } from './product-cache.service';
import { PRODUCT_ENDPOINTS } from '@products/endpoints/product.endpoints';
import { FILES_ENDPOINTS } from '@dashboard/endpoints/files.endpoints';

const baseUrl = environment.API_URL;

//TODO: Rebuild the backend using .net core web API, also use docker and kubernetes.
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);
  private readonly productCacheService = inject(ProductCacheService);

  getProducts(options: ProductPaginationOptions): Observable<ProductResponse> {
    const { limit = 10, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productCacheService.existsKeyInProductsCache(key)) {
      return of(this.productCacheService.getProductsCache(key));
    }

    return this.httpClient
      .get<ProductResponse>(`${baseUrl}/${PRODUCT_ENDPOINTS.products}`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(tap((response) => this.productCacheService.setProductsCache(key, response)));
    //TODO: implement error handling maybe as an interceptor
  }

  getProductById(productId: string): Observable<Product> {
    if (productId === DEFAULT_EMPTY_PRODUCT_ID) {
      return of(emptyProduct);
    }

    return this.getProduct(productId);
  }

  getProductBySlug(productSlug: string): Observable<Product> {
    return this.getProduct(productSlug);
  }

  private getProduct(param: string): Observable<Product> {
    return this.httpClient
      .get<Product>(`${baseUrl}/${PRODUCT_ENDPOINTS.products}/${param}`)
      .pipe(tap((product) => this.productCacheService.setProductCache(param, product)));
  }

  updateProduct(
    productId: string,
    product: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImages = product.images ?? [];

    return this.uploadProductImages(imageFileList).pipe(
      map((fileNames) => ({
        ...product,
        images: [...currentImages, ...fileNames],
      })),
      switchMap((updatedProduct) =>
        this.httpClient.patch<Product>(
          `${baseUrl}/${PRODUCT_ENDPOINTS.products}/${productId}`,
          updatedProduct
        )
      ),
      tap((product) => {
        this.productCacheService.setProductCache(product.id, product);
        this.productCacheService.updateProductsCache(product);
      })
    );
  }

  createProduct(product: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    const currentImages = product.images ?? [];

    return this.uploadProductImages(imageFileList).pipe(
      map((fileNames) => ({
        ...product,
        images: [...currentImages, ...fileNames],
      })),
      switchMap((newProduct) =>
        this.httpClient.post<Product>(`${baseUrl}/${PRODUCT_ENDPOINTS.products}`, newProduct)
      ),
      tap((product) => this.productCacheService.updateProductsCache(product))
    );
  }

  uploadProductImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) => this.uploadImage(imageFile));
    return forkJoin(uploadObservables);
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);

    return this.httpClient
      .post<{ fileName: string }>(
        `${baseUrl}/${FILES_ENDPOINTS.files}/${PRODUCT_ENDPOINTS.product}`,
        formData
      )
      .pipe(map((response) => response.fileName));
  }
}
