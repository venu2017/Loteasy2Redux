import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-invitee-search',
  templateUrl: 'invitee-search.html',
})
export class InviteeSearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InviteeSearchPage');
  }

}
