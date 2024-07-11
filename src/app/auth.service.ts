import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import jwt_decode, { jwtDecode } from 'jwt-decode';

export interface Users{
  userID:number;
  name:string;
  email:string;
  password:string;
  phoneNumber:string;
  userType:string;
}
export interface Owners{
  propertyId:number;
  ownerName:string;
  ownerEmail:string;
  contactNumber:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'https://localhost:7214/api/Account/login'; 
  private registerUrl = 'https://localhost:7214/api/Account/register';
  private userUrl = 'https://localhost:7214/api/Account';
  private loggedIn = false;
  private authToken: string ='';
  private userType: string |null ='';
  private loggedInSubject = new BehaviorSubject<boolean>(this.loggedIn);
private forgotPasswordUrl='https://localhost:7214/api/User/reset-password';
  constructor(private http: HttpClient, private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getAuthToken();
      if (token) {
        this.authToken = token;
        this.loggedIn = true;
        this.loggedInSubject.next(true);
      }
    }
  }
  
  register(userData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(this.registerUrl, userData, httpOptions);
  }
  // login(username: string, password: string): Observable<any> {
  //   const loginData = {
  //     username: username,
  //     password: password,
  //   };
  //   console.log('inside login of auth service');
  //   console.log(loginData);

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   debugger;
  //   return this.http.post<any>(this.loginUrl, loginData, { headers }).pipe(
  //     tap(response => {
  //       if (response && response.token) {
  //         this.authToken = response.token;
  //         localStorage.setItem('authToken', this.authToken);
  //         this.loggedIn = true;
  //         this.loggedInSubject.next(true);
  //       }
  //     }),
  //     catchError(this.handleError)
  //   );
  // }
  login(username: string, password: string): Observable<any> {
    const loginData = {
      username: username,
      password: password,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.loginUrl, loginData, {headers}).pipe(
      tap(response => {
        if (response && response.token) {
          this.authToken = response.token;
          localStorage.setItem('authToken', this.authToken);
          this.loggedIn = true;
          this.loggedInSubject.next(true);
          const decodedToken: any = jwtDecode(response.token);
          this.userType = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; 
          if(this.userType != null){
          localStorage.setItem('userType', this.userType);
          }
        }
      }),
    );
  }
    logout(): void {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      // localStorage.removeItem('currentStep');
      this.authToken = '';
      this.loggedIn = false;
      this.loggedInSubject.next(false);
      this.router.navigate(['/login']);
    }
  
    isLoggedIn(): boolean{
      return isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken');
    }
    isLoggedInOwner(): string | null {
      this.userType = localStorage.getItem('userType');
      return this.userType;
    }
  
    getAuthToken(): string | null {
      const token = localStorage.getItem('authToken');
      return token ? token : null;
    }
    getCurrentUserId(): number  | null {
      if (this.authToken) {
        const decodedToken: any = jwtDecode(this.authToken);
        const userIdString = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
         const   userID = parseInt(userIdString, 10);

        // Check if the parsed userID is a valid number
        if (!isNaN(userID)) {
          return userID;
        } else {
          console.error('User ID is not a valid number.');
          return null;
        }
      }
      return null;
    }
    getCurrentUser(userId:number):Observable<Users>{
      return this.http.get<Users>(`${this.userUrl}/userbyid?user_id=${userId}`);
    }
    getOwnerInfo(propertyId:number):Observable<Owners>{
      return this.http.get<Owners>(`${this.userUrl}/ownerinfo?propertyId=${propertyId}`)
    }
    forgotPassword(email: Users): Observable<any> {
      console.log(email);
      return this.http.put(this.forgotPasswordUrl,email);
    }
}
