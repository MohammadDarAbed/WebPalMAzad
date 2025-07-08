import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../shared/successDialog/success-dialog.component';

@Component({
  // standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule], // ReactiveFormsModule: to use formGroup in HTML 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm;

  constructor(private fb: FormBuilder,
    private readonly authService: AuthService,
      private dialog: MatDialog) {
    this.loginForm = this.fb.group({
      userNameOrEmail: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const userNameOrEmail = this.loginForm.get('userNameOrEmail')?.value;
    const password = this.loginForm.get('password')?.value;
    if (!userNameOrEmail || !password) {
      return;
    }
    const credentials = { userNameOrEmail, password };
    this.authService.login(credentials).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(SuccessDialogComponent);
        // Auto-close popup after 2 seconds
        setTimeout(() => dialogRef.close(), 2000);
      },
      error: (err) => {
        alert('Login failed: ' + err.message);
      },
    });
  }

}
