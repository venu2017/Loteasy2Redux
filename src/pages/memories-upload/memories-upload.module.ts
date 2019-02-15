import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoriesUploadPage } from './memories-upload';

@NgModule({
  declarations: [
    MemoriesUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(MemoriesUploadPage),
  ],
})
export class MemoriesUploadPageModule {}
