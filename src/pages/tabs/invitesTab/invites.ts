import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiServices } from '../../../services/appAPIServices';
import { Storage } from '@ionic/Storage';
import { AppConstants } from '../../../assets/appConstants';
import { NavController, NavParams, LoadingController, Tabs } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { Contacts } from '@ionic-native/contacts';
import { LoteasyService } from '../../../services/loteasyService';
import { LoadingCreator } from '../../../services/loadingcreator';
import { IonicPage } from 'ionic-angular';
import { NotificationObject } from '../../../services/oneSignalPushNotificationProvider';
import { OneSignalServiceProvider } from '../../../services/oneSignalPushNotificationProvider';
@IonicPage()
@Component({
  selector: 'page-invites',
  templateUrl: 'invites.html'
})
export class InvitesPage {
  public Register_users: any[] = [];
  private User_list_contacts: any[] = [];
  public Upcoming_Events: any[] = [];
  public enddate: any;
  public Events_Details: any[] = [];
  public loading: any;
  public Events_days: any;
  public useracceptstate: any;
  public userid: any;
  public username: any;
  public userclass: any;
  public login_user_phone: any;
  public Event_user_list: any[] = [];
  public cloudinary_pic: any;
  public User_state: any;
  public User_state_icon: any;
  public User_name: any;
  public button_state: any;
  public getcurrenttime: any;
  public Total_user_invitees: any;
  public Event_time: any;
  public Event_complete_date: any;
  public Invitee_name: any;
  public profile_img: any;
  @ViewChild('inviteeviewchild') showInvitee: ElementRef;
  @ViewChild('tabs') tabsRef: Tabs;
  Empty_Invitees: string;
  cloudinaryUrl:string = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  constructor(public loteasyService: LoteasyService,
    public tabs: Tabs, private contacts: Contacts,
    private navCtrl: NavController, public apiService: ApiServices,
    public loadingCtrl: LoadingController, public navParams: NavParams,
    private storage: Storage, public datepipe: DatePipe, 
    public loadingCreator: LoadingCreator, public oneSignalService:OneSignalServiceProvider) {

    setTimeout(() => {
      this.loading.dismiss();

    }, 10000);

  }
 
  //https://www.djamware.com/post/5892739480aca7411808fa9c/how-to-create-ionic-2-accordion-list
  shownGroup = null;
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {

    return this.shownGroup === group;
  };
  //load event details
  LoadEventDetails(Event_details) {
    var objDate = new Date(Event_details.Event[0].EventDate.split("-").reverse().join("-"));
    var startDate = Date.parse(objDate.toDateString());
    this.enddate = new Date();
    var timeDiff = startDate - this.enddate;
    var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    this.Event_complete_date = new Date(this.datepipe.transform(startDate, 'MM/dd/yyyy') + " " + Event_details.Event[0].EventTime);

    if (this.Event_complete_date > this.enddate) {
      if (daysDiff == 0)
        this.Events_days = "Today";
      else if (daysDiff == 1)
        this.Events_days = daysDiff + "  Day to go";
      else
        this.Events_days = daysDiff + "  Days to go";
      if (Event_details.Event[0].EventCreatedBy == this.userid) {
        this.username = "You";
        if (Event_details.Event[0].EventStatusId == 0)
          this.button_state = 1;
        if (Event_details.Event[0].EventStatusId == 1)
          this.button_state = 2;
        if (Event_details.Event[0].EventStatusId == 2)
          this.button_state = 3;
      }
      else {


        let user_index = this.Register_users.findIndex(users => users.UserId == Event_details.Event[0].EventCreatedBy);

        if (user_index > -1) {
          let index = this.User_list_contacts.findIndex(cont => cont.phone == this.Register_users[user_index].PhoneNumber);
          if (index > -1) {
            this.username = this.User_list_contacts[index].Name;
          }
          else {
            if (Event_details.Event[0].EventUserName != 'undefined') {
              this.username = Event_details.Event[0].EventUserName;
            }
            else {
              this.username = this.User_list_contacts[index].Name;
            }
          }
        }

      }
      this.useracceptstate = 0;
      for (var k = 0; k < Event_details.Invitees.length; k++) {
        this.Invitee_name = "";
        if (Event_details.Event[0].EventCreatedBy != this.userid) {
          if (Event_details.Invitees[k].PhoneNumber == this.login_user_phone && Event_details.Invitees[k].AcceptStatus == 2) {
            this.button_state = 3;
          }
          if (Event_details.Invitees[k].PhoneNumber == this.login_user_phone && Event_details.Invitees[k].AcceptStatus == 0) {
            this.button_state = 1;
          }
          if (Event_details.Invitees[k].PhoneNumber == this.login_user_phone && Event_details.Invitees[k].AcceptStatus == 1) {
            this.button_state = 2;
          }
        }
        if (Event_details.Invitees[k].UserProfileImg == "NULL")
          this.cloudinary_pic = "assets/images/Single Contact Icon.svg"
        else
          this.cloudinary_pic = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH + Event_details.Invitees[k].UserProfileImg
        if (Event_details.Invitees[k].username == "NULL" || Event_details.Invitees[k].username == 'undefined')
          this.User_name = Event_details.Invitees[k].PhoneNumber;
        else
          this.User_name = Event_details.Invitees[k].username;
        if (Event_details.Invitees[k].AcceptStatus == 0) {
          this.User_state_icon = "icon pending";
          this.User_state = "Pending";
        }
        if (Event_details.Invitees[k].AcceptStatus == 1) {
          this.User_state_icon = "icon Accepted";
          this.User_state = "Accepted";
          this.useracceptstate++;
        }
        if (Event_details.Invitees[k].AcceptStatus == 2) {
          this.User_state_icon = "icon decline";
          this.User_state = "Rejected";
        }
        let index = this.User_list_contacts.findIndex(cont => cont.phone == Event_details.Invitees[k].PhoneNumber);
        if (index > -1) {
          // "phone":formattedNumber,
          //   "Name": con.contact.displayName
          this.Invitee_name = this.User_list_contacts[index].Name;
        }
        else {
          this.Invitee_name = Event_details.Invitees[k].username;
        }
        this.Event_user_list.push({
          "Profilepic": this.cloudinary_pic,
          "Name": this.Invitee_name,
          "Decline": Event_details.Invitees[k].DeclinedMessage,
          "MobileNumber": Event_details.Invitees[k].PhoneNumber,
          "Userclass": this.User_state_icon,
          "Userstate": this.User_state
        })
      }
      var dateString = Event_details.Event[0].EventDate + " " + Event_details.Event[0].EventTime;
      var dateTimeParts = dateString.split(' ');
      var timeParts = dateTimeParts[1].split(':');
      var dateParts = dateTimeParts[0].split('-');
      var event_date;
      event_date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0]), parseInt(timeParts[0]), parseInt(timeParts[1]));
      this.Upcoming_Events.push({
        "EventCreatedBy": Event_details.Event[0].EventCreatedBy,
        "EventsDays": daysDiff,
        "Events_date": event_date,
        "EventMonth": objDate.toLocaleString("en-us", { month: "short" }),
        "Event_created_time": this.renderDate(Event_details.Event[0].EventSentTime.split(" ")[0], Event_details.Event[0].EventSentTime.split(" ")[1], Event_details.Event[0].EventSentTime.split(" ")[2]),
        "EventTime": Event_details.Event[0].EventTime,
        "EventDate": Event_details.Event[0].EventDate.split("-")[0],
        "EventName": this.username,
        "Event_status_state": Event_details.Event[0].EventStatusId,
        "Event_state": this.button_state,
        "Eventsummary": Event_details.Event[0].InviteSummaryDesc,
        "EventsCoduct": this.Events_days,
        "Rest_map_lat": Event_details.Event[0] ? (Event_details.Event[0].LatLong ? Event_details.Event[0].LatLong.split(",")[0] : 0) : 0,
        "Rest_map_long": Event_details.Event[0] ? (Event_details.Event[0].LatLong ? Event_details.Event[0].LatLong.split(",")[1] : 0) : 0,
        "EventAddress": Event_details.Event[0].Address,
        "EventVenueAddress": Event_details.Event[0].eventAddress,
        "Eventid": Event_details.Event[0].EventId,
        "Eventtitle": Event_details.Event[0].EventTitle,
        "Restname": Event_details.Event[0].Name,
        "EventSentTime": Event_details.Event[0].EventSentTime,
        "EventAcceptedcount": this.useracceptstate,
        "EventMembers": Event_details.Invitees.length,
        "Invitess_list": this.Event_user_list,
        "Event_cost": parseInt(Event_details.Event[0].CostForTwo) / 2 * (Event_details.Invitees.length + 1)
      })
      //for array events in ascending order
      setTimeout(() => {
        this.Upcoming_Events.sort(this.sortbydays).join(',');
        this.loading.dismiss();
      }, 500);
    }
  }
  sortbydays(a, b) {
    return a.Events_date - b.Events_date;
  }
  async GetListofInvitees(): Promise<any> {
    return await this.loteasyService.fetch('get', 'GetAllInviteesCreatedByUser', { PhoneNumber: this.login_user_phone });
  }
  async MainContent() {

    let Events_list;

    this.storage.set("Invitespage", { Invitnavigation: "HomePage" }).then(() => {
    }).catch(err => {
      console.log(err.message);
    })
    this.Upcoming_Events = [];
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      duration: 10000
    })

    this.loading.data.content = this.loadingCreator.getLoadingSymbol();
    this.loading.present();

    await this.GetListofInvitees()
      .then((Invitee_dat => {
        if (Invitee_dat == null) {
          this.Empty_Invitees = "No invitees Found for This user"
          //no iNVITEE
        }
        else {
          this.Empty_Invitees = '';
          Events_list = Invitee_dat;
        }

      })).catch((error => {

        console.log(error)
      }))
    //let Events_list=await this.GetListofInvitees();
    //fetch all events based on phone number
    
    this.Events_Details = Object.assign([], Events_list);//copy of object to array
    for (var i = 0; i < this.Events_Details.length; i++) {
      this.Event_user_list = [];
      this.LoadEventDetails(this.Events_Details[i])

    }
    // })
  }
  navigateToHome() {
    this.navCtrl.push('HomePage');
  }
  async getAllPhoneContacts(): Promise<any> {
    return await this.contacts.find(['displayName', 'name', 'phoneNumbers'], { filter: "", multiple: true, desiredFields: ['displayName', 'name', 'phoneNumbers'] })
  }

  async GetUsersRegisters(): Promise<any> {
    return await this.loteasyService.fetch('get', 'GetRegisteredUsers', {});
  }

  async ionViewDidEnter() {
    //let x=await this.apiService.getcontact_list();
    let List_Registered_users = await this.GetUsersRegisters();
    List_Registered_users.Reg_users.forEach(element => {
      this.Register_users.push({
        "UserId": element.UserId,
        "UserProfileImg": element.UserProfileImg,
        "PhoneNumber": element.PhoneNumber,
        "UserName": element.UserName
      })
    })

    let phoneContacts = await this.getAllPhoneContacts();
    phoneContacts.forEach(contact => {
      if (contact.phoneNumbers != null) {
        this.profile_img = "";
        let formattedNumber = contact.phoneNumbers[0].value.replace(/[^0-9+]/g, '')
        this.User_list_contacts.push({
          "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
          "Name": contact.displayName
        })
     this.User_list_contacts = this.removeDuplicates(this.User_list_contacts);


      }


    })


    this.storage.get("userDetails").then((data: any) => {
      this.login_user_phone = data.phone;
      this.userid = data.UserId;

      this.MainContent();
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
  public Login_username: any;
 
  Nvaigate_to_map(lat, long) {
    document.location.href = "" + "http://maps.google.com/maps?saddr=" + lat + "," + long;
    // $location.path(link);
    //document.location.href = ""+"https://maps.google.com/?q="+lat+","+long+"&t=k";
  }
  //update event status
  UpdateEventStatus(statusid: number, Eventid, usertype, index_position, state_event: number, event_state: number, Accepted_count: number, event: any): void {
    console.log(event);
    let invitees = event.Invitess_list.map(inv => {
      return inv.MobileNumber;
    })
    let index = this.Upcoming_Events.findIndex(x => x.Eventid == Eventid);
    this.getcurrenttime = new Date();
    let latest_date = this.datepipe.transform(this.getcurrenttime, 'HH:mm a');
    this.apiService.FetchSingleUserById(event.EventCreatedBy)
    .subscribe(user=>{
      let thisusername = JSON.parse(user).UserName;
      if (usertype == "You") {
        this.apiService.UpdateEventStatusByowner(this.userid, Eventid, statusid, '').subscribe((ownerupdateevent) => {
            if (statusid == 1) {
  
            this.Upcoming_Events.splice(index, 1);
            this.apiService.GetOneSignalPlayerIds(JSON.stringify(invitees))
            .subscribe(playerIds=>{
              this.apiService.FetchSingleUserById(this.userid)
              .subscribe(currentUser=>{
                let userName= JSON.parse(currentUser).UserName;
                let userPhoto = JSON.parse(currentUser).UserProfileImg;
                this.sendPushNotifcationViaOneSignal('confirmedInvite',playerIds,JSON.stringify(event),userName,userPhoto,'','');

              })
            })
            // this.apiService.SendPushNotificationFCM(JSON.stringify(invitees), `${thisusername} has confirmed the event`, JSON.stringify(event), '', 'confirmedInvite')
            //   .subscribe(r => {
            //     console.log(r);
            //   })
  
          }
          if (statusid == 2) {
            this.Upcoming_Events[index].Event_state = 3;
            this.apiService.GetOneSignalPlayerIds(JSON.stringify(invitees))
            .subscribe(playerIds=>{
              this.apiService.FetchSingleUserById(this.userid)
              .subscribe(currentUser=>{
                let userName= JSON.parse(currentUser).UserName;
                let userPhoto = JSON.parse(currentUser).UserProfileImg;
                this.sendPushNotifcationViaOneSignal('exitedEvent',playerIds,JSON.stringify(event),userName,userPhoto,'','');

              })
            })
            // this.apiService.SendPushNotificationFCM(JSON.stringify(invitees), `${thisusername} has cancelled the event`, JSON.stringify(event), '', 'confirmedInvite')
            //   .subscribe(r => {
            //     console.log(r);
            //   })
          }
  
  
        })
      }
      else {
        let user_index = this.Upcoming_Events[index].Invitess_list.findIndex(x => x.MobileNumber == this.login_user_phone)
        this.Login_username = this.Upcoming_Events[index].Invitess_list[user_index].Name;
        this.apiService.UpdateEventStatus(this.userid, Eventid, this.login_user_phone, statusid, "", latest_date, this.Login_username).subscribe((UpdateEventInviteeDetails: any) => {
        if (event_state == 0) {
            if (statusid == 1) {
              this.Upcoming_Events[index].Event_state = 2;
            this.Upcoming_Events[index].EventAcceptedcount = Accepted_count = Accepted_count + 1;
              this.Upcoming_Events[index].Invitess_list[user_index].Userclass = "icon Accepted";
              this.Upcoming_Events[index].Invitess_list[user_index].Userstate = "Accepted";
              this.apiService.FetchSingleUserById(event.EventCreatedBy)
              .subscribe(eventCreatedUser=>{
                this.apiService.GetOneSignalPlayerIds(JSON.parse(eventCreatedUser).PhoneNumber)
                .subscribe(playerIds=>{
                  this.storage.get('userDetails').then(ud=>{
                    this.apiService.FetchSingleUserById(ud.UserId)
                    .subscribe(currentUser=>{
                      let userName= JSON.parse(currentUser).UserName;
                      let userPhoto = JSON.parse(currentUser).UserProfileImg;
                      this.sendPushNotifcationViaOneSignal('acceptedInvite',playerIds,JSON.stringify(event),userName,userPhoto,'','');
      
                    })
                  })
                 
                })
              })
             
              // this.apiService.SendPushNotificationFCM(JSON.stringify(invitees),`${thisusername} has accepted to join the event`,JSON.stringify(event),'','acceptedInvite')
              // .subscribe(res=>{
              //   console.log(res);
              // })
            }
            if (statusid == 2) {
  
              this.Upcoming_Events[index].Event_state = 3;
              this.Upcoming_Events[index].EventAcceptedcount = Accepted_count = Accepted_count - 1;
              this.Upcoming_Events[index].Invitess_list[user_index].Userclass = "icon decline";
              this.Upcoming_Events[index].Invitess_list[user_index].Userstate = "Rejected";
              this.apiService.FetchSingleUserById(event.EventCreatedBy)
              .subscribe(eventCreator=>{
                this.apiService.GetOneSignalPlayerIds(JSON.parse(eventCreator).PhoneNumber)
                .subscribe(playerIds=>{
                  this.apiService.FetchSingleUserById(this.userid)
                  .subscribe(currentUser=>{
                    let userName= JSON.parse(currentUser).UserName;
                    let userPhoto = JSON.parse(currentUser).UserProfileImg;
                    this.sendPushNotifcationViaOneSignal('declinedInvite',playerIds,JSON.stringify(event),userName,userPhoto,'','');
    
                  })
                })
              })
             
              // this.apiService.SendPushNotificationFCM(JSON.stringify(invitees),`${thisusername} has declined to join the event`,JSON.stringify(event),'','declinedInvite')
              // .subscribe(res=>{
              //   console.log(res);
              // })
            }
          }
  
          else if (event_state == 2) {
  
            if (statusid == 1) {
  
              this.Upcoming_Events[index].Event_state = 2;
              this.Upcoming_Events[index].EventAcceptedcount = Accepted_count = Accepted_count + 1;
              this.Upcoming_Events[index].Invitess_list[user_index].Userclass = "icon Accepted";
              this.Upcoming_Events[index].Invitess_list[user_index].Userstate = "Accepted";
              this.apiService.FetchSingleUserById(event.EventCreatedBy)
              .subscribe(eventCreator=>{
                
                this.apiService.GetOneSignalPlayerIds(JSON.parse(eventCreator).PhoneNumber)
                .subscribe(playerIds=>{
                  this.apiService.FetchSingleUserById(this.userid)
                  .subscribe(currentUser=>{
                    let userName= JSON.parse(currentUser).UserName;
                    let userPhoto = JSON.parse(currentUser).UserProfileImg;
                    this.sendPushNotifcationViaOneSignal('acceptedInvite',playerIds,JSON.stringify(event),userName,userPhoto,'','');
    
                  })
                })
              })
              
              // this.apiService.SendPushNotificationFCM(JSON.stringify(invitees),`${this.username} has accepted to join the event`,JSON.stringify(event),'','acceptedInvite')
              // .subscribe(pushResp=>{
              //     console.log(pushResp);
              // })
            }
            if (statusid == 2) {
  
              this.Upcoming_Events[index].Event_state = 3;
              this.Upcoming_Events[index].EventAcceptedcount = Accepted_count = Accepted_count - 1;
              this.Upcoming_Events[index].Invitess_list[user_index].Userclass = "icon decline";
              this.Upcoming_Events[index].Invitess_list[user_index].Userstate = "Rejected";
              this.apiService.FetchSingleUserById(event.EventCreatedBy)
              .subscribe(eventCreator=>{
                this.apiService.GetOneSignalPlayerIds(JSON.parse(eventCreator).PhoneNumber)
                .subscribe(playerIds=>{
                  this.apiService.FetchSingleUserById(this.userid)
                  .subscribe(currentUser=>{
                    let userName= JSON.parse(currentUser).UserName;
                    let userPhoto = JSON.parse(currentUser).UserProfileImg;
                    this.sendPushNotifcationViaOneSignal('acceptedInvite',playerIds,JSON.stringify(event),userName,userPhoto,'','');
    
                  })
                })
              })
             
              // this.apiService.SendPushNotificationFCM(JSON.stringify(invitees),`${this.username} has declined to join the event`,JSON.stringify(event),'','acceptedInvite')
              // .subscribe(pushResp1=>{
              //     console.log(pushResp1);
              // })
            }
          }
          else if (event_state == 1) {
            if (statusid == 1) {
  
              this.Upcoming_Events.splice(index, 1);
  
            }
  
          }
  
        })
      }
    })
    
  }
  //redirect
  Redirectstatus(user_type: string, Eventid: number, EventTitle: any): void {
    if (user_type == 'You') {
      this.storage.set("Invitespage", { Invitnavigation: "invitees_page" }).then(() => {
      }).catch(err => {
        console.log(err.message);
      })
      this.navCtrl.push('InviteeStatusPage', { "Eventid_status": Eventid, "EventTitle": EventTitle });
    }
  }
  renderDate(user_date, time, time_format) {
    let spandate: any;
    let today: any;
    let yesterday: any;
    spandate = new Date(user_date);
    today = new Date();
    yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    spandate = spandate.getFullYear() + "-" + (spandate.getMonth() + 1) + "-" + spandate.getDate();
    today = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    yesterday = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();
    if (today == spandate) {
      return time.split(":")[0] + " : " + time.split(":")[1] + " " + time_format;
    }
    else if (yesterday == spandate) {
      return "Yesterday";
    }
    else {
      return user_date.split("/")[1] + "  " + new Date(user_date).toLocaleString("en-us", { month: "short" }) + ", " + user_date.split("/")[2].substr(2, 3);
    }
  }
  ShowInvitees(Eventid): void {
    this.showInvitee.nativeElement.classList.toggle('show');
  }

  sendPushNotifcationViaOneSignal(typeOfNotify,playerIds,eventDetails,senderName,largeIcon,latlong,distance){
    let notificationObj:NotificationObject = {
        type:typeOfNotify,
        playerIds:playerIds.PlayersIds,
        senderName:senderName,
        senderPhotoLink:this.cloudinaryUrl+largeIcon,
        // bigPicture:this.cloudinaryRestHeroImgUrl+bigPicture,
        eventDetails:eventDetails,
        latlong:latlong,
        distance:distance
    }

    this.oneSignalService.postOneSignalNotification(notificationObj);
   
}


}
