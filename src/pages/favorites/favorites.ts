import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, IonicPage } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { Storage } from '@ionic/Storage';
import { LoadingCreator } from '../../services/loadingcreator';
@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
RestaurantDetailPage:'RestaurantDetailPage';
public faviourties_rest:any[]=[];
public faviourties_buddies:any[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService:ApiServices, 
    public loadingCtrl:LoadingController, public storage:Storage, public loadingCreator:LoadingCreator) {

      let loading = this.loadingCtrl.create({
        spinner:'hide'
      })
      loading.data.content = this.loadingCreator.getLoadingSymbol();
      loading.present();

      this.apiService.GeTuserFaviourties( this.navParams.get("UserId")).subscribe(Faviourates=>{

      this.faviourties_rest=Faviourates.Faviourties;
      console.log(Faviourates.Faviourties, Faviourates);

      this.faviourties_buddies=Faviourates.Buddy_Details;

      loading.dismiss();

      })



    
  }
  Rest_details(rest_id:number):void{
    this.navCtrl.push('RestaurantDetailPage',{RestaurantId:rest_id});


  }
  Buddy_details():void{

   // this.navCtrl.push(BuddyDetailsPage,{Buddy:buddy,buddyname:buddy_name});
  }

  navigateBackToMore(){
    this.navCtrl.pop();
  }

}
