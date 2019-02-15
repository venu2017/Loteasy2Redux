import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoriesSelectionPage } from './memories-selection';
import { DialogModule } from 'primeng/dialog';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MemoriesSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(MemoriesSelectionPage),
    DialogModule,
    PipesModule
  ],
})
export class MemoriesSelectionPageModule {}
