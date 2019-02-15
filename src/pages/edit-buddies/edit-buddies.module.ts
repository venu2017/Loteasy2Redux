import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditBuddiesPage } from './edit-buddies';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    EditBuddiesPage,
  ],
  imports: [
    IonicPageModule.forChild(EditBuddiesPage),
    PipesModule
  ],
})
export class EditBuddiesPageModule {}
