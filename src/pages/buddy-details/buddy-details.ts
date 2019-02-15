import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { ApiServices } from '../../services/appAPIServices';
import { AppConstants } from '../../assets/appConstants';
import { LoadingCreator } from '../../services/loadingcreator';
@IonicPage()
@Component({
  selector: 'page-buddy-details',
  templateUrl: 'buddy-details.html',
})
export class BuddyDetailsPage {
  
  UserId:any;
  memoryImages:string[];
  buddiesDetails:Array<any>=[];
  buddiesListWithPhotos:Array<any>=[];
  buddy:any;
  Buddies_count:any;
  User_list_contacts:any[]=[];
  cloudImagePath:any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  _profileIcon:string='assets/images/new buddies group icon.svg';
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage,
      public apiService:ApiServices, public loadingCtrl:LoadingController, public loadingCreator:LoadingCreator) {
       
        this.UserId = this.navParams.get("UserId");
        this.buddy = this.navParams.get("Buddy");
   
   
    }

    public List_users:any;
 async ionViewWillEnter() {
  this.buddiesListWithPhotos=[];
 
    this.List_users=await this.apiService.GetListofRegisters();
    
    this.buddiesDetails =[];
    this.List_users.Reg_users.forEach(element => {
      this.User_list_contacts.push({
        "UserName":element.UserName,
        "UserProfileImg":element.UserProfileImg,
        "PhoneNumber":element.PhoneNumber
        })
    });
    
    //
    let loading = this.loadingCtrl.create({
      spinner:'hide'
    });
    loading.data.content = this.loadingCreator.getLoadingSymbol();
    
    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 10000);
    
   
    this.buddiesDetails = JSON.parse(this.buddy.BuddiesDetails);
    this.Buddies_count= this.buddiesDetails.length;
   loading.dismiss();
  
 
    this.buddiesDetails.forEach(bd =>{
     
      console.log(JSON.stringify( this.User_list_contacts)+"bd.phone")
      let index=this.User_list_contacts.findIndex(x=>x.PhoneNumber==bd.phone);
      if(index>-1){
        this.buddiesListWithPhotos.push({name:bd.name,phone:bd.phone,
          profileImg:"https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/"+ this.User_list_contacts[index].UserProfileImg})
      }
      else
      {
        this.buddiesListWithPhotos.push({name:bd.name,phone:bd.phone,
          profileImg:"assets/images/Single Contact Icon.svg"})
      }
    })
   
    
    
  }

  backToMoreHomePage(){
    this.navCtrl.pop();
  }
  navigateToEditBuddies():void{
this.navCtrl.push('EditBuddiesPage', {BuddyName:this.buddy})

  }
}
