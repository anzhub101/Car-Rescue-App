import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'm-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './m-login.component.html',
  styleUrls: ['./m-login.component.css']
})
export class MLoginComponent {
  name: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  userPath: string = '';
  rightPanelActive: boolean = false;

  @Input() isLoggedIn: boolean = false;

  @Output() userLoggedIn = new EventEmitter<{ name: string; phone: string; email: string; password: string; userPath: string }>();

  constructor(private firebaseService: FirebaseService) {}

  activateRightPanel(event: Event): void {
    event.preventDefault();
    this.rightPanelActive = true;
  }

  deactivateRightPanel(event: Event): void {
    event.preventDefault();
    this.rightPanelActive = false;
  }

  signUp(signUpForm: NgForm): void {
    if (signUpForm.invalid) {
      console.log("ended up here");
      return;
    }

    if (this.name && this.phone && this.email && this.password) {
      const userData = {
        name: this.name,
        phone: this.phone,
        email: this.email,
        password: this.password,
        isLoggedIn: false

      };
      this.firebaseService.pushToList('users', userData)
        .then(() => {
          this.name = '';
          this.phone = '';
          this.email = '';
          this.password = '';
        });
        this.rightPanelActive = false;
    }
  }

  signIn(signInForm: NgForm): void {
    if (signInForm.invalid) {
      return;
    }

    if (this.email && this.password) {
      let userFound = true;
      this.firebaseService.getList('users')
        .then(users => {
          users.forEach((user: any, index: number) => {
            if (user.email === this.email && user.password === this.password && this.isLoggedIn===false) {
              this.name = user.name;
              this.phone = user.phone;
              this.userPath = (index+1).toString();
              this.userLoggedIn.emit({ name: this.name, phone: this.phone, email: this.email, password: this.password, userPath: this.userPath });
              this.firebaseService.update('users', this.userPath, { isLoggedIn: true });
              userFound =true;
            }
            if(this.isLoggedIn!=false){
              window.alert("Someone is using this account")
            }
            if(!userFound){
              window.alert("Username password combination doesnt exist")
            }
          });
        });
    }
  }
}
