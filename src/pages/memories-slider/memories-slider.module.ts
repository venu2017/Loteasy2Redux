import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoriesSliderPage } from './memories-slider';
import { SlickModule  } from 'ngx-slick';

@NgModule({
  declarations: [
    MemoriesSliderPage,
  ],
  imports: [
    IonicPageModule.forChild(MemoriesSliderPage),
    SlickModule
  ],
})
export class MemoriesSliderPageModule {}
