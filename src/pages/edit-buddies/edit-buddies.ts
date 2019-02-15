import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { ApiServices } from '../../services/appAPIServices';
import { AppConstants } from '../../assets/appConstants';
import { LoteasyService } from '../../services/loteasyService';
import { LoadingCreator } from '../../services/loadingcreator';

@IonicPage()
@Component({
  selector: 'page-edit-buddies',
  templateUrl: 'edit-buddies.html',
})
export class EditBuddiesPage {
public  User_Id:any;
public searchText:any;
  buddiesDetails:Array<any>=[];
  buddiesListWithPhotos:Array<any>=[];
public Buddy_id:any;
  buddy:any;
  Buddies_count:any;
  User_list_contacts:any[]=[];
  cloudImagePath:any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  _profileIcon:string='assets/images/new buddies group icon.svg';
 
  constructor(public navCtrl: NavController, public alertCtrl:AlertController, public navParams: NavParams, public storage:Storage,public loteasyservice:LoteasyService,
      public apiService:ApiServices, public loadingCtrl:LoadingController, public loadingCreator:LoadingCreator) {
       
   

    this.buddy = this.navParams.get("BuddyName");
   this.searchText= this.buddy.BuddiesListName;
   this.Buddy_id=this.buddy.BuddiesListId;
    console.log(this.buddy)
   
    }
    AddNewMembers(){

      this.navCtrl.push('MyBuddiesPage',{ from:'EditBuddies',buddy:this.buddy})
    }
    public List_users:any;
 async ionViewWillEnter() {
  this.storage.get("userDetails").then((data:any)=>{
  
    this.User_Id=data.UserId;
  })    
    this.List_users=await this.apiService.GetListofRegisters();
    

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
     
      
      let index=this.User_list_contacts.findIndex(x=>x.PhoneNumber==bd.phone);
      if(index>-1){
        console.log(JSON.stringify( this.User_list_contacts)+"bd.phone")
        this.buddiesListWithPhotos.push({name:bd.name,phone:bd.phone,
          profileImg:"https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/"+ this.User_list_contacts[index].UserProfileImg})
      }
      else
      {
        console.log(JSON.stringify( this.User_list_contacts)+"bd.phone")
        this.buddiesListWithPhotos.push({name:bd.name,phone:bd.phone,
          profileImg:"assets/images/Single Contact Icon.svg"})
      }
    })
   
    
    
  }

  backpage(){
    this.navCtrl.push('MyBuddiesPage')
  }
  navigateToEditBuddies():void{
this.navCtrl.push('EditBuddiesPage', {BuddyName:this.buddiesDetails})

  }
  async DeleteBuddyGroupcall(UserId,BuddyGroupid):Promise<any>{
    return await this.loteasyservice.fetch('get','DeleteUserBuddyGroup',{UserId:UserId,  BuddyGroupid:BuddyGroupid});
  } 

  async UpdateBuddiesgroup(buudyid,buddygroupname,BuddiesDetails,buddyname):Promise<any>{

    return await this.loteasyservice.fetch('get','updateUserBuddyGroup',{buudyid:buudyid,buddygroupname:buddygroupname,BuddiesDetails:BuddiesDetails,buddyname:buddyname})
  }
 async savebuddylist(buddy_id:any){
  let loading = this.loadingCtrl.create({
    spinner:'hide'
  });
  loading.data.content = this.loadingCreator.getLoadingSymbol();
  loading.present();

  setTimeout(() => {
    loading.dismiss();
  }, 10000);
  let result= this.UpdateBuddiesgroup(this.Buddy_id,this.buddy.BuddiesListProfilePic, JSON.stringify( this.buddiesDetails), this.searchText)
loading.dismiss();
this.navCtrl.push('MyBuddiesPage')  
}

  removeContact(buddy_name:any,buddy_phone:any,buddy_id:any){

  let dbindex=  this.buddiesListWithPhotos.findIndex(x=>x.name==buddy_name);
  if(dbindex>-1){
    this.buddiesListWithPhotos.splice(dbindex,1);

 let index=this.buddiesDetails.findIndex(x=>x.phone==buddy_phone);
 if(index>-1){
   this.buddiesDetails.splice(index,1);
this.Buddies_count=this.Buddies_count-1;
   
 }
  }
  }
  async deleteBuddygroup(buddy_id:any,user_id:any){
    
    let alertfordelete =  this.alertCtrl.create({
      message: 'Delete this buddy group '+this.buddy.BuddiesListName+'?',
      buttons: [
        {
          text: 'Delete',
          role: 'Delete',
          handler: () => {
          
  let Events_list=  this.DeleteBuddyGroupcall( user_id,buddy_id);
console.log(user_id+"user_id")
this.navCtrl.push('MyBuddiesPage',{UserId:user_id})
  
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
}
