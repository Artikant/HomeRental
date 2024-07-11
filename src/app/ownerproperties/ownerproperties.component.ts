import { Component,OnInit } from '@angular/core';
import { ApiService, Property } from '../api.service';
import { Router } from '@angular/router';
import { OwnerpropertyService } from '../ownerproperty.service';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-ownerproperties',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './ownerproperties.component.html',
  styleUrl: './ownerproperties.component.css'
})
export class OwnerpropertiesComponent implements OnInit{
  properties: Property[] = [];
  filteredProperties:Property[]=[];
  userId:number=0;
  currId:number|null=0;
  propertyToDelete: Property|null=null;
  constructor(private ownerpropertyService:OwnerpropertyService,private router: Router,private authService:AuthService) { }

  ngOnInit(): void {
    this.currId = this.authService.getCurrentUserId();
    if(this.currId!=null){
      this.userId=this.currId;
    }
    this.ownerpropertyService.getownerProperties(this.userId).subscribe((data:any) => {
        this.properties = data;
        this.filteredProperties = this.properties; 
        console.log(data);
    }
  )};
  isLoggedIn(): boolean {
    return false;
  }
  AddProperty(){
    this.router.navigate(['addproperty']);
  }
  openDeleteModal(property: Property) {
    this.propertyToDelete = property;
    console.log(this.propertyToDelete);
    $('#deleteModal').modal('show');
  }

  deleteProperty() {
    if (this.propertyToDelete) {
      this.ownerpropertyService.deleteProperty(this.propertyToDelete.propertyID)
        .subscribe({
          next: () => {
            console.log('Property deleted successfully');
            // Update property list after deletion
            // this.properties = this.properties.filter(p => p.property_id !== this.propertyToDelete!.property_id);
            // this.filteredProperties = this.filteredProperties.filter(p => p.property_id !== this.propertyToDelete!.property_id);
            this.propertyToDelete = null; 
            $('#deleteModal').modal('hide'); 
          },
          error: error => {
            console.error('Error deleting property:', error);
            // Handle error scenario
          }
        });
    }
  }
  EditProperty(property:Property){
this.router.navigate(['editproperty']);
  }
  
  openChat(propertyId: number) {
    console.log(this.userId);
    console.log("propertyid"+propertyId);
    this.router.navigate(['/owner-chat'], {
      state: { 
        propertyId: propertyId,
        ownerId: this.userId,
      }
    });
    // console.log('Opening chat for property:', property);
    // this.router.navigate(['/owner-chat']);
  }
}
