import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(Router);
  hasError = signal(false);
  isPosting = signal(false);

  myForm = this.fb.group({
    email: [, [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.myForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email = '', password = '' } = this.myForm.value;
    this.authService.login(email!, password!)
    .subscribe((isAuthenticated) => {
      if(isAuthenticated){
        this.route.navigateByUrl('/');
        return;
      }

      this.hasError.set(true);
    })
  }

  // Check Autentication
  // Registro
  // Logout

}
