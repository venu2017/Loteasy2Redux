import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoriesDetailsPage } from './memories-details';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    MemoriesDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MemoriesDetailsPage),
    DialogModule
  ],
})
export class MemoriesDetailsPageModule {}
