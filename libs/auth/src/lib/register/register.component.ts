import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'aurel-ai-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [
    AuthService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  showRepeatPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Form submitted successfully');
      console.log('Username:', this.registerForm.value.username);
      console.log('Email:', this.registerForm.value.email);
      console.log('Password:', this.registerForm.value.password);
      console.log('Full Form:', this.registerForm.value);
      // Here you can add your registration logic
      this.authService.register(this.registerForm.value).subscribe({
        next: (value) => {
          console.log('Next:', value);
          if (value.error) {
            this.openSnackBar(value.error, 'Close');
          } else {
            this.openSnackBar(value.message, 'Close');
            console.log('Successfully Registered In. Redirecting...');
            this.router.navigate(['/', 'login']);
          }
        },
        error: (error) => {
          console.log(error.error);
          this.openSnackBar(error.message, 'Close');
        },
        complete: () => {
          console.info('register form request complete!');
        },
      });
    } else {
      console.log('Form is invalid');
      this.openSnackBar('Form is invalid', '🤦‍♂️');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
