import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactRequest, Property } from './api.service';

export class PropertyDetails {
  propertyTitle: string = '';
  propertyDescription: string = '';
  propertyAddress: string = '';
  propertyCity: string = '';
  propertyState: string = '';
  propertyPostalCode: string = '';
  propertyCountry: string = '';
  propertyType: string = '';
  propertyBedrooms: number = 0;
  propertyBathrooms: number = 0;
  propertyPricePerMonth: number = 0;
  propertyAvailabilityStatus: string = '';
  overviewProjectArea: string = '';
  overviewSize: string = '';
  overviewProjectSize: string = '';
  overviewLaunchDate: Date | undefined;
  overviewAvgPrice: number = 0;
  overviewPossessionStarts: Date | undefined;
  overviewConfiguration: string = '';
  overviewReraId: string = '';
  overviewAbout: string = '';
  amenities: string[] = [];
  reviews: Review[] = [];
  propertyImages: Photos[];
  sellerName: string = '';
  sellerContact: string = '';

  constructor() {
    this.reviews = [];
    this.propertyImages = [];
  }
}

export class Review {
  userId: number = 0;
  reviewText: string = '';
  rating: number = 0;
  createdAt: Date | undefined;
}

export class Photos {
  imageURL: string = '';
}
export class rentalRequestForm {
  requestFormId:number=0;
  submissionDate: Date = new Date();
  ownerId: number = 0;
  userId: number = 0;
  propertyId: number = 0;
  status: string = '';
  requestDate: Date = new Date();
  approvalDate: Date = new Date();
  title: string = '';
  fullName: string = '';
  occupation: string = '';
  contactNumber: string = '';
  rentalHistory: string = '';
  pets: string = '';
  expectations: string = '';
  numOfPeople: number = 0;
  livingType: string = '';
  bachelorType: string = '';
  leaseAgreement: string = '';
  conditions: string = '';
};
export interface Bookings{
  bookingId:number;
  title:string;
  userId:number;
  ownerId:number;
  propertyID:number;
  bookingStatus:string;
  startDate:Date;
  endDate:Date; 
  amount:number;
};
export interface Transactions{
  bookingId:number;
  userId:number;
  propertyID:number;
  title :string;
  amount :number;
  startDate :Date;
};
@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = '/api/Account/PropertyDetails';
  private requestFormUrl = '/api/Account/requestform';
  private StatusUrl = '/api/User';
  private bookingUrl = '/api/User/booking';
  constructor(private http: HttpClient) { }

  getPropertyDetails(propertyId: number): Observable<PropertyDetails> {
    return this.http.get<PropertyDetails>(`${this.apiUrl}/${propertyId}`);
  }
  submitRentalRequestForm(rentalRequest: rentalRequestForm): Observable<any> {
    return this.http.post<any>(`${this.requestFormUrl}`, rentalRequest);
  }
  checkStatus(userId: number, propertyId: number): Observable<ContactRequest> {
    return this.http.get<ContactRequest>(`${this.StatusUrl}/checkstatus?user_id=${userId}&property_id=${propertyId}`);
  }
  getRentedProperty(userId: number): Observable<Bookings[]> {
    console.log(userId);
    return this.http.get<Bookings[]>(`${this.StatusUrl}/rentedproperties?user_id=${userId}`);
  }
  transactions(user_id:number):Observable<Transactions[]>{
    return this.http.get<Transactions[]>(`${this.StatusUrl}/transactions?user_id=${user_id}`);
  }
  bookings(booking:Bookings):Observable<Bookings>{
    debugger;
    console.log("in service",booking);
    return this.http.post<Bookings>(this.bookingUrl, booking);  
  }


  terminateBookings(booking: Bookings): Observable<any> {
    console.log("in service: ", booking);
    return this.http.put(`${this.StatusUrl}/terminateproperty`, booking);
  }
  checkterminationstatus(bookingId:Number):Observable<any>{
    return this.http.get<any>(`https://localhost:7214/api/User/isTerminated?bookingId=${bookingId}`);
  }
}
