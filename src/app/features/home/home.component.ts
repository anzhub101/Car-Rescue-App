import { Component, OnInit } from '@angular/core';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MMainMenuComponent } from '../../m-framework/m-main-menu/m-main-menu.component';
import { MLoginComponent } from '../../m-framework/m-login/m-login.component';
import { Router } from '@angular/router';
import { MLocaldataService } from '../../services/m-localdata.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MLoginComponent, CommonModule, FormsModule, MContainerComponent, MMainMenuComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;

  username: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  userPath: string = '';

  constructor(private router: Router, private localDataService: MLocaldataService, private firebaseService: FirebaseService)  {} 

  ngOnInit() {
    console.log('Stored isLoggedIn:', localStorage.getItem('isLoggedIn'));
  
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isLoggedIn = true;
      const userData = this.localDataService.getList().find(user => user.id === this.localDataService.getNextID() - 1);
      
      if (userData) {
        this.username = userData.name;
        this.phone = userData.phone;
        this.email = userData.email;
        this.password = userData.password;
        this.userPath = userData.userPath;
      } else {
        console.log('No user data found, redirecting to login');
        this.isLoggedIn = false;
      }
    } else {
      console.log('User is not logged in');
      this.isLoggedIn = false;
    }
  }

  handleUserLoggedIn(user: { name: string; phone: string; email: string; password: string; userPath: string }) {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true'); // Store as 'true'
    
    this.username = user.name;
    this.phone = user.phone;
    this.email = user.email;
    this.password = user.password;
    this.userPath = user.userPath;
  
    this.localDataService.add({
      id: this.localDataService.getNextID(), 
      name: this.username,
      phone: this.phone,
      email: this.email,
      password: this.password,
      userPath: this.userPath,
      isLoggedIn: this.isLoggedIn
    });
  
    console.log("Successfully retrieved and stored user details");
    console.log(localStorage.getItem('isLoggedIn'));
    console.log(this.userPath);
  }
  
  
  

logOut() {
  if (this.userPath) {
    this.firebaseService.update('users', this.userPath, { isLoggedIn: false, lat: null, lng: null });
  }

  this.isLoggedIn = false;
  this.username = '';
  this.phone = '';
  this.email = '';
  this.password = '';
  this.userPath = '';

  localStorage.removeItem('isLoggedIn');
  this.localDataService.removeAll();
}
  navigateTo(feature: string): void {
    this.router.navigate([`/${feature}`]);
  }
}
