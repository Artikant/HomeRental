import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Property } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { rentalRequestForm } from './property.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerpropertyService {
  private ownerpropertyUrl = 'api/Account';
  private ownerrequestsUrl = 'api/Account';
  private approveUrl = 'api/Account/approve';
  private addPropertyUrl = 'https://localhost:7214/api/Owner/addproperties';
  private countriesUrl = 'https://restcountries.com/v3.1/all';
  private delUrl = 'api/Owner/deleteproperties';
  private editUrl = 'api/Owner/editproperties';
  constructor(private http: HttpClient, private router: Router) { }

  // addownerProperties(property:Property){
  //   return this.http.post<Property>(this.addPropertyUrl,property);
  // }
  addOwnerProperties(propertyData: Property): Observable<any> {
    console.log(propertyData);
    return this.http.post<any>(`${this.addPropertyUrl}`, propertyData);
  }
  // uploadPhoto(file: File, propertyId: number): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file);
  //   formData.append('propertyId', propertyId.toString());

  //   return this.http.post<any>(this.delUrl, formData);
  // }
  editproperty(propertyData:Property):Observable<any> {
    return this.http.post<Property>(`${this.editUrl}`, propertyData);
  }
  deleteProperty(propertyId: number): Observable<any> {
    const url = `${this.delUrl}/${propertyId}`;
    return this.http.delete(url);
  }
  getownerProperties(userId: number): Observable<Property[]> {
    console.log(userId);
    return this.http.get<Property[]>(`${this.ownerpropertyUrl}/allpropertyofowner?userId=${userId}`);
  }
  getownerrequests(userId: number): Observable<rentalRequestForm[]> {
    return this.http.get<rentalRequestForm[]>(`${this.ownerrequestsUrl}/allrequestsofowner?ownerId=${userId}`);
  }
  approveRequests(requestId: number): Observable<any> {
    console.log(requestId);
    // const url = `${this.approveUrl}/${requestId}`;
    // return this.http.put(url, {});
    return this.http.put<any>(`${this.approveUrl}/${requestId}`,{});
  }
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.countriesUrl);
  }
}
