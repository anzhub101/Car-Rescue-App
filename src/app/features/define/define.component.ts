import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { MMapComponent } from '../../m-framework/m-map/m-map.component';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAhaComponent } from '../../m-framework/m-aha/m-aha.component';
//@ts-ignore
declare var google; // Forward Declaration 

class Location{
  lat: number;
  lon: number;
  constructor(lat: number, lon: number){
    this.lat = lat; this.lon = lon; 
  }
}
class Toast{
  message: string; 
  type: string;
  duration: number; 
  header: string; 
  ngIfControl: boolean; 
  constructor(message: string, type:string, header: string, duration:number)
  {
    this.message = message; 
    this.type = type; 
    this.header = header; 
    this.duration = duration; 
    this.ngIfControl = false;
  }
  show(){
    this.ngIfControl = true; 
    setTimeout(()=>{
       this.ngIfControl = false; 
     },this.duration);
     return this;
  }
}

@Component({
  selector: 'app-define',
  standalone: true,
  imports: [MContainerComponent,MMapComponent,FormsModule,CommonModule,MAhaComponent],
  templateUrl: './define.component.html',
  styleUrl: './define.component.css'
})
export class DefineComponent{
  busNumber: number;
  lat: number; 
  lng: number;
  counter: number;
  myInt: any; 
  map: any;
  list: any[];
  toast: any; 
  //----------------------------------------------------------------
  constructor(private firebaseService:FirebaseService){
    this.busNumber = 0; 
    this.lat = 0; 
    this.lng = 0; 
    this.counter = 0; 
    this.list = [];
    this.toast = new Toast("","","",100);
    
  }
  //----------------------------------------------------------------
  drawMarker(latitude: number, longitude: number){
    const marker = new google.maps.Marker({
      map: this.map,
      position: {lat: latitude, lng: longitude},
    });
  }
 //---------------------------------------------------------------- 
  drawCircle(latitude: number, longitude: number, radius: number, changable: boolean){
    const circle = new google.maps.Circle({
      map: this.map, 
      center: {lat: latitude, lng: longitude},
      radius: radius,
      editable: changable
    });
  }
 //----------------------------------------------------------------
  getMapInstance(map: any)
  {
    this.map = map;
    this.map.addListener("click", (event:any) => {
      let location = event.latLng;
      this.drawMarker(location.lat(),location.lng());
      this.list.push(new Location(location.lat(),location.lng()));
    });
  }
  //--------------------------------------------------------------
  storeRoute(){
    if(this.busNumber > 0)
    {
        this.firebaseService.addToList("/routes",{busNumber: this.busNumber, locations: this.list});
        this.toast = new Toast("Route Stored","success","Info",2000).show(); 
    }
    else
      this.toast = new Toast("Warning. Bus number must be positive", "warning","Warning", 2000).show();
  }
  //--------------------------------------------------------------
  async getRouteFromFirebase(){
    let routes = [];
    routes = await this.firebaseService.readList("/routes");
    let routeFound = false; 
    routes.forEach(route => {
      if(route.busNumber == this.busNumber)
      {
        routeFound = true; 
        this.list = route.locations; 
        this.list.forEach(location=>{
          this.map.setCenter({lat:location.lat, lng:location.lon});
          this.drawMarker(location.lat,location.lon)
        });
      }
    });
    if(!routeFound)
      this.toast = new Toast("Route not found. Check the number.","error","Error",3000).show();
  }
 
 //--------------------------------------------------------------
  async playRoute(){
    this.counter = 0; 
    this.list = [];
    let routeFound = false; 
    let routes = await this.firebaseService.readList("/routes");
    routes.forEach((route)=>{
      if(route.busNumber == this.busNumber)
        {
          routeFound = true; 
          this.list = route.locations; 
          let initialLocation = new Location(this.list[0].lat,this.list[0].lon);
          
          this.firebaseService.createObject("/driverlocation", initialLocation).then(()=>{
          this.myInt = setInterval(()=>{
            let currentLocation = new Location(this.list[this.counter].lat,this.list[this.counter].lon);
            this.map.setCenter({lat:currentLocation.lat, lng:currentLocation.lon});
            this.firebaseService.updateObject("/driverlocation","", currentLocation)
            this.counter++;
            this.drawCircle(currentLocation.lat,currentLocation.lon,50, false);
            if(this.counter >= this.list.length) 
            {
              clearInterval(this.myInt);
              this.toast = new Toast("Route replay complete.","success","Info",3000).show();
            }
          },3000);
          });
        }
    });
    if(!routeFound)
      this.toast = new Toast("Route not found. Check the number.","error","Error",3000).show();
    
  }
  
}
