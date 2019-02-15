import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
import { DialogModule } from 'primeng/dialog';
import { SlickModule } from 'ngx-slick';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    EventsPage
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    DialogModule,
    SlickModule,
    PipesModule
  ],
  exports: [
    EventsPage
  ]
})
export class EeventsPageModule {}