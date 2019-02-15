import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginTwoPage } from './login-two';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LoginTwoPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginTwoPage),
    PipesModule
  ],
  exports:[LoginTwoPage]
})
export class LoginTwoPageModule {}
