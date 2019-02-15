import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../../../services/appAPIServices';
import { IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { AppConstants } from '../../../assets/appConstants';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { Contacts } from '@ionic-native/contacts';
import { DomSanitizer } from '@angular/platform-browser';
import { ISubscription } from 'rxjs/Subscription';
import { LoadingCreator } from '../../../services/loadingcreator';
import { NotificationObject } from '../../../services/oneSignalPushNotificationProvider';
import { OneSignalServiceProvider } from '../../../services/oneSignalPushNotificationProvider';

@IonicPage()
@Component({
    selector: 'page-events',
    templateUrl: 'events.html'
})
export class EventsPage implements OnInit {
    public Register_users: any[] = [];
    public phoneContacts: any[] = [];
    private User_list_contacts: any[] = [];
    public restaurantDetails: any[] = [];
    public Upcoming_Events: any[] = [];
    public Earlier_Events: any[] = [];
    public enddate: any;
    public Event_address: any;
    public Events_Details: any[] = [];
    public loading: any;
    public Events_days: any;
    public fetch_image: any;
    public userlist: any[] = [];
    public useracceptstate: any;
    public userdeclinemsg: any;
    public userid: any;
    public username: any;
    public Events_user: any[] = [];
    public userclass: any;
    public login_user_phone: any;
    public Event_user_list: any[] = [];
    public cloudinary_pic: any;
    public User_state: any;
    public User_state_icon: any;
    public User_name: any;
    public button_state: any;
    public memoryImages: any[] = [];
    public Event_complete_date: any;
    public Invitee_name: any;
    public cloudinaryUrl:string = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
    subscription: ISubscription;
    eventSelectedForUpdateToBeReadInModalDialog:any;
    selectedEventIndex:any;
    slideConfig = {
        "slidesToScroll": 1,
        "infinite": false,
        "variableWidth": true,
        "dots": false
    };
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

    LoadEventDetails(Event_details) {
        var objDate = new Date(Event_details.Event[0].EventDate.split("-").reverse().join("-"));
        var startDate = Date.parse(objDate.toDateString());
        this.enddate = new Date();
        var timeDiff = startDate - this.enddate;
        var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        this.Event_complete_date = new Date(this.datepipe.transform(startDate, 'MM/dd/yyyy') + " " + Event_details.Event[0].EventTime);
        if (Event_details.Event[0].EventTitle == "Meet Friends Now") {
            this.Event_complete_date.setHours(this.Event_complete_date.getHours() + 2);
   }

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
            } else {
                // this.username = Event_details.Event[0].EventUserName;
                let user_index = this.Register_users.findIndex(users => users.UserId == Event_details.Event[0].EventCreatedBy)
                let index = this.User_list_contacts.findIndex(cont => cont.phone == this.Register_users[user_index].PhoneNumber);
                if (index > -1) {
                    this.username = this.User_list_contacts[index].Name;
                }
                else {
                    this.username = Event_details.Event[0].EventUserName;
                }
            }
            this.useracceptstate = 0;
            for (var k = 0; k <
                Event_details.Invitees.length; k++) {
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
                if (Event_details.Invitees[k].username == "NULL")
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
                "EventsDays": daysDiff,
                "EventMonth": objDate.toLocaleString("en-us", {
                    month: "short"
                }),
                "EventCreatedBy":Event_details.Event[0].EventCreatedBy,
                "EventTime": Event_details.Event[0].EventTime,
                "Events_date": event_date,
                "EventDate": Event_details.Event[0].EventDate.split("-")[0],
                "EventName": this.username,
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
                "Event_cost": parseInt(Event_details.Event[0].CostForTwo) / 2 * (Event_details.Invitees.length + 1),
            })
            setTimeout(() => {
                this.Upcoming_Events.sort(this.sortbydays).join(',');
            }, 500);
        } else {
            if (Event_details.Event[0].EventCreatedBy == this.userid) {
                this.username = "You";
                if (Event_details.Event[0].EventStatusId == 0)
                    this.button_state = 1;
                if (Event_details.Event[0].EventStatusId == 1)
                    this.button_state = 2;
                if (Event_details.Event[0].EventStatusId == 2)
                    this.button_state = 3;
            } else {
                // this.username = Event_details.Event[0].EventUserName;
                let user_index = this.Register_users.findIndex(users => users.UserId == Event_details.Event[0].EventCreatedBy)
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
            if (Event_details.Shared_ImageDetails.length > 0) {
                for (var f = 0; f < Event_details.Shared_ImageDetails.length; f++) {
                    if (Event_details.Shared_ImageDetails[f].SharedBy == this.userid) {
                        let shared_images = Event_details.Shared_ImageDetails[f].images.split(",");
                        // "img": AppConstants.CLOUDINARY_FETCH_MEMORIES_ALBUMS + shared_images[p]
                        for (var p = 0; p < shared_images.length; p++) {
                            this.memoryImages.push({
                                "img": shared_images[p]
                            })
                        }
                    }
                    let phone_numbers = Event_details.Shared_ImageDetails[f].SharedTo.split(",");
                    for (var k = 0; k < phone_numbers.length; k++) {
                        if (phone_numbers[k] == this.login_user_phone) {
                            let shared_images = Event_details.Shared_ImageDetails[f].images.split(",");
                            for (var p = 0; p < shared_images.length; p++) {
                                this.memoryImages.push({
                                    "img": shared_images[p]
                                })
                            }
                        }
                    }
                }
            } else {
                this.memoryImages = [];
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
                if (Event_details.Invitees[k].username == "NULL")
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
                var dateString = Event_details.Event[0].EventDate + " " + Event_details.Event[0].EventTime;
                var dateTimeParts = dateString.split(' ');
                var timeParts = dateTimeParts[1].split(':');
                var dateParts = dateTimeParts[0].split('-');
                var event_date;
                event_date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0]), parseInt(timeParts[0]), parseInt(timeParts[1]));
                this.Event_user_list.push({
                    "Profilepic": this.cloudinary_pic,
                    "Name": this.Invitee_name,
                    "Decline": Event_details.Invitees[k].DeclinedMessage,
                    "MobileNumber": Event_details.Invitees[k].PhoneNumber,
                    "Userclass": this.User_state_icon,
                    "Userstate": this.User_state
                })
            }
            var year_check = new Date().getFullYear();
            /*  let Event_check_lastyear;
            console.log(Event_details.Event[0].EventDate.split("-")[2])
            if(year_check<Event_details.Event[0].EventDate.split("-")[2]){
            ///previous year
            Event_check_lastyear=Event_details.Event[0].EventDate.split("-")[2];
            }
            else
            {
            Event_check_lastyear=this.Events_days;
            }*/
            this.Earlier_Events.push({
                "EventsDays": daysDiff,
                "EventMonth": objDate.toLocaleString("en-us", {
                    month: "short"
                }),
                "EventTime": Event_details.Event[0].EventTime,
                "Events_date": event_date,
                "EventDate": Event_details.Event[0].EventDate.split("-")[0],
                "EventName": this.username,
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
                "Eventphotos": this.memoryImages,
                "EventConductdate": Event_details.Event[0].EventDate,
                "Event_cost": parseInt(Event_details.Event[0].CostForTwo) / 2 * (Event_details.Invitees.length + 1),
            })
            setTimeout(() => {
                this.Earlier_Events.sort(this.sortbydays).join(',');
            }, 500);
            this.memoryImages = [];
        }
    }
    ionViewDidEnter() {
        this.storage.get("userDetails").then((data: any) => {
            this.login_user_phone = data.phone;
            this.userid = data.UserId;
            this.apiService.FetchSingleUserById(data.UserId).subscribe(user => {
                this.Login_username = JSON.parse(user).UserName;

            })


            this.apiService.GetUsersRegisters()
                .subscribe(Reg_data => {
                    Reg_data.Reg_users.forEach(element => {
                        this.Register_users.push({
                            "UserId": element.UserId,
                            "PhoneNumber": element.PhoneNumber
                        })

                    })
                })
            this.MainContent();
        })
    }
    ngOnInit() { }
    sortbydays(a, b) {
        return a.Events_date - b.Events_date;
    }
    MainContent(): void {
        this.Upcoming_Events = [];
        this.Earlier_Events = [];
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',

        })
        this.loading.data.content = this.loadingCreator.getLoadingSymbol();
        this.loading.present();
        //fetch all events based on phone number
        //this.apiService.GetTotalEventsCreatedByUser(this.login_user_phone).retryWhen((err)=>err.delay(1000)). 
        this.subscription = this.apiService.GetTotalEventsCreatedByUser(this.login_user_phone).retryWhen((err) => {
            return err.scan((retrycount) => {

                retrycount += 1;
                if (retrycount > 6) {
                    throw (err)
                }
            }, 0).delay(1000)
        }).

            subscribe(Events_list => {
                this.loading.dismiss();
                console.log(Events_list)
                this.Events_Details = Object.assign([], Events_list); //copy of object to array
                for (var i = 0; i <
                    this.Events_Details.length; i++) {
                    this.Event_user_list = [];
                    if (this.Events_Details[i].Event[0].EventCreatedBy == this.userid && this.Events_Details[i].Event[0].EventStatusId == 1) {
                        this.LoadEventDetails(this.Events_Details[i])
                    } else {
                        for (var k = 0; k <
                            this.Events_Details[i].Invitees.length; k++) {
                            if (this.Events_Details[i].Event[0].EventTitle == "Meet Friends Now" && this.Events_Details[i].Invitees[k].AcceptStatus != 1) {
                                //not display catch
                            }
                            else {
                                if (this.Events_Details[i].Invitees[k].PhoneNumber == this.login_user_phone && this.Events_Details[i].Event[0].EventStatusId == 1) {
                                    if (this.Events_Details[i].Invitees[k].AcceptStatus == 1) {
                                        this.LoadEventDetails(this.Events_Details[i])
                                    }
                                }
                            }
                        }
                    }
                }
            })
    }
    navigateToHome() {
        this.navCtrl.push('HomePage');
    }
    //navigate to memories
    Memories(Event_id: number, photos: any, event_date: any, event_title: any, ): void {
        this.navCtrl.push('MemoriesDetailsPage', {
            event: Event_id,
            memories: photos,
            from: 'EventPage',
            Event_date: event_date,
            Event_title: event_title
        });
        //  this.navCtrl.push(MemoriesDetailsPage,{event:ev,memories:eal});
    }
    public Login_username: any;
    public message: any;
    public Event_Errors: any[] = [];
    public Cancel_Errors: any[] = [];
    constructor(public alertCtrl: AlertController, private navCtrl: NavController,
        private contacts: Contacts, private sanitizer: DomSanitizer,
        public datepipe: DatePipe, public apiService: ApiServices,
        public loadingCtrl: LoadingController, public navParams: NavParams,
        private storage: Storage, public loadingCreator: LoadingCreator, 
        public oneSignalService:OneSignalServiceProvider) {
        this.populatedcontacts();
        this.Event_Errors.push(
            { "error": 'I am traveling', "checked": false },
            { "error": 'Event Location is not far', "checked": false },
            { "error": 'Caught up in a work', "checked": false },
            { "error": 'Others', "checked": false },
        )

        this.Cancel_Errors.push(
            { "error": 'Reason 1', "checked": false },
            { "error": 'Reason 2', "checked": false },
            { "error": 'Reason 3', "checked": false },
            { "error": 'Others', "checked": false },
        )
        // this.message = document.getElementsByClassName('ui-confirmdialog-message')[0].innerHTML = "Do you want to change Event status to <br> <input type='radio' name='reason'   [value]='I am traveling'  [checked]='true'  (change)='onSelectionChange(entry)' [(ngModel)]='testing'/>I am traveling<br> <input type='radio' name='reason'  (change)='onSelectionChange(entry)' [checked]='true'  [value]='Event Location is not far'  [(ngModel)]='testing'/>Event Location is not far<br> <input type='radio'   name='reason' (change)='onSelectionChange(entry)'   [value]='Caught up in a work'  [checked]='true'  [(ngModel)]='testing'/>Caught up in a work";
    }
    onSelectionChange(val) {
        this.showOthers = false;
        this.testRadioResult = val;
        if (val == 'Others') {
            this.showOthers = true;
        }
    }
    Nvaigate_to_map(lat, long) {
        document.location.href = "" + "https://maps.google.com/?q=" + lat + "," + long + "&t=k";
    }
    testRadioOpen: boolean;
    testRadioResult;
    public showExitEvent: boolean = false;
    public Error_text: any;
    public showOthers: boolean = false;
    public Header_title: any;

    ExecuteEvent() {
        let event = this.eventSelectedForUpdateToBeReadInModalDialog;
        let eventIndex = this.selectedEventIndex;
        console.log(event,eventIndex);
        let invitees = event.Invitess_list.map(inv => {
            return inv.MobileNumber;
        })

        console.log(invitees);
        if (event.Eventtitle == 'Meet Friends Now' && event.EventName == "You") {

            this.storage.remove("selected_users_interesrted");
            this.storage.remove("user_created_time");
        }

        if (this.testRadioResult == 'Others')
            this.testRadioResult = this.Error_text;

        let index = this.Upcoming_Events.findIndex(x => x.Eventid == event.Eventid);
        if (event.EventName == "You") {
            this.apiService.UpdateEventStatusByowner(this.userid, event.Eventid, 2, this.testRadioResult)
                .subscribe((ownerupdateevent) => {
                    this.apiService.GetOneSignalPlayerIds(JSON.stringify(invitees))
                    .subscribe(playerIds=>{
                        this.apiService.FetchSingleUserById(this.userid)
                        .subscribe(currentUser=>{
                            let userName = JSON.parse(currentUser).UserName;
                            let userPhoto = JSON.parse(currentUser).UserProfileImg;
                            this.sendPushNotifcationViaOneSignal('cancelledInvite',playerIds,JSON.stringify(event),this.username,userPhoto,'','', this.testRadioResult,'');
                        })
                    })

                    setTimeout(() => {
                        this.Upcoming_Events.splice(eventIndex, 1);
                    }, 100);
                    // this.apiService.SendPushNotificationFCM(JSON.stringify(invitees), `${this.username} has cancelled the event`, JSON.stringify(event), '', 'cancelledInvite')
                    //     .subscribe(res => {
                    //         console.log(res);
                    //     })
                    if (index > -1) {
                       this.testRadioOpen = false;
                        this.Error_text = '';
                        this.showOthers = false;
                    }

                })
        } else {
           this.apiService.UpdateEventStatus(this.userid, event.Eventid, this.login_user_phone, 2, this.testRadioResult, this.datepipe.transform(new Date(), 'HH:mm a'), this.Login_username)
                .subscribe((UpdateEventInviteeDetails: any) => {
                    this.apiService.FetchSingleUserById(event.EventCreatedBy)
                        .subscribe(user => {
                            this.apiService.GetOneSignalPlayerIds(JSON.parse(user).PhoneNumber)
                            .subscribe(playerIds=>{
                                this.apiService.FetchSingleUserById(this.userid)
                                .subscribe(currentUser=>{
                                    let userName = JSON.parse(currentUser).UserName;
                                    let userPhoto = JSON.parse(currentUser).UserProfileImg;
                                    this.sendPushNotifcationViaOneSignal('declinedInvite',playerIds,JSON.stringify(event),this.username,userPhoto,'','','','');
                                })
                            })
                            // this.apiService.SendPushNotificationFCM(JSON.parse(user).PhoneNumber, `${this.username} has declined to attend the event`, JSON.stringify(event), '', 'declinedInvite')
                            //     .subscribe(r => {
                            //         console.log(r);
                            //     })
                        })

                    console.log(UpdateEventInviteeDetails + "UpdateEventDetails");

                    if (index > -1) {
                        this.Upcoming_Events.splice(index, 1);
                        this.testRadioOpen = false;
                        this.Error_text = '';
                        this.showOthers = false;
                    }
                })
        }


    }
    //update event status
    UpdateEventStatus(statusid, Eventid, usertype, EventType, event,k): void {
        console.log(event);
        this.Header_title = 'Reason to  ' + EventType;
        this.showExitEvent = false;
        this.testRadioOpen = true;
        this.eventSelectedForUpdateToBeReadInModalDialog = event;
        this.selectedEventIndex = k;
        
        if (EventType == 'Exit Event') {
            this.showExitEvent = true;
        }

        else {
            this.showExitEvent = false;

        }




        //alert.present();



    }
    async populatedcontacts() {
        this.phoneContacts = [];
        this.User_list_contacts = [];
        await this.contacts.find(["givenName", "phoneNumbers", "displayName", "photos"])
            .then((contacts: Array<any>
            ) => {
                contacts.forEach(c => {
                    if (c.photos != null) {
                        c["image"] = this.sanitizer.bypassSecurityTrustUrl(c.photos[0].value);
                    }
                    this.phoneContacts.push({ contact: c });
                })
            })
        this.phoneContacts = this.removeDuplicates(this.phoneContacts);
        await this.phoneContacts.forEach(con => {
            if (con.contact.phoneNumbers != null) {
                let formattedNumber = con.contact.phoneNumbers[0].value.replace(/[- )(]/g, '').replace(/\s+/g, "");
                // formattedNumber= formattedNumber.split('').splice(formattedNumber.length-10).join('');
                this.User_list_contacts.push({
                    "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
                    "Name": con.contact.displayName
                })
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

    sendPushNotifcationViaOneSignal(typeOfNotify,playerIds,eventDetails,senderName,largeIcon,latlong,distance, reasonForCancellation, reasonForExitingEvent){
        let notificationObj:NotificationObject = {
            type:typeOfNotify,
            playerIds:playerIds.PlayersIds,
            senderName:senderName,
            senderPhotoLink:this.cloudinaryUrl+largeIcon,
            // bigPicture:this.cloudinaryRestHeroImgUrl+bigPicture,
            eventDetails:eventDetails,
            latlong:latlong,
            distance:distance,
            reasonForCancellation:reasonForCancellation,
            reasonForExitingEvent:reasonForExitingEvent
        }
    
        this.oneSignalService.postOneSignalNotification(notificationObj);
       
    }
}