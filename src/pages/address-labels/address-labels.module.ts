import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressLabelsPage } from './address-labels';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    AddressLabelsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressLabelsPage),
    DialogModule
  ],
})
export class AddressLabelsPageModule {}
