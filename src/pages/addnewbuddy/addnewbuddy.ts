import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { AppConstants } from '../../assets/appConstants';
import { Storage } from '@ionic/Storage';
@IonicPage()
@Component({
  selector: 'page-addnewbuddy',
  templateUrl: 'addnewbuddy.html',
})
export class AddnewbuddyPage {
UploadContactDetails:any;
userId:any;
cloudinaryPhotoPath:any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
buddyList:any[]=[];
buddyTobeAddedToList:any;
itemSelected:boolean = false;
public buddysearch:any;
public Buddies_details:any[]=[];
cloudImagePath:any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  constructor(public navCtrl: NavController, public navParams: NavParams,
       public apiService:ApiServices, public alertCtrl:AlertController, public storage:Storage) {
    this.UploadContactDetails = this.navParams.get("contact");
    this.userId = this.navParams.get("UserId");
    
  }

 async ionViewDidEnter(){
    let userId:any;
    let image_display:any;

    this.storage.get("userDetails").then(data=>{
      userId = data.UserId;
     
      this.apiService.FetchBuddiesListsByUserId(userId)
      .subscribe(data=>{
        let buddies =  JSON.parse(data);
        buddies.forEach(buddy=>{
        
       let buddy_dt=JSON.parse (buddy.BuddiesDetails);

       buddy_dt.forEach(element => {

        this.Buddies_details.push({

          "name":element.name,
          "phone":element.phone
        })
        
         
       });
          if(buddy.BuddiesListProfilePic!="undefined")
          {
            image_display=this.cloudinaryPhotoPath + buddy.BuddiesListProfilePic
          }
          else
          {
            image_display="assets/images/new buddies group icon.svg";
          }

          this.buddyList.push({BuddiesDetails:buddy_dt,BuddiesListId:buddy.BuddiesListId, checked:false,name:buddy.BuddiesListName,profile_img:image_display});
          })
    
        
      })
    })
    .catch(err=>{
      console.log(err.message);
    })

  }

  ionViewDidLoad() {
 
  }
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

    backtopreviouspage(){

      this.navCtrl.pop();
    }

    public count_buddy_selected:number=0;
 async saveContactToBuddyList(){

  await this.buddyList.forEach((element,indexdb) => {
    if(element.checked)
    {
      this.count_buddy_selected++;
    }

  })
  this.Buddies_details=[];

  if(this.navParams.get("from")=='setavaliablity')
  {
    this.Buddies_details.push({

      name: this.UploadContactDetails.displayName, 
      phone: this.UploadContactDetails["phoneNumbers[0].value"]
  
    })
  }
  else
  {

    console.log(this.navParams.get("typelist")+"this.navParams.get");
    if(this.navParams.get("typelist")=="phonelist")
    {
      this.Buddies_details.push({

        name: this.UploadContactDetails.name, 
        phone: this.UploadContactDetails.phone 
    
      })
    }
    else
    {
      this.Buddies_details.push({

        name: this.UploadContactDetails.displayName, 
        phone: this.UploadContactDetails["phoneNumbers[0].value"] 
    
      })
    }
  
}

console.log(this.count_buddy_selected+"count")

await this.buddyList.forEach((element,indexdb) => {



  if(element.checked)
  {
    
   
    element.BuddiesDetails.forEach(element => {
     
      this.Buddies_details.push({

        name:element.name,
        phone:element.phone

      })
      
    });
    // const obj1 = { name: this.UploadContactDetails.displayName, phone: this.UploadContactDetails["phoneNumbers[0].value"] };
    this.Buddies_details= this.removeDuplicates(this.Buddies_details, "phone");
    
    // const obj2 =  element.BuddiesDetails
    // const Buddies_updatedetails = { ...obj2, obj1 };
  
this.apiService.ModifyBuddyList(element.BuddiesListId,JSON.stringify(this.Buddies_details))
.subscribe(data=>{
 
  let alert = this.alertCtrl.create({
      subTitle:"Added User Phone Number To Buddy List Successfully!",
      buttons:[
        {text: 'OK',
        role: 'cancel',
      handler: () => {
        alert.dismiss().then(()=>{
        
        }).catch(err=>{
          console.log(err.message);
        })
      
      }
    }]
    
    })

    this.count_buddy_selected--;

    if(this.count_buddy_selected==0)
    {
      alert.present();
    
      setTimeout(() => {
        this.navCtrl.pop();
      }, 2000);
    }

   
})
  }

});
   
   
  

  }

  onBuddySelected(buddy){
    this.itemSelected= !this.itemSelected;
    console.log(buddy);
    this.buddyTobeAddedToList = buddy;
  }

  navigateBackToChooseInvitees(){
    this.navCtrl.pop();
  }

}
