import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetAvailabilityPage } from './set-availability';
import { DialogModule } from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {GeolocationService} from '../../services/geolocation';
import {GeocoderService} from '../../services/geocoder';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
 @NgModule({
  declarations: [
    SetAvailabilityPage
  ],
  imports: [
    IonicPageModule.forChild(SetAvailabilityPage),
    ComponentsModule,
    DialogModule,
    ConfirmDialogModule,
    PipesModule
  ],
  providers:[
    GeolocationService,
    GeocoderService
  ]
})
export class SetAvailabilityPageModule {}
