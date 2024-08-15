import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MCardComponent } from '../../m-framework/m-card/m-card.component';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-feature3',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MContainerComponent, MCardComponent],
  templateUrl: './feature3.component.html',
  styleUrls: ['./feature3.component.css']
})
export class Feature3Component {
  lat: number;
  lng: number;
  mechanicShops: any[] = [];
  apiKey: string = 'AIzaSyAHgzxsF3U2Rtbjou0cY2tLwnVZ0r_idMI';

  constructor(private http: HttpClient) {
    this.lat = 0;
    this.lng = 0;
    this.getLocation();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.fetchWorkshops();
      }
    );
  }

  fetchWorkshops() {
    const apiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.lat+','+this.lng+'&radius=5000&type=car_repair&key='+this.apiKey;

    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        this.mechanicShops = response.results.map((shop: any) => {
          return {
            name: shop.name,
            phoneNumber: shop.formatted_phone_number,
            distance: this.calculateDistance(),
            imageUrl: shop.photos && shop.photos.length > 0 ? this.getPhoto(shop.photos[0].photo_reference) : ''
          };
        });
      },
      (error) => {
        console.error("finding workshop error", error);
      }
    );
  }

  getPhoto(photoRef: string): string {
    return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photoRef+'&key='+this.apiKey;
  }

  calculateDistance() {
    
  }
}
