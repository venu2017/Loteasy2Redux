import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteeStatusPage } from './invitee-status';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    InviteeStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteeStatusPage),
    DialogModule
  ],
})
export class InviteeStatusPageModule {}
