import { Component, ViewChild,ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { Storage } from '@ionic/Storage';
import { Contacts} from '@ionic-native/contacts';
import { AppConstants } from '../../assets/appConstants';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingCreator } from '../../services/loadingcreator'

@IonicPage()
@Component({
selector: 'page-memories-share',
templateUrl: 'memories-share.html',
})
export class MemoriesSharePage {
enableSubmitButtn: boolean;
@ViewChild('contactInput') searchContact:ElementRef;
@ViewChild('shareModal') shareModal:ElementRef;
loteasyBuddies:Array<any>=[];
userId:any;
userDetailsArray:Array<any>=[];
cloudinaryPath:string = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
phoneNumbersOfBuddies:Array<any>=[];
eventId:any;
isContactPhotoNull: boolean;
memory:any;
public user_contacts:any[]=[];
public query:any;
public HideSubmitt:boolean=false;
brands: string[] = ['Audi','BMW','Fiat','Ford','Honda','Jaguar','Mercedes','Renault','Volvo','VW'];
public list_user:any[]=[];
selectedBuddiesCount:number=0;
public buddy_count:number=0;
public NotAttendedUsers:any[]=[];
constructor(public navCtrl: NavController, public navParams: NavParams,  public sanitizer:DomSanitizer,
public apiService:ApiServices, public storage:Storage, 
public contacts:Contacts, public platform:Platform, 
public ngZone:NgZone, public loadingCtrl:LoadingController, public alertCtrl:AlertController, public loadingCreator:LoadingCreator) {
  this.HideSubmitt=false;
this.memory = this.navParams.get('memory');
this.eventId = this.navParams.get('memory').Event_Id;
this.buddy_count=this.navParams.get('memory').Shared_count;
this.buddies_list();
}
buddies_list(){
let loading = this.loadingCtrl.create({
spinner:'hide',

})

loading.data.content = this.loadingCreator.getLoadingSymbol();
loading.present();
this.storage.get("userDetails").then(data=>{
this.userId = data.UserId;

this.apiService.GetEventDetailsByEventId(this.navParams.get('memory').Event_Id).subscribe(user_details=>{

  if(user_details.EventCreatedBy==this.userId)
{
 
this.apiService.GetUsersRegisters()
.subscribe(Reg_data=>{
Reg_data.Reg_users.forEach(element => {

  if(element.UserId==this.userId)
  {
   console.log(element.UserProfileImg+"element.UserProfileImg")
    if(element.UserProfileImg=='NULL' || element.UserProfileImg==" ")
    {

      this.userDetailsArray.push({
        "UserName":element.UserName,
        "UserProfileImg":"assets/images/new buddies group icon.svg",
        "Phone":element.PhoneNumber,
        "isChecked":false
        })
    }
   
    else
    {
      this.userDetailsArray.push({
        "UserName":element.UserName,
        "UserProfileImg":this.cloudinaryPath+element.UserProfileImg,
        "Phone":element.PhoneNumber,
        "isChecked":false
        })
    }



   

  }

});
})

}
  
 
})
this.apiService.GetEventStatus(this.navParams.get('memory').Event_Id)
.subscribe(buddies=>{
  this.NotAttendedUsers=[];
  for(var i=0;i<buddies.EventDeails.length;i++){
    let profile_pic="";
// if(buddies.EventDeails[i].Event_status=='1')
// {
  if(buddies.EventDeails[i].profile_pic=="No Pic")
  profile_pic="assets/images/new buddies group icon.svg";
  else
  profile_pic=this.cloudinaryPath+buddies.EventDeails[i].profile_pic;

  this.userDetailsArray.push({
    "UserName":buddies.EventDeails[i].Invitee_name,
    "Phone":buddies.EventDeails[i].MobileNumber,
    "UserProfileImg":profile_pic,
    "isChecked":false
    })
//}
// else
// {
// this.NotAttendedUsers.push({
//   "UserName":buddies.EventDeails[i].UserName,
//   "Phone":buddies.EventDeails[i].MobileNumber,
//   "UserProfileImg":buddies.EventDeails[i].profile_pic
// })
// }
    
  }

loading.dismiss();

setTimeout(() => {
this.userDetailsArray= this.removeDuplicates(this.userDetailsArray, "Phone");   

}, 500);
})
})
}
// filteredBrands: any[];

// brand: string;
// filterBrands(event) {
//   this.filteredBrands = [];
//   for(let i = 0; i < this.NotAttendedUsers.length; i++) {
//       let brand = this.NotAttendedUsers[i];
//       if(brand.UserName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
//           this.filteredBrands.push(brand.UserName);
//       }
//   }
// }
removeDuplicates(originalArray, prop) {
var newArray = [];
var lookupObject  = {};
for(var i in originalArray) {
lookupObject[originalArray[i][prop]] = originalArray[i];
}
for(i in lookupObject) {
newArray.push(lookupObject[i]);
}
return newArray;
}
ionViewDidEnter(){

}


sharePhotosToBuddies(){

  if(this.selected_shared_usersalbums.length>0){
   
this.HideSubmitt=true;
        let alert = this.alertCtrl.create({
          subTitle:'The photos have been successfully shared',
          buttons:[
          {
          text:'OK',
          role:'cancel',
          handler:()=>{
          this.navCtrl.pop();
          }
          }
          ]
          })
  let loading = this.loadingCtrl.create({
  spinner:'hide',
  
  })

  loading.data.content = this.loadingCreator.getLoadingSymbol();
  
  loading.present();
  this.userDetailsArray.forEach(ud=>{
  if(ud.isChecked==true){
  this.phoneNumbersOfBuddies.push(ud.Phone);
  }
  })
  setTimeout(() => {
    //
  this.apiService.SharePhotosToBuddies(this.userId, this.navParams.get('memory').Event_Id,this.navParams.get('memory').Event_images,
  this.phoneNumbersOfBuddies.toString(),new Date().toString())
  .subscribe(data=>{
  this.HideSubmitt=true;
  loading.dismiss();
  alert.present();
  })
  
  }, 1000);
  }
  else
  {
 
    let alert = this.alertCtrl.create({
      subTitle:'Please select one User to share',
      buttons:[
      {
      text:'OK',
      role:'cancel',
      handler:()=>{
    
      }
      }
      ]
      })
      alert.present();
  }  
   
 
}
ionViewDidLoad(){
this.shareModal.nativeElement.style.display = 'block';
this.shareModal.nativeElement.style.width = '100%';
}
navigateBackToMemories(){
this.navCtrl.push('MemoriesPage');
}

public selected_shared_usersalbums:any[]=[];

/*var uniqueArray = function(arrArg) {
    return arrArg.filter(function(elem, pos,arr) {
      return arr.indexOf(elem) == pos;
    });
  };*/
  // console.log(uniqueArray(this.selected_shared_usersalbums));
Buddy_contactselecte(phone):void{
let index =  this.userDetailsArray.findIndex(x => x.Phone==phone);

let find_index= this.selected_shared_usersalbums.findIndex(x=>x==phone);

if(this.userDetailsArray[index].isChecked)
{
this.userDetailsArray[index].isChecked=false;
//
}
else
{
this.userDetailsArray[index].isChecked=true;

}
if(find_index>-1){

this.selected_shared_usersalbums.splice(find_index, 1);
}
else
{
this.selected_shared_usersalbums.push(phone);
}


}
}