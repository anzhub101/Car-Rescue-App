import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { TrackComponent } from './features/track/track.component';
import { DefineComponent } from './features/define/define.component';
export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'define', component:DefineComponent},
    {path:'track', component:TrackComponent}
];
