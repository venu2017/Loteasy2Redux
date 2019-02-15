import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantSearchPage } from './restaurant-search';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    RestaurantSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(RestaurantSearchPage),
    PipesModule
  ],
})
export class RestaurantSearchPageModule {}
