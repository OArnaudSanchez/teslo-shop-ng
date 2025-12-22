import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductPaginationOptions } from '@products/interfaces/product-pagination-options.interface';
import { Product, ProductResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductCacheService } from './product-cache.service';

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
    if(this.productCacheService.existsKeyInProductsCache(key)){
      return of(this.productCacheService.getProductsCache(key));
    }

    return this.httpClient
      .get<ProductResponse>(`${ baseUrl }/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap(response => this.productCacheService.setProductsCache(key, response))
      );
      //TODO: implement error handling maybe as an interceptor
  }

  getProductByIdSlug(productSlug: string): Observable<Product>{

    if(this.productCacheService.existsKeyInProductCache(productSlug)) return of(this.productCacheService.getProductCache(productSlug)!);

    return this
      .httpClient
      .get<Product>(`${ baseUrl }/products/${ productSlug }`)
      .pipe(
        tap(product =>  this.productCacheService.setProductCache(productSlug, product))
      );
  }
}
