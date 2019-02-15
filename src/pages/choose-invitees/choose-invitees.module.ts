import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseInviteesPage } from './choose-invitees';
import { CallNumber } from '@ionic-native/call-number';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ChooseInviteesPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseInviteesPage),
    PipesModule
    
  ],
  providers:[
    CallNumber
  ]
})
export class ChooseInviteesPageModule {}
