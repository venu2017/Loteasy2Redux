import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestoMenuPage } from './resto-menu';

@NgModule({
  declarations: [
    RestoMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(RestoMenuPage),
  ],
})
export class RestoMenuPageModule {}
