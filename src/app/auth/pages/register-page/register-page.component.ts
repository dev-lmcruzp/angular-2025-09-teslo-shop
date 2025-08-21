import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router)
  hasError = signal(false);
  isPosting = signal(false);

  myForm = this.fb.group({
    fullName: [, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    email: [, [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.myForm.invalid) {
      this.setFlagError();
      return;
    }

    const { fullName = '', email = '', password = '' } = this.myForm.value

    this.authService.register(fullName!, email!, password!)
      .subscribe((registered) => {
        if (registered) {
          this.router.navigateByUrl('/');
          return;
        }

        this.setFlagError();
      });
  }

  setFlagError() {
    this.hasError.set(true);
    setTimeout(() => {
      this.hasError.set(false);
    }, 2000);
  }

}
