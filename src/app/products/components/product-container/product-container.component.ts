import { Component, input } from '@angular/core';

@Component({
  selector: 'product-container',
  imports: [],
  templateUrl: './product-container.component.html',
  styleUrl: './product-container.component.css',
})
export class ProductContainerComponent {

  header = input.required<string>();
  subHeader = input<string | null>(null);
}
