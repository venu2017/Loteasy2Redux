import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickItemsPage } from './pick-items';
import {TreeModule} from 'primeng/tree';

@NgModule({
  declarations: [
    PickItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(PickItemsPage),
    TreeModule
  ],
})
export class PickItemsPageModule {}
