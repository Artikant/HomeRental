import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, rentalRequestForm } from '../property.service';
import { AuthService } from '../auth.service';
import { Property } from '../api.service';
import { OwnerpropertyService } from '../ownerproperty.service';
import { CommonModule } from '@angular/common';
import * as $ from 'jquery';
import { error } from 'console';

@Component({
  selector: 'app-propertyrequests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './propertyrequests.component.html',
  styleUrl: './propertyrequests.component.css'
})
export class PropertyrequestsComponent implements OnInit{
  properties: Property[] = [];
  requests: rentalRequestForm[] = [];
  filteredProperties:rentalRequestForm[]=[];
  userId:number=0;
  currId:number|null=0;
  tenant: any;
  selectedTenant: any = null;
  
  constructor(private ownerpropertyService:OwnerpropertyService,private router: Router,private authService:AuthService) { }
  ngOnInit(): void {
    this.currId = this.authService.getCurrentUserId();
    if(this.currId!=null){
      this.userId=this.currId;
    }
    this.ownerpropertyService.getownerrequests(this.userId).subscribe((data:any) => {
        this.requests = data;
        console.log(data);
    });
  }
  // showTenant(userId: number) {
  //   console.log(userId);
  //   this.selectedTenant = this.requests.find(request => request.userId === userId);
  //   console.log(this.tenant);
  //   this.openModal();
  // }
  // openModal() {
  //   (jQuery('#tenantDetailsModal') as any).modal('show');
  // }

  // closeModal() {
  //   (jQuery('#tenantDetailsModal') as any).modal('hide');
  // }
  approveRequest(requestFormId: number) {
    console.log(requestFormId);
    this.ownerpropertyService.approveRequests(requestFormId).subscribe({
      next:response => {
        console.log('API Response:', response);
        alert('Approved successfully');
        this.router.navigate(['/propertyrequests']);
      },
      error:error => {
        console.error('Error in API call:', error);
        alert('Error approving request');
        // Handle error scenarios as needed
      }
    }
      
    );
    
  }

  rejectRequest(requestFormId: number) {
    // Implement logic to reject request (e.g., update status in backend)
    console.log(`Request ${requestFormId} rejected`);
  }
}
