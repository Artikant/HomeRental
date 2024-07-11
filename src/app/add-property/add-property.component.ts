import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OwnerpropertyService } from '../ownerproperty.service';
import { Property } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { data } from 'jquery';
import { AuthService } from '../auth.service';
import { Route, Router } from '@angular/router';
import * as L from 'leaflet';
@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css'
})
export class AddPropertyComponent implements OnInit {
  countries: any[] = [];
  states: string[] = [];
  cities: string[] = [];
  property: Property = {
    propertyID: 0,
    ownerId: 0,
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    propertyType: '',
    numberOfBedrooms: 0,
    numberOfBathrooms: 0,
    pricePerMonth: 0,
    availabilityStatus: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    imageID: null,
    imageURL: '',
    imageCreatedAt: null,
    imageUpdatedAt: null,
    isRented:false,
    latitude: 0,
    longitude: 0,
    ownerName: '',
    phoneNumber: ''
  };
  selectedCountry = '';
  selectedState = '';
  selectedCity = '';
  ownerId: number | null = 0;
  selectedFiles: FileList | null = null;
  coverImage: File | null = null;
  map: L.Map | undefined;
  marker: L.Marker | undefined;
  constructor(private ownerpropertyService: OwnerpropertyService, private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.ownerId = this.authService.getCurrentUserId();
    console.log(this.ownerId);
    this.countries = [];
    this.states = [];
    // this.ownerpropertyService.getCountries().subscribe({
    //   next: (data: any[]) => {
    //     this.countries = data;

    //   },
    //   error: (error: any) => {
    //     console.error('Error fetching countries:', error);
    //   }
    // });
  }
  // onFileSelected(event: any): void {
  //   this.selectedFiles = event.target.files;
  // }

  // triggerFileInput(): void {
  //   const fileInput = document.getElementById('photos') as HTMLInputElement;
  //   fileInput.click();
  // }
  
  // onSubmit(form: NgForm) {
  //   if (form.valid) {
  //     const formData = form.value;
  //     this.property=formData;
  //     if(this.ownerId!=null){
  //       this.property.ownerID=this.ownerId;
  //     }
  //     console.log(this.property);
  //     this.ownerpropertyService.addOwnerProperties(this.property).subscribe({
  //       next: (data: any) => {
  //         alert('Property added successfully:');
  //         if (this.selectedFiles) {
  //           for (let i = 0; i < this.selectedFiles.length; i++) {
  //             const file = this.selectedFiles[i];
  //             this.ownerpropertyService.uploadPhoto(file,this.property).subscribe({
  //               next:(uploadResponse:any)=> {
  //                 console.log('Photo uploaded successfully', uploadResponse);
  //               },
  //               error:(uploadError:any) => {
  //                 console.error('Error uploading photo', uploadError);
  //               }
  //             }),
  //           }
  //         }

  //       }
  //       error: (error: any) => {
  //         console.error('Error fetching formdata:', error);
  //       }
  //     });

  //   }
  // }
  openMap() {
    if(typeof window!=='undefined'){
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.style.display = 'block';
    }
  }
    if (!this.map) {
      this.map = L.map('map').setView([28.6139, 77.2090], 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (this.marker) {
          this.marker.setLatLng(e.latlng);
        } else {
          if(this.map)
          this.marker = L.marker(e.latlng).addTo(this.map);
        }

        (document.getElementById('latitude') as HTMLInputElement).value = lat.toFixed(6);
        (document.getElementById('longitude') as HTMLInputElement).value = lng.toFixed(6);
      });
    }
  }
  onSubmit(form: NgForm) {
    const user_id= this.authService.getCurrentUserId();
    console.log(user_id);
    if(user_id)
    this.property.ownerId=user_id;
    if (form.valid) {
      const formData = form.value;
      this.property = formData;
      if (this.ownerId != null) {
        this.property.ownerId = this.ownerId;
      }

      console.log(this.property);

      this.ownerpropertyService.addOwnerProperties(this.property).subscribe({
        next:response => {
          alert('Property added successfully:');
          this.router.navigate(['/ownerproperties']);
        },
        error: error=> {
          console.error('Error adding property:', error);
        }
      });
    }
  }
  // onSubmit(form: NgForm): void {
  //   if (form.valid && this.coverImage) {
  //     const formData = form.value;
  //     this.property = {
  //       ...formData,
  //       ownerID: this.ownerId,
  //       imageURL: '' 
  //     };

  //     console.log(this.property);
  //     // First, add property without cover image
  //     this.ownerpropertyService.addOwnerProperties(this.property).subscribe({
  //       next: (data: any) => {
  //         alert('Property added successfully');
  //       },
  //       error: (uploadError: any) => {
  //         console.error('Error uploading cover image', uploadError);
  //       }
  //     });
  //   }
  // }

}
