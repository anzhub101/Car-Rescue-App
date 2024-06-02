import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
//@ts-ignore
declare var google;

@Component({
  selector: 'm-map',
  standalone: true,
  imports: [],
  templateUrl: './m-map.component.html',
  styleUrl: './m-map.component.css'
})
export class MMapComponent implements OnInit {
  @Input() zoomLevel: number = 16; 
  @Input() lat: number = 0; 
  @Input() lng: number = 0; 
  @Output() mapInstance: EventEmitter<any> = new EventEmitter();

  map: any;

  ngOnInit() {
    if (this.lat === 0 && this.lng === 0) {
      this.getLocation();
    } else {
      this.initMap();
    }
  }

  async initMap() {
    const { Map } = await google.maps.importLibrary("maps");
 
    this.map = new Map(document.getElementById("map"),
      {
        zoom:16,
        center: {lat: this.lat, lng: this.lng},
        disableDoubleClickZoom: true,
        mapId: "Demo Map"
      }
    );
    this.mapInstance.emit(this.map);
  }
  getLocation(){
    navigator.geolocation.getCurrentPosition((data)=>{
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
      this.initMap();
    });
  }
}
