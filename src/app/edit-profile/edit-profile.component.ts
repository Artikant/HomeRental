import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, Users } from '../auth.service';
import { error } from 'console';
import { ApiService, OtpValidation } from '../api.service';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  userId: number | null = null;
  userData: Users = {
    userID: 0,
    userType: 'tenant',
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  };
  updatedProfile: Users | null = null;
  resetPasswordForm: FormGroup;
  profileImage: string | ArrayBuffer | null = '';
  userEmailOtp: Users = {
    userID: 0,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    userType: ''
  };
  validateOtp: OtpValidation = {
    Email: '',
    Otp: ''
  }
  showNewPasswordFields = false;
  showOtpField = false;
  showoldPassword = true;
  constructor(private fb: FormBuilder, private authService: AuthService, private apiService: ApiService) {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phoneNumber: [''],
      userType: ['']
    });
    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
      otp: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId()
    if (this.userId) {
      this.userData.userID = this.userId;
    }
    if (this.userId) {
      this.authService.getCurrentUser(this.userId).subscribe({
        next: (data: Users) => {
          console.log(data);
          this.userData = data;
          this.updatedProfile = this.userData;
          this.populateProfileForm();
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }
  populateProfileForm(): void {
    if (this.userData) {
      this.profileForm.patchValue({
        name: this.userData.name,
        email: this.userData.email,
        phoneNumber: this.userData.phoneNumber,
        userType: this.userData.userType
      });
    }
  }

  onFileChange(event: any): void {
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.updatedProfile = this.profileForm.value;
      console.log(this.updatedProfile);
      if (this.updatedProfile) {
        this.apiService.editProfile(this.updatedProfile);
      }
    }
  }

  onResetPasswordSubmit(): void {
    if (!this.resetPasswordForm.get('oldPassword')!.valid) {
      return;
    }
    const oldPassword = this.resetPasswordForm.get('oldPassword')!.value;
    if (oldPassword === this.userData.password) {
      this.showNewPasswordFields = true;
    } else {
      alert("invalid password");
      this.resetPasswordForm.get('oldPassword')!.reset();
    }
  }

  conResetPasswordConfirmed(): void {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword')!.value;
      console.log(newPassword);
      this.showNewPasswordFields = false;
      this.showoldPassword = false;
      this.sendOtp();
      // this.resetPasswordForm.reset(); 

    } else {
      alert("passwords do not match");
    }
  }
  sendOtp(): void {
    const userEmail = this.userData.email;
    this.userEmailOtp.name = this.userData.name;
    this.userEmailOtp.email = userEmail;
    this.showoldPassword = false;
    this.showOtpField = true;
    this.apiService.sendOtp(this.userEmailOtp).subscribe({
      next: () => {
        alert("otp sent succesfully");
      },
      error: error => {
        console.log(error);
      }
    });
  }

  onModalClose(): void {
    this.resetPasswordForm.reset();
    this.showNewPasswordFields = false;
  }
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')!.value;
    const confirmNewPassword = form.get('confirmNewPassword')!.value;
    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }
  validateOtpAndResetPassword(): void {
    const otp = this.resetPasswordForm.get('otp')!.value;
    this.validateOtp.Otp = otp;
    const newPassword = this.resetPasswordForm.get('newPassword')!.value;
    const confirmNewPassword = this.resetPasswordForm.get('confirmNewPassword')!.value;
    console.log(newPassword);
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }
    this.validateOtp.Email = this.userEmailOtp.email;

    console.log(this.validateOtp);
    this.userEmailOtp.password = newPassword;
    console.log(this.userEmailOtp);
    this.apiService.validateOtp(this.validateOtp).subscribe({
      next: () => {
        alert("otp validated");
        this.apiService.resetPassword(this.userEmailOtp).subscribe({
          next: () => {
            alert("Password reset successfully");
            this.resetPasswordForm.reset();
            this.showNewPasswordFields = false;
            this.showOtpField = false;
            this.showoldPassword = true;
          },
          error: error => {
            alert("Resetting password failed");
            console.error(error);
          }
        });
        error: (error:any) => {
          alert("Invalid OTP");
          console.log(error);
        }
      }
    });
  }

}