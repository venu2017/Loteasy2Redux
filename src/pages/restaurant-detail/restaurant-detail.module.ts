import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantDetailPage } from './restaurant-detail';
import { SlickModule } from 'ngx-slick';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    RestaurantDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RestaurantDetailPage),
    SlickModule,

  ],
  providers:[
    CallNumber
  ]
})
export class RestaurantDetailPageModule {}
