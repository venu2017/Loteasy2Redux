import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { LoteasyService } from '../../services/loteasyService';
import { AppConstants } from '../../assets/appConstants';


@IonicPage()
@Component({
  selector: 'page-search-buddies',
  templateUrl: 'search-buddies.html',
})
export class SearchBuddiesPage {
public buddyList:any[]=[];
cloudImagePath:any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  constructor(public navCtrl: NavController, public loteasyService:LoteasyService, public alertCtrl:AlertController, public navParams: NavParams,public apiService:ApiServices)  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchBuddiesPage');
  }
  async DeleteBuddyGroup(UserId,BuddyGroupid):Promise<any>{
    return await this.loteasyService.fetch('get','DeleteUserBuddyGroup',{UserId:UserId,  BuddyGroupid:BuddyGroupid});
  } 
  EditBuddies(buddy:any){
    this.navCtrl.push('EditBuddiesPage',{BuddyName:buddy});
  }
  async removeBuddy(buddy_id:any,userid:any,buddy_name:any){


    let alertfordelete =  this.alertCtrl.create({
      title: 'Buddy Group Deletion',
      message: 'Do you want to Remove the '+buddy_name+'?',
      buttons: [
        {
          text: 'Delete',
          role: 'Delete',
          handler: () => {
          
  let Events_list=  this.DeleteBuddyGroup(userid,buddy_id);
  let index=  this.buddyList.findIndex(x=>x.BuddiesListName==buddy_name)
    if(index>-1)
    {
      console.log("removed")
      this.buddyList.splice(index,1)
    }
          }
        },
        {
          text: 'Cancel',
          role:'Cancel',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alertfordelete.present();
   
  }
  ionViewDidEnter(){
   
    this.apiService.FetchBuddiesListsByUserId(this.navParams.get("Userid"))
    .subscribe(data=>{
      this.buddyList = JSON.parse(data);

      console.log(this.buddyList+"this.buddyList")

     
    })


   

  }
  onMemberChanged(val:any){
        this.buddyList.filter((item:any)=>{
      return item.BuddiesListName.toLowerCase().indexOf(val) === 0;
      })
 

  }
  backpage(){
    this.navCtrl.push('MyBuddiesPage' );
  }
  buddiesDetails(buddy: any) {
    this.navCtrl.push('BuddyDetailsPage', { Buddy: buddy });
  }
}
