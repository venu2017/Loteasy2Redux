import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyBuddiesPage } from './my-buddies';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MyBuddiesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyBuddiesPage),
    ComponentsModule,
    PipesModule
  ],
})
export class MyBuddiesPageModule {}
