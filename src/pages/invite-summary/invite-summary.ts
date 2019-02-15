import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { ApiServices } from '../../services/appAPIServices';
import { AppConstants } from '../../assets/appConstants';
import { CallNumber } from '@ionic-native/call-number';
import { EventsHubService } from '../../services/EventsHubService';
import { DatePipe } from '@angular/common';
import { SharedService } from '../../services/globalvariable';
import { Contacts } from '@ionic-native/contacts';
import { LoadingCreator } from '../../services/loadingcreator';
import { OneSignalServiceProvider, NotificationObject } from '../../services/oneSignalPushNotificationProvider';
declare var $: any;
interface InviteSummary {
  _date: any;
  _time: any;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  invitees: Array<any>;
  estimatedCost: number;
  inviteDescription: string;
}
@IonicPage()
@Component({
  selector: 'page-invite-summary',
  templateUrl: 'invite-summary.html',
})
export class InviteSummaryPage {
  Title_heading: string;
  proxy: any;
  connection: any;
  eventId: any;
  invitepopup: boolean = false;
  callpopup: boolean = false;
  flowType: any;
  location: any;
  _time: any;
  _date: any;
  invitees: Array<any> = [];
  restaurant: any;
  fromPage: any;
  showOccassion: boolean;
  isInviteDateToday: boolean;
  inviteDayName: string;
  inviteDate: any;
  inviteMonth: string;
  inviteesList: Array<any> = [];
  cloudinaryUrl: string = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  cloudinaryRestHeroImgUrl = AppConstants.CLOUDINARY_FETCH_HERO_IMAGE_PATH;
  inviteSummary: InviteSummary;
  inviteeToCall: any;
  UserId: number;
  public occasion_details: any;
  UserName: string;
  public mobilenumber: any;
  public Estimated_cost: any;
  public name: any;
  public Rest_Address: any;
  public Rest_name: any;
  public Profile_img: any;
  public getcurrenttime: any;
  public Register_users: any[] = [];
  public User_details: any[] = [];
  public estimated: any;
  public Event_occasion: any;
  public type_place: any;
  signalRBaseUrl: string = 'http://loteasysignalr-dev.ap-south-1.elasticbeanstalk.com';
  userProfilePic: any;
  @ViewChild('eventdescr') eventDescr: ElementRef;

  Localstorage(): void {
    this.storage.get("eventParams").then(data => {
      this.location = data.location;
      if (this.navParams.get("from") == "chooseLocationDateTime") {
        this._time = this.navParams.get("time_selected");
        this._date = this.navParams.get("Date_Selected");
      }
      else {
        this._time = this.navParams.get("_time");
        this._date = this.navParams.get("_date");
        //  this._time = data.time;
        // this._date = data.date;
      }
      this.restaurant = data.restaurant;
      if (this.navParams.get('from') !='planchooseInvitees' && this.navParams.get('flow')!='plan') {
        this.Rest_Address = this.restaurant&&this.restaurant!=undefined?(this.restaurant.Address?this.restaurant.Address.split('|~|').join(''):''):'';
        this.Rest_name = this.restaurant && this.restaurant!=undefined?this.restaurant.Name:'';
      }
      if (this.fromPage == "chooseInvitees") {

      }
      else {
        this.invitees = Object.assign([], data.invitees);

      }
    })


  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public datepipe: DatePipe,
    public storage: Storage, public apiService: ApiServices, private contacts: Contacts,
    public ngZone: NgZone, public callNumber: CallNumber,
    public loadingCtrl: LoadingController, public eventHubService: EventsHubService,
    public globalVar: SharedService, public loadingCreator: LoadingCreator,
    public oneSignalService: OneSignalServiceProvider) {

    this.estimated = true;

    this.storage.get("Plan_a_GetTOGETHER").then(plan_details => {

       if (plan_details.flowType == 'plan') {
        if (this.navParams.get("location") != null) {

          this.Rest_Address = this.navParams.get("location");
        }
        else {
          this.Rest_Address = this.navParams.get("_address");

        }
        this.Title_heading = "It\'s Party Time!";

        this.showOccassion = true;
        this.type_place = "Venue";
        this.occasion_details = "It\'s Party Time!";
        this.Event_occasion = plan_details.Selected_event;


        this.Rest_name = "";
        this.estimated = false;
      }
      else {
        this.Title_heading = "Start a Hangout";
        this.showOccassion = false;
        this.type_place = "Restaurant";
        this.occasion_details = "Start a Hangout";
      }

    })
    this.fromPage = this.navParams.get("from");
    if (this.fromPage == 'restaurantList' || this.fromPage == 'LocationwiseRestuarnt') {
      this.location = this.navParams.get("location");
      this._time = this.navParams.get("_time");
      this._date = this.navParams.get("_date");
      this.invitees = Object.assign([], this.navParams.get("invitees"));
      if (this.fromPage == 'LocationwiseRestuarnt') {
        this.estimated = false;
      //  let arr = this.navParams.get("restaurant");
      //   this.restaurant = arr[0];
      //   this.Rest_name = this.restaurant.Name;
      //   this.Rest_Address = this.restaurant.Address.split('|~|').join('');
      }
      else if (this.fromPage == 'restaurantList') {
        this.estimated = true;
        this.restaurant = this.navParams.get("restaurant");
        this.Rest_name = this.restaurant&& this.restaurant!=undefined?this.restaurant.Name:'';
        this.Rest_Address = this.restaurant&& this.restaurant!=undefined?this.restaurant.Address.split('|~|').join(''):'';
      }
   }
    else if (this.fromPage == "chooseInvitees") {
      this.Localstorage();
    }
    else {
      this.Localstorage();
    }

    // this.flowType = this.navParams.get('flow');
    this.storage.get("flow").then(data => {
      this.flowType = data;
    })

    this.storage.get("userDetails").then(data => {
      this.apiService.FetchSingleUserById(data.UserId)
        .subscribe(data => {
          let userData = JSON.parse(data);
          this.UserId = userData.UserId;
          this.UserName = userData.UserName;
          this.userProfilePic = userData.UserProfileImg;
        })
    })

    // create hub connection  
    this.connection = $.hubConnection(this.signalRBaseUrl);

    // create new proxy as name already given in top  
    this.proxy = this.connection.createHubProxy('EventsHub');

  }
  public Reg_users: any[] = [];
  ionViewDidEnter() {
    this.apiService.GetUsersRegisters()
      .subscribe(Reg_data => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.storage.get("Invitees_names").then(data => {
              this.User_details = data.selectedInviteesnames;
              this.Estimated_cost = (this.restaurant && this.restaurant!=undefined ? parseInt(this.restaurant.CostForTwo) : 0) / 2 * (this.User_details?this.User_details.length:0 + 1);
              this.User_details.forEach(inv => {
                let ph = inv.phone.replace(/[- )(]/g, '').replace(/\s+/g, "")
                ph = ph.split('').splice(ph.length - 10).join('');
                let phone_exist = this.Register_users.findIndex(x => x.PhoneNumber == ph);
                this.Reg_users.push(ph);
                if (phone_exist > -1) {
                  this.inviteesList.push({
                    "image": "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[phone_exist].UserProfileImg,
                    "Mobile": ph,
                    "Name": inv.name
  
                  })
                }
                else {
                    this.inviteesList.push({
                    "image": "assets/images/Single Contact Icon.svg",
                    "Mobile": ph,
                    "Name": inv.name
                  })
  
                }
  
              })
            })
          })  
        }, 500);
        
        Reg_data.Reg_users.forEach(element => {
          this.Register_users.push({
            "UserName": element.UserName,
            "UserProfileImg": element.UserProfileImg,
            "PhoneNumber": element.PhoneNumber
          })
        });
      })

    setTimeout(() => {
      this.storage.set("eventParams", {
        location: this.location, time: this._time, date: this._date,
        invitees: this.invitees, restaurant: this.restaurant
      }).then(() => {
        //  console.log("event params have been saved successfully to local storage!");
      }).catch(err => {
        console.log(err.message);
      })
    }, 2000);

    //invite summary data:
    let _today = new Date().toDateString();
    let _inviteDate = new Date(this._date.split('-')[1] + "-" +
      this._date.split('-')[0] + "-" + this._date.split('-')[2]).toDateString();
    if (_inviteDate == _today) {
      this.isInviteDateToday = true;
    } else {
      this.isInviteDateToday = false;
      this.inviteDayName = new Date(this._date.split('-')[1] + "-" +
        this._date.split('-')[0] + "-" + this._date.split('-')[2]).toString().split(' ')[0];
    }
    this.inviteDate = this._date.split('-')[0];
    this.inviteMonth = new Date(this._date.split('-')[1] + "-" +
      this._date.split('-')[0] + "-" + this._date.split('-')[2]).toString().split(' ')[1];

  }

  navigateBackToRestaurant() {
    this.navCtrl.pop();
  }

  navigateToLocationDateTime() {
    if (this.showOccassion) {
      this.navCtrl.push('ChooseLocationDatetimePage', { from: 'invitesummary', time_selected: this._time, Date_Selected: this._date, EventType: 'PlanTogether', occasiontype: this.Event_occasion, Venue: this.Rest_Address, flowName: 'plan' });
    }
    else {
      this.navCtrl.push('ChooseLocationDatetimePage', { from: 'invitesummary', time_selected: this._time, Date_Selected: this._date, EventType: 'FunchWithFrieds' });
    }
  }

  navigateToRestaurants() {
    this.navCtrl.push('RestaurantsListPage', { from: 'invitesummary', flow: 'Funch' });
  }

  navigateToInvitees() {
    this.navCtrl.push('ChooseInviteesPage', { from: 'invitesummary' });
  }

  showCallDialog(invitee) {

    this.mobilenumber = invitee.Mobile;
    this.name = invitee.Name;
    this.Profile_img = invitee.image

    this.callpopup = true;
    this.inviteeToCall = invitee;
  }

  callInviteeUsingDialer() {
    this.callNumber.callNumber(this.inviteeToCall, false).then(() => {
      console.log('dialer launched');
    })
      .catch(err => {
        console.log('error while launching dialer');
      })
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
  showSendInviteDialog() {
    let eventdesc = "";
    this.invitees = this.remove_duplicates(this.Reg_users);
    let loading = this.loadingCtrl.create({
      spinner: 'hide'
    });

    loading.data.content = this.loadingCreator.getLoadingSymbol();

    loading.present();
    if (this.occasion_details == "Plan get Together") {
      eventdesc = this.Event_occasion;
    }
    else {
      eventdesc = this.eventDescr.nativeElement.value;
    }

    let userId: number;
    this.storage.get("userDetails").then(data => {
      userId = data.UserId;
    })
    let message = "";
    message += this.UserName + " has sent an invite.\n";
    message += this._date + ", " + this._time + "\n";
    message += ",Venue:" + this.restaurant &&this.restaurant!=undefined?this.restaurant.Name:'' + "\n";
    // message += ".Please download loteasy app and confirm your participation in the event";
    //to check invitees are regitesred members, if not send sms:
    //  for unique filtering
    // var uniq = this.invitees.reduce(function(a,b){
    //   if (a.indexOf(b) < 0 ) a.push(b);
    //   return a;
    // },[]);
    var rest_id;
    setTimeout(() => {
      this.ngZone.run(() => {

        if (this.Title_heading == "It\'s Party Time!") {
          rest_id = 101;
        }
        else {
          rest_id = this.restaurant && this.restaurant!=undefined?this.restaurant.RestaurantId:'';
        }

        this.apiService.CreateNewEvent(userId, rest_id, new Date().toString(),
          JSON.stringify(this.invitees), '', 0, '', eventdesc, this._date, this._time, this.occasion_details, this.Rest_Address)
          .subscribe(data => {
            //   console.log(data);
            let eventId = JSON.parse(data).EventId;
            this.proxy.on('sendNewEvent', (x: any) => {
              //   console.log(x);
            })

            if (this.connection && this.connection.state === $.signalR.connectionState.disconnected) {
              this.connection.start().done(() => {
                // console.log('signalr hub connection established');
                this.proxy.invoke('SubscribeUsersToReceiveEventOnCreation', data, this.UserId)
                  .done(data => {
                    // console.log('Hub Method invoked');
                    this.apiService.CreateNotification(this.UserId, eventId, 0)
                      .subscribe(res => {
                        console.log(res);
                      })

                  })
              })
            } else {
              this.proxy.invoke('SubscribeUsersToReceiveEventOnCreation', data, this.UserId)
                .done(data => {
                  //  console.log(data);

                })
            }
            let EventDetails = JSON.parse(data);
            this.eventId = EventDetails.EventId;
            let profilePic = this.cloudinaryUrl + this.userProfilePic;
            this.apiService.GetOneSignalPlayerIds(this.invitees.toString())
              .subscribe((playerIds) => {
                console.log(playerIds.PlayersIds);
                this.storage.get('userDetails').then(ud => {
                  this.apiService.FetchSingleUserById(ud.UserId)
                    .subscribe(user => {
                      let userName = JSON.parse(user).UserName;
                      let userPhotoLink = JSON.parse(user).UserProfileImg;
                      this.apiService.FetchRestaurantDetailsById(JSON.parse(data).EventVenueId)
                        .subscribe(rest => {
                          let bigPitcure = rest.HeroImg;
                          this.sendPushNotifcationViaOneSignal(playerIds, data, userName, userPhotoLink, bigPitcure);
                        })
                    })

                })

              })
            //  this.apiService.SendPushNotificationFCM(this.invitees.toString(),message,data, profilePic,'funchOrPlanInvite')
            //  .subscribe(data=>{


            //  })

            this.inviteesList.forEach(list => {

              this.getcurrenttime = new Date();
              let latest_date = this.datepipe.transform(this.getcurrenttime, 'HH:mm a');

              this.apiService.UpdateEventStatus(4, EventDetails.EventId, list.Mobile, 0, "", latest_date, list.Name).subscribe((update_status) => {


              })
            })

            this.inviteesList.forEach((inv, index) => {

              // this.getcurrenttime=new Date();
              // let latest_date =this.datepipe.transform(this.getcurrenttime, 'HH:mm a');

              // this.apiService.UpdateEventStatus(4,EventDetails.EventId,inv.Mobile,0,"",latest_date,inv.Name).subscribe((update_status)=>{


              // })

              if (inv == null) {

                this.apiService.SendInviteSMSToNonRegdUser(this.invitees[index], message)
                  .subscribe(data => {

                  })
              }
            })

          })
        this.invitepopup = true;
        loading.dismiss().then(() => {
          console.log('loading dismissed');
        })

      })

    }, 3000);



  }

  navigateToHome() {
    this.invitepopup = false;
    this.navCtrl.push('HomePage', {});
  }
  navigateToViewStatus() {
    //navigate to status page
    this.invitepopup = false;
    this.navCtrl.push('InviteeStatusPage', { Eventid_status: this.eventId });
  }

  sendPushNotifcationViaOneSignal(playerIds, eventDetails, senderName, largeIcon, bigPicture) {
    let notificationObj: NotificationObject = {
      type: 'funchOrPlanInvite',
      playerIds: playerIds.PlayersIds,
      senderName: senderName,
      senderPhotoLink: this.cloudinaryUrl + largeIcon,
      bigPicture: this.cloudinaryRestHeroImgUrl + bigPicture,
      eventDetails: eventDetails
    }

    this.oneSignalService.postOneSignalNotification(notificationObj);

  }

 

}