import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/product.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { map } from 'rxjs';
import { ProductDetailsComponent } from "./product-details/product-details.component";

@Component({
  selector: 'app-product-admin-page',
  imports: [LoadingComponent, ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
  styleUrl: './product-admin-page.component.css',
})
export class ProductAdminPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly productService = inject(ProductService);

  productId = toSignal(this.activatedRoute.paramMap.pipe(map((params) => params.get('productId'))));

  productResource = rxResource({
    params: () => ({ productId: this.productId() }),
    stream: ({ params }) => {
      return this.productService.getProductById(params.productId ?? '');
    },
  });

  redirectEffect = effect(() => {
    // TODO: maybe its better to redirect to the not found component
    if (this.productResource.error()) this.router.navigate(['/admin/products'], { replaceUrl: true });
  });
}
