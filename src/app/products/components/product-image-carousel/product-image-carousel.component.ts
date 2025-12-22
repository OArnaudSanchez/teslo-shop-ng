import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { ProductImagePipe } from '@shared/pipes/product-image.pipe';

@Component({
  selector: 'product-image-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-image-carousel.component.html',
  styleUrl: './product-image-carousel.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductImageCarouselComponent implements AfterViewInit{
  images = input.required<string[]>();

  ngAfterViewInit(): void {
    register();
  }
  
}
