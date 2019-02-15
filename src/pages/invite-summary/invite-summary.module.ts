import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteSummaryPage } from './invite-summary';
import {DialogModule} from 'primeng/dialog';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    InviteSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteSummaryPage),
    DialogModule,
    
  ],
  providers:[
    CallNumber
  ]
})
export class InviteSummaryPageModule {}
