import { NgModule } from '@angular/core';
import { NotificationOneComponent } from './notification-one/notification-one';
import { NotificationTwoComponent } from './notification-two/notification-two';
import { ExpandableComponent } from './expandable/expandable';
import { InviteecountListComponent } from './inviteecount-list/inviteecount-list';
// import { SearchLocationWiseRestuarntsComponent } from './search-location-wise-restuarnts/search-location-wise-restuarnts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
// import {GMapModule} from 'primeng/gmap';
import { SearchBarComponent } from './search-bar/search-bar';


@NgModule({
	declarations: [
    NotificationOneComponent,
    NotificationTwoComponent,
    ExpandableComponent,
    InviteecountListComponent,
    // SearchLocationWiseRestuarntsComponent,
    SearchBarComponent,
    
    
],
	imports: [
       CommonModule,
       FormsModule,
       IonicModule,
    //    GMapModule,
       
    ],
	exports: [
    NotificationOneComponent,
    NotificationTwoComponent,
    ExpandableComponent,
    InviteecountListComponent,
    // SearchLocationWiseRestuarntsComponent,
    SearchBarComponent,
    
    
]
})
export class ComponentsModule {}
