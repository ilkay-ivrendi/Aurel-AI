import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { CredentialsService } from '../credentials.service';

@Component({
  selector: 'aurel-ai-login',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    AuthService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted successfully');
      console.log('Username:', this.loginForm.value.username);
      console.log('Password:', this.loginForm.value.password);
      console.log('Remember:', this.loginForm.value.remember);
      // Here you can add your authentication logic
      this.authService.login(this.loginForm.value).subscribe({
        next: (value) => {
          console.log('Success', value);
        },
        error: (e) => {
          console.log(e.error);
          this.openSnackBar(e.message, 'Close');
        },
        complete: () => {
          console.info('complete');
        },
      });
    } else {
      console.log('Form is invalid');
      this.openSnackBar('Form is invalid', 'Close');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
