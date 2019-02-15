import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import {LoteasyService} from '../../services/loteasyService'
import { Storage } from '@ionic/Storage';
@IonicPage()
@Component({
  selector: 'page-cuisines-modal',
  templateUrl: 'cuisines-modal.html',
})
export class CuisinesModalPage {
restoName:any;
restoModalType:any;
restoModalData:any;
restoModalIcon:any;
public Review_rating:any;
public txtcomments:any;
public User_id:any;
public user_reviews:any[]=[];
public offers_array:any[]=[];
public Register_users:any[]=[];
  constructor(public navCtrl: NavController,public loteasyService:LoteasyService, public alertCtrl:AlertController, private storage:Storage,public navParams: NavParams, private viewCtrl:ViewController,public service_call:ApiServices) {
this.restoName = this.navParams.get("name");
this.restoModalType = this.navParams.get("modalType");
this.restoModalIcon = this.navParams.get("icon");
if(this.restoModalType=='Offers'){
  this.restoModalData = this.navParams.get("data").split(',');
  this.restoModalData.forEach(element => {
if(element!="|~|")
this.offers_array.push(element)
  });
}else{
  this.restoModalData = this.navParams.get("data").split(',');
}


  }
  async GetUsersRegisters():Promise<any>{
    return await this.loteasyService.fetch('get','GetRegisteredUsers',{});
  }

async ionViewDidEnter(){

  let list_reg_users=await this.GetUsersRegisters();
 await list_reg_users.Reg_users.forEach(element => {
    this.Register_users.push({
    "UserName":element.UserName,
    "UserProfileImg":element.UserProfileImg,
    "PhoneNumber":element.PhoneNumber,
    "UserId":element.UserId,
    })
    });
 await this.Display_Reviews();
  this.storage.get('userDetails').then(d=>{

    this.User_id=d.UserId;

  
   
  })
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad CuisinesModalPage');
  }
  closeModal(){
    this.navCtrl.pop();
   }
   ratingselected(event) {
  
    this.Review_rating=event;
}
public rate:any;
createReview(){
 
  let Rest_id=this.navParams.get("Restuarntid");
this.service_call.CreateRestReview(this.User_id,Rest_id,this.txtcomments,this.Review_rating).subscribe(res=>{
this.txtcomments='';
this.rate=0;

alert.present();

})
let alert = this.alertCtrl.create({
  message: 'Your Review  has been successfully submitted',
  buttons: [
  {
  text: 'OK',
  role: 'cancel',
  handler: () => {
    this.Display_Reviews();
  }
  }]
  })
}
shownGroup = null;
toggleGroup(group) {
  if (this.isGroupShown(group)) {
      this.shownGroup = null;
  } else {
      this.shownGroup = group;
  }
};
isGroupShown(group) {

  return this.shownGroup === group;
};

Display_Reviews(){
  this.user_reviews=[];

    this.service_call.GetRestuarntsReviews(this.navParams.get("Restuarntid")).subscribe(results=>{

      results.Rest_reviews.forEach(element => {
        let index=this.Register_users.findIndex(x=>x.UserId==element.UserId);
        if(index>-1)
        {
          this.user_reviews.push({

            "ReviewText":element.ReviewText,
            "ReviewRating":element.ReviewRating,
            "user":this.Register_users[index].UserName,
            "UserProfileImg":"https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/"+this.Register_users[index].UserProfileImg,
          })
        }
      
      });
 
    })
  

}
}
