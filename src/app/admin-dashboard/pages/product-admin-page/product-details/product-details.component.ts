import { Component, inject, input, OnInit, signal } from '@angular/core';
import { DEFAULT_EMPTY_PRODUCT_ID, Product } from '@products/interfaces/product.interface';
import { ProductImageCarouselComponent } from '@products/components/product-image-carousel/product-image-carousel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { ProductService } from '@products/services/product.service';
import { Router } from '@angular/router';
import { AlertComponent } from '@shared/components/alert/alert.component';

@Component({
  selector: 'product-details',
  imports: [
    ProductImageCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    AlertComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);

  product = input.required<Product>();
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  alertMessage = signal<string>('');
  canShowAlertMessage = signal(false);

  ngOnInit() {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    // this.productForm.patchValue(formLike as any);
    // this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  readonly productForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(4)]],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [['']],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  onSubmit() {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: this.getProductTags(formValue.tags ?? []),
    };

    if (this.product().id === DEFAULT_EMPTY_PRODUCT_ID) {
      this.productService.createProduct(productLike).subscribe({
        next: (product) => {
          console.log('CREATED', product);
          this.router.navigate(['/admin/product', product.id]);
          this.showAlertMessage('Producto creado correctamente.');
        },
      });
      return;
    }

    this.productService.updateProduct(this.product().id, productLike).subscribe({
      next: (product) => {
        this.showAlertMessage('Producto actualizado correctamente.');
      },
    });
  }

  private getProductTags(tags: string | string[]): string[] {
    return Array.isArray(tags)
      ? tags
      : tags
          ?.toLowerCase()
          ?.split(',')
          ?.map((tag) => tag?.trim());
  }

  setGender = (gender: string) => this.productForm.controls.gender.setValue(gender);

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.controls.sizes.value ?? [];
    const PRODUCT_TO_TAKE = 1;

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), PRODUCT_TO_TAKE);
    } else {
      currentSizes.push(size);
    }

    this.productForm.controls.sizes.setValue(currentSizes);
  }

  inputHasErrors = (input: string) => this.productForm.get(input)?.errors ?? false;

  private showAlertMessage(message: string) {
    this.alertMessage.set(message);
    this.canShowAlertMessage.set(true);

    setTimeout(() => {
      this.canShowAlertMessage.set(false);
    }, 3500);
  }
}
