import { Component, OnInit } from '@angular/core';
import { ApiService, ContactRequest } from '../api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Property } from '../api.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, Owners, Users } from '../auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  selectedPropertyId: number | null = null;
  filtersForm!: FormGroup;
  cities: string[] = []; // Array to hold unique cities for filtering
  localities: string[] = []; // Array to hold localities within selected city
  selectedLocalities: string[] = [];
  showLoginComponent: boolean = false;
  minValue: number = 1000;
  maxValue: number = 5000;
  min: number = 0;
  max: number = 10000;
  showSlider: boolean = false;
  message: string = '';
  activePropertyId: number | null = null;
  showMessageInput: boolean = false;
  property: Property | undefined;
  user: Users = {
    userID: 0,
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    userType: '',
  };
  contactrequestdata:ContactRequest={
    requestId: 0,
    propertyId: 0,
    tenantId: 0,
    message: '',
    requestStatus: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  isLoading: boolean = false;
  constructor(private apiService: ApiService, private router: Router, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.apiService.getAllProperties().subscribe(data => {
      this.properties = data;
      this.filteredProperties = this.properties;
      this.updateCityOptions();
   
    });
    this.buildFiltersForm();

    this.filteredProperties = this.properties;
    this.updateCityOptions();
  }
  toggleSlider() {
    this.showSlider = !this.showSlider;
  }

  updateMinValue(event: any) {
    this.minValue = parseInt(event.target.value, 10);
  }

  updateMaxValue(event: any) {
    this.maxValue = parseInt(event.target.value, 10);
  }
  isValidRange(): boolean {
    return this.minValue <= this.maxValue;
  }
  isLoggedIn(): boolean {
    return false;
  }
  selectProperty(property: Property): void {
    this.apiService.setSelectedProperty(property);
    this.router.navigate(['/map']);
  }
  // contactSeller(property: any) {
  //   console.log("clicked");

  //   if (this.authService.isLoggedIn()) {
  //     console.log("yes");
  //     this.router.navigate(['/profile']);
  //   } else {
  //     console.log("in else");
  //       this.router.navigate(['/login']);
  //     }
  //   }  
  buildFiltersForm(): void {
    this.filtersForm = this.formBuilder.group({
      priceRange: [[this.minValue, this.maxValue]],
      city: [''],
      bedrooms: ['']
    });
    // this.filtersForm.get('city')?.valueChanges.subscribe(city => {
    //   if (city) {
    //     this.localities = Array.from(new Set(this.properties.filter(property => property.city === city).map(property => property.address)));
    //   } else {
    //     this.localities = [];
    //   }
    // });
  }
  updateCityOptions(): void {
    this.cities = Array.from(new Set(this.properties.map(property => property.city)));
  }
  applyFilters(): void {
    console.log(this.filtersForm.value);
    const filters = this.filtersForm.value;
    this.filteredProperties = this.properties.filter(property => {
      let match = true;
      if (filters.priceRange < this.max) {
        const [min, max] = filters.priceRange.split('-').map((val: any) => parseInt(val.trim(), 10));
        if (min && property.pricePerMonth < min) {
          match = false;
        }
        if (max && property.pricePerMonth > max) {
          match = false;
        }
      }
      if (filters.city && property.city !== filters.city) {
        match = false;
        // }
        // if (filters.localities.length > 0 && !filters.localities.includes(property.address)) {
        //   match = false;
      }
      if (filters.bedrooms && property.numberOfBedrooms !== parseInt(filters.bedrooms, 10)) {
        match = false;
      }
      return match;
    });
  }
  shareProperty(property: Property): void {
    console.log('Sharing property:', property);
  }

  addToFavorites(property: Property): void {
    this.showLoginComponent = true;
    console.log('Adding property to favorites:', property);
  }
  sendMessage(propertyId: number): void {
    {
      this.activePropertyId = this.activePropertyId === propertyId ? null : propertyId;
      this.message = ''; // Clear message input when toggling
      this.showMessageInput = !this.showMessageInput;
    }
  }
  contactSeller(propertyId: number): void {
    console.log(`Sending message for property ID ${propertyId}: ${this.message}`);
    this.activePropertyId = null,
      this.showMessageInput = false;
    if (propertyId && this.message.trim() !== '') {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.authService.getCurrentUser(userId).subscribe({
          next: (user: Users) => {
            this.isLoading = true;
            const property = this.properties.find(p => p.propertyID === propertyId);
            if (property) {
              this.authService.getOwnerInfo(propertyId).subscribe({
                next: (owner: Owners) => {
                  if (property && user) {
                    const messageData = {
                      userName: user.name,
                      userEmail: user.email,
                      message: this.message.trim(),
                      property: {
                        title: property.title,
                        address: property.address,
                        city: property.city,
                        state: property.state,
                        postalCode: property.postalCode,
                        country: property.country,
                        pricePerMonth: property.pricePerMonth
                      },
                      ownerEmail: owner.ownerEmail
                    };
                    this.apiService.sendEmail(messageData).subscribe({
                      next: (response: any) => {
                        this.isLoading = false;
                        console.log('Message sent successfully:', response);
                        alert('Message sent successfully');
                        this.contactrequestdata.tenantId=userId;
                        this.contactrequestdata.propertyId=propertyId;
                        this.contactrequestdata.message=messageData.message;
                        console.log(this.contactrequestdata);
                        this.apiService.contactSeller(this.contactrequestdata).subscribe({
                      next: (response: any) => {
                        
                        console.log('Message sent successfully:', response);
                        this.message = '';
                        this.router.navigate(['/profile']);

                      },
                      error: (error: any) => {
                        console.error('Error sending message:', error);
                        this.router.navigate(['/profile']);

                      }
                    });

                      },
                      error: (error: any) => {
                        console.error('Error sending message:', error);
                        this.router.navigate(['/profile']);

                      }
                    });
                  }
                  else {
                    console.error('User ID not available. Unable to send message.');
                  }
                }
              });
            }
          }
        });
      }
    }
  }
}
