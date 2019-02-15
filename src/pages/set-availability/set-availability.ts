import { Component, ViewChild, ElementRef, ViewChildren, QueryList, Renderer, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { GeocoderService } from '../../services/geocoder';
import { GeolocationService } from '../../services/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LoteasyService } from '../../services/loteasyService';
import { Contacts } from '@ionic-native/contacts';
import { AppConstants } from '../../assets/appConstants';
import { ApiServices } from '../../services/appAPIServices';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs/Observable';
import { LoadingCreator } from '../../services/loadingcreator';
import { SearchLocationWiseRestuarntsComponent } from '../../components/search-location-wise-restuarnts/search-location-wise-restuarnts';
import { NotificationObject } from '../../services/oneSignalPushNotificationProvider';
import { OneSignalServiceProvider } from '../../services/oneSignalPushNotificationProvider';
import { FileTransfer } from '../../../node_modules/@ionic-native/file-transfer';

declare var $: any;
@IonicPage()
@Component({
  selector: 'page-set-availability',
  templateUrl: 'set-availability.html',
  providers: [ConfirmationService]
})
export class SetAvailabilityPage {
  items: any = [];
  itemExpandHeight: number = 100;
  public user_list_contacts: any[] = [];
  cloudinary_pic: string;
  Invitee_name: any;
  signalRBaseUrl: string = 'http://loteasysignalr-dev.ap-south-1.elasticbeanstalk.com';
  addressTwo: any;
  addressOne: any;
  city: any;
  formattedAddress: any;
  private notifypopup: boolean = false;
  fromPage: any;
  floName: any;
  phoneNumber: string;
  userId: number;
  currentDate: any;
  buddiesLists: Array<any> = [];
  phoneContacts: Array<any> = [];
  combinedContactAndBuddyLists: Array<any> = [];
  currentSelected: any;
  cloudinaryPhotoPath: any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  selectedListsArray: Array<any> = [];
  connection: any;
  proxy: any;
  inviteesOfEvent: any;
  public searchText: any;
  public Register_phone: any;
  public Register_users: any[] = [];
  public memberInputChange: any;
  public User_list_contacts: any[] = [];
  public List_of_catchupEvents: any[] = [];
  public Event_user_list: any[] = [];
  public enddate: any;
  public Event_complete_date: any;
  public CatchupEventsstate: any;
  public users_interested: any;
  public showAvaliablity: any;
  public minutes: any;
  public hours: any;
  public catch_time: any;
  public rangeValues: any;
  public User_type: any;
  public restaurant_details: any;
  public Estimated_cost: any;
  public flow_from: any;
  public Estimated_members: any;
  public Booking_type: any;
  public conforButton: any;
  public Eventid: any;
  public exitEvent: any;
  public Buddies_details: any[] = [];
  public buddyList: any[] = [];
  public buddylistchecked: boolean = true;
  public tabBarElement: any;
  public currentTime: any;
  distanceSelected: any;
  public catchupstateDesc: any;
  public CatchstateStatus: boolean;
  public button_status: any;
  public displayBuddygroup: any;
  public Event_usernames: any;
  public Event_invitee_button: any;
  public showrangehide: boolean = true;
  public Register_username: any;
  public User_id: any;
  public Initial_state_user: any = true;
  public selectedInvitees: any[] = [];
  public selected_stoargeusers: any[] = [];
  public buddies_selection: any[] = [];
  public showselectedlist: boolean = true;
  public cancelled_state: any = true;
  public testing: any;
  public Buddies_count: any;
  public Phone_contacts_count: any;
  public buddiesList: any[] = [];
  public Uncheckedinviteeslist: any;
  public cloudinaryUrl: string = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  public cloudinaryRestHeroImgUrl: string = AppConstants.CLOUDINARY_FETCH_HERO_IMAGE_PATH;
  public eventsDeletedStatusByUser:Array<any>=[];
  noMatchFound: boolean;
  autocompleteContatcs: any;
  autocompleteContacstList: any[] = [];
  showContactsSearchResults: boolean;
  selectedContacts: any[] = [];
  public activatesearch: any;
  public allFieldsNotAvailable: boolean;
  selectedInviteesList: any;
  showphonecontacts: boolean = false;
  showTabbedView: boolean;
  addressType: number;
  showCancelEventDialog: boolean;
  typeOfCancelledEvent: string;
  eventToBeCancelledId: any;
  availableInvitees: Array<any> = [];
  cloudImagePath: any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  @ViewChild('catchup') catchupList: ElementRef;
  @ViewChild('setavablie') setavablieList: ElementRef;
  @ViewChild('setavablityactive') setavablityactive: ElementRef;
  @ViewChild('setcatchactive') setcatchactive: ElementRef;
  @ViewChildren("skillImg") private skillImgs: QueryList<ElementRef>;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private renderer: Renderer, 
    private confirmationService: ConfirmationService, public navParams: NavParams, public apiService: ApiServices, public DatePipe: DatePipe,
    public storage: Storage, public _geocode: GeocoderService, public toastctrl: ToastController,
    public geoService: GeolocationService, public platform: Platform,
    public loadingCtrl: LoadingController, public diagnostic: Diagnostic, public alertctrl: AlertController,
    public loteasyService: LoteasyService, public contacts: Contacts, public ngZone: NgZone,
    public loadingCreator: LoadingCreator, public oneSignalService: OneSignalServiceProvider) {
    this.currentDate = "Today, " + new Date().getDate() + " " + new Date().toLocaleString("en-us", { month: "short" });
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.showAvaliablity = false;
    this.testing = "Accepted";

    // this.testing ="table"
    this.showTabbedView = true;
    this.conforButton = false;
    this.exitEvent = false;
    this.displayBuddygroup = false;
    this.button_status = "Proceed to booking";
    this.rangeValues = 5;
    this.populated_contacts();
    this.storage.get("userDetails").then(data => {
      this.Register_phone = data.phone;
      this.userId = data.UserId;
      this.apiService.FetchSingleUserById(this.userId).subscribe(user => {
        this.Register_username = JSON.parse(user).UserName;
      })

    }).catch(err => {
      console.log(err.message);
    })

    this.flow_from = "catchup";
    this.Booking_type = "Booking";


  }


  shownGroup = null;
  toggleGroup(group) {
    this.testing = "interested";
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {

    return this.shownGroup === group;
  };
  public buddy_selectiom: any[] = [];


  getCurrentLocationFromGeocode() {
    if (this.catchupstateDesc.indexOf('Currently') == -1) {
      this.diagnostic.isLocationEnabled().then(
        (isAvailable) => {
          if (isAvailable) {

            this.platform.ready().then(() => {
              let loading = this.loadingCtrl.create({
                spinner: 'hide',
                duration: 5000
              });
              loading.data.content = this.loadingCreator.getLoadingSymbol();
              loading.present();
              this.geoService._geolocate({ enableHighAccuracy: false }).then((res) => {
                this.addressOne = { lat: res.coords.latitude, lng: res.coords.longitude };
                this.storage.set("latlong", this.addressOne).then(() => {
                }).catch((err: any) => {
                  console.log(err.message);
                  let toast = this.toastctrl.create({
                    message: 'Please check your internet connection & device location',
                    duration: 2000
                  })
                  toast.present();
                })
                this._geocode._reverseGeocode(this.addressOne).then((address: any) => {
                  console.log(address[0]);
                  this.formattedAddress = address[0].formatted_address;
                  this.city = address[0].address_components[4].long_name;
                  loading.dismiss();
                }).catch((err) => {
                  console.log(err);
                  let toast = this.toastctrl.create({
                    message: 'Please check your internet connection & device location',
                    duration: 2000
                  })
                  toast.present();
                });
              }).catch((err) => {
                console.log(err);
              })

            })
          }
          else {

            let toast = this.toastctrl.create({
              message: 'You have declined to use gps',
              duration: 1500,
              position: 'bottom'
            })

            toast.present();
          }
        })
    }

  }
  exceuted(val) {
    if (this.searchText.length > 0) {
      this.memberInputChange = true;
    }
    else {
      this.memberInputChange = false;
    }
    if (this.selectedInvitees.length > 0) {

      this.selectedInvitees.forEach(element => {

        let index = this.User_list_contacts.findIndex(x => x.phone == element.phone);
        if (index > -1) {
          this.User_list_contacts[index].state = true;
        }


      });


    }

    this.User_list_contacts.filter((item: any) => {
      return item.Name.toLowerCase().indexOf(val) === 0;
    })

  }
  async onMemberChanged(val: any) {
   this.showrangehide = false;
    this.displayBuddygroup = false;
    if (this.searchText.length > 0) {
      this.memberInputChange = true;
    }
    else {
      this.memberInputChange = false;
    }
    if (this.buddy_selectiom.length > 0) {
      this.buddy_selectiom.forEach(element => {

        let buddylistindex = this.User_list_contacts.findIndex(x => x.Name == element && x.phone == 'tenDigitNumber');
        if (buddylistindex > -1) {

          this.User_list_contacts[buddylistindex].State = true;
        }
        else {
          this.User_list_contacts[buddylistindex].State = false;
        }
      });

    }
    if (val == '') {
      this.showselectedlist = true;
    }
    else {

      this.showselectedlist = false;
    }
  }


  public profile_img: any;
  GetlistofstoredSelectedcontacts: Observable<any> =
    Observable.fromPromise(this.storage.get('List_contactseleced').then(token => {
      //maybe some processing logic like JSON.parse(token)
      return token;
    }));


  async populated_contacts() {
    this.selected_stoargeusers = []
    let list_reg_users = await this.GetUsersRegisters();
    await this.GetlistofstoredSelectedcontacts.subscribe(contacts => {
      if (contacts != null) {


        this.selected_stoargeusers = contacts;
        if (this.selected_stoargeusers.length > 0) {
          this.showrangehide = true;
          this.selectedInvitees = contacts;
        }

      }
    })
    // await this.GetlistofstoredSelectedcontacts().then((contacts=>{


    //   }));

    await list_reg_users.Reg_users.forEach(element => {

      this.Register_users.push({
        "UserName": element.UserName,
        "UserProfileImg": element.UserProfileImg,
        "PhoneNumber": element.PhoneNumber
      })
    });
    this.phoneContacts = [];
    this.User_list_contacts = [];
    let phoneContacts = await this.getAllPhoneContacts();
    phoneContacts.forEach(contact => {
      if (contact.phoneNumbers != null) {
        this.profile_img = "";
        let formattedNumber = contact.phoneNumbers[0].value.replace(/[^0-9]/g, '')

        let profile_img = "";



        let user_index = this.Register_users.findIndex(user => user.PhoneNumber == formattedNumber)

        if (user_index > -1) {

          this.profile_img = `https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/${this.Register_users[user_index].UserProfileImg}`;
        }
        else {
          this.profile_img = "assets/images/Single Contact Icon.svg";
        }

        let user_state;
        if (this.selected_stoargeusers.length > 0) {

          let index = this.selected_stoargeusers.findIndex(x => x.phone == formattedNumber);

          if (index > -1) {

            user_state = true;
          }
          else {
            user_state = false;
          }
        }
        else {
          user_state = false;
        }
        this.User_list_contacts.push({
          "phone": formattedNumber,
          "Name": contact.displayName,
          "profile": this.profile_img,
          "State": user_state,
          "contactType": "Contact"


        })


        this.User_list_contacts = this.removeDuplicates(this.User_list_contacts);
      }
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

  public display_users: any[] = [];
  Display_users(event_id: any): void {
    this.display_users = [];

    this.showAvaliablity = true;
    this.users_interested = 0;
    let indexdb = this.List_of_catchupEvents.findIndex(x => x.Eventid == event_id);
    if (indexdb > -1) {

      this.List_of_catchupEvents[indexdb].Invitess_list.forEach((element, indexedDB) => {
        if (element.status_state == "1") {

          // "phone":tenDigitNumber,
          // "Name": contact.displayName,


          this.display_users.push({
            "Profilepic": element.Profilepic,
            "Name": element.Name,
            "status_state": element.status_state,
            "Time": element.Time,
            "state": element.state
          })


        }
      })

      // this.display_users=this.List_of_catchupEvents[indexdb].Invitess_list;
    }
  }

  TimeDisplay(present_date) {
    this.hours = present_date.getHours();
    this.minutes = present_date.getMinutes();

    var ampm = "AM";
    if (this.minutes < 30 && this.minutes > 0) {
      this.minutes = "30";

    } else {
      this.minutes = "00";
      ++this.hours;
    }
    if (this.hours > 23) {
      this.hours = 12;
    } else if (this.hours > 12) {
      this.hours = this.hours - 12;
      ampm = "PM";
    } else if (this.hours == 12) {
      ampm = "PM";
    } else if (this.hours == 0) {
      this.hours = 12;
    }
    return this.hours + ":" + this.minutes + " " + ampm;
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
  async FetchBuddieslist(user_id: any): Promise<any> {

    return this.loteasyService.fetch("get", "FetchBuddiesListsByUserId", { UserId: user_id })
  }
   ionViewDidEnter() {
   this.setAvailabilityFunction();
  }

  getBuddiesListByUserId(){
    this.storage.get("userDetails").then(data => {
      this.userId = data.UserId;
      this.apiService.FetchBuddiesListsByUserId(data.UserId)
        .subscribe(data => {
          let buddies = JSON.parse(data);
          this.Buddies_count = buddies.length;
          buddies.forEach(buddy => {
            this.buddiesList.push({ buddy: buddy, checked: false });
          })
        })
    })
  }
 async setAvailabilityFunction(){
   this.getBuddiesListByUserId();
    let Reg_data = await this.GetUsersRegisters();
    Reg_data.Reg_users.forEach(element => {
      this.Register_users.push({
        "UserName": element.UserName,
        "UserProfileImg": element.UserProfileImg,
        "PhoneNumber": element.PhoneNumber
      })
    });
    let phoneContacts = await this.getAllPhoneContacts();

    phoneContacts.forEach((contact, indexedDB) => {
      if (contact.phoneNumbers != null && contact.displayName != null) {
        this.profile_img = "";
        let formattedNumber = contact.phoneNumbers[0].value.replace(/[^0-9+]/g, '')


        if (formattedNumber != this.Register_phone) {
          this.Phone_contacts_count = indexedDB;
          let phone_exist = this.Register_users.findIndex(x => x.PhoneNumber == formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
          if (phone_exist > -1) {
            this.profile_img = "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[phone_exist].UserProfileImg
          }
          else
            this.profile_img = "assets/images/Single Contact Icon.svg";
          this.phoneContacts.push({
            phone: formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
            checked: false,
            profileimg: this.profile_img,
            name: contact.displayName
          });
          this.user_list_contacts.push({
            phone: formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
            checked: false,
            profileimg: this.profile_img,
            name: contact.displayName
          });
        }

      }
    })
    var present_date = new Date();
    var addhours = new Date();
    this.buddies_selection = [];
    addhours.setHours(addhours.getHours() + 2);
    this.CatchstateStatus = true;
    this.catchupstateDesc = 'Let your friends accompany you over a meal';
     this.storage.get("user_created_time").then(status => {
      if (status != null || status != undefined) {
        this.apiService.GetAvailabileInviteesOfCatchupEvent(JSON.parse(status.eventcreated).EventId)
          .subscribe(availableInv => {
            console.log(availableInv);
            if (availableInv[0] != null && availableInv[0] != 'undefined') {
              this.availableInvitees = Object.assign([], availableInv);
            }

          })

        this.CatchupEventsstate = new Date(status.Created_time);
        this.CatchupEventsstate.setHours(this.CatchupEventsstate.getHours() + 2);
        this.enddate = new Date();
        this.currentTime = this.TimeDisplay(new Date(status.Created_time)) + '-' + this.TimeDisplay(this.CatchupEventsstate)
        if (this.CatchupEventsstate >= this.enddate) {
          this.CatchstateStatus = false;
          this.rangeValues = status.Distance_selected;
          this.catchupstateDesc = 'Currently catch up is running (' + this.currentTime + ')';
        }

      }
      else {
        this.storage.remove('catchupinviteConfirmed');
        this.rangeValues = 5;
      }
    })
    this.currentTime = this.TimeDisplay(new Date(present_date)) + '-' + this.TimeDisplay(addhours)
    await this.GetlistofstoredSelectedcontacts.subscribe(contacts => {
      if (contacts != null)
        this.buddies_selection = contacts;
      else
        this.buddies_selection = [];

    })
    this.tabBarElement.style.display = 'none';
    let navData = await this.getNavParamsData();
    this.fromPage = navData.from;
    this.floName = navData.flow;
    let userData = await this.getUserDetails();
    this.userId = userData.UserId;
    this.phoneNumber = userData.phone;
    let userId: any;
    let image_display: any;

    await this.storage.get("userDetails").then(data => {
      userId = data.UserId;
    })

    await this.FetchBuddieslist(userId).then((buddy_details) => {


    })

    await this.apiService.FetchBuddiesListsByUserId(userId)
      .subscribe(data => {
        let buddies = JSON.parse(data);
        buddies.forEach(buddy => {
          let status_value;
          let buddy_dt = JSON.parse(buddy.BuddiesDetails);

          buddy_dt.forEach(element => {

            this.Buddies_details.push({

              "name": element.name,
              "phone": element.phone
            })


          });
          if (buddy.BuddiesListProfilePic != "undefined") {
            image_display = this.cloudinaryPhotoPath + buddy.BuddiesListProfilePic
          }
          else {
            image_display = "assets/images/new buddies group icon.svg";
          }

          if (this.buddies_selection.length > 0) {
            let index = this.buddies_selection.findIndex(x => x.name == buddy.BuddiesListName && x.phone == 'tenDigitNumber');

            if (index > -1) {
              this.User_list_contacts.push({
                "phone": "tenDigitNumber",
                "Name": buddy.BuddiesListName,
                "profile": image_display,
                "State": true,
                "contactType": "BuddyList"
              })
            }
            else {
              this.User_list_contacts.push({
                "phone": "tenDigitNumber",
                "Name": buddy.BuddiesListName,
                "profile": image_display,
                "State": false,
                "contactType": "BuddyList"
              })
            }
          }
          else {
            this.User_list_contacts.push({
              "phone": "tenDigitNumber",
              "Name": buddy.BuddiesListName,
              "profile": image_display,
              "State": false,
              "contactType": "BuddyList"
            })
          }
          this.buddyList.push({ BuddiesDetails: buddy_dt, BuddiesListId: buddy.BuddiesListId, checked: false, name: buddy.BuddiesListName, profile_img: image_display });
        })
      })


    if (this.navParams.get("from") == 'Locationset-availability') {
      this.formattedAddress = this.navParams.get("selected_place");
      console.log('formatted address: ' + this.formattedAddress);
      setTimeout(() => {
        this.sendPushNotificationsToInviteesOnLocationChange();
      }, 2000);
      
      // this.addressType=1;
    }

    else if (this.navParams.get("from") == "selected_restaurantListaddress") {

      setTimeout(() => {
        this.ngZone.run(() => {
          this.restaurant_details = this.navParams.get("restaurant");
          this.formattedAddress = this.restaurant_details.Name + ", " + this.restaurant_details.Address;
          // this.addressType=2;
          setTimeout(() => {
            this.sendPushNotificationsToInviteesOnLocationChange();
          }, 2000);
          
        })
      }, 300);

    }
    else {


      this.platform.ready().then((readySource) => {

        this.diagnostic.isLocationEnabled().then(
          (isAvailable) => {

            if (!isAvailable) {
              let alert1 = this.alertctrl.create({
                title: 'Error on GPS',
                message: 'Error on GPS You need active the GPS',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: 'Enable',
                    handler: data => {
                      this.switchToLocationSettings().then((data) => {
                        setTimeout(() => {
                          this.ngZone.run(() => {
                            this.getCurrentLocationFromGeocode();
                          })

                        }, 300);


                      })
                        .catch(err => {

                        })
                    }
                  }
                ]
              })
              alert1.present();
              //  this.diagnostic.switchToLocationSettings();
            }
            else {
              setTimeout(() => {
                this.ngZone.run(() => {
                  this.getCurrentLocationFromGeocode();
                })

              }, 300);
            }

          }).catch((e) => {
            console.log(e);

          });


      });
      if (this.navParams.get("Booking_type") != undefined) {
        if (this.navParams.get("Booking_type") == "No-Booking") {
          console.log("1:" + this.navParams.get("Booking_type"));
          this.catchupList.nativeElement.classList.remove('active');
          this.setavablieList.nativeElement.classList.add('active');
          //this.setavablityactive.nativeElement.classList.remove('active');
          //this.setcatchactive.nativeElement.classList.add('active');
          this.shownGroup = this.navParams.get("EventDetails");
        }
        else {
          console.log("2:" + this.navParams.get("Booking_type"));
          this.setavablityactive.nativeElement.classList.remove('active');
          this.setcatchactive.nativeElement.classList.add('active');
          this.catchupList.nativeElement.classList.add('active');
          this.setavablieList.nativeElement.classList.remove('active');
          this.shownGroup = this.navParams.get("EventDetails");
          this.testing = "interested";
          this.Display_catchupEvents();
        }
      }

      if (this.navParams.get("Booking_type") == 'EditAddress') {
        console.log("3:" + this.navParams.get("Booking_type"));
        this.setavablityactive.nativeElement.classList.remove('active');
        this.setcatchactive.nativeElement.classList.add('active');
        this.catchupList.nativeElement.classList.add('active');
        this.setavablieList.nativeElement.classList.remove('active');
        this.shownGroup = this.navParams.get("EventDetails");
        this.testing = "interested";
        this.Display_catchupEvents();
        setTimeout(() => {
          this.sendPushNotificationsToInviteesOnLocationChange();
        }, 2000);
        
      }


    }

  }

  sendPushNotificationsToInviteesOnLocationChange() {
    console.log("formatted address: " + this.formattedAddress);
    this.storage.get('user_created_time').then(user_created_time => {
      if(user_created_time){
        let Created_time = user_created_time.Created_time,
        Distance_selected = user_created_time.Distance_selected,
        message = user_created_time.message,
        pic = user_created_time.pic,
        selectedusers = user_created_time.selectedusers;
      let catchupEventcreated = user_created_time.eventcreated;
       this.storage.get('catchupcreated')
        .then(catchupcreated => {
          if (catchupcreated) {
            console.log(catchupEventcreated);
            let eventOwnerId = JSON.parse(catchupEventcreated).EventCreatedBy;
            let parsedEventCreated = JSON.parse(catchupEventcreated);
            parsedEventCreated.Event_Address = this.navParams.get('selectedAddr');
            //  console.log(JSON.parse(catchupCreated).InviteesList);
            this.apiService.FetchSingleUserById(eventOwnerId)
              .subscribe(eventCreator => {
                console.log(eventCreator);
                console.log("changed location: " + this.formattedAddress);
                this.apiService.GetOneSignalPlayerIds(JSON.parse(catchupEventcreated).InviteesList)
                  .subscribe(playerIds => {
                    this.apiService.GetEventDetailsByEventId(parsedEventCreated.EventId).subscribe(ev=>{
                      console.log(ev);
                      let eventVenue = ev.Event_Address;
                      this.sendPushNotifcationViaOneSignal('venueChanged', playerIds, JSON.stringify(parsedEventCreated), JSON.parse(eventCreator).UserName, eventCreator.UserProfileImg, '', '', '', eventVenue)
                      console.log(playerIds);
                      this.storage.set('user_created_time', {
                        Created_time: Created_time, Distance_selected: Distance_selected,
                        message: message, pic: pic, selectedusers: selectedusers, eventcreated: JSON.stringify(parsedEventCreated)
                      })
                        .then(success => {
                          console.log('success');
                        })
                    })
                   
                  })
                // this.sendPushNotifcationViaOneSignal('venueChanged',playerIds)

              })

          }
        })
      }
    })
  }
  switchToLocationSettings(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.diagnostic.switchToLocationSettings());
      reject(new Error('failed'));

    })



  }
  public user_list: any[] = [];

  getUserDeletedStatus(eventId, userId,eventsDeletedStatusByUser:Array<any> ){
    this.apiService.GetEventStatusUpdatesByEventId(eventId,userId)
    .subscribe(res=>{
      eventsDeletedStatusByUser.push(res);
    })
  }
  async Display_catchupEvents() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      duration: 5000

    })
    loading.data.content = this.loadingCreator.getLoadingSymbol();
    loading.present();
    
    let Catchlist_Events = await this.getCountofcatchups();

    if (Catchlist_Events.length < 0) {
      loading.dismiss();

    }

    this.List_of_catchupEvents = [];
    await Catchlist_Events.forEach(Catch_Events => {
      this.getUserDeletedStatus(Catch_Events.Event[0].EventId,this.userId,this.eventsDeletedStatusByUser)
      // console.log(Catch_Events);
      this.Event_user_list = [];
      this.display_users = [];
      let accepted_count = 0;
      this.Initial_state_user = false;
      // if(Catch_Events.Event[0].EventStatusId!="2")
      // {
      if (Catch_Events.Event[0].EventCreatedBy == this.userId) {

        this.User_type = "sender";
        if (Catch_Events.Event[0].EventStatusId == "1") {
          this.Event_usernames = 'You created an event';
        }
        else {
          this.Event_usernames = 'You have Catch up Event to Confirm';
        }

        this.Event_invitee_button = '';
        this.cancelled_state = true;
      }
      else {
        this.cancelled_state = true;
        this.User_type = "invitee";
        this.Event_usernames = Catch_Events.Event[0].EventUserName + '  created an event';
      }
      if (Catch_Events.Event[0].EventStatusId == "2" && Catch_Events.Event[0].EventCreatedBy == this.userId) {
        this.Event_usernames = 'You Cancelled the event';
        this.cancelled_state = false;
      }
      if (Catch_Events.Event[0].EventStatusId == "2" && Catch_Events.Event[0].EventCreatedBy != this.userId) {
        this.Event_usernames = Catch_Events.Event[0].EventUserName + '  Cancelled the event';
        this.cancelled_state = false;
      }
      this.Event_user_list = [];
      var objDate = new Date(Catch_Events.Event[0].EventDate.split("-").reverse().join("-"));
      var startDate = Date.parse(objDate.toDateString());
      this.Event_complete_date = new Date(this.DatePipe.transform(startDate, 'MM/dd/yyyy') + " " + Catch_Events.Event[0].EventTime);
      // this.Event_complete_date = new Date(this.DatePipe.transform(startDate, 'MM-dd-yyyy') + " " + Catch_Events.Event[0].EventTime);



      this.hours = this.Event_complete_date.getHours();
      this.minutes = this.Event_complete_date.getMinutes();

      var ampm = "AM";
      if (this.minutes < 30 && this.minutes > 0) {
        this.minutes = "30";

      } else {
        this.minutes = "00";
        ++this.hours;
      }
      if (this.hours > 23) {
        this.hours = 12;
      } else if (this.hours > 12) {
        this.hours = this.hours - 12;
        ampm = "PM";
      } else if (this.hours == 12) {
        ampm = "PM";
      } else if (this.hours == 0) {
        this.hours = 12;
      }
      this.catch_time = this.hours + ":" + this.minutes + " " + ampm;

      this.Event_complete_date.setHours(this.Event_complete_date.getHours() + 2);
      this.enddate = new Date();

      if (this.Event_complete_date >= this.enddate) {
        for (var k = 0; k < Catch_Events.Invitees.length; k++) {


          let index = this.User_list_contacts.findIndex(cont => cont.phone == Catch_Events.Invitees[k].PhoneNumber);


          if (index > -1) {
            this.Invitee_name = this.User_list_contacts[index].Name;
          }
          else {
            this.Invitee_name = Catch_Events.Invitees[k].username;
          }
          if (Catch_Events.Invitees[k].UserProfileImg == "NULL")
            this.cloudinary_pic = "assets/images/Single Contact Icon.svg"
          else
            this.cloudinary_pic = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH + Catch_Events.Invitees[k].UserProfileImg

          if (Catch_Events.Invitees[k].AcceptStatus == '2' && Catch_Events.Invitees[k].PhoneNumber == this.Register_phone) {
            this.Event_invitee_button = 'Join Back';
            this.Initial_state_user = false;

          }

          if (Catch_Events.Invitees[k].AcceptStatus == '1' && Catch_Events.Invitees[k].PhoneNumber == this.Register_phone) {
            this.Event_invitee_button = 'Exit';
            this.Initial_state_user = false;
          }

          if (Catch_Events.Invitees[k].AcceptStatus == '0' && Catch_Events.Invitees[k].PhoneNumber == this.Register_phone) {
            this.Initial_state_user = true;
          }

          this.Event_user_list.push({
            "Profilepic": this.cloudinary_pic,
            "Name": this.Invitee_name,
            "status_state": Catch_Events.Invitees[k].AcceptStatus,
            "Time": Catch_Events.Invitees[k].StatusUpdateTime,
            "phone": Catch_Events.Invitees[k].PhoneNumber,
            "state": true,
          })
          //}

          if (Catch_Events.Invitees[k].AcceptStatus == "1") {
            if (Catch_Events.Event[0].EventCreatedBy == this.userId && Catch_Events.Event[0].EventStatusId == "0") {


              this.list_of_selected.push(Catch_Events.Invitees[k].PhoneNumber);
              this.list_of_selected = this.remove_duplicates(this.list_of_selected);

            }
            accepted_count++;
          }


        }

        console.log(this.eventsDeletedStatusByUser);
        this.List_of_catchupEvents.push({
          "EventCreatedBy": Catch_Events.Event[0].EventCreatedBy,
          "Eventid": Catch_Events.Event[0].EventId,
          "Eventcreated": this.User_type,
          "Event_date": Catch_Events.Event[0].EventDate.split("-")[0],
          "EventMonth": objDate.toLocaleString("en-us", { month: "short" }),
          "Restname": Catch_Events.Event[0].Name,
          "EventAddress": Catch_Events.Event[0].Address,
          "RestAddress": Catch_Events.Event[0].Event_Address,
          "CostForTwo": Catch_Events.Event[0].CostForTwo,
          "Invitess_list": this.Event_user_list,
          "CompleteInviteelist": this.Event_user_list,
          "Rounded": this.catch_time,
          "AcceptedUsers": accepted_count,
          "EventUserName": this.Event_usernames,
          "EventinviteeButton": this.Event_invitee_button,
          "Initial_state_user": this.Initial_state_user,
          "Delted_state": this.cancelled_state,
          "Event_state": Catch_Events.Event[0].EventStatusId,
          "ExpireTime": (this.hours + 2) + ":" + this.minutes + " " + ampm,
          "EventDeletedByUser":this.eventsDeletedStatusByUser.indexOf(Catch_Events.Event[0].EventId)>-1
        })

      }
      //}

    });
    console.log(this.List_of_catchupEvents);
    // create hub connection  
    this.connection = $.hubConnection(this.signalRBaseUrl);
    // create new proxy as name already given in top  
    this.proxy = this.connection.createHubProxy('EventsHub');

    // if(this.navParams.get("Booking_type")!=undefined  )
    // {
    //   this.storage.get("selected_users_interesrted").then(data=>{

    //     if(data!=null || data!=undefined )
    //     {


    // this.list_of_selected=[]

    //     this.user_list=data.Interested
    //      let index=this.List_of_catchupEvents.findIndex(x=>x.Eventid==data.Eventid);
    //      let index_event=this.List_of_catchupEvents.findIndex(x=>x.Eventid==data.Eventid);
    //  this.List_of_catchupEvents[index_event].AcceptedUsers= this.List_of_catchupEvents[index_event].AcceptedUsers-this.user_list.length;
    //  this.Estimated_members=this.List_of_catchupEvents[index].AcceptedUsers+1;


    //      this.user_list.forEach(element => {
    //        let user_index= this.List_of_catchupEvents[index].Invitess_list.findIndex(x=>x.phone==element);
    //  this.list_of_selected.push(element);
    //        if(user_index>-1)
    //     {


    //      this.List_of_catchupEvents[index].Invitess_list[user_index].state=false;
    //     }
    //  });
    // }

    //     })

    // }
    if (this.navParams.get("from") == "decideaplace") {
      //  this.storage.set("selected_users_interesrted",{"Interested":this.selected_users_interesrted,Eventid:Event_id});
      this.flow_from = "restaurantList";
      this.addressType = 1;
      this.Booking_type = this.navParams.get("Booking_type");

    }


    else if (this.navParams.get("from") == "restaurantList") {

      setTimeout(() => {
        // this.setavablityactive.nativeElement.classList.remove('active');
        // this.setcatchactive.nativeElement.classList.add('active');
        // this.catchupList.nativeElement.classList.add('active');
        // this.setavablieList.nativeElement.classList.remove('active')
        this.flow_from = "restaurantList";
        this.addressType = 2;
        this.Booking_type = this.navParams.get("Booking_type");
        this.restaurant_details = this.navParams.get("restaurant");
        if (this.navParams.get("Booking_type") == "Booking") {
          let index = this.List_of_catchupEvents.findIndex(x => x.Eventcreated == "sender");

          // if(index>-1)
          // {

          //   this.Estimated_cost=parseInt( this.restaurant_details.CostForTwo)/2* parseInt( this.Estimated_members);

          // }


        }
      }, 2000);


    }
  }



  backtoHomeScreen() {
    this.navCtrl.push('HomePage');
  }



  //helper methods
  getNavParamsData(): Promise<any> {
    return new Promise((resolve, reject) => {
      let navData = this.navParams.data;
      resolve(navData);
      reject(new Error('Error occured'));
    })
  }

  getUserDetails(): Promise<any> {
    return this.storage.get('userDetails');
  }

  getFormattedCurrentDate(_date: Date): Promise<any> {

    let months = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    let month = months[_date.getMonth()];
    let day = _date.getDate();
    let formattedDate = "Today, " + day + " " + month;
    return new Promise((resolve, reject) => {FileTransfer
      resolve(formattedDate);
      reject(new Error('an error has occured'));
    })

  }

  getLatlong(): Promise<any> {
    return this.geoService._geolocate({ enableHighAccuracy: true, timeout:120000,maximumAge:600000 });
  }


  reverseGeocode(latlong: any): Promise<any> {
    return this._geocode._reverseGeocode(latlong);
  }


  //  async getCurrentLocation():Promise<any>{
  //         let loading = this.loadingCtrl.create({
  //           spinner:'',
  //           content:'Loading, please wait...'
  //          });
  //          loading.present();
  //         let latlong = await this.getLatlong();

  //         // platform ready check start
  //         let platformReady =await this.platform.ready();
  //         let isAuthorized = await this.diagnostic.isLocationAuthorized();
  //         let requestLocationAuthorization =await this.diagnostic.requestLocationAuthorization();

  //     if(platformReady=='cordova'){
  //       if(!isAuthorized){
  //         if(requestLocationAuthorization=='GRANTED'){
  //           loading.dismiss();
  //           return await this.reverseGeocode({lat:latlong.coords.latitude,lng:latlong.coords.longitude}); 

  //         }else{
  //           loading.dismiss();
  //           alert('Request for location declined');
  //         }

  //       }else{
  //         loading.dismiss();
  //         return await this.reverseGeocode({lat:latlong.coords.latitude,lng:latlong.coords.longitude}); 
  //       }
  //     }

  //   }



  async getCountofcatchups(): Promise<any> {
    //this.phoneNumber="9652068666";
    return await this.loteasyService.fetch('get', 'GetListofCatcheup', { PhoneNumber: this.phoneNumber });
  }

  async GetUsersRegisters(): Promise<any> {
    return await this.loteasyService.fetch('get', 'GetRegisteredUsers', {});
  }


  async getAllPhoneContacts(): Promise<any> {
    return await this.contacts.find(['displayName', 'name', 'phoneNumbers'], { filter: "", multiple: true, desiredFields: ['displayName', 'name', 'phoneNumbers'] })
  }

  async groupContactsAndBuddies(groupOne: Array<any>, groupTwo: Array<any>): Promise<any> {
    return await groupOne.concat(groupTwo);
  }
  onBuddyListItemClicked(idx: any, buddy: any) {
    if (JSON.stringify(this.selectedListsArray).indexOf(JSON.stringify(buddy)) == -1) {
      this.selectedListsArray.push(buddy);
    } else {
      let indexOfSelected = this.selectedListsArray.indexOf(buddy);
      this.selectedListsArray.splice(indexOfSelected);
    }
    this.currentSelected = idx;

  }

  onContactListSelected() {
    if (this.selectedListsArray.indexOf(this.phoneContacts) == -1) {
      this.selectedListsArray.push(this.phoneContacts)
    } else {
      let index = this.selectedListsArray.indexOf(this.phoneContacts);
      this.selectedListsArray.splice(index);
    }

  }
  public selected_users: any[] = [];
  public details: any[] = [];
  public selected_contact_names: any[] = [];
  async onNotify() {
    this.showselectedlist = false;
    let loading = this.loadingCtrl.create({
      spinner: 'hide'

    });

    loading.data.content = this.loadingCreator.getLoadingSymbol();
    loading.present();

    this.distanceSelected = this.rangeValues;
    await this.selectedInvitees.forEach(si => {

      if (si.buddy_group == "NotBuddy" && si["phoneNumbers[0].value"] != undefined) {
        let formattedNumber = si["phoneNumbers[0].value"].replace(/[^0-9+]/g, '');
        this.selected_users.push(formattedNumber.split('').splice(formattedNumber.length - 10).join(''))
        this.selected_contact_names.push({
          "name": si.displayName,
          "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
        })
      }

      if (si.phoneNumbers != undefined || si.phoneNumbers != null) {
        let formattedNumber = si.phoneNumbers[0].value.replace(/[^0-9+]/g, '');
        this.selected_users.push(formattedNumber.split('').splice(formattedNumber.length - 10).join(''))
        this.selected_contact_names.push({
          "name": si.displayName,
          "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
        })

      }
    })

    await this.buddiesList.filter(buddy => {
      if (buddy.checked == true) {
        let _buddies = JSON.parse(buddy.buddy.BuddiesDetails);
        _buddies.forEach(b => {
          let formattedNumber = b.phone?b.phone.replace(/[^0-9+]/g, ''):'';
          this.selected_users.push(formattedNumber.split('').splice(formattedNumber.length - 10).join(''))
          this.selected_contact_names.push({
            "name": b.name,
            "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
          })

        })
      }
    })
    this.selected_contact_names = await this.removeDuplicatesoflist(this.selected_contact_names, "phone");
    setTimeout(async () => {
      let eventCreated = await this.createCatchUpEvent(this.formattedAddress);
      loading.dismiss();
      await this.selected_contact_names.forEach(list => {
        let EventDetails = JSON.parse(eventCreated);
        let latest_date = this.DatePipe.transform(new Date(), 'HH:mm a');
        this.apiService.UpdateEventStatus(4, EventDetails.EventId, list.phone.split('').splice(list.phone.length - 10).join(''), 0, "", latest_date, list.name).subscribe((update_status) => {

        })
      })
      this.notifypopup = true;
      setTimeout(() => {
        this.notifypopup = false;
        this.storage.remove("List_contactseleced");
        this.storage.set('catchup', 1).then(() => {

          //  
        })
      }, 3000);
      let user = await this.getUserProfilePicByUserId();
      await this.geoService._geolocate({ enableHighAccuracy: false }).then((res) => {
        this.addressOne = { lat: res.coords.latitude, lng: res.coords.longitude }
      })

      let message = `${JSON.parse(user).UserName} is available for a meal. Would you like to join?,${this.addressOne.lat + ',' + this.addressOne.lng
        },${this.distanceSelected}`
      let profilePic = JSON.parse(user).profilePic != null && JSON.parse(user).profilePic != undefined ? JSON.parse(user).profilePic : 'dddf';

      this.storage.set("user_created_time", { Created_time: new Date(), "selectedusers": this.selected_users.toString(), "message": message, "eventcreated": eventCreated, "pic": JSON.parse(user).profilePic, "Distance_selected": this.distanceSelected })
        .then(() => {
          this.apiService.GetOneSignalPlayerIds(this.selected_users.toString())
            .subscribe(playerIds => {
              this.sendPushNotifcationViaOneSignal('catchupInvite', playerIds, eventCreated, JSON.parse(user).UserName, JSON.parse(user).UserProfileImg, '', this.addressOne.lat + ',' + this.addressOne.lng, this.distanceSelected, '');
              this.storage.set('catchupcreated', true);
            })
        })
      // let response = await this.sendPushNotification(this.selected_users.toString(), message, eventCreated, JSON.parse(user).profilePic);
      // this.storage.set('catchupinviteConfirmed',true  ).then(()=>{
      //   console.log('catchupinviteConfirmed: ' + true);
      // })
      // this.selected_users=[];
      this.navCtrl.popToRoot();
    }, 1000);
  }
  async onNotifys() {
    this.showselectedlist = false;
    let loading = this.loadingCtrl.create({
      spinner: 'hide'

    });

    loading.data.content = this.loadingCreator.getLoadingSymbol();
    loading.present();



    this.distanceSelected = this.rangeValues;
    // let latlng = await this.getLatlong();



    await this.selectedInvitees.forEach((elementAt, index) => {
      if (elementAt.phone != 'tenDigitNumber')
        this.selectedInvitees.push(elementAt.phone.split('').splice(elementAt.phone.length - 10).join(''));
      else
        this.selectedInvitees.splice(index, 1);

    })

    await this.buddy_selectiom.forEach(element => {

      let buddy = this.buddyList.findIndex(x => x.name == element);


      this.details = this.buddyList[buddy].BuddiesDetails;;


      this.details.forEach(details => {
        if (details.phone != 'tenDigitNumber') {
          this.selected_users.push(details.phone.split('').splice(details.phone.length - 10).join(''));

          this.selectedInvitees.push({
            name: details.name,
            phone: details.phone.split('').splice(details.phone.length - 10).join(''),
            "Image": details.Image,

          })
        }
        else {

          let index = this.selectedInvitees.findIndex(x => x.phone == 'tenDigitNumber')
          if (index > -1) {

            this.selectedInvitees.splice(index, 1)
          }
        }
      });


    });

    this.selected_users = await this.removeDuplicates(this.selected_users);
    this.selectedInvitees = await this.removeDuplicatesoflist(this.selectedInvitees, "name");


    setTimeout(async () => {

      // this.inviteesOfEvent = JSON.parse(invitees).length;
      let eventCreated = await this.createCatchUpEvent(this.formattedAddress);

      loading.dismiss();

      this.searchText = '';
      this.User_list_contacts = [];

      await this.selectedInvitees.forEach(list => {

        if (list.phone != 'tenDigitNumber') {
          let EventDetails = JSON.parse(eventCreated);

          let latest_date = this.DatePipe.transform(new Date(), 'HH:mm a');

          this.apiService.UpdateEventStatus(4, EventDetails.EventId, list.phone.split('').splice(list.phone.length - 10).join(''), 0, "", latest_date, list.name).subscribe((update_status) => {


          })
        }
      })
      this.notifypopup = true;
      setTimeout(() => {
        this.notifypopup = false;
        this.storage.remove("List_contactseleced");
        this.storage.set('catchup', 1).then(() => {

          //  
        })
      }, 3000);
      // let signalrNotifySent =  await this.sendSignalRNotificationAndCreateNotification(eventCreated);

      let user = await this.getUserProfilePicByUserId();
      await this.geoService._geolocate({ enableHighAccuracy: false }).then((res) => {
        this.addressOne = { lat: res.coords.latitude, lng: res.coords.longitude }
      })
      let message = `${JSON.parse(user).UserName} is available for a meal.
          Would you like to join?,${this.addressOne.lat + ',' + this.addressOne.lng
        },${this.distanceSelected}`
      let profilePic = JSON.parse(user).profilePic != null && JSON.parse(user).profilePic != undefined ? JSON.parse(user).profilePic : 'dddf';

      this.storage.set("user_created_time", { Created_time: new Date(), "selectedusers": this.selected_users.toString(), "message": message, "eventcreated": eventCreated, "pic": JSON.parse(user).profilePic, "Distance_selected": this.distanceSelected })
      this.apiService.GetOneSignalPlayerIds(this.selected_users.toString())
        .subscribe(playerIds => {
          this.sendPushNotifcationViaOneSignal('catchupInvite', playerIds, eventCreated, JSON.parse(user).UserName, JSON.parse(user).profilePic, '', this.addressOne.lat + ',' + this.addressOne.lng, this.distanceSelected, '')

        })
      // let response = await this.sendPushNotification(this.selected_users.toString(), message, eventCreated, JSON.parse(user).profilePic);
      // this.selected_users=[];
      this.navCtrl.popToRoot();
    }, 1000);

  }

  async getUserProfilePicByUserId(): Promise<any> {
    return await this.loteasyService.fetch('get', 'FetchSingleUserById', { UserId: this.userId });

  }



  async consolidateContactsFromBuddiesAndContacts(): Promise<any> {
    let selectedList: Array<any> = [];
    this.selectedListsArray.forEach(list => {
      if (Array.isArray) {
        if (Array.isArray(list)) {
          list.forEach(item => {
            selectedList.push(item);
          })
        } else {
          let buddies = JSON.parse(list.phone);
          buddies.forEach(buddy => {
            selectedList.push({ displayName: buddy.name, phone: buddy.phone })
          })
        }
      }
    })
    return new Promise((resolve, reject) => {
      resolve(selectedList);
      reject(new Error('error occured during process'));
    })

  }

  async  filterOutNonRegdUsers(consolidateList: Array<any>): Promise<any> {
    let regd: Array<any> = [];
    let nonRegd: Array<any> = [];
    consolidateList.forEach(contact => {

      let index = this.Register_users.findIndex(users => users.PhoneNumber == contact.phone);
      if (index > -1) {
        regd.push(contact.phone);
      }
      else {
        nonRegd.push(contact.phone);
      }
      //  this.loteasyService.fetch('post','FetchUserDetailsByPhoneNumber',
      //     {PhoneNumber:contact.phone,CountryCode:'91'})
      //  .then(user=>{
      //    if(user != null && user != undefined){
      //      if(regd.indexOf(user.PhoneNumber)==-1){
      //       regd.push(user.PhoneNumber);
      //      }
      //    }else{
      //      if(nonRegd.indexOf(contact.phone)==-1){
      //       nonRegd.push(contact.phone);
      //      }
      //    }

      //  })  

    })

    return await new Promise((resolve, reject) => {
      resolve({ regd: regd, nonRegd: nonRegd });
      reject(new Error('error processing request'));
    })

  }

  async combineRegdAndNonRegdPhoneNumbers(regdAndNonRegdUsersObj: any): Promise<any> {
    let regd = regdAndNonRegdUsersObj.regd;
    let unregd = regdAndNonRegdUsersObj.nonRegd;
    return await new Promise((resolve, reject) => {
      resolve(JSON.stringify(regd.concat(unregd)));
      reject(new Error('error occured'));
    })
  }

  async createCatchUpEvent(Address): Promise<any> {
    let _date = this.DatePipe.transform(new Date(), 'dd-MM-yyyy');
    let _time = this.DatePipe.transform(new Date(), 'hh:mm a');
    return await this.loteasyService.fetch('post', 'CreateNewEvent',
      {
        UserId: this.userId, VenueId: 101, EventDateTime: new Date().toString(), InviteesList: JSON.stringify(this.selected_users), ImagesShared: '',
        EventStatusId: 0, ReasonForCancellation: '', EventDescription: '', EventDate: _date, EventTime: _time,
        EventTitle: 'Meet Friends Now', EventAddress: Address
      })

  }

  async sendPushNotification(invitees: string, message: string, eventDetails: any, profilePic: string): Promise<any> {

    return await this.loteasyService.fetch('post', 'SendPushNotificationFCM',
      { PhoneNumbers: invitees, NotifyMessage: message, eventDetails: eventDetails, profileImg: profilePic, typeOfNotification: 'catchUpInvite' });
  }

  showUser() {
    this.catchupList.nativeElement.classList.add('active');
    this.setavablieList.nativeElement.classList.remove('active')
    this.showAvaliablity = false;
    this.display_users = [];
    // this.List_of_catchupEvents=[];
    this.Display_catchupEvents();
  }
  setavablity() {
    this.catchupList.nativeElement.classList.remove('active');
    this.setavablieList.nativeElement.classList.add('active');
    this.storage.get('catchupcreated').then(catchupcreated=>{
      if(!catchupcreated){
        this.setAvailabilityFunction();
      }
    })
    
  }
  async Navigate_rest(Event_id: any) {

    this.storage.set("selected_users_interesrted", { "Interested": this.selected_users_interesrted, Eventid: Event_id });
    if (this.button_status == 'Proceed Booking')
      this.navCtrl.push('RestaurantsListPage', { catchup: 'catchupstate', EventDetails: Event_id, from: "set-availability", flow: 'Meet Friends Now' });
    else {
      let latlng = await this.getLatlong();
      let user = await this.getUserProfilePicByUserId();
      let message = `${JSON.parse(user).UserName} is available for a meal. Would you like to join?,${latlng.coords.latitude + ',' + latlng.coords.longitude},${this.rangeValues}`
      this.storage.get("user_created_time").then(status => {
        this.apiService.GetOneSignalPlayerIds(status.selectedusers)
          .subscribe(playerIds => {
            this.apiService.FetchSingleUserById(this.userId)
              .subscribe(currentUser => {
                let userName = JSON.parse(currentUser).UserName;
                let userPhoto = JSON.parse(currentUser).UserProfileImg;
                this.sendPushNotifcationViaOneSignal('catchupInvite', playerIds, status.eventcreated, userName, userPhoto, '', '', '', '');
                console.log(status, status.eventCreated);
                this.storage.set("user_created_time", { Created_time: status.Created_time, "selectedusers": status.selectedusers.toString(), "message": message, "eventcreated": status.eventcreated, "pic": status.pic, "Distance_selected": this.rangeValues })
                .then((storedRes)=>{
                  this.notifypopup = true;
                  setTimeout(() => {
                    this.notifypopup = false;
                    this.navCtrl.popToRoot();
                  }, 2000);
                })
               
              })
          })

        // let response = this.sendPushNotification(status.selectedusers, message, status.eventcreated, status.pic);
      });


    }


  }

  invokeCancelEventDialog(eventId, type) {
    this.showCancelEventDialog = true;
    this.eventToBeCancelledId = eventId;
    this.typeOfCancelledEvent = type;
    document.body.classList.add('ovh');
    
  }

  cancelEvent() {
    if (this.button_status == 'ResendNotifications') {
      this.button_status = 'Proceed Booking';
      this.storage.get("user_created_time").then(status => {
        this.rangeValues = status.Distance_selected;
      })
    }
    else {
      this.Eventid = this.eventToBeCancelledId;
      // let latest_date =this.DatePipe.transform(new Date(), 'HH:mm a');
      let index = this.List_of_catchupEvents.findIndex(x => x.Eventid == this.eventToBeCancelledId);
      if (this.typeOfCancelledEvent == 'owner') {
        this.apiService.UpdateEventStatusByowner(this.userId, this.eventToBeCancelledId, 2, '').subscribe((ownerupdateevent) => {
          // this.List_of_catchupEvents.splice(index,1);
          this.List_of_catchupEvents[index].Delted_state = false;
          this.storage.remove("selected_users_interesrted");
          this.List_of_catchupEvents[index].EventUserName = 'You Cancelled the event';
          this.List_of_catchupEvents[index].Eventcreated = "cancel";
          this.rangeValues = 5;
          this.CatchstateStatus = true;
          this.catchupstateDesc = 'Let your friends accompany you over a meal';
          this.storage.get('user_created_time').then(res => {
            console.log(res);
            let eventId =JSON.parse(res.eventcreated).EventId;
            
            this.apiService.GetOneSignalPlayerIds(res.selectedusers)
              .subscribe(playerIds => {
                this.apiService.FetchSingleUserById(this.userId)
                  .subscribe(currentUser => {
                    let userName = JSON.parse(currentUser).UserName;
                    let userPhoto = JSON.parse(currentUser).UserProfileImg;
                    this.sendPushNotifcationViaOneSignal('cancelledInvite', playerIds, res.eventcreated, userName, userPhoto, '', '', '', '');
                    this.storage.remove("user_created_time").then(()=>{
                      this.storage.set('catchupcreated', false).then(()=>{
                        console.log('Set catchup created to false');
                        // this.apiService.UpdateEventStatusByowner(this.userId,eventId,2,'')
                        // .subscribe(res=>{
                        //   console.log(res);
                        // })
                        // this.apiService.UpdateEventStatus(this.userId,eventId,JSON.parse(currentUser).PhoneNumber,2,'',new Date(),)
                      })
                    })
                  })
              })
            // this.apiService.SendPushNotificationFCM(res.selectedusers, `${this.Register_username} has cancelled the catchup event`, res.eventcreated, '', 'cancelledInvite')
            //   .subscribe(resp => {

            //     console.log(resp);
            //   })
          })
          this.showCancelEventDialog = false;
          document.body.classList.remove('ovh');


        })
      }

    }

  }

  dismissCancelEventDialog() {
    this.showCancelEventDialog = false;
    document.body.classList.remove('ovh');
  }
  InviteeSelection(name: any) {

  }
  removeDuplicatesoflist(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
  toggle(id: any) {
    this.skillImgs.forEach((skill: ElementRef) => {
      this.renderer.setElementStyle(skill.nativeElement, "display", "none");
    });
    // document.querySelector('#users'+id).classList.add('show');
    // console.log(document.querySelector('#users'+id))
    // if(document.getElementById('users'+id).style.display=="none")
    // document.getElementById('users'+id).style.display="block";
    // else
    // document.getElementById('users'+id).style.display="none";
  }
  Interested(Event_id: any, type: any) {


    this.confirmationService.confirm({

      message: 'Are You  ' + type + ' in joining the Catchup',
      header: 'Confirm the Event',

      accept: () => {

        let index = this.List_of_catchupEvents.findIndex(x => x.Eventid == Event_id);
        let user_index = this.List_of_catchupEvents[index].Invitess_list.findIndex(x => x.phone == this.phoneNumber)
        let latest_date = this.DatePipe.transform(new Date(), 'HH:mm a');
        if (type == "Intrested") {
          this.apiService.UpdateEventStatus(this.userId, Event_id, this.phoneNumber, 1, "", latest_date, this.Register_username).subscribe((UpdateEventInviteeDetails: any) => {
            this.List_of_catchupEvents[index].Initial_state_user = false;
            this.List_of_catchupEvents[index].EventinviteeButton = 'Exit';
            this.List_of_catchupEvents[index].Invitess_list[user_index].status_state = 1;
            this.List_of_catchupEvents[index].AcceptedUsers = this.List_of_catchupEvents[index].AcceptedUsers + 1;
          })
        }
        else if (type == "Not Intrested") {
          this.apiService.UpdateEventStatus(this.userId, Event_id, this.phoneNumber, 2, "", latest_date, this.Register_username).subscribe((UpdateEventInviteeDetails: any) => {
            this.List_of_catchupEvents[index].Initial_state_user = false;
            this.List_of_catchupEvents[index].Invitess_list[user_index].status_state = 2;
            this.List_of_catchupEvents[index].EventinviteeButton = 'Join Back';

          })
        }

      },
      reject: () => {
        console.log("rejected")
      }
    })


  }
  conformEvent(event: any, type: any) {
    let uncheckedInvitees = this.Event_user_list.filter(inv => {
      return inv.state == false;
    })
    console.log(event);
    console.log("type:" + type);
    this.selectedInviteesList = JSON.stringify(this.list_of_selected);
    console.log("final list:" + this.selectedInviteesList);
    this.Uncheckedinviteeslist = this.selected_users_interesrted;
    console.log("uncheckedinviteeslist: " + this.selected_users_interesrted);
    let index = this.List_of_catchupEvents.findIndex(x => x.Eventid == event.Eventid);

    if (type == "withoutRest") {

      let confirmMsg: string;

      if (this.addressType == 2) {
        confirmMsg = 'Do you want to Confirm the Event';

      }
      else {
        confirmMsg = 'You are confirming without selecting a restaurant.';

      }
      this.confirmationService.confirm({


        message: confirmMsg,

        header: 'Confirm the Event',

        accept: () => {


          console.log("status:" + this.List_of_catchupEvents[index].Event_state);
          this.apiService.UpdateEventStatusByowner(this.userId, event.Eventid, 1, '').subscribe((ownerupdateevent) => {
            //  this.List_of_catchupEvents.splice(index,1);
            // this.sendPushNotificationsToInviteesOnLocationChange();
            this.apiService.GetOneSignalPlayerIds(this.selectedInviteesList.toString())
              .subscribe(playerIds => {
                this.apiService.FetchSingleUserById(this.userId)
                  .subscribe(currentUser => {
                    let userName = JSON.parse(currentUser).UserName;
                    let userPhoto = JSON.parse(currentUser).UserProfileImg;
                    this.sendPushNotifcationViaOneSignal('confirmedInvite', playerIds, JSON.stringify(event), userName, userPhoto, '', '', '', '');

                  })
              })
            this.storage.set('catchupinviteConfirmed', true)
              .then(() => {
                console.log('catchupinviteConfirmed: ' + true);
              });

            this.storage.ready().then(
              () => {

                this.CatchstateStatus = true;

                this.List_of_catchupEvents[index].Event_state = 1;
                if (this.List_of_catchupEvents[index].Event_state == 1) {
                  this.List_of_catchupEvents[index].EventUserName = 'You created the event';
                }
                else {
                  this.List_of_catchupEvents[index].EventUserName = 'You have Catch up event to confirm';
                }
                this.List_of_catchupEvents[index].Delted_state = true;

                this.flow_from = 'catchup';
                this.CatchstateStatus = false;

                this.Booking_type = 'completed';
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
              });
          })
          console.log(this.Uncheckedinviteeslist);
          if (this.Uncheckedinviteeslist != '') {

            this.apiService.UpdateUncheckedinviteeStatus(this.Uncheckedinviteeslist, event.Eventid, 2, this.selectedInviteesList).subscribe((ownerupdateevent) => {
              //  this.List_of_catchupEvents.splice(index,1);
              this.apiService.GetOneSignalPlayerIds(uncheckedInvitees.toString())
                .subscribe(playerIds => {
                  this.apiService.FetchSingleUserById(this.userId)
                    .subscribe(currentUser => {
                      let userName = JSON.parse(currentUser).UserName;
                      let userPhoto = JSON.parse(currentUser).UserProfileImg;
                      this.sendPushNotifcationViaOneSignal('excludedFromEvent', playerIds, JSON.stringify(event), userName, userPhoto, '', '', '', '');

                    })
                })
              // this.apiService.SendPushNotificationFCM(JSON.stringify(uncheckedInvitees),`${this.Register_username} has excluded you from the event`,JSON.stringify(event),'','excludedFromEvent')
              // .subscribe(pushResponse1=>{
              //   console.log(pushResponse1);
              // })
              this.storage.ready().then(
                () => {

                  this.CatchstateStatus = true;
                  this.List_of_catchupEvents[index].Event_state = 1;
                  this.List_of_catchupEvents[index].Delted_state = true;
                  if (this.List_of_catchupEvents[index].Event_state == 1) {
                    this.List_of_catchupEvents[index].EventUserName = 'You created the event';
                  }
                  else {
                    this.List_of_catchupEvents[index].EventUserName = 'You have Catch up Event to Confirm';
                  }

                  this.flow_from = 'catchup';
                  this.CatchstateStatus = false;
                  this.Booking_type = 'completed';
                  this.navCtrl.setRoot(this.navCtrl.getActive().component);
                });
            });
          }

        },
        reject: () => {
          console.log("rejected")
        }
      });
    }
    else {
      this.apiService.UpdateEventStatusByowner(this.userId, event.Eventid, 1, '').subscribe((ownerupdateevent) => {
        //  this.List_of_catchupEvents.splice(index,1);

        this.storage.ready().then(
          () => {
            // this.storage.remove("user_created_time");
            this.List_of_catchupEvents[index].Event_state = 1;
            this.List_of_catchupEvents[index].Delted_state = true;
            if (this.List_of_catchupEvents[index].Event_state == 1) {
              this.List_of_catchupEvents[index].EventUserName = 'You created the event';
            }
            else {
              this.List_of_catchupEvents[index].EventUserName = 'You have Catch up Event to Confirm';
            }
            this.flow_from = 'catchup';
            this.CatchstateStatus = false;
            this.Booking_type = 'completed';
            this.navCtrl.setRoot(this.navCtrl.getActive().component);

          });
      })
    }

  }

  confirm1(Event_id: any, type: any, type_event: any, event) {

    let index = this.List_of_catchupEvents.findIndex(x => x.Eventid == Event_id);
    let user_index = this.List_of_catchupEvents[index].Invitess_list.findIndex(x => x.phone == this.phoneNumber)
    let status_value: any;
    this.storage.get('userDetails').then(userdetails => {
      this.apiService.FetchSingleUserById(userdetails.UserId)
        .subscribe(thisuser => {
          let username = JSON.parse(thisuser).UserName;
          this.apiService.FetchSingleUserById(this.List_of_catchupEvents[index].EventCreatedBy)
            .subscribe(eventcreator => {
              let eventCreatorPhone = JSON.parse(eventcreator).PhoneNumber;
              if (type_event == 'Exit') {
                status_value = 2;

              }
              else if (type_event == 'Join Back')

                status_value = 1;

              this.confirmationService.confirm({

                message: 'Are you sure you want to ' + type_event + '?',
                header: type_event + ' Event',

                accept: () => {
                  let latest_date = this.DatePipe.transform(new Date(), 'HH:mm a');
                  this.apiService.UpdateEventStatus(this.userId, Event_id, this.phoneNumber, status_value, "", latest_date, this.Register_username).subscribe((UpdateEventInviteeDetails: any) => {

                    if (type_event == 'Exit') {
                      this.List_of_catchupEvents[index].EventinviteeButton = 'Join Back';
                      this.List_of_catchupEvents[index].AcceptedUsers = this.List_of_catchupEvents[index].AcceptedUsers - 1;
                      this.List_of_catchupEvents[index].Invitess_list[user_index].status_state = status_value;
                      this.apiService.GetOneSignalPlayerIds(eventCreatorPhone)
                        .subscribe(playerId => {
                          this.apiService.FetchSingleUserById(this.userId)
                            .subscribe(currentUser => {
                              let userName = JSON.parse(currentUser).UserName;
                              let userPhoto = JSON.parse(currentUser).UserProfileImg;
                              this.sendPushNotifcationViaOneSignal('exitedEvent', playerId, JSON.stringify(event), userName, userPhoto, '', '', '', '')
                            })
                        })
                      // this.apiService.SendPushNotificationFCM(eventCreatorPhone, `${username} has exited the event`, JSON.stringify(event), '', 'exitedEvent')
                      //   .subscribe(pushResponse1 => {
                      //     console.log(pushResponse1);
                      //   })

                    }
                    else {

                      this.List_of_catchupEvents[index].AcceptedUsers = this.List_of_catchupEvents[index].AcceptedUsers + 1;
                      this.List_of_catchupEvents[index].EventinviteeButton = 'Exit';
                      this.List_of_catchupEvents[index].Invitess_list[user_index].status_state = status_value;
                      this.apiService.GetOneSignalPlayerIds(eventCreatorPhone)
                        .subscribe(playerId => {
                          this.apiService.FetchSingleUserById(this.userId)
                            .subscribe(currentUser => {
                              let userName = JSON.parse(currentUser).UserName;
                              let userPhoto = JSON.parse(currentUser).UserProfileImg;
                              this.sendPushNotifcationViaOneSignal('joinedbackEvent', playerId, JSON.stringify(event), userName, userPhoto, '', '', '', '')
                            })
                        })
                      // this.apiService.SendPushNotificationFCM(eventCreatorPhone, `${username} has joined back the event`, JSON.stringify(event), '', 'joinedbackEvent')
                      //   .subscribe(pushResponse2 => {
                      //     console.log(pushResponse2);
                      //   })
                    }


                  })

                },
                reject: () => {

                }
              });
            })

        })
    })

  }
  addToBuddyList(contact: any) {
    this.navCtrl.push('AddnewbuddyPage', { UserId: this.userId, contact: contact, from: 'setavaliablity' });
  }

  displayBuddies() {
    this.buddiesList=[];
    setTimeout(() => {
      this.getBuddiesListByUserId();
    }, 100);
    
    this.autocompleteContacstList = [];
    this.showselectedlist = !this.showselectedlist;
    if (this.buddy_selectiom.length > 0) {
      this.buddyList.forEach((element, indexdb) => {
        let index = this.buddy_selectiom.findIndex(x => x == element.name);
        if (index > -1) {
          this.buddyList[indexdb].checked = true;
        }
        else {
          this.buddyList[indexdb].checked = false;
        }

      });


    }
    else {

      this.buddyList.forEach((element, indexdb) => {
        if (this.buddies_selection.length > 0) {
          let indexb = this.buddies_selection.findIndex(x => x.name == element.name);
          if (indexb > -1) {
            this.buddyList[indexdb].checked = true;
          }
          else {
            this.buddyList[indexdb].checked = false;
          }
        }
        else {
          this.buddyList[indexdb].checked = false;
        }
      })

    }
    // let buddylistindex =  this.User_list_contacts.findIndex(x => x.Name==element && x.phone=='tenDigitNumber');
    this.memberInputChange = false;
    this.displayBuddygroup = !this.displayBuddygroup;
    this.searchText = '';

  }
  async handleChange() {
    this.storage.get("user_created_time").then(status => {
      if (status != null || status != undefined) {

        if (this.rangeValues < status.Distance_selected) {
          this.rangeValues = status.Distance_selected;
        }
        else if (this.rangeValues > status.Distance_selected) {
          this.button_status = "ResendNotifications";
        }
        else if (this.rangeValues == status.Distance_selected) {
          this.button_status = "";

        }
      }
    })

    //e.value is the new value


  }
  mouseLeaveStarEvent(val) {

    this.showrangehide = true;
  }
  mouseEnter() {

    this.showrangehide = false;

  }
  public selected_users_interesrted: any[] = [];
  public list_of_selected: any[] = [];
  Interestedcontactselection(name: any, phone: any, Event_id: any) {

    let index_event = this.List_of_catchupEvents.findIndex(x => x.Eventid == Event_id);
    let index = this.list_of_selected.findIndex(x => x == phone);
    console.log("total list:" + this.list_of_selected);

    let index_list = this.selected_users_interesrted.findIndex(x => x == phone);


    if (index_list > -1) {
      this.selected_users_interesrted.splice(index_list, 1);
    }
    else {
      this.selected_users_interesrted.push(phone);
    }


    if (index > -1) {

      this.list_of_selected.splice(index, 1);

      this.List_of_catchupEvents[index_event].AcceptedUsers = this.List_of_catchupEvents[index_event].AcceptedUsers - 1;

    }
    else {

      this.list_of_selected.push(phone);

      this.List_of_catchupEvents[index_event].AcceptedUsers = this.List_of_catchupEvents[index_event].AcceptedUsers + 1;


    }

  }

  async displayAllContacts() {
    this.noMatchFound = false;
    this.autocompleteContacstList = [];

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      duration: 2000
    })

    loading.data.content = this.loadingCreator.getLoadingSymbol();
    loading.present();
    setTimeout(() => {
      loading.dismiss();

    }, 500);
    this.autocompleteContatcs = "";
    this.activatesearch = true;
    this.showphonecontacts = true;

    this.phoneContacts = await this.user_list_contacts;

    if (this.selectedInvitees.length > 0) {

      this.selectedInvitees.forEach(element => {
        let user_phone = "";

        user_phone = element["phoneNumbers[0].value"];
        let phone_index = this.phoneContacts.findIndex(x => x.phone == user_phone);
        if (phone_index > -1)
          this.phoneContacts[phone_index].checked = true;

      });
    }

  }

  selectimgfordelettion(buddy_name: any, indexdb: any): void {
    let index = this.buddiesList.findIndex(x => x.buddy.BuddiesListName == buddy_name);
    let buddy = this.selectedInvitees.findIndex(x => x.displayName == buddy_name);


    if (buddy > -1) {
      this.selectedInvitees.splice(buddy, 1);
    }
    else {
      let imges = "";
      if (this.buddiesList[index].buddy.BuddiesListProfilePic != "undefined") {
        imges = this.cloudImagePath + this.buddiesList[index].buddy.BuddiesListProfilePic;
      }
      else {
        imges = "assets/images/new buddies group icon.svg";
      }
      this.selectedInvitees.push({
        "displayName": buddy_name,
        "phoneNumbers[0].value": indexdb + indexdb + indexdb + indexdb,
        "image": imges,
        "buddy_group": "Buddy"
      }
      )


    }
    if (this.buddiesList[index].checked) {
      this.buddiesList[index].checked = true;
    }
    else {
      this.buddiesList[index].checked = false;
    }
    // this.proceedButton();
  }
  selectedListContacts(): void {
    this.noMatchFound = false;
    this.autocompleteContatcs = "";
    this.activatesearch = false;

  }
  phonecontactselection(contact_name: any, phone: any): void {
    let index = this.phoneContacts.findIndex(x => x.name == contact_name);
    if (phone == this.Register_phone) {
      this.Errormsg();
    }
    else {
      let phone_exist = this.Register_users.findIndex(x => x.PhoneNumber == phone);
      let profile_pic = "";
      if (phone_exist > -1) {
        profile_pic = "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[phone_exist].UserProfileImg
      }
      else {
        profile_pic = "assets/images/Single Contact Icon.svg"
      }
      if (this.phoneContacts[index].checked) {

        this.selectedInvitees.push({
          "displayName": contact_name,
          "phoneNumbers[0].value": phone,
          "image": profile_pic,
          "buddy_group": "NotBuddy"
        }
        )
        //
      }
      else {
        this.selectedInvitees.splice(this.selectedInvitees.findIndex(x => x.displayName == contact_name), 1);
      }
      this.proceedButton();


    }
  }
  allContactList: any[] = []
  Errormsg() {
    let checkduplicates = this.toastCtrl.create({
      message: "This " + this.Register_phone + " Number is Registered with the device",
      duration: 1000,
      position: 'bottom'
    })
    checkduplicates.present();
  }
  proceedButton() {
    if (this.selectedInvitees.length > 0) {
      this.allFieldsNotAvailable = false;

    }
    else {
      this.allFieldsNotAvailable = true;

    }
  }
  removeContact(contact: any, i: any) {
    this.selectedInvitees.splice(i, 1);
    let phone_index = this.phoneContacts.findIndex(x => x.name == contact.displayName);
    // let index_check_contacts=this.selected_user.findIndex(x=>x.phone==contact.phone);
    // if(index_check_contacts>-1)
    // {
    // this.selected_user.splice(index_check_contacts, 1);
    // }
    if (phone_index > -1) {
      if (this.phoneContacts[phone_index].checked) {
        this.phoneContacts[phone_index].checked = false;
      }
      else {
        this.phoneContacts[phone_index].checked = true;
      }
    }
    let index = this.buddiesList.findIndex(x => x.buddy.BuddiesListName == contact.displayName);
    if (index > -1) {
      this.buddiesList[index].checked = false;
    }
    this.proceedButton();
    //this.buddiesList[index].checked=false;
  }


  async onContatsSearch(event) {
    this.phoneContacts = this.user_list_contacts;
    var events = [];
    this.autocompleteContacstList = [];

    let searchContactKeyword = event.target.value.trim().toLowerCase();
    if (!this.activatesearch) {

      this.autocompleteContatcs == '' ? this.showContactsSearchResults = true
        : this.showContactsSearchResults = false;
      await this.contacts.find(['displayName', 'name', 'phoneNumbers'], { filter: "", multiple: true, desiredFields: ['displayName', 'name', 'phoneNumbers'] })
        .then(data => {
          this.allContactList = data;

          this.allContactList.forEach((contact, indexedDB) => {

            if (contact.phoneNumbers != null && contact.displayName != null) {

              this.profile_img = "";
              let formattedNumber = contact.phoneNumbers[0].value.replace(/[^0-9+]/g, '');
              let phone_exist = this.Register_users.findIndex(x => x.PhoneNumber == formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
              if (phone_exist > -1) {
                this.profile_img = "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[phone_exist].UserProfileImg
              }
              else
                this.profile_img = "assets/images/Single Contact Icon.svg";

              if (contact.displayName != null) {


                events.push({
                  phone: formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
                  name: contact.displayName,
                  image: this.profile_img
                })
              }
            }

          })
        })

      this.autocompleteContacstList = events.filter((event) => {
        return event.name.toLowerCase().indexOf(searchContactKeyword) > -1 || event.phone.indexOf(searchContactKeyword) > -1;
      })

      if (this.autocompleteContacstList.length < 1) {
        this.noMatchFound = true;
        this.autocompleteContacstList = [];
        this.showphonecontacts = false;
        //.phoneContacts=[];
      } else {
        this.noMatchFound = false;
        this.autocompleteContacstList = this.filterUniqueItemsfromArray(this.autocompleteContacstList);
      }
      if (this.autocompleteContatcs == '') {
        this.noMatchFound = false;
        this.showTabbedView = true;
        this.autocompleteContacstList = [];
        this.showphonecontacts = false;
      }
      else {
        this.showTabbedView = false;
      }

    }
    else {

      let searchContactKeyword = event.target.value.trim().toLowerCase();




      this.phoneContacts = this.phoneContacts.filter((item, index, self) => {
        return (item.name.toLowerCase().indexOf(searchContactKeyword) > -1
          || item.phone.indexOf(searchContactKeyword) > -1);
      });

      if (this.phoneContacts.length > 0) {

        this.noMatchFound = false;
      }
      else {
        this.noMatchFound = true;
      }
    }
    //end
    // this.showTabbedView = true;
  }
  filterUniqueItemsfromArray = function (origArr) {
    var newArr = [],
      origLen = origArr.length,
      found, x, y;
    for (x = 0; x < origLen; x++) {
      found = undefined;
      for (y = 0; y < newArr.length; y++) {
        if (origArr[x] === newArr[y]) {
          found = true;
          break;
        }
      }
      if (!found) {
        newArr.push(origArr[x]);

      }
    }
    return newArr;
  }

  onContactSelected(contact: any) {
    if (contact.phone == this.Register_phone) {
      this.Errormsg();
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'This contact: ' + contact.phone + ' is already selected!',
        duration: 3000,
        position: 'bottom'
      })
      this.ngZone.run(() => {
        if (this.selectedInvitees.length > 0) {
          let phone_index = this.selectedInvitees.findIndex(x => x.displayName == contact.name);
          if (this.phoneContacts.length > 0) {
            let index = this.phoneContacts.findIndex(x => x.name == contact.name);
            this.phoneContacts[index].checked = true;
          }
          if (phone_index > -1) {
            toast.present();
          }
          else {

            this.selectedInvitees.push({
              "displayName": contact.name,
              "phoneNumbers[0].value": contact.phone,
              "image": contact.image,
              "buddy_group": "NotBuddy"
            }
            )

          }
        }
        else {
          this.selectedInvitees.push({
            "displayName": contact.name,
            "phoneNumbers[0].value": contact.phone,
            "image": contact.image,
            "buddy_group": "NotBuddy"
          }
          )

        }
        this.showTabbedView = true;
        this.noMatchFound = false;
        this.autocompleteContatcs.input = '';

      })
      this.testing = "interested";
      this.proceedButton();
    }
  }
  navigateToLocationEdit() {
    this.storage.set("List_contactseleced", this.removeDuplicatesoflist(this.selectedInvitees, "name"))
    this.navCtrl.push(SearchLocationWiseRestuarntsComponent, { from: "Locationset-availability", flow: 'catchupoverameal', userId: this.userId, latlong: this.addressOne })

  }
  LocationEdit(Event_id: any) {
    this.storage.set("List_contactseleced", this.removeDuplicatesoflist(this.selectedInvitees, "name"))
    this.navCtrl.push(SearchLocationWiseRestuarntsComponent, { catchup: 'catchupstateaddress', EventDetails: Event_id, from: "set-availability_address", flow: 'Meet Friends Now', latlong: this.addressOne });
  }
  remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    for (var key in obj) {
      ret_arr.push(key);
    }
    return ret_arr;
  }

  sendPushNotifcationViaOneSignal(typeOfNotify, playerIds, eventDetails, senderName, largeIcon, bigPicture, latlong, distance, changedVenue) {
    let notificationObj: NotificationObject = {
      type: typeOfNotify,
      playerIds: playerIds.PlayersIds,
      senderName: senderName,
      senderPhotoLink: this.cloudinaryUrl + largeIcon,
      bigPicture: this.cloudinaryRestHeroImgUrl + bigPicture,
      eventDetails: eventDetails,
      latlong: latlong,
      distance: distance,
      changedVenue: changedVenue
    }

    this.oneSignalService.postOneSignalNotification(notificationObj);

  }

   deleteLapsedEvent(event,i){
   let loading = this.loadingCtrl.create({
     spinner:'hide'
   })  
   loading.data.content = this.loadingCreator.getLoadingSymbol();
   loading.present();
   this.List_of_catchupEvents.splice(i,1);
   loading.dismiss();
      this.apiService.deleteCatchupEventByUser(this.userId,event.Eventid,1)
      .subscribe(res=>{
        if(res){
          this.storage.remove('user_created_time').then(()=>{
            console.log('event removed from loacal storage');
          })
        }
       console.log(res);       
      })
      .unsubscribe()
           
   }


}
