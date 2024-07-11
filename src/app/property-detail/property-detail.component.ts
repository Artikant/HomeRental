import { Component, OnInit } from '@angular/core';
import { ApiService, Property } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookings, PropertyDetails, PropertyService, rentalRequestForm } from '../property.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import {NgbProgressbarConfig, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../payment.service';
@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [FormsModule, CommonModule,NgbProgressbar],
  templateUrl: './property-detail.component.html',
  providers: [NgbProgressbarConfig],
  styleUrl: './property-detail.component.css'
})
export class PropertyDetailComponent implements OnInit {
  propertyDetails: PropertyDetails | null = null;
  Booking:Bookings={
    bookingId: 0,
    title: '',
    userId: 0,
    ownerId: 0,
    propertyID: 0,
    bookingStatus: '',
    startDate: new Date(),
    endDate: new Date,
    amount: 0
  };
  propertyID: number =0;
  step: number = 1;
  amount: number = 1000;
  email: string = 'customer@example.com'; // Example email, replace with actual email
  phone: string = '9876543210';
  userId:number=0;
  steps: any[] = [
    { label: 'See Details' },
    { label: 'Submit Form' },
    { label: 'Waiting for Approval' },
    { label: 'Make Payment' }
  ];
  rentalRequestSubmitted: boolean = false;
  requestApproved: boolean = false;
  
  rentalRequest: rentalRequestForm = {
    requestFormId:0,
    status:'',
  requestDate:new Date(),
  approvalDate:new Date(),
    fullName: '',
    occupation: '',
    contactNumber: '',
    rentalHistory: '',
    pets: '',
    expectations: '',
    numOfPeople: 1,
    livingType: 'family',
    bachelorType: '',
    leaseAgreement: 'yes',
    conditions: '',
    userId: 0,
    propertyId: 0,
    title:'',
    submissionDate: new Date(),
    ownerId: 0
  };

  stepImages: string[] = [
    './assets/step1.png',
    './assets/step2.png',
    './assets/step3.png',
    './assets/step4.png'
  ];
  userID: number =0;
  name: string='';
  contact: string='';
  constructor(private route: ActivatedRoute, private router: Router,private propertyService: PropertyService, private authService: AuthService,config: NgbProgressbarConfig,private paymentService: PaymentService) {
    config.max = 1000;
		config.striped = true;
		config.animated = true;
		config.type = 'success';
		config.height = '20px';
   }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('propertyID');
      if (id !== null) {
        const parsedID = +id;
        if (!isNaN(parsedID)) {
          this.propertyID = parsedID;
          this.getPropertyDetails(this.propertyID);
          const userId = this.authService.getCurrentUserId();
          if (userId != null) {
            this.userID = userId;
            this.step = this.getCurrentStep(this.userID, this.propertyID);
          } else {
            console.error('Error: User ID not found.');
          }
        } else {
          console.error('Error: Invalid propertyID found in route parameters.');
        }
      }
    });
  }
  storeCurrentStep(userID: number,propertyID:number, step: number): void {
    localStorage.setItem(`currentStep_${userID}${propertyID}`, step.toString());
  }
  getCurrentStep(userID: number,propertyID:number): number {
    const step = localStorage.getItem(`currentStep_${userID}${propertyID}`);
    return step ? parseInt(step, 10) : 1; 
  }
  getStepImage(step: number): string {
    return this.stepImages[step - 1];
  }
  get progressWidth(): string {
    return `${(this.step - 1) * 33.33}%`;
  }
  nextStep() {
    if (this.step < 4) {
      this.step++;
    }
    this.storeCurrentStep(this.userID, this.propertyID, this.step);
  }
  prevStep() {
    if (this.step > 1) {
      this.step--;
      this.storeCurrentStep(this.userID, this.propertyID, this.step);
    }
  }
  getPropertyDetails(propertyID: number): void {
    this.propertyService.getPropertyDetails(propertyID).subscribe({
      next: (data) => {
        this.propertyDetails = data;
      },
      error: (err) => {
        console.error('Error fetching property details:', err);
      }
    });
  }

  rentrequest() {
    const userId = this.authService.getCurrentUserId();
    
    alert("request sent to seller");
  }
  onLivingTypeChange() {
    if (this.rentalRequest.livingType !== 'bachelors') {
      this.rentalRequest.bachelorType = '';
    }
  }
  onSubmit() {
    const userId = this.authService.getCurrentUserId();
    if (userId != null && this.propertyID != null) {
      this.rentalRequest.userId = userId;
      this.rentalRequest.propertyId = this.propertyID;
    }
    console.log(this.rentalRequest);
    this.propertyService.submitRentalRequestForm(this.rentalRequest).subscribe({
      next: (data) => {
        // this.step = 3;
        this.resetForm();
        this.nextStep();

      },
      error: (err) => {
        console.error('Error fetching property details:', err);
      }
    })
  }
  resetForm() {
    this.rentalRequest = {
      requestFormId:0,
      status:'',
      requestDate:new Date(),
      approvalDate:new Date(),
      ownerId:0,
      submissionDate:new Date(),
      userId: 1,
      propertyId: 1,
      title:'',
      fullName: '',
      occupation: '',
      contactNumber: '',
      rentalHistory: '',
      pets: '',
      expectations: '',
      numOfPeople: 1,
      livingType: 'family',
      bachelorType: '',
      leaseAgreement: 'yes',
      conditions: '',
     
    };
  }
  submitForm() {
    
    const formData = {
      userId: 1,
      propertyId: 2,
      fullName: 'John Doe',
      occupation: 'Engineer',
      contactNumber: '1234567890',
      rentalHistory: 'None',
      pets: 'None',
      expectations: 'Quiet place',
      numOfPeople: 2,
      livingType: 'Family',
      bachelorType: 'N/A',
      leaseAgreement: 'Yes',
      conditions: 'None'
    };
  }
  setStep(index: number): void {
    if (index === 2 && !this.propertyDetails) {
      return; // Prevent going to step 2 if property details are not loaded
    }

    if (index === 3 && !this.rentalRequestSubmitted) {
      return; // Prevent going to step 3 if rental request is not submitted
    }

    if (index === 4 && !this.requestApproved) {
      return; 
    }

    this.step = index; 
  }
  makePayment() {
    // if(this.propertyDetails?.propertyPricePerMonth){
    // this.amount=this.propertyDetails?.propertyPricePerMonth;
    // this.name=this.propertyDetails?.sellerName;
    // this.contact=this.propertyDetails?.sellerContact;
    // this.paymentService.initiatePayment(this.amount,this.name,this.contact);
    // if (this.propertyDetails?.propertyPricePerMonth) {
    //   debugger;
    //   this.paymentService.initiatePayment(
    //     this.propertyDetails?.propertyPricePerMonth,
    //     this.propertyDetails?.sellerName,
    //     this.propertyDetails?.sellerContact,
    //     this.storeindb.bind(this)
    //   );
    // }
    if (this.propertyDetails?.propertyPricePerMonth) {
      this.amount = this.propertyDetails.propertyPricePerMonth;
      this.name = this.propertyDetails.sellerName;
      this.contact = this.propertyDetails.sellerContact;
      this.paymentService.initiatePayment(this.amount, this.name, this.contact);
    }
    this.storeindb();
   
  }
  storeindb():void{
    const userID = this.authService.getCurrentUserId();
    if(userID&&this.propertyDetails){
      this.Booking.userId=userID;
      this.Booking.propertyID=this.propertyID;
      this.Booking.amount=this.amount;
      this.Booking.title=this.propertyDetails?.propertyTitle;
    }
    console.log(this.Booking);
    debugger;
    if(this.Booking){
      this.propertyService.bookings(this.Booking).subscribe({
        next: (response) => {
        },
        error: (error) => {
          alert('Booking failed. Please try again.');
        }
      });    }
     this.nextStep();
     this.router.navigate(['/profile']);
  }
  checkStatus() {
    const userId = this.authService.getCurrentUserId();
    if(userId != null){
      this.userID=userId;
    }
    if(userId != null && this.propertyID !=null){
      this.propertyService.checkStatus(userId, this.propertyID).subscribe(response => {
        const status = response.requestStatus;
        if (status != 'pending') {
          this.step = 4;
        } else {
          alert("still pending");
        }
      });
    }
    
  }
} 
