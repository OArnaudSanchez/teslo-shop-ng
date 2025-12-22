import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product.service';
import { map } from 'rxjs';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ProductCardComponent } from '@store-front/components/product-card/product-card.component';
import { I18nSelectPipe } from '@angular/common';
import { ProductContainerComponent } from '@products/components/product-container/product-container.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/services/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [
    LoadingComponent,
    ProductCardComponent,
    I18nSelectPipe,
    ProductContainerComponent,
    PaginationComponent,
  ],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css',
})
export class GenderPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly paginationService = inject(PaginationService);

  currentPage = computed(() => this.paginationService.currentPage());
  readonly genderMap = { men: 'Hombres', women: 'Mujeres', kids: 'Niños' };
  gender = toSignal(this.activatedRoute.params.pipe(map((value) => value['gender'])));

  productsResource = rxResource({
    params: () => {
      return {
        gender: this.gender(),
        page: this.currentPage(),
      };
    },

    stream: ({ params }) => {
      const pageOffset = 9;
      const offset = (params.page - 1) * pageOffset;

      return this.productService.getProducts({ gender: params.gender, offset, limit: 10 });
    },
  });
}
