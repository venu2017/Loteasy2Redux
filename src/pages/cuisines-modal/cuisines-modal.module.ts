import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CuisinesModalPage } from './cuisines-modal';
import {RatingModule} from 'primeng/rating';
import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [
    CuisinesModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CuisinesModalPage),
    RatingModule,Ionic2RatingModule
  ],
  exports:[
    CuisinesModalPage
  ]
})
export class CuisinesModalPageModule {}
