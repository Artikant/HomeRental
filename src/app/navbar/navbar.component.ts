import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { After } from 'v8';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit,AfterViewInit {
  isLoggedIn: boolean = false;
  isDropdownOpen = false;
  userType:string | null ='tenant';
  constructor(private authService: AuthService,private router:Router) {}
  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
  ngAfterViewInit():void{

  }
  isLoggedInuser(): boolean {
    return this.authService.isLoggedIn();
  }
  isLoggedInuserOwner():string|null{
    this.userType= this.authService.isLoggedInOwner();
    return this.userType;
  }
  logout() {
    this.authService.logout()
    this.isLoggedIn = false;
    console.log("called logout");
    this.router.navigate(['/login']); 
  }
}
