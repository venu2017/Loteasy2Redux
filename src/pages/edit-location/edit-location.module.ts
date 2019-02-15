import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditLocationPage } from './edit-location';

@NgModule({
  declarations: [
    EditLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(EditLocationPage),
  ],
})
export class EditLocationPageModule {}
