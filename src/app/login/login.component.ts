import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { ApiService, OtpValidation } from '../api.service';
// import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { SocialAuthServiceWrapper } from '../social-auth.service';
import { AuthService, Users } from '../auth.service';
import { Router } from '@angular/router';
// import bootstrap from '../../main.server';
// import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  password: string='';
  username: string='';
  loginError: string='';
  // userType: string = '';
  loginMessage: string='';
  loginMessageClass: string='';
  forgotPasswordMessage: string = '';
  forgotPasswordMessageClass: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  showNewPasswordFields: boolean = false;
  showOtpField: boolean = false;
  resetPasswordOtp:Users={
    userID: 0,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    userType: ''
  }
  OtpValidation:OtpValidation={
    Email: '',
    Otp: ''
  }
  userData:Users={
    userID: 0,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    userType: ''
  }
  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  @ViewChild('forgotPasswordModal') forgotPasswordModal!: ElementRef;

  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router,  private socialAuthService: SocialAuthServiceWrapper,private apiervice :ApiService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      otp: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }
  login(form: NgForm) {
    if (form.valid) {
      console.log(this.username);
      console.log(this.password);
      this.authService.login(this.username, this.password).subscribe({
        next:response => {
          this.loginMessage = 'Login successful!';
          this.loginMessageClass = 'alert-success';
          this.router.navigate(['/home']);
        },
        error:error => {
          this.loginMessage = 'Login failed. Please try again.';
          this.loginMessageClass = 'alert-danger';
        }
    });
    }
  }
  forgotPassword(form: NgForm) {
    if (form.controls['username']?.valid) {
       this.resetPasswordOtp.email=this.username };
      this.apiervice.sendOtp(this.resetPasswordOtp).subscribe({
        next:(response:any) => {
          this.forgotPasswordMessage = 'OTP sent to your email.';
          this.forgotPasswordMessageClass = 'alert-success';
          this.showOtpField = true;
        },
        error:error => {
          this.forgotPasswordMessage = 'Error sending OTP. Please try again.';
          this.forgotPasswordMessageClass = 'alert-danger';
        }
  });
    }
    

  validateOtp(form: NgForm) {
    
    if (form.controls['otp']?.valid) {
       this.OtpValidation.Otp = this.otp;
       this.OtpValidation.Email=this.username };
      this.apiervice.validateOtp(this.OtpValidation).subscribe({
        next:response => {
          this.forgotPasswordMessage = 'OTP validated. You can now reset your password.';
          this.forgotPasswordMessageClass = 'alert-success';
          this.showNewPasswordFields = true;
          this.showOtpField = false;
        },
        error:error => {
          this.forgotPasswordMessage = 'Invalid OTP. Please try again.';
          this.forgotPasswordMessageClass = 'alert-danger';
        }
  });
    }

  resetPassword(form: NgForm) {
    if (this.newPassword !== this.confirmNewPassword) {
      this.forgotPasswordMessage = 'Passwords do not match.';
      this.forgotPasswordMessageClass = 'alert-danger';
      return;
    }

    if (form.controls['newPassword'].valid && form.controls['confirmNewPassword'].valid) {
      this.userData.email=this.username;
      this.userData.password=this.newPassword };
      this.apiervice.resetPassword(this.userData).subscribe({
        next:response => {
          this.forgotPasswordMessage = 'Password reset successful!';
          this.forgotPasswordMessageClass = 'alert-success';
          this.router.navigate(['/home']);
        },
        error:error => {
          this.forgotPasswordMessage = 'Error resetting password. Please try again.';
          this.forgotPasswordMessageClass = 'alert-danger';
        }
  });
    }

  onResetPasswordSubmit() {
    this.showNewPasswordFields = true;
  }
}
