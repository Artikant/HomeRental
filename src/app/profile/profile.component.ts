import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService, Property } from '../api.service';
import { CommonModule } from '@angular/common';
import { AuthService, Users } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { jsPDF } from 'jspdf';
import { Bookings, PropertyDetails, PropertyService, Transactions } from '../property.service';
import { ChatComponent } from '../chat/chat.component';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { request } from 'http';
import { response } from 'express';
import { error } from 'console';
import { Payment, PaymentService } from '../payment.service';


declare var $: any;
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ChatComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  @ViewChild('pdfContent')
  pdfContent!: ElementRef;


  contactedProperty: any;
  selectedSection: string = 'contactedProperty';
  isLoggedIn: boolean = false;
  filteredProperties: Property[] = [];
  rentedBookings:Bookings[]=[];
  rentedProperties: Property[] = [];
  userID: number = 0;
  targetPropertyIDs: number[] = [];  // To store the dynamic propertyIDs
  alreadyTakenIds: number[] = [];
  transactions: Transactions[] = [];
  selectedProperty: PropertyDetails | null = null;
  selectedBooking:Bookings={
    bookingId: 0,
    title: '',
    userId: 0,
    ownerId: 0,
    propertyID: 0,
    bookingStatus: '',
    startDate: new Date(),
    endDate: new Date(),
    amount: 0
  };
  terminationDate: string = '';
  terminationReason: string = '';
  isDateInvalid: boolean = false;
  loginMessage: string = '';
  loginMessageClass: string = '';
  property: Property | null = null;
  pdfSrc: any;
  isPdfGenerated: boolean = false;
  status:boolean=false;
  terminationStatusMap: Map<number, boolean> = new Map<number, boolean>();
  pendings:Boolean=false;
userpaymnet:Payment={
  paymentId: 0,
  userId: 0,
  bookingId: 0,
  amount: 0,
  status: '',
  dueDate: new Date()
}
pendingpayment:string='';
pendingpaymentClass:string='';
user:Users|null=null;
  constructor(private http :HttpClient ,private apiService: ApiService, private authService: AuthService, private propertyService: PropertyService, private router: Router, private sanitizer: DomSanitizer,private paymentService: PaymentService) { }

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
    }
    if (userId) {
      this.fetchContactedProperties(userId);
      this.userID = userId;
      this.propertyService.getRentedProperty(this.userID).subscribe(data => {
        if (data.length > 0) {
          this.rentedBookings=data;
          this.targetPropertyIDs = this.extractPropertyIDs(data);
          this.filterPropertiesById();
        }
      });
      this.propertyService.transactions(this.userID).subscribe(data => {
        this.transactions = data;
      })
    } else {
      console.error('User ID not available.');
    }
  }
  checkTerminationStatus(bookingId: number): boolean | undefined{
    // Check if termination status is already fetched for the bookingId
    if (this.terminationStatusMap.has(bookingId)) {
      return this.terminationStatusMap.get(bookingId);
    }

    // Call API to check termination status
    this.propertyService.checkterminationstatus(bookingId).subscribe({
      next:isTerminated => {
        this.terminationStatusMap.set(bookingId, isTerminated); // Cache the result
      },
      error: error=> {
        console.error('Error checking termination status:', error);
      }
    });

    return false; // Return default false until API response is received
  }
  extractPropertyIDs(properties: Bookings[]): number[] {
    return properties.map(property => property.propertyID);
  }
  extractRentedPropertyIDs(properties: Property[]): number[] {
    return properties.filter(property => !property.isRented).map(property => property.propertyID);
  }
  findBookingsByPropertyId(propertyId: number): Bookings[] {
    // Find all bookings that match the given propertyId
    return this.rentedBookings.filter(booking => booking.propertyID === propertyId);
  }
  removeProperty(property: any) {

  }
  fetchContactedProperties(userId: number): void {
    this.apiService.getUserContactedProperties(userId).subscribe({
      next: (data: Property[]) => {
        this.filteredProperties = data;
        this.alreadyTakenIds = this.extractRentedPropertyIDs(this.filteredProperties);
        console.log("alreadytakenids: "+this.alreadyTakenIds);
        // this.filterRentedPropertiesById();
      },

      error: (error: any) => {
        console.error('Error fetching contacted properties:', error);
      }
    });
  }
  filterRentedPropertiesById() {
    if (this.alreadyTakenIds.length > 0) {
      this.filteredProperties = this.filteredProperties.filter(property => this.alreadyTakenIds.includes(property.propertyID));
      console.log("contacted properties",this.filteredProperties);
    }
  }
  selectSection(section: string): void {
    this.selectedSection = section;
    if (section === 'contactedProperty') {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.userID = userId
          ; this.fetchContactedProperties(userId);

      } else {
        console.error('User ID not available.');
      }
    } else {
      if (section === 'rentedproperty') {
        // this.filterPropertiesById();
      }
      else {
        if (section === 'logout') {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        else {
          if (section === 'editprofile') {
            this.router.navigate(['/edit-profile']);
          }
        }
      }
    }

  }
  filterPropertiesById() {
    this.rentedProperties = this.filteredProperties;
    if (this.targetPropertyIDs.length > 0) {
      this.rentedProperties = this.rentedProperties.filter(property => this.targetPropertyIDs.includes(property.propertyID));
      this.rentedBookings = this.rentedBookings.filter(property => this.targetPropertyIDs.includes(property.propertyID));
    }
  }

  generatePDF(propertyID: any) {
    this.propertyService.getPropertyDetails(propertyID).subscribe({
      next: (data) => {
        this.selectedProperty = data;
        console.log(this.selectedProperty);
        if (this.selectedProperty) {
          setTimeout(() => {
            const doc = new jsPDF();
            const pdfContent = this.pdfContent.nativeElement;

            doc.setFont('Roboto');
            doc.setFontSize(16);

            doc.html(pdfContent, {
              callback: (doc) => {
                doc.save('rental-agreement.pdf');
              },
              x: 10,
              y: 10,
              width: 190,
              windowWidth: pdfContent.clientWidth,
            });
          }, 0);
        }
      },
      error: (err) => {
        console.error('Error fetching property details:', err);
      }
    });
  }
  navigateToChat(property: Property) {
    this.router.navigate(['/chat'], {
      state: {
        propertyId: property.propertyID,
        userid: this.userID,
        ownerId: property.ownerId
      }
    });
  }
  checkTerminationDate() {
    const today = new Date();
    const terminationDate = new Date(this.terminationDate);
    if (terminationDate < today) {
      this.loginMessage = 'Termination date cannot be before today\'s date.';
      this.loginMessageClass = 'alert-danger';
    } else {
      this.loginMessage = '';
      this.loginMessageClass = '';
    }
  }
  terminateRent(property: Property) {

  }

  openTerminationModal(property: Property,booking:Bookings) {
    // Open modal and set initial values if needed
    $('#terminationModal').modal('show');
    this.selectedBooking=booking;
    this.property = property;
    this.pdfSrc = null;
    this.isPdfGenerated = false;
  }

  closeTerminationModal() {
    // Close modal and reset form fields
    $('#terminationModal').modal('hide');
    $('#terminateModal').modal('hide');

    this.terminationDate = '';
    this.terminationReason = '';
  }
  // async generateRentalTerminatePDF() {
  //   if(this.property){
  //   const doc = new jsPDF();
  //   const content = `
  //     Lease Termination Letter

  //     Property Address: ${this.property.address}
  //     Termination Date: ${this.terminationDate}
  //     Termination Reason: ${this.terminationReason}

  //     Dear ${this.property.ownerName},

  //     This letter is to inform you that the tenant at the above-mentioned property is terminating the lease agreement effective from ${this.terminationDate}. 

  //     Reason for termination: ${this.terminationReason}

  //     Thank you for your cooperation.

  //     Sincerely,
  //     Tenant Name
  //   `;

  //   doc.text(content, 10, 10);

  //   const dataUrl = doc.output('dataurlstring');
  //   this.pdfSrc = dataUrl;
  //   this.isPdfGenerated = true;
  // }
  // }
  // async generateRentalTerminatePDF() {
  //   if (this.property) {
  //     console.log(this.property);
  //     const content = `
  //     <div id="pdfContenttermination">
  //       <h1>Lease Termination Letter</h1>
  //       <p><strong>Property Address:</strong> ${this.property.address}</p>
  //       <p><strong>Termination Date:</strong> ${this.terminationDate}</p>
  //       <p><strong>Termination Reason:</strong> ${this.terminationReason}</p>
  //       <p>Dear ${this.property.ownerName},</p>
  //       <p>This letter is to inform you that the tenant at the above-mentioned property is terminating the lease agreement effective from ${this.terminationDate}.</p>
  //       <p><strong>Reason for termination:</strong> ${this.terminationReason}</p>
  //       <p>Thank you for your cooperation.</p>
  //       <p>Sincerely,</p>
  //       <p>Tenant Name</p>
  //     </div>
  //   `;


  //     const pdfContainer = document.createElement('div');
  //     pdfContainer.innerHTML = content;
  //     console.log(pdfContainer.innerHTML);
  //     document.body.appendChild(pdfContainer);

  //     html2canvas(pdfContainer).then(canvas => {
  //       const pdf = new jsPDF();
  //       const imgData = canvas.toDataURL('image/png');
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //       const pdfOutput = pdf.output('blob');

  //       const reader = new FileReader();
  //       reader.readAsDataURL(pdfOutput);
  //       reader.onloadend = () => {
  //         this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
  //         this.isPdfGenerated = true;
  //         document.body.removeChild(pdfContainer);
  //       };
  //     });
  //   }
  // }
terminatemodal(){
  $('').modal('hide');
  $('#terminateModal').modal('show');
}
  submitTerminationForm() {
    
    // if (!this.isPdfGenerated) {
    //   this.loginMessage = 'Please generate the PDF before submitting.';
    //   this.loginMessageClass = 'alert-danger';
    //   return;
    // }
    const today = new Date();
    const selectedDate = new Date(this.terminationDate);
    if (selectedDate < today) {
      this.isDateInvalid = true;
      this.loginMessage = 'Invalid Date';
      this.loginMessageClass = 'alert-danger';
      return;
    }
     if(this.property){
    const requestBody = {
      bookingId: this.selectedBooking?.bookingId, // Use the actual booking ID from the property
      terminationDate: this.terminationDate,
      terminationReason: this.terminationReason
    };
    this.selectedBooking.endDate= selectedDate;
    this.propertyService.terminateBookings(this.selectedBooking).subscribe({
      next: response => {
          console.log('Booking terminated successfully', response);
          this.closeTerminationModal();
          
        },
       error:error=>{
        console.error('Error terminating booking', error);
        this.loginMessage = 'Error terminating booking';
        this.loginMessageClass = 'alert-danger';
       }
    });
    // Close the modal after form submission
    this.closeTerminationModal();
  }
  }
  pendingpay(){
    this.pendings=true;
  }
  paynow(bookingId:number){
    this.userpaymnet.bookingId=bookingId;
    this.paymentService.getPaymentStatus(this.userpaymnet.bookingId).subscribe({
      next:(status:Payment) => {
        console.log(status);
      this.userpaymnet=status;
      const dueDate = new Date(this.userpaymnet.dueDate);
      const today = new Date();
      console.log(dueDate);
      console.log(today);
      console.log(this.userpaymnet.status);
      if(this.userpaymnet.status=='Pending' && dueDate> today){
        this.pendingpayment='payment due';
        this.pendingpaymentClass='alert-danger';
        console.log(new Date());
      }else if(this.userpaymnet.status!='Pending'){
        this.pendingpayment='no payment due';
        this.pendingpaymentClass='alert-success';
      }else if(this.userpaymnet.status=='Pending'&& dueDate<today){
        this.pendingpayment='due date is gone';
        this.pendingpaymentClass='alert-danger';
      }
      },
      error:error=>{
        console.log(error);
      }
    });
  }
  initiatePayment(): void {
    this.paymentService.initiateUserPayment().subscribe(session => {
      // Redirect to payment gateway session
    });
  }
  monthlypaynow(userpaymnet:Payment){
    console.log(userpaymnet);
    const userId=this.authService.getCurrentUserId();
    if(userId){
    this.authService.getCurrentUser(userId).subscribe({
      next:(data:Users)=>{
        this.user=data;
        if(this.user){
          console.log(this.user);
          this.paymentService.initiatePayment(userpaymnet.amount,this.user?.name,this.user.phoneNumber);
          this.paymentService.monthlypayment(userpaymnet.paymentId).subscribe({
            next:data=>{
              console.log(data);
            },
            error:error=>{
              console.log(error);
            }
          });
        }
      },
      error:error=>{
        console.log(error);
      }
    });
    }
    
  }
}
