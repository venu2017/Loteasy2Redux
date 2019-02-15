import { TabsPage } from './tabs';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {GeolocationService} from '../../services/geolocation';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        TabsPage
    ],
    imports: [
      IonicPageModule.forChild(TabsPage),
      ComponentsModule
    ],
    exports:
    [
      TabsPage
    ],
    providers:[
      GeolocationService
    ]
})
export class TabsPageModule { }