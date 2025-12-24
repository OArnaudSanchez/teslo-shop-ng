import { Component, input } from '@angular/core';

@Component({
  selector: 'auth-input-error',
  imports: [],
  templateUrl: './auth-input-error.component.html',
  styleUrl: './auth-input-error.component.css',
})
export class AuthInputErrorComponent {

  errorMessage = input.required<string>();

}
