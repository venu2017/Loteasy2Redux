import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginOnePage } from './login-one';

@NgModule({
  declarations: [
    LoginOnePage,
  ],
  imports: [
    IonicPageModule.forChild(LoginOnePage),
  ],
  exports:[LoginOnePage]
})
export class LoginOnePageModule {}
