import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product.service';
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { ProductImageCarouselComponent } from "@products/components/product-image-carousel/product-image-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [LoadingComponent, ProductImageCarouselComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  productSlug = this.activatedRoute.snapshot.paramMap.get('idSlug') ?? '';

  productResource = rxResource({
    params: () => {
      return {
        idSlug: this.productSlug,
      };
    },

    stream: ({ params }) => {
      const { idSlug } = params;
      return this.productService.getProductBySlug(idSlug);
    },
  });
}
