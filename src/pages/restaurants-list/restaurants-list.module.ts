import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantsListPage } from './restaurants-list';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    RestaurantsListPage,
  ],
  imports: [
    IonicPageModule.forChild(RestaurantsListPage),
    ComponentsModule,
    PipesModule
  ],
})
export class RestaurantsListPageModule {}
