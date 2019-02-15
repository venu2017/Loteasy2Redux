import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAddressLabelPage } from './add-address-label';

@NgModule({
  declarations: [
    AddAddressLabelPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAddressLabelPage),
  ],
})
export class AddAddressLabelPageModule {}
