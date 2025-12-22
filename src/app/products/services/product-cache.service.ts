import { Injectable } from "@angular/core";
import { Product, ProductResponse } from "@products/interfaces/product.interface";

@Injectable({
    providedIn: 'root'
})
export class ProductCacheService{

    //TODO: Create a generic cache service
    private readonly productsCache = new Map<string, ProductResponse>();
    private readonly productCache = new Map<string, Product>();

    existsKeyInProductsCache(key : string) : boolean{
        return this.productsCache.has(key);
    }

    existsKeyInProductCache(key : string) : boolean{
        return this.productCache.has(key);
    }

    getProductsCache(key: string): ProductResponse{
        return this.productsCache.get(key)!;
    }

    getProductCache(key: string): Product{
        return this.productCache.get(key)!;
    }

    setProductsCache(key: string, products: ProductResponse): void{
        this.productsCache.set(key, products);
    }

    setProductCache(key: string, product: Product){
        this.productCache.set(key, product);
    }

    // existsKey(key : string) : boolean{
    //     return this.productCache.has(key) || this.productsCache.has(key);
    // }

    // setCache(key: string, data: Product | ProductResponse){

    //     const test = data
        
    //     if(data instanceof Product){
    //         this.productCache.set(key, data);
    //     }

    //     if(data instanceof ProductResponse){
    //         this.productsCache.set(key, data)
    //     }
    // }

}