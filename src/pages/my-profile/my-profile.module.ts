import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProfilePage } from './my-profile';
import {GeolocationService} from '../../services/geolocation';
import {GeocoderService} from '../../services/geocoder';

@NgModule({
  declarations: [
    MyProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(MyProfilePage),
  ],
  providers:[
    GeolocationService,
    GeocoderService
  ]
})
export class MyProfilePageModule {}
