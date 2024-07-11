import { Component, OnInit,Input, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
// import * as L from 'leaflet';
import { ApiService } from '../api.service';
import {Property } from '../api.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
 
  @Input() propertyId!: number; 
  private userMarker!: L.Marker | null;
  private map!: L.Map;
  latitude: number = 0;
  longitude: number = 0;
  userLatitude: number = 0;
  userLongitude: number = 0;
  errorMessage: string = '';
  property: Property | null = null;
  selectedPropertyId: number | null = null;
  selectedProperty: Property | null = null;

  constructor(private apiService: ApiService, private http: HttpClient ,@Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnInit(): void {
    this.apiService.getSelectedProperty().subscribe(property => {
      console.log("called this onint");
      if (property) {
        this.property=property;
        this.selectedPropertyId = property.propertyID;
        this.loadPropertyDetails(property.propertyID);
      }
      this.apiService.isMapInitialized().subscribe(isInitialized => {
        if (isPlatformBrowser(this.platformId) && !isInitialized) {
          this.apiService.setMapInitialized(true);
        }
      });
    });
  }
  
  loadPropertyDetails(propertyId: number): void {
    console.log("load called");
    this.apiService.getPropertyById(propertyId).subscribe({
      next: (property) => {
        this.selectedProperty = property;
        this.latitude = property.latitude;
        this.longitude = property.longitude;
        if (isPlatformBrowser(this.platformId)) {
          if (!this.map) {
            this.initMap(this.latitude, this.longitude);
          }        
        }

      },
      error: (error) => {
        console.error('Error fetching property details:', error);
      },
    });
  } 

  private initMap(latitude: number, longitude: number): void {
    console.log("called");
    if (!isPlatformBrowser(this.platformId) || latitude === 0 || longitude === 0) {
      return;
    }

    import('leaflet').then((L) => {
      this.map = L.map('map').setView([latitude, longitude], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      

      const icon = L.icon({
        iconUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [25, 41], // size of the icon
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
        shadowSize: [41, 41] // size of the shadow
      });

      L.marker([latitude, longitude]).addTo(this.map)
        .bindPopup('Property Location')
        .openPopup();
        this.fetchUserLocation();
      setTimeout(() => this.map.invalidateSize(), 100); 
    }).then(() => {
      return import('leaflet-routing-machine');
    }).catch(error => {
      console.error('Error loading Leaflet', error);
    });
  }

  fetchUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLatitude = position.coords.latitude;
          this.userLongitude = position.coords.longitude;
          this.addUserMarker();
          this.showRoute();
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              break;
            default:
              console.error('An unknown error occurred:', error);
              break;
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  private addUserMarker(): void {
    import('leaflet').then((L) => {
    if (this.userLatitude && this.userLongitude) {
      if (!this.userMarker) {
        const icon = L.icon({
          iconUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        this.userMarker = L.marker([this.userLatitude, this.userLongitude]).addTo(this.map)
          .bindPopup('Your Location')
          .openPopup();
      }else {
        this.userMarker.setLatLng([this.userLatitude, this.userLongitude]);
      }
    }
  });
  }

  private showRoute(): void {
    if (!this.userLatitude || !this.userLongitude || !this.latitude || !this.longitude) {
      return;
    }
      import('leaflet-routing-machine').then((L) => {
        import('leaflet').then((L) => {
        L.Routing.control({
        waypoints: [
          L.latLng(this.userLatitude, this.userLongitude),
          L.latLng(this.latitude, this.longitude)
        ],
        routeWhileDragging: true
      }).addTo(this.map);
    });
    }).catch(error => {
      console.error('Error loading Leaflet Routing Machine', error);
    });
  }
  
}