import { Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapComponent } from './map/map.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { RegistrationComponent } from './registration/registration.component';
import { OwnerpropertiesComponent } from './ownerproperties/ownerproperties.component';
import { OwnerprofileComponent } from './ownerprofile/ownerprofile.component';
import { PropertyrequestsComponent } from './propertyrequests/propertyrequests.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { ChatComponent } from './chat/chat.component';
import { OwnerChatComponent } from './owner-chat/owner-chat.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

export const routes: Routes = [ 
  { path: 'properties', component: DashboardComponent },
  { path: 'ownerproperties', component: OwnerpropertiesComponent},
  {path:'addproperty',component:AddPropertyComponent},
  {path:'editproperty',component:EditPropertyComponent},
  { path: 'ownerprofile', component: OwnerprofileComponent },
  { path: 'propertyrequests', component: PropertyrequestsComponent },
  {path:'edit-profile',component:EditProfileComponent},
  {path:'chat',component:ChatComponent},
  {path:'owner-chat',component:OwnerChatComponent},
  { path: 'map', component: MapComponent },
  { path: 'login', component: LoginComponent },
  {path:'about',component:AboutComponent},
  {path:'contact',component:ContactComponent},
  {path:'home',component:HomeComponent},
  { path: 'property/:propertyID', component: PropertyDetailComponent }, 
  {path:'register',component:RegistrationComponent},
  { path: 'profile', component: ProfileComponent},
  {path:'',component:HomeComponent},

  // { path: '', redirectTo: '/properties', pathMatch: 'full' },
  // { path: '**', redirectTo: '/properties' },

  ];
