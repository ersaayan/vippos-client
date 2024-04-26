import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/login-request';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  messageService= inject(MessageService);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        if (response.isSuccess) {
          setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Logged In',
            detail: 'Successful Login!',
          });
        }, 1000);
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to Login!',
        });
      }
    );
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.messageService.add({
        key: 'success',
        severity: 'success',
        styleClass: 'bg-green-500',
        contentStyleClass: 'p-3',
        closable: false
      });
    });
  }
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
}
