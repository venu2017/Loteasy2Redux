import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchBuddiesPage } from './search-buddies';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchBuddiesPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchBuddiesPage),
    PipesModule
  ],
})
export class SearchBuddiesPageModule {}
