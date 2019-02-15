import { Component, ViewChild, ElementRef, NgZone, Renderer } from '@angular/core';
import {
  IonicPage, NavController, NavParams, Platform,
  ActionSheetController, LoadingController, ToastController, AlertController
} from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CloudinaryServices } from '../../services/cloudinaryServices';
import { Storage } from '@ionic/Storage';
import { ApiServices } from '../../services/appAPIServices';
import { AppConstants } from '../../assets/appConstants';
import { Contacts } from '@ionic-native/contacts';
import { LoteasyService } from '../../services/loteasyService';
import { LoadingCreator } from '../../services/loadingcreator';
@IonicPage()
@Component({
  selector: 'page-my-buddies',
  templateUrl: 'my-buddies.html',
})
export class MyBuddiesPage {
  public buddyeditname: any;
  UserId: any;
  _groupPic: any;
  base64Image: string;
  isCameraEnabled: boolean;
  isNewBuddiesViewVisible: boolean;
  isCreateNew: boolean;
  buddyList: Array<any>=[];
  public Buddy_list: boolean = false;
  public loading: any;
  cloudImagePath: any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  enableCreateBuddyButton: boolean;
  memberInput: boolean;
  groupnameInput: boolean;
  memberInputChange: boolean = false;
  phoneContacts: Array<any> = [];
  public Register_users: any[] = [];
  private User_list_contacts: any[] = [];
  selectedGroupContacts: Array<any> = [];
  public Register_phone: any;
  public searchText: any;
  public txt_groupname: any;
  groupPicIcon: string = 'assets/images/new buddies group icon.svg';
  @ViewChild('groupname') groupName: ElementRef;
  @ViewChild('memberselected') memberSelected: ElementRef;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loteasyService: LoteasyService, public navParams: NavParams, public toastCtrl: ToastController,
    public _platform: Platform, private _camera: Camera,
    private _diagnostic: Diagnostic, private _cloudImageService: CloudinaryServices,
    private storage: Storage, private _actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController, private apiService: ApiServices,
    private contacts: Contacts, private loadingCreator: LoadingCreator, private zone:NgZone,
    private renderer:Renderer) {
    this.populated_contacts();
    this.storage.get("userDetails").then(data => {
      this.Register_phone = data.phone;

    }).catch(err => {
      console.log(err.message);
    })
    this.apiService.GetUsersRegisters()
      .subscribe(Reg_data => {
        Reg_data.Reg_users.forEach(element => {
          this.Register_users.push({
            "UserName": element.UserName,
            "UserProfileImg": element.UserProfileImg,
            "PhoneNumber": element.PhoneNumber
          })
        });
      })
    this._groupPic = "assets/images/new buddies group icon.svg";
    this.isNewBuddiesViewVisible = false;
    this.UserId = this.navParams.get("UserId");
    this._platform.ready().then(() => {
      this.isCameraAvailable();


    }).catch((err: any) => {
      console.log(err.message);
    })

  }
  async DeleteBuddyGroup(UserId, BuddyGroupid): Promise<any> {
    return await this.loteasyService.fetch('get', 'DeleteUserBuddyGroup', { UserId: UserId, BuddyGroupid: BuddyGroupid });
  }
  async  ionViewDidEnter() {
    this.storage.get("userDetails").then((data: any) => {
      this.buddyeditname = false;
      this.UserId = data.UserId;
      console.log(this.UserId + "user_id")
      let loading = this.loadingCtrl.create({
        spinner: 'hide'
      });

      loading.data.content = this.loadingCreator.getLoadingSymbol();
      loading.present();

      setTimeout(() => {
        loading.dismiss();
      }, 10000);
      this.apiService.FetchBuddiesListsByUserId(this.UserId)
        .subscribe(data => {
          loading.dismiss();
          this.buddyList = JSON.parse(data);
        })

      this.enableCreateBuddyButton = false;
    })
    if (this.navParams.get("from") == "EditBuddies") {
      this.changeViewToAddNew();
    }
    //  this.UserId = await this.navParams.get("UserId");
  }

  ionViewDidLoad() {
    if (this.groupnameInput && this.phoneContacts.length > 0) {
      this.enableCreateBuddyButton = true;
    } else {
      this.enableCreateBuddyButton = false;
    }
  }
  Errormsg(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    })

    toast.present();
  }
  async UpdateBuddiesgroup(buudyid, buddygroupname, BuddiesDetails, buddyname): Promise<any> {

    return await this.loteasyService.fetch('get', 'updateUserBuddyGroup', { buudyid: buudyid, buddygroupname: buddygroupname, BuddiesDetails: BuddiesDetails, buddyname: buddyname })
  }
  async CreateOrModifyNewBuddyList() {
    if (this.txt_groupname == undefined || this.txt_groupname == "") {
      this.Errormsg("Buddy name cannot be empty");

    }
    else if (this.selectedInvitees.length == 0) {
      this.Errormsg("Buddy List cannot be empty");
    }
    else {
     
          this.Buddy_list = true;
      let loading = this.loadingCtrl.create({
        spinner: 'hide'
      });
      loading.data.content = this.loadingCreator.getLoadingSymbol();
      loading.present().then(() => {
        let userId = this.UserId;
        let buddyListName = this.txt_groupname;

        if (this._groupPic != undefined)
          this._groupPic = this._groupPic.split('/')[9];
        else
          this._groupPic = "assets/images/new buddies group icon.svg";

        if (this.navParams.get("from") == "EditBuddies") {
          let details = this.UpdateBuddiesgroup(this.editbuddy_id, this._groupPic, JSON.stringify(this.selectedInvitees), this.txt_groupname)
          loading.dismiss().then(() => {
            this.navCtrl.popToRoot();
          })
        }
        else {
        if( this.buddyList.map(buddyListElement=>{
          return buddyListElement.BuddiesListName;
          }).indexOf(this.txt_groupname)==-1){
          this.apiService.CreateNewBuddyList(userId, this.txt_groupname, this._groupPic, JSON.stringify(this.selectedInvitees))
          .subscribe(data => {
            console.log(data);
            this.Buddy_list = false;
            loading.dismiss().then(() => {
              this.navCtrl.popToRoot();
            })
          })
        } else{
          let toast = this.toastCtrl.create({
            message:'The buddy list name ' + this.txt_groupname + ' already exists. Please select another name!',
            duration:3000
          })
         this.renderer.setElementStyle(this.groupName.nativeElement,'border-bottom','1px solid rgb(196, 44, 44) !important');
          toast.present();
          loading.dismiss();
        }
         
        }
      }).catch(err => {
        console.log(err.message);
      })
        
      
    }

  }
  onGroupnameChanged(val: any): void {
    if (val && val.length > 2) {
      this.groupnameInput = true;
      this.renderer.setElementStyle(this.groupName.nativeElement,'border','1px solid green')
    }
  }

  async onMemberChanged(val: any) {
    if (this.searchText.length > 0) {
      this.memberInputChange = true;
    }
    else {
      this.memberInputChange = false;
    }


    if (this.selectedInvitees.length > 0) {

      await this.selectedInvitees.forEach(element => {
        //user_phone=element._objectInstance.phoneNumbers[0].value
        let index = this.User_list_contacts.findIndex(x => x.phone == element.phone);
        if (index > -1) {
          this.User_list_contacts[index].state = true;
        }


      });


    }
    // this.phoneContacts.push({contact:c,isChecked:false});
    await this.User_list_contacts.filter((item: any) => {
      return item.Name.toLowerCase().indexOf(val) === 0;
    })
  }

  removeDuplicates(arr) {
    let unique_array = []
    for (let i = 0; i < arr.length; i++) {
      if (unique_array.indexOf(arr[i]) == -1) {
        unique_array.push(arr[i])
      }
    }
    return unique_array
  }

  backToMoreHomepge() {
    this.navCtrl.push('MorePage');
  }

  isCameraAvailable() {
    this._diagnostic.isCameraAvailable()
      .then((isAvailable: any) => {
        this.isCameraEnabled = true;
      })
      .catch((error: any) => {
        console.log('Camera is:' + error);
      });
  }

  promptToChooseSourceOption() {
    let actionSheet = this._actionSheetCtrl.create({
      title: 'Please Chooose Option',
      buttons: [
        {
          text: 'Albums',
          icon: 'albums',
          role: 'destructive',
          handler: () => {
            this.changeGroupPic(0);
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.changeGroupPic(1);
          }
        }

      ]
    });

    actionSheet.present();
  }

  changeGroupPic(sorceOption: number) {
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
        this.loading = this.loadingCtrl.create({
          spinner: 'hide',

        })
        this.loading.data.content = this.loadingCreator.getLoadingSymbol();
        this.loading.present();
        this.base64Image = 'data:image/jpeg;base64,' + data;
        //  let publicId = 'root/profile_pics';
        this._cloudImageService.uploadPhoto(this.base64Image, 'profile')
          .subscribe((data: any) => {

            this._groupPic = data.secure_url;
            this.loading.dismiss();
          })


      })
      .catch((err: any) => {
        console.log(err);
      });

  }

  buddiesDetails(buddy: any) {
    this.navCtrl.push('BuddyDetailsPage', { Buddy: buddy });
  }
  EditbuddiesDetails(buddy: any) {
    this.navCtrl.push('EditBuddiesPage', { BuddyName: buddy });
  }

  async removeBuddy(buddy_id: any, userid: any, buddy_name: any) {
    let alertfordelete = this.alertCtrl.create({
      message: 'Do you want to Remove the ' + buddy_name + '?',
      buttons: [
        {
          text: 'Delete',
          role: 'Delete',
          handler: () => {
            let Events_list = this.DeleteBuddyGroup(userid, buddy_id);
            let index = this.buddyList.findIndex(x => x.BuddiesListName == buddy_name)
            if (index > -1) {
              console.log("removed")
              setTimeout(() => {
                this.zone.run(()=>{
                  this.buddyList.splice(index, 1)
                })
                
              }, 200);
              
            }
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
  public GetBuddies_details: any[] = [];
  public editbuddy_id: any;
  changeViewToAddNew() {
    this._groupPic = "assets/images/new buddies group icon.svg";
    this.isNewBuddiesViewVisible = true;
    this.isCreateNew = true;
    if (this.navParams.get("from") == "EditBuddies") {
      let buddies_details = this.navParams.get("buddy");
      this.GetBuddies_details = JSON.parse(buddies_details.BuddiesDetails);
      this.editbuddy_id = buddies_details.BuddiesListId;
      this.txt_groupname = buddies_details.BuddiesListName;
      this.buddyeditname = true;
      //  this.groupName.nativeElement
      if (buddies_details.BuddiesListProfilePic != 'undefined') {
        this._groupPic = this.cloudImagePath + buddies_details.BuddiesListProfilePic
      }
      else {
        this._groupPic = "assets/images/new buddies group icon.svg";
      }
      //}


      this.GetBuddies_details.forEach(element => {
        let index = this.User_list_contacts.findIndex(x => x.phone == element.phone);
        if (index > -1) {
          this.User_list_contacts[index].state = true;
        }
        this.selectedInvitees.push({
          "name": element.name,
          "phone": element.phone

        })
      });

    }
    // setTimeout(() => {
    //   this.groupName.nativeElement.value = '';
    //   this.memberSelected.nativeElement.value = '';    
    // }, 3000);

  }


  public selectedInvitees: any[] = [];

  async phonecontactselection(contact_name: any, contact_details: any) {
    if (this.selectedInvitees.length > 0) {
      let index = this.selectedInvitees.findIndex(x => x.name == contact_details.Name);

      if (index > -1) {

        await this.selectedInvitees.splice(index, 1);

        //
      }
      else {
        await this.selectedInvitees.push({
          "name": contact_details.Name,
          "phone": contact_details.phone

        })
      }
    }
    else {
      await this.selectedInvitees.push({
        "name": contact_details.Name,
        "phone": contact_details.phone

      })

    }

  }
  public profile_img: any;
  async populated_contacts() {
    this.phoneContacts = [];
    this.User_list_contacts = [];

    this.contacts.find(['displayName', 'name', 'phoneNumbers'], { filter: "", multiple: true, desiredFields: ['displayName', 'name', 'phoneNumbers'] })
      .then((contacts: Array<any>) => {
        contacts.forEach(c => {
          if (c.phoneNumbers != null) {
            let profile_img = "";
            let formattedNumber = c.phoneNumbers[0].value.replace(/[- )(]/g, '').replace(/\s+/g, "");

            let user_index = this.Register_users.findIndex(user => user.PhoneNumber == formattedNumber.split('').splice(formattedNumber.length - 10).join(''))

            if (user_index > -1) {
              this.profile_img = "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[user_index].UserProfileImg;
            }
            else {
              this.profile_img = "assets/images/Single Contact Icon.svg";
            }
            if (this.Register_phone != formattedNumber.split('').splice(formattedNumber.length - 10).join('')) {


              this.User_list_contacts.push({
                "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
                "Name": c.displayName,
                "profile": this.profile_img,
                "state": false

              })
            }
          }
        })
        this.User_list_contacts = this.removeDuplicates(this.User_list_contacts);
      })



  }

  searchBuddies() {
    this.navCtrl.push('SearchBuddiesPage', { Userid: this.UserId })
  }
}
