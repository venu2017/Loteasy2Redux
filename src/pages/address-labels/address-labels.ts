import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-address-labels',
  templateUrl: 'address-labels.html',
})
export class AddressLabelsPage {
  tabBarElement: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter(){
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressLabelsPage');
  }

  navigateBackToOrderFoodHome(){
    this.navCtrl.pop();
  }

  navigateToCreateAddressLabel(){
    this.navCtrl.push('AddAddressLabelPage',{from:'addressLabels'});
  }

}
