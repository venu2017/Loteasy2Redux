import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvitesPage } from './invites';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    InvitesPage
  ],
  imports: [
    IonicPageModule.forChild(InvitesPage),
    PipesModule
  ],
  exports: [
    InvitesPage
  ]
})
export class InvitesPageModule {}