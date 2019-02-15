import { Component } from "@angular/core";
import {NavController,Nav, Tabs, Platform, 
        ActionSheetController, LoadingController, IonicPage} from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CloudinaryServices } from '../../../services/cloudinaryServices';
import { Storage } from "@ionic/Storage";
import { AppConstants } from '../../../assets/appConstants';
import { ApiServices } from '../../../services/appAPIServices';
import { LoadingCreator } from '../../../services/loadingcreator';
import { InAppBrowser , InAppBrowserOptions } from '@ionic-native/in-app-browser';
import {ConfirmationService} from 'primeng/api';



@IonicPage()
@Component({
    selector:'page-more',
    templateUrl:'more.html'
})
export class MorePage{
    options : InAppBrowserOptions = {
        location : 'yes',//Or 'no' 
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'yes',//Android only ,shows browser zoom controls 
        hardwareback : 'yes',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only 
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only 
        toolbar : 'yes', //iOS only 
        enableViewportScale : 'no', //iOS only 
        allowInlineMediaPlayback : 'no',//iOS only 
        presentationstyle : 'pagesheet',//iOS only 
        fullscreen : 'yes',//Windows only    
    };
    isCameraEnabled: boolean = false;
    base64Image:any ='';
    profilePic:any;
    profileName:string="";
    phoneNumber:any;
    userId:any;
    userEmail:string;
   // @ViewChild('tabs') tabRef: Tabs;
    tabs:Tabs;
    constructor(private navCtrl:NavController,private nav:Nav, private _camera:Camera,
                private _diagnostic:Diagnostic, private _platform:Platform,
                 private _actionSheetCtrl:ActionSheetController,
                    private _cloudImageService:CloudinaryServices,
                    private storage:Storage, private loadingCtrl:LoadingController,
                     public apiService:ApiServices, public loadignCreator:LoadingCreator,
                    private theInAppBrowser:InAppBrowser, private confirmService:ConfirmationService){
    this.tabs = this.navCtrl.parent;

    this._platform.ready().then(()=>{
        this.isCameraAvailable();
       

    }).catch((err:any)=>{
        console.log(err.message);
    })
    
}

    ionViewDidEnter(){
     let loading =  this.loadingCtrl.create({
            spinner:'hide'
        })

        loading.data.content = this.loadignCreator.getLoadingSymbol();
        loading.present().then(()=>{
            this.storage.get("userDetails").then((userdetails:any)=>{
                this.userId = userdetails.UserId;
                this.phoneNumber = userdetails.phone;
                this.apiService.retrieveImage(this.userId,"userProfile").subscribe((profileImage:any)=>{
                    let imagePath = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH + profileImage.split(":")[1];
                    if(imagePath=="https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/")
                    this.profilePic="assets/images/new buddies group icon.svg"
                    else
                    this.profilePic = imagePath;
                   
                   
                })
                this.apiService.FetchSingleUserById(this.userId).subscribe((user:any)=>{
                    console.log(user);
                    this.profileName = JSON.parse(user).UserName;
                    this.userEmail = JSON.parse(user).EmailId;
                })
                
                loading.dismiss().then(()=>{console.log("Loading dismissed!")})
                    .catch(err=>{console.log(err.message)})

            })
        }).catch(err=>{
            console.log(err.message);
        })
       
    }

     navigateToHomeTab(){
     this.tabs.select(2);
     }

    isCameraAvailable()
   {
      this._diagnostic.isCameraAvailable()
      .then((isAvailable : any) =>
      {
         this.isCameraEnabled = true;
      })
      .catch((error :any) =>
      {
         console.log('Camera is:' + error);
      });
   }

   promptToChooseSourceOption(){
    let actionSheet = this._actionSheetCtrl.create({
        title: 'Please Chooose Option',
        buttons: [
          {
            text: 'Albums',
            icon:'albums',
            role: 'destructive',
            handler: () => {
                this.selectPictureFromPhotoLibrary(0);
            }
          },
          {
            text: 'Camera',
            icon:'camera',
            handler: () => {
                this.selectPictureFromPhotoLibrary(1);
            }
          }
         
         
        ]
      });

     actionSheet.present();
   }

   selectPictureFromPhotoLibrary(sorceOption:number){
   let options : CameraOptions = {
         quality 			: 50,
         destinationType 	: this._camera.DestinationType.DATA_URL,
         encodingType 		: this._camera.EncodingType.JPEG,
         saveToPhotoAlbum   : true,
         sourceType 		: sorceOption,
         allowEdit           : true,
         correctOrientation:true,
        targetHeight       :    100,
        targetWidth        :    100
      }

      if(!this.isCameraEnabled) alert("Camera is not enabled");

      this._camera.getPicture(options)
      .then((data : any) =>
      {
         this.base64Image = 'data:image/jpeg;base64,' + data;
        //  let publicId = 'root/profile_pics';
         this._cloudImageService.uploadPhoto(this.base64Image,'profile')
            .subscribe((data:any)=>{
            console.log(data.secure_url);
            this.profilePic = data.secure_url;
            
            console.log(this.profilePic.split('/'));
            let imagePath = this.profilePic.split('/')[9];
            console.log(imagePath);
           
               this.apiService.addOrSaveImage(this.userId,imagePath,"userProfile").subscribe((data:any)=>{
                   console.log(data);
               });

        })
                
      })
      .catch((err : any) =>
      {
         console.log(err);
      });
   }

   navigateToProfileEdit(){
    this.navCtrl.push('MyProfilePage',{UserId:this.userId, ProfilePic:this.profilePic, phoneNumber:this.phoneNumber,UserName:this.profileName,UserEmail:this.userEmail});
        
       
    //    this.navCtrl.push(MyProfilePage);
   }

   navigateToMyPreferences(){
       this.navCtrl.push('MyPreferencesPage',{UserId:this.userId, 
            ProfilePic:this.profilePic, phoneNumber:this.phoneNumber, UserName:this.profileName,UserEmail:this.userEmail});
   }

   navigateToMyBuddiesPage(){
       this.navCtrl.push('MyBuddiesPage',{UserId:this.userId, 
        ProfilePic:this.profilePic, phoneNumber:this.phoneNumber,UserName:this.profileName,UserEmail:this.userEmail});
   }

   navigateToMyFavorites(){
       this.navCtrl.push('FavoritesPage',{UserId:this.userId});
   }

   logout(){
       this.confirmService.confirm({
           message:'Do you really want to logout?',
           accept:()=>{
               this.storage.remove('userDetails').then(d=>{
                this.navCtrl.push('LoginOnePage');
               })
            // this.storage.clear().then(d=>{
            //     this.navCtrl.push('LoginOnePage');
            // })
           },
           reject:()=>{
               console.log('rejected');
           }
       })
       
      
   }
   public openWithInAppBrowser(type:string){
    let target = "_blank";
    this.theInAppBrowser.create(`assets/${type}.htm`,target,this.options);
    
}
}