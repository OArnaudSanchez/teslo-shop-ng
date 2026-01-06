import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { ProductService } from '@products/services/product.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/services/pagination.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, FormsModule, RouterLink],
  templateUrl: './products-admin-page.component.html',
  styleUrl: './products-admin-page.component.css',
})
export class ProductsAdminPageComponent {

  private readonly productService = inject(ProductService);
  private readonly paginationService = inject(PaginationService);

  currentPage = computed(() => this.paginationService.currentPage());

  productsPerPage = signal(10);

  productsPerPageOptions = [10, 20, 50, 100];

  productsResource = rxResource({
    params: () => ({ page: this.currentPage(), limit: this.productsPerPage() }),
    stream: ({ params }) => {
      const pageOffset = 9;
      const offset = (params.page - 1) * pageOffset;

      return this.productService.getProducts({
        offset,
        limit: params.limit
      });
    }
  });

  get productCount(){
    return this.productsResource.value()?.count ?? 0;
  }

}
