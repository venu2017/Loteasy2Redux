import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-add-address-label',
  templateUrl: 'add-address-label.html',
})
export class AddAddressLabelPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAddressLabelPage');
  }

  navigateBackToAddressLabels(){
    this.navCtrl.pop();
  }

  onAddressFormSubmit(addressFields:any){
    console.log(addressFields);
  }

}
