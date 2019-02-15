import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseLocationDatetimePage } from './choose-location-datetime';
import {GeolocationService} from '../../services/geolocation';
import {GeocoderService} from '../../services/geocoder';
import { HZDatePickerModule, HZDatePickerService } from 'ng2-hz-datepicker';
         
@NgModule({
  declarations: [
    ChooseLocationDatetimePage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseLocationDatetimePage),
    HZDatePickerModule
       
  ],
  exports:[
    ChooseLocationDatetimePage
  ],
  providers:[
    GeolocationService,
    GeocoderService,
    HZDatePickerService
       
       
  ],
  
})
export class ChooseLocationDatetimePageModule {}
