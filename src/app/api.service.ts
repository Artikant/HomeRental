import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,BehaviorSubject, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Users } from './auth.service';

export interface Property {
    propertyID: number;
    ownerId: number;
    title: string;
    description: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    propertyType: string;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    pricePerMonth: number;
    availabilityStatus: string;
    createdAt: Date;
    updatedAt: Date;
    imageID: number | null;
    imageURL: string | null;
    imageCreatedAt: Date | null;
    imageUpdatedAt: Date | null;
    isRented :Boolean;
    latitude :number;
    longitude :number;
    ownerName:string;
    phoneNumber:string;
}
export interface ContactRequest {
  requestId: number;
  propertyId: number;
  tenantId: number; 
  message: string; 
  requestStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface PropertyOwnerInfo {
  propertyId: number;
  ownerName?: string;
  contactNumber?: string;
}
export interface OtpValidation{
  Email:string;
  Otp:string;
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private selectedPropertySubject: BehaviorSubject<Property | null> = new BehaviorSubject<Property | null>(null);
  private contactedProperty: any[] = [];
  private mapInitializedSubject = new BehaviorSubject<boolean>(false);
  private contactedpropertyUrl='https://localhost:7214/api/Account';
  private editProfileUrl='https://localhost:7214/api/User/editprofile';
  private otpValidateUrl = 'https://localhost:7214/api/User/validate-otp';
  private apiUrl = '/api/Account';
  private resetPasswordOtpUrl='https://localhost:7214/api/User/request-reset-password';
  private locationUrl= '/api/Account/location';
  private addcontactrequest = 'https://localhost:7214/api/Account/addrequest'; 
  private resetPasswordUrl = 'https://localhost:7214/api/User/reset-password';
  constructor(private http: HttpClient,private router: Router) { }

  getAllProperties(): Observable<Property[]> {
      return this.http.get<Property[]>(`${this.apiUrl}/allproperties`);
  }
  getPropertyById(propertyId: number): Observable<Property> {
    return this.http.get<Property>(`${this.locationUrl}/?propertyId=${propertyId}`);
  }
  setSelectedProperty(property: Property): void {
    console.log(property);
    this.selectedPropertySubject.next(property);
  }
  setMapInitialized(isInitialized: boolean): void {
    this.mapInitializedSubject.next(isInitialized);
  }

  isMapInitialized(): Observable<boolean> {
    return this.mapInitializedSubject.asObservable();
  }
  getSelectedProperty(): Observable<Property | null> {
    return this.selectedPropertySubject.asObservable();
  }
  addContactedProperty(property: any) {
    this.contactedProperty.push(property);
  }

  removeContactedProperty(property: any) {
    this.contactedProperty = this.contactedProperty.filter((p: any) => p !== property);
  }

  getContactedProperty() {
    return this.contactedProperty;
  }
  
  getUserContactedProperties(userId: number): Observable<Property[]> {
    console.log(userId);
    return this.http.get<Property[]>(`${this.contactedpropertyUrl}/usercontactrequest?TenantId=${userId}`);
  }
  contactSeller(contactrequestdata: ContactRequest): Observable<any> {
    debugger;
    console.log(contactrequestdata);
    return this.http.post<any>(`${this.addcontactrequest}`, contactrequestdata);
    // .pipe(
    //   catchError(this.handleError)
    // );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message)); 
  }
  sendEmail(messageData: any) {
    return this.http.post(`${this.apiUrl}/send-email`, messageData);
  }
  editProfile(userData: Users) {
    console.log('Updating profile:', userData);
    return this.http.put(`https://localhost:7214/api/User/editprofile`, userData)
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(
        response => {
          alert("profile updated");
          console.log('API Response:', response);
        },
        error => {
          console.error('API Error:', error);
        }
      );
  }
  sendOtp(resetPasswordOtp: Users): Observable<any> {
    console.log(resetPasswordOtp);
    return this.http.post(`${this.resetPasswordOtpUrl}`, resetPasswordOtp);
  }

  validateOtp(OtpValidation:OtpValidation): Observable<any> {
    console.log(OtpValidation);
    return this.http.post(`${this.otpValidateUrl}`,OtpValidation);
  }

  resetPassword(userData:Users): Observable<any> {
    console.log(userData);
    return this.http.put(`${this.resetPasswordUrl}`, userData);
    
  }
  
}
