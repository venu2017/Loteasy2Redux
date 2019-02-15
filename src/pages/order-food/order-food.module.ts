import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderFoodPage } from './order-food';

@NgModule({
  declarations: [
    OrderFoodPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderFoodPage),
  ],
})
export class OrderFoodPageModule {}
