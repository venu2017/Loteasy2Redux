import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CloudinaryServices } from '../../services/cloudinaryServices';
import { GeolocationService } from '../../services/geolocation';
import { GeocoderService } from '../../services/geocoder';
import { ApiServices } from '../../services/appAPIServices';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoteasyService } from '../../services/loteasyService';
import { LoadingCreator } from '../../services/loadingcreator';
@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  userMobile: any;
  base64Image: string;
  tabBarElement: any;
  profilePic: any;
  Address2: any;
  Address1: any;
  UserAddressType: any;
  isCameraEnabled: boolean = false;
  isNewAddressVisible: boolean;
  _formattedAddress: any;
  phoneNumber: any;
  userId: any;
  userEmail:string;
  address: any;
  errorText: string = "";
  pagetitle:string;
  public addressList:any[]=[];
  emailPlaceholder:string='Email';
  placeholder: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public Loteasy_Service: LoteasyService,
    private storage: Storage, private loadingCtrl: LoadingController,
    private _camera: Camera, private _cloudImageService: CloudinaryServices,
    private _geoLoc: GeolocationService, private _geoCode: GeocoderService,
    public apiService: ApiServices, public ngZone: NgZone, public alertCtrl: AlertController,
  public loadingCreator:LoadingCreator) {


    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewAddressVisible = false;

    if (this.navParams.get("ProfilePic") == "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/")
      this.profilePic = "assets/images/new buddies group icon.svg"
    else
      this.profilePic = this.navParams.get("ProfilePic");


    this.phoneNumber = this.navParams.get("phoneNumber");
    this.userId = this.navParams.get("UserId");
     this.apiService.FetchSingleUserById(this.userId)
     .subscribe(userDetails=>{
       this.userEmail = JSON.parse(userDetails).EmailId;
     })

  }

  async  ionViewWillEnter() {
    this.pagetitle = 'New Address';
   await this.storage.get("recentAddressesList").then((addresses:any)=>{
      if(addresses)addresses.forEach(address => {

      this.addressList.push(address);
      });
    })

    await this.storage.get("userDetails").then((data: any) => {

      this.userId = data.UserId;


      // 
    })
    this.populateUserSavedAddresses();
    let user_details = JSON.parse(await this.GetUserDetails(this.userId));
    this.placeholder.Name = user_details.UserName;
    this.userMobile = user_details.PhoneNumber;
   
    if (this.navParams.get("from") == "MoreDetails") {
      this.getCurrentLocation();

      this.ngZone.run(() => {
        this.placeholder = {
          Name: this.navParams.get("UserName"),
          Email: this.navParams.get("UserEmail"),
          Phone: this.navParams.get("phoneNumber")
         
        }
      })
    }
     




  }
  EditAddress(userAddress): void {
    this.pagetitle= 'Edit Address';
    this._formattedAddress=userAddress.AddressLine3;
    this.isNewAddressVisible = true;
    this.Address1 = userAddress.AddressLine1;
    this.Address2 = userAddress.AddressLine2;
    this.UserAddressType = userAddress.UserAddressType;

  }
  updateUserSavedAddresses() {

    if (this.navParams.get("from") == "MoreDetails") {
      this.populateUserSavedAddresses();
    }
    else if (this.navParams.get("from") == "EditLocationRecentLocation") {
      this.navCtrl.push('EditLocationPage')
    }

  }


  populateUserSavedAddresses() {
    this.storage.get("userDetails").then((data: any) => {

      this.userId = data.UserId;
    })
    this.tabBarElement.style.display = 'none';
    if (this.navParams.get("from") == "EditLocationRecentLocation") {
      this.isNewAddressVisible = true;
      console.log(this.navParams.get("Address"))
      this._formattedAddress = this.navParams.get("Address");
    }
    else
    {
    this.apiService.fetchSavedAddresses(this.userId)
      .subscribe((addresses => {
        this.address = JSON.parse(addresses);
        if (this.address.length > 0) {
          this._formattedAddress = "";
        }
        else {
          this._formattedAddress = "Currently there are no saved addresses";
        }
      }))
    }
     
  }
  Newaddress(): void {
    this.pagetitle = 'New Address';
    this.isNewAddressVisible = true;
    this.UserAddressType = 1;
    this.Address1 = "";
    this.Address2 = "";
  }


  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  backToMoreHomePage(name, email) {
    console.log(name,email);
    let loading = this.loadingCtrl.create({
      spinner: 'hide'
    })
    loading.data.content = this.loadingCreator.getLoadingSymbol();
   
      this.apiService.updateUserProfile(this.userId, name, email)
        .subscribe(data => {
          console.log(data);
          loading.dismiss();
          this.navCtrl.pop();

        })
  
  }

  navigateBackToMorePage(){
    this.navCtrl.pop();
  }

  selectPictureFromPhotoLibrary(sorceOption: number) {
    let options: CameraOptions = {
      quality: 50,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      saveToPhotoAlbum: true,
      sourceType: sorceOption,
      allowEdit: true,
      correctOrientation: true,
      targetHeight: 100,
      targetWidth: 100
    }

    if (!this.isCameraEnabled) alert("Camera is not enabled");

    this._camera.getPicture(options)
      .then((data: any) => {
        this.base64Image = 'data:image/jpeg;base64,' + data;
        this._cloudImageService.uploadPhoto(this.base64Image, 'profile')
          .subscribe((data: any) => {
            this.profilePic = data.secure_url;
            this.storage.get("userDetails").then((data: any) => {
              console.log(data);
              let userId = data.UserId;
              let imagePath = this.profilePic.split('/')[9];
              // console.log(userId);
              this.apiService.addOrSaveImage(userId, imagePath, "userProfile").subscribe((data: any) => {
                console.log(data);
              });

            }).catch((err: any) => {
              console.log(err);

            })

          })


      })
      .catch((err: any) => {
        console.log(err);
      });
  }


 async saveUserAddress(housenumber, landmark, addressType) {
  
    if ((housenumber != null && housenumber != undefined && housenumber != "")
      && (landmark != null && landmark != undefined && landmark != "") ) {
        if(this._formattedAddress == 'Currently there are no saved addresses' || !this._formattedAddress){
          this._formattedAddress = '';
        }
      this.apiService.saveUserAddress(this.userId, housenumber + "|" + landmark + "|" + this._formattedAddress, addressType)
        .subscribe(data => {
          let alert = this.alertCtrl.create({
            message: 'Address has been saved!',
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  this.isNewAddressVisible = false;
                  //this.navCtrl.pop();
                }
              }]
          })
          alert.present();
                  
          console.log(JSON.stringify(this.addressList)+"this.addressList")
          let index=this.addressList.findIndex(x=>x.Address==this._formattedAddress);
          if(index>-1)
          {
              console.log("haiiii");

            this.addressList[index].SavedType='Saved';
          }
            this.storage.set("recentAddressesList",this.addressList);

          this.populateUserSavedAddresses();
          if(this.navParams.get('from')=='EditLocationRecentLocation'){
            this.navCtrl.pop();
          }
        })
    } else {
      let alert = this.alertCtrl.create({
        title: 'Empty Fields',
        message: 'Please provide Hno, Landmark details',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }]
      })

      alert.present();

    }

  }

  getCurrentLocation() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide'
    })
    loading.data.content = this.loadingCreator.getLoadingSymbol();
    loading.present();
    this._geoLoc._geolocate({ enableHighAccuracy: true }).then((pos: any) => {
      console.log(pos);
      let latlong = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      this._geoCode._reverseGeocode(latlong).then((res: any) => {
        console.log(res[0]);
        this._formattedAddress = res[0].formatted_address.split(",").slice(1);
        loading.dismiss();
      }).catch(err => console.log(err.message));
    }).catch(err => console.log(err.message));
  }

  deleteAddress(index: number) {

    let alertfordelete = this.alertCtrl.create({
      title: 'Location Deletion',
      message: 'Do you want to delete this address?',
      buttons: [
        {
          text: 'Delete',
          role: 'Delete',
          handler: () => {
            console.log('Cancel clicked');
            this.apiService.deleteUserAddress(this.userId, index)
              .subscribe(data => {
                console.log(data);
                this.populateUserSavedAddresses()
              })
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alertfordelete.present();

  }

  async GetUserDetails(User_id: any): Promise<any> {

    return await this.Loteasy_Service.fetch('get', 'FetchSingleUserById', { UserId: User_id })
  }
}
