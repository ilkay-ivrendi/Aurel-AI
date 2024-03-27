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
      // Here you can add your authentication logic
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.openSnackBar('Welcome ' + response.data.user_data.username, '👌');
        },
        error: (e) => {
          if (e.status === 504) {
            this.openSnackBar('Server is Unreachable!', '❌');
            return;
          }
          if (e.status === 401) {
            this.openSnackBar(e.error.message, '⚠️');
            return;
          }
          this.openSnackBar(e.message, '❌');
        },
        complete: () => {},
      });
    } else {
      this.openSnackBar('Form is invalid', '❌');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
