import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MMapComponent } from '../../m-framework/m-map/m-map.component';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { FirebaseService } from '../../services/firebase.service';
import { MLocaldataService } from '../../services/m-localdata.service';

//@ts-ignore
declare var google;

@Component({
  selector: 'app-feature2',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent, MMapComponent],
  templateUrl: './feature2.component.html',
  styleUrl: './feature2.component.css'
})
export class Feature2Component {
  lat: number;
  lng: number;
  map: any;
  marker: any;
  circle: any;
  userPath: string ='';
  helpUser: string = '';
  helpNumber: string = '';
  distance:number =0;

  constructor(private firebaseService: FirebaseService,
    private localDataService: MLocaldataService){
    this.lat = 24.4539;
    this.lng = 54.3773;
  }
  ngOnInit() {
    const userData = this.localDataService.getList().find(user => user.id === this.localDataService.getNextID() - 1);
    if (userData) {
      this.userPath = userData.userPath;

      console.log(userData.userPath, )
      console.log(this.userPath)
    }
    this.watchPosition();
  }

  getMapInstance(map: any)
  {
    this.map = map;
  }

  watchPosition() {
    navigator.geolocation.watchPosition((data) => {
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
      
      if (this.userPath) {
        this.firebaseService.update('users', this.userPath, {
          lat: this.lat,
          lng: this.lng
        });
      }
      this.updateCircle();
    });
  }
  
  updateCircle(){
    if (this.circle) {
      this.circle.setMap(null);
    }
  
    this.circle = new google.maps.Circle({
      map: this.map,
      center: { lat: this.lat, lng: this.lng },
      radius: 1000,
    });
  
    this.map.setCenter({ lat: this.lat, lng: this.lng });
    this.getListOfUsers()
    console.log("circle done")
  }
  
  async getListOfUsers() {
    const list = await this.firebaseService.getList('users');
  
    list.forEach((item: any) => {
      console.log(item)
      if (item.lat && item.lng) {

        const marker = new google.maps.Marker({
          position: { lat: item.lat, lng: item.lng },
          map: this.map,
          title: item.name || 'User location',
        });
  
        google.maps.event.addListener(marker, 'click', () => {
          this.helpUser = item.name;
          this.helpNumber = item.phone;
          this.distance = this.calculateDistance(this.lat, this.lng, item.lat, item.lng);
        });
      }
    });
  }  
  
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

