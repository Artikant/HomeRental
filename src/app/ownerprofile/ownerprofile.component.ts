import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OwnerpropertyService } from '../ownerproperty.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Property } from '../api.service';

@Component({
  selector: 'app-ownerprofile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ownerprofile.component.html',
  styleUrl: './ownerprofile.component.css'
})
export class OwnerprofileComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties:Property[]=[];
  userId:number=0;
  currId:number|null=0;
  selectedSection: string = 'rentedProperty';
  showPaymentSection=false;
  constructor(private ownerpropertyService:OwnerpropertyService,private router: Router,private authService:AuthService) { }

  ngOnInit(): void {
    this.currId = this.authService.getCurrentUserId();
    if(this.currId!=null){
      this.userId=this.currId;
    }
    this.ownerpropertyService.getownerProperties(this.userId).subscribe({
      next:(data: Property[]) => {
        this.properties = data.filter(property => property.isRented === true); // Explicitly check for true
        this.filteredProperties = this.properties;
        console.log(this.filteredProperties);
      },
      error:error=>{
        console.log(error);
      }
    }
  )};

  selectSection(section: string): void {
    this.selectedSection = section;
    // if (section === 'contactedProperty') {
    //   const userId = this.authService.getCurrentUserId();
    //   this.fetchContactedProperties(userId);

    //   } else {
    //     console.error('User ID not available.');
    //   }
    // } else {
    //   if (section === 'rentedproperty') {
    //     // this.filterPropertiesById();
    //   }
    //   else {
    //     if (section === 'logout') {
    //       alert('yes');
    //       this.authService.logout();
    //       this.router.navigate(['/login']);
    //     }
    //     else {
    //       if (section === 'editprofile') {
    //         alert('yes');
    //         this.router.navigate(['/edit-profile']);
    //       }
    //     }
    //   }
    // }

  }
  openPaymentSection(property: Property) {
    // Toggle the showPaymentSection flag to display/hide payment section
    // property.showPaymentSection = !property.showPaymentSection;

    // // Fetch payment history if not already fetched
    // if (!property.paymentHistory) {
    //   // Example: this.ownerpropertyService.getPaymentHistory(property.propertyID).subscribe(...)
    //   // Replace with your actual service call to fetch payment history
    //   property.paymentHistory = [
    //     { date: new Date(), amount: 12000, status: 'Paid' },
    //     { date: new Date(), amount: 12000, status: 'Pending' },
    //     { date: new Date(), amount: 12000, status: 'Overdue' }
    //   ];
    // }
  }

  requestMonthlyPayment(property: Property) {
    // Example: Implement logic to send request for monthly payment
    // You can add a confirmation dialog or send a notification to the tenant
    console.log(`Requesting monthly payment for property: ${property.title}`);
  }
}
