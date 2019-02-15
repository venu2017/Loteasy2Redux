import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewBuddiesPage } from './add-new-buddies';

@NgModule({
  declarations: [
    AddNewBuddiesPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewBuddiesPage),
  ],
})
export class AddNewBuddiesPageModule {}
