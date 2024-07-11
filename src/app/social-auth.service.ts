import { Injectable } from '@angular/core';
// import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthServiceWrapper {
  constructor(
    // private socialAuthService: SocialAuthService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  // loginWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then((user: SocialUser) => {
  //       console.log('Google user:', user);
  //       // this.authService.login();
  //     })
  //     .catch((err) => {
  //       console.error('Google login error:', err);
  //     });
  // }

  // signOut(): void {
  //   this.socialAuthService.signOut()
  //     .then(() => {
  //       this.authService.logout();
  //     })
  //     .catch((err) => {
  //       console.error('Sign out error:', err);
  //     });
  // }
}
