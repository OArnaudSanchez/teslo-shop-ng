import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '@products/services/product.service';
import { ProductCardComponent } from '@store-front/components/product-card/product-card.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ProductContainerComponent } from '@products/components/product-container/product-container.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/services/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, LoadingComponent, ProductContainerComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private readonly productService = inject(ProductService);
  private readonly paginationService = inject(PaginationService);

  currentPage = computed(() => this.paginationService.currentPage());

  productsResource = rxResource({
    params: () => ({ page: this.currentPage() }),
    stream: ({ params }) => {
      const pageOffset = 9;
      const offset = (params.page - 1) * pageOffset;

      return this.productService.getProducts({
        offset,
      });
    },
  });
}
