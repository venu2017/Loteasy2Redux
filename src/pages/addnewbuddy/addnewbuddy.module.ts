import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddnewbuddyPage } from './addnewbuddy';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AddnewbuddyPage,
  ],
  imports: [
    IonicPageModule.forChild(AddnewbuddyPage),
    PipesModule
  ],
})
export class AddnewbuddyPageModule {}
