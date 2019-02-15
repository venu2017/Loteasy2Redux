import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPreferencesPage } from './my-preferences';

@NgModule({
  declarations: [
    MyPreferencesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPreferencesPage),
  ],
})
export class MyPreferencesPageModule {}
