import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoriesSharePage } from './memories-share';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MemoriesSharePage,
  ],
  imports: [
    IonicPageModule.forChild(MemoriesSharePage),
    PipesModule
  ],
})
export class MemoriesSharePageModule {}
