import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MorePage } from './more';
import {ConfirmDialogModule} from 'primeng/confirmdialog';



@NgModule({
  declarations: [
    MorePage
  ],
  imports: [
    IonicPageModule.forChild(MorePage),
    ConfirmDialogModule
  ],
  
})
export class MorePageModule {}