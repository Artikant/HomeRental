import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var Razorpay: any;

export interface Payment{
  paymentId:number;
  userId:number;
  bookingId:number;
  amount:number;
  status:string;
  dueDate:Date;
}
@Injectable({
  providedIn: 'root'
})

export class PaymentService {
// private razorpayOptions: any = {
//   key: 'rzp_test_bfsUwGvbOsTygO', 
//   amount: 500,
//   currency: 'INR',
//   name: 'Home Rental',
//   description: 'Payment for Property Rental', 
//   image: 'assets/logo.png',
//   prefill: {
//     name: 'John Doe',
//     email: 'customer@example.com', 
//     contact: '9876543210' 
//   },
//   theme: {
//     color: '#3399cc' 
//   }
// };
private razorpayOptions: any = {
  key: 'rzp_test_bfsUwGvbOsTygO', 
  amount: 500,
  currency: 'INR',
  name: 'Home Rental',
  description: 'Payment for Property Rental', 
  image: 'assets/logo.png',
  prefill: {
    name: 'John Doe',
    email: 'customer@example.com', 
    contact: '9876543210' 
  },
  theme: {
    color: '#3399cc' 
  },
  handler: this.paymentHandler.bind(this)
};
private rzp: any;
private apiUrl = 'https://localhost:7214/api/User';
private paymentUrl='https://localhost:7214/api/User/confirmpayment';
constructor(private http:HttpClient) {
  this.loadRazorpay();
}

private loadRazorpay(): void {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => {
    console.log('Razorpay SDK loaded successfully');
    this.rzp = new Razorpay(this.razorpayOptions);
  };
  script.onerror = () => {
    console.error('Razorpay SDK could not be loaded.');
  };
  document.body.appendChild(script);
}

initiatePayment(amount: number, name: string, contact: string): void {
  debugger;
  if (this.rzp) {
    this.razorpayOptions.amount = amount * 100; // Razorpay expects amount in paise, so multiply by 100
    this.razorpayOptions.prefill.name = name;
    this.razorpayOptions.prefill.contact = contact;
    console.log('Initializing Razorpay payment with options:', this.razorpayOptions);

    this.rzp = new Razorpay(this.razorpayOptions);

    // this.rzp.on('payment.success', (response: any) => {
    //   console.log('Payment successful:', response);
    //   alert('Payment successful! again');
    //   if (storeindbCallback && typeof storeindbCallback === 'function') {
    //     storeindbCallback(); // Callback to store in database
    //   } else {
    //     console.error('storeindbCallback is not a function');
    //   }
    // });

    this.rzp.on('payment.error', (response: any) => {
      console.error('Payment failed:', response.error);
      alert('Payment failed. Please try again.');
    });
    console.log('Opening Razorpay checkout');

    this.rzp.open();
  } else {
    console.error('Razorpay instance is not initialized.');
  }
}
private paymentHandler(response: any, storeindbCallback: () => void): void {
  console.log('Payment Response:', response);
  storeindbCallback();
}
getPaymentStatus(bookingId:number): Observable<Payment> {
  return this.http.get<Payment>(`${this.apiUrl}/${bookingId}/status`);
}

initiateUserPayment(): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/initiate`, {});
}
monthlypayment(paymentId:number):Observable<any>{
  alert(paymentId);
  return this.http.put<any>(`${this.paymentUrl}/${paymentId}`,{});
}
}
