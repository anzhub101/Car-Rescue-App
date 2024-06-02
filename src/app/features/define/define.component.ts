import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { MMapComponent } from '../../m-framework/m-map/m-map.component';
import { FirebaseService } from '../../services/firebase.service';

//@ts-ignore
declare var google; // Forward Declaration 

class Location{
  lat: number;
  lon: number;
  constructor(lat: number, lon: number){
    this.lat = lat; this.lon = lon; 
  }
}

@Component({
  selector: 'app-define',
  standalone: true,
  imports: [MContainerComponent,MMapComponent],
  templateUrl: './define.component.html',
  styleUrl: './define.component.css'
})
export class DefineComponent{

  lat: number; 
  lng: number;
  counter: number;
  myInt: any; 
  map: any;
  list: any[];
  
  //----------------------------------------------------------------
  constructor(private firebaseService:FirebaseService){
    this.lat = 0; 
    this.lng = 0; 
    this.counter = 0; 
    this.list = [];
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
    this.firebaseService.createObject("/route",this.list);
  }
  //--------------------------------------------------------------
  async getRouteFromFirebase(){
    this.list = [];
    this.list = await this.firebaseService.readList("/route");
    this.list.forEach(location => {
      this.drawMarker(+location.lat,+location.lon);
    });
  }
 //--------------------------------------------------------------
  async playRoute(){
    this.list = [];
    this.list = await this.firebaseService.readList("/route");
    let initialLocation = new Location(this.list[0].lat,this.list[0].lon);
    this.firebaseService.createObject("/driverlocation", initialLocation).then(()=>{
      this.drawCircle(initialLocation.lat,initialLocation.lon, 50, false);
      this.myInt = setInterval(()=>{
        let currentLocation = new Location(this.list[this.counter].lat,this.list[this.counter].lon);
        this.firebaseService.updateObject("/driverlocation","", currentLocation)
        this.counter++;
        this.drawCircle(currentLocation.lat,currentLocation.lon,50, false);
        if(this.counter > this.list.length) 
          clearInterval(this.myInt);
      },3000);
    });
  }
  
}
