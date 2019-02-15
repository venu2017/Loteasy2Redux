import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSummaryPage } from './order-summary';
import {GeolocationService} from '../../services/geolocation';
import {GeocoderService} from '../../services/geocoder';

@NgModule({
  declarations: [
    OrderSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderSummaryPage),
  ],
  providers:[
    GeolocationService,
    GeocoderService
  ]
})
export class OrderSummaryPageModule {}
