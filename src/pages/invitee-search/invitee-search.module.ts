import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InviteeSearchPage } from './invitee-search';

@NgModule({
  declarations: [
    InviteeSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(InviteeSearchPage),
  ],
})
export class InviteeSearchPageModule {}
