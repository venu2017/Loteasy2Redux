import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuddyDetailsPage } from './buddy-details';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BuddyDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuddyDetailsPage),
    PipesModule
  ],
})
export class BuddyDetailsPageModule {}
