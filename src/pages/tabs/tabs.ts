import { Component, ViewChild, NgZone, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  NavController,
  Tabs,
  NavParams,
  ToastController,
  IonicPage,
  Platform
} from "ionic-angular";
import { ApiServices } from "../../services/appAPIServices";
import { Storage } from "@ionic/Storage";
import { LoteasyService } from "../../services/loteasyService";
// import { FCM } from '@ionic-native/fcm';
import { OneSignal } from "@ionic-native/onesignal";
import {
  OneSignalServiceProvider,
  NotificationObject
} from "../../services/oneSignalPushNotificationProvider";
import { GeolocationService } from "../../services/geolocation";
import { Observable } from "rxjs/Observable";
import { AppConstants } from "../../assets/appConstants";
import { EventsService } from "../../new-services/eventsService";
import { NgRedux, select } from "ng2-redux";
import { IAppState, IUser } from "../../app/stores";
import { UserDetailsService } from "../../new-services/fetchUserDetails";

declare var $: any;
@IonicPage()
@Component({
  selector: "page-tabs",
  template: `
    <ion-tabs selectedIndex="2" #tabs>
      <ion-tab
        [root]="invitesPage"
        tabIcon="customicon1"
        tabTitle="Invites"
        tabBadge="{{ pendingEventsCount | async }}"
        tabBadgeStyle="danger"
      >
      </ion-tab>
      <ion-tab
        [root]="memoriesPage"
        tabIcon="customicon2"
        tabTitle="Memories"
      ></ion-tab>
      <ion-tab [root]="homePage" tabIcon="customicon3"></ion-tab>
      <ion-tab
        [root]="eventsPage"
        tabIcon="customicon4"
        tabTitle="Events"
      ></ion-tab>
      <ion-tab
        [root]="morePage"
        tabIcon="customicon5"
        tabTitle="More"
      ></ion-tab>
    </ion-tabs>
    <ul>
      <li *ngFor="let notify of eventNotificationsArray; let i = index">
        <notification-one
          [notification]="notify"
          [currentTime]="currentTime"
          [senderName]="notify.userName"
          [inviteeName]="notify.inviteeName"
          [showNotifyMask]="showNotifyMask"
          (onCloseNotification)="close(notify)"
          [eventName]="notify.eventTitle"
          [eventDateTime]="notify.eventDateMonth + ', ' + notify.eventTime"
          (onAcceptNotification)="accept(notify)"
          (onDeclineNotification)="decline(notify)"
          [funchOrPlanInvite]="notify.type == 'funchOrPlanInvite'"
          [declinedInvite]="notify.type == 'declinedInvite'"
          [acceptedInvite]="notify.type == 'acceptedInvite'"
          [nofriendsInVicinity]="notify.type == 'nofriendsInVicinity'"
          [catchupInvite]="notify.type == 'catchupInvite'"
          [notWithinRange]="notify.distanceRangeSelected < notify.distance"
          [isWithinRange]="notify.distanceRangeSelected > notify.distance"
          [cancelledInvite]="notify.type == 'cancelledInvite'"
          [confirmedInvite]="notify.type == 'confirmedInvite'"
          [excludedFromEvent]="notify.type == 'excludedFromEvent'"
          [exitedEvent]="notify.type == 'exitedEvent'"
          [joinedbackEvent]="notify.type == 'joinedbackEvent'"
          [venueChanged]="notify.type == 'venueChanged'"
          [newVenueForCatchup]="notify.newVenueForCatchup"
          [msgBody]="notify.msgBody"
        >
        </notification-one>
      </li>
    </ul>
  `
})
export class TabsPage {
  showNotifyMask: boolean;
  showNotification: boolean;
  public homePage: any = "HomePage";
  public invitesPage: any = "InvitesPage";
  public memoriesPage: any = "MemoriesPage";
  public eventsPage: any = "EventsPage";
  public morePage: any = "MorePage";
  userId: any;
  public enddate: any;
  public Events_Details: any[] = [];
  public invitess: number;
  public login_user_phone: any;
  signalRBaseUrl: string =
    "http://loteasysignalr-dev.ap-south-1.elasticbeanstalk.com";
  private proxy: any;
  private proxyName: string = "EventsHub";
  private connection: any;
  notifications: Array<any> = [];
  phoneNumber: any;
  funchOrPlanInvite: boolean;
  declinedInvite: boolean;
  acceptedInvite: boolean;
  nofriendsInVicinity: boolean;
  catchUpInvite: boolean;
  notificationsEventIds: Array<any> = [];
  @ViewChild("tabs") tabsRef: Tabs;
  currentTime: any;
  eventDateFormat: any;
  acceptedInvites: Array<any> = [];
  acceptedInvitesList: Array<any> = [];
  public Event_complete_date: any;
  public eventCreatedBy: any;
  public display_inviteescount: any;
  public isWithinRange: number;
  public userName: string;
  public cloudinaryUrl: string = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  eventNotificationsArray: Array<any> = [];
  @select(["leEvents", "pendingEventsCount"]) pendingEventsCount;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    public apiService: ApiServices,
    private storage: Storage,
    public ngZone: NgZone,
    private datepipe: DatePipe,
    private toast: ToastController,
    public loteasyService: LoteasyService,
    public oneSignal: OneSignal,
    public geoService: GeolocationService,
    public platform: Platform,
    public oneSignalService: OneSignalServiceProvider,
    private eventsService: EventsService,
    private ngRedux: NgRedux<IAppState>,
    private userDetailsService: UserDetailsService
  ) {
    this.firebaseToken();
    let signalRnotifyResponse = this.connectToSignalRHubAndInvoke();
    this.showInAppNotification();
    this.storage.get("userDetails").then(user => {
      this.eventsService.GetAllEventsByPhoneNumber(user.phone);
      this.userDetailsService.fetchUserDetails(user.phone);
      this.apiService.FetchSingleUserById(user.UserId).subscribe(userObj => {
        this.userName = JSON.parse(userObj).UserName;
      });
    });
  }

  getLatlong(): Promise<any> {
    return this.geoService._geolocate({ enableHighAccuracy: true });
  }
  async Getlistofinvitess(phoneNumber: string): Promise<any> {
    return this.loteasyService.fetch("get", "GetCountofUserEvents", {
      PhoneNumber: phoneNumber
    });
  }
  distance_calculator(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  async firebaseTokenCaptureAndUpdate() {
    let latlong = await this.getLatlong();
    this.platform.ready().then(() => {
      this.oneSignal.startInit(
        "af88399f-192c-48fd-b0ad-1bc57483ed6c",
        "449263978865"
      );
      this.oneSignal.getIds().then(ids => {
        console.log(ids);
        this.saveOSPushTokenToDb(ids);
      });

      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.Notification
      );

      this.oneSignal.handleNotificationReceived().subscribe(data => {
        this.Getlistofinvitess(this.login_user_phone).then(result => {
          this.invitess = 0;
          console.log(result);
          setTimeout(() => {
            this.ngZone.run(() => {});
          }, 100);

          console.log(this.invitess);
        });
        // do something when notification is received
        console.log(
          "onesignal notification received, data" +
            JSON.stringify(data.payload.additionalData)
        );
        // this.oneSignal.promptLocation();

        if (
          data.payload.additionalData.senderLatLong &&
          data.payload.additionalData.senderLatLong != "undefined"
        ) {
          let Distance_value = this.distance_calculator(
            latlong.coords.latitude,
            latlong.coords.longitude,
            data.payload.additionalData.senderLatLong.split(",")[0],
            data.payload.additionalData.senderLatLong.split(",")[1]
          );
          console.log(
            Distance_value,
            data.payload.additionalData.distanceSelected
          );
          this.isWithinRange =
            Distance_value > data.payload.additionalData.distanceSelected
              ? 0
              : 1;
          let catchupEventId = JSON.parse(
            data.payload.additionalData.loteasyEvent
          ).EventId;
          this.storage.get("userDetails").then(userDetails => {
            this.apiService
              .FetchSingleUserById(userDetails.UserId)
              .subscribe(currentUser => {
                this.apiService
                  .CreateOrUpdateCatchUpInviteeAvailability(
                    catchupEventId,
                    userDetails.phone,
                    this.isWithinRange,
                    userDetails.UserId,
                    JSON.parse(currentUser).UserProfileImg,
                    JSON.parse(currentUser).UserName
                  )
                  .subscribe(res => {
                    console.log(res);
                  });
              });
          });
        }
        this.formatDetailsForTheNotification(data);
        this.showNotifyMask = true;
        this.showNotification = true;
        console.log(this.eventNotificationsArray);
        // console.log(data.body);
      });

      this.oneSignal.handleNotificationOpened().subscribe(data => {
        // do something when a notification is opened
        this.Getlistofinvitess(this.login_user_phone).then(result => {
          this.invitess = 0;
          console.log(result);
          setTimeout(() => {
            this.ngZone.run(() => {});
          }, 100);

          console.log(this.invitess);
        });
        console.log(
          "onesignal notification opened, data " + JSON.stringify(data)
        );
        if (
          data.notification.payload.additionalData.senderLatLong &&
          data.notification.payload.additionalData.senderLatLong != "undefined"
        ) {
          let Distance_value = this.distance_calculator(
            latlong.coords.latitude,
            latlong.coords.longitude,
            data.notification.payload.additionalData.senderLatLong.split(
              ","
            )[0],
            data.notification.payload.additionalData.senderLatLong.split(",")[1]
          );
          this.isWithinRange =
            Distance_value >
            data.notification.payload.additionalData.distanceSelected
              ? 0
              : 1;
          let catchupEventId = JSON.parse(
            data.notification.payload.additionalData.loteasyEvent
          ).EventId;
          this.storage.get("userDetails").then(userDetails => {
            this.apiService
              .FetchSingleUserById(userDetails.UserId)
              .subscribe(currentUser => {
                this.apiService
                  .CreateOrUpdateCatchUpInviteeAvailability(
                    catchupEventId,
                    userDetails.phone,
                    this.isWithinRange,
                    userDetails.UserId,
                    JSON.parse(currentUser).UserProfileImg,
                    JSON.parse(currentUser).UserName
                  )
                  .subscribe(res => {
                    console.log(res);
                  });
              });
          });
        }
        this.formatDetailsForTheNotification(data.notification);
        this.showNotifyMask = true;
        this.showNotification = true;
        console.log(this.eventNotificationsArray);
        if (
          data.action.actionID == "accept_event" ||
          data.action.actionID == "accept_btn_catchup"
        ) {
          this.onNotificationActionButtonClick(data, 1, "acceptedInvite");
        } else {
          this.onNotificationActionButtonClick(data, 2, "declinedInvite");
        }
      });
      this.oneSignal.endInit();
    });
  }

  onNotificationActionButtonClick(data, eventStatus, acceptOrdecline) {
    let currentTime = this.datepipe.transform(new Date(), "HH mm a");
    this.storage.get("userDetails").then(user => {
      this.apiService
        .FetchSingleUserById(user.UserId)
        .subscribe(userDetails => {
          this.apiService
            .UpdateEventStatus(
              user.UserId,
              JSON.parse(data.notification.payload.additionalData.loteasyEvent)
                .EventId,
              user.phone,
              eventStatus,
              "",
              currentTime,
              JSON.parse(userDetails).UserName
            )
            .subscribe(res => {
              console.log(res);
              this.apiService
                .FetchSingleUserById(
                  JSON.parse(
                    data.notification.payload.additionalData.loteasyEvent
                  ).EventCreatedBy
                )
                .subscribe(eventCreator => {
                  this.apiService
                    .GetOneSignalPlayerIds(JSON.parse(eventCreator).PhoneNumber)
                    .subscribe(playerIds => {
                      this.sendPushNotifcationViaOneSignal(
                        acceptOrdecline,
                        playerIds,
                        data.notification.payload.additionalData.loteasyEvent,
                        JSON.parse(userDetails).UserName,
                        JSON.parse(userDetails).UserProfileImg,
                        "",
                        "",
                        ""
                      );
                    });
                });
            });
        });
    });
  }
  async formatDetailsForTheNotification(data) {
    console.log(data);
    let thisUserName = "";
    let loteasyEvent: any;
    this.storage.get("userDetails").then(user => {
      this.apiService.FetchSingleUserById(user.UserId).subscribe(userObj => {
        thisUserName = JSON.parse(userObj).UserName;
      });
    });
    if (typeof data.payload.additionalData.loteasyEvent != "object") {
      loteasyEvent = JSON.parse(data.payload.additionalData.loteasyEvent);
    } else {
      loteasyEvent = data.payload.additionalData.loteasyEvent;
    }

    this.apiService
      .FetchSingleUserById(loteasyEvent.EventCreatedBy)
      .subscribe(async res => {
        let userName = JSON.parse(res).UserName;
        let eventDateTimeStamp = new Date(
          loteasyEvent.EventDate.split("-")[1] +
            "/" +
            loteasyEvent.EventDate.split("-")[0] +
            "/" +
            loteasyEvent.EventDate.split("-")[2] +
            " " +
            loteasyEvent.EventTime
        );
        let eventDateMonth =
          eventDateTimeStamp.toString().split(" ")[2] +
          eventDateTimeStamp.toString().split(" ")[1] +
          ",";
        console.log(eventDateTimeStamp);
        let eventTime = loteasyEvent.EventTime;
        let eventTitle = loteasyEvent.EventTitle;
        let distanceFromSender: number;
        let distanceSelected: number;
        let changedVenue: string;
        if (data.payload.additionalData.notifyType == "catchupInvite") {
          let senederLatitude = data.payload.additionalData.senderLatLong.split(
            ","
          )[0];
          let senederLogitude = data.payload.additionalData.senderLatLong.split(
            ","
          )[1];
          let position = await this.geoService._geolocate({
            enableHighAccuracy: true
          });
          console.log(position);
          let inviteeLatitude = position.coords.latitude;
          let inviteeLongitude = position.coords.longitude;
          console.log(
            senederLatitude,
            senederLogitude,
            inviteeLatitude,
            inviteeLongitude
          );
          distanceFromSender = this.getDistanceFromLatLonInKm(
            senederLatitude,
            senederLogitude,
            inviteeLatitude,
            inviteeLongitude
          );
          console.log(distanceFromSender);
          distanceSelected = data.payload.additionalData.distanceSelected;
        }
        if (data.payload.additionalData.notifyType == "venueChanged") {
          changedVenue = data.payload.additionalData.changedVenue;
        }
        this.eventNotificationsArray.push({
          userName: userName,
          eventDateMonth: eventDateMonth,
          eventTime: eventTime,
          eventTitle: eventTitle,
          eventId: loteasyEvent.EventId,
          eventCreatedBy: loteasyEvent.EventCreatedBy,
          type: data.payload.additionalData.notifyType,
          loteasyEvent: loteasyEvent,
          distance: distanceFromSender,
          distanceRangeSelected: distanceSelected,
          newVenueForCatchup: changedVenue,
          inviteeName: thisUserName,
          msgBody: data.payload.body
        });
      });
  }

  async SaveFCMTokenToDatabase(
    phoneNumber: string,
    token: string,
    _date: string
  ): Promise<any> {
    let response: Promise<any> = await this.loteasyService.fetch(
      "post",
      "SaveFCMTokenToDatabase",
      { PhoneNumber: phoneNumber, FcmToken: token, _DateTimeStamp: _date }
    );
    return response;
  }

  async firebaseToken() {
    await this.getStorageData().then(async data => {
      await this.firebaseTokenCaptureAndUpdate();
    });
  }

  async getStorageData() {
    await this.loteasyService
      .getDataFromLocalStorage(this.storage, "userDetails")
      .then(res => {
        if (typeof res == "string") {
          let parsedVal = JSON.parse(res);
          this.userId = parsedVal.UserId;
          this.phoneNumber = parsedVal.phone;
        } else if (typeof res == "object") {
          this.userId = res.UserId;
          this.phoneNumber = res.phone;
        }
      });
  }

  async accept(notify: any) {
    console.log(notify);
    let userPhoneNumber;
    let userId;
    let currentTime = this.datepipe.transform(new Date(), "HH mm a");
    await this.Getlistofuserdetails.subscribe(user_details => {
      userPhoneNumber = user_details.phone;
      userId = user_details.UserId;
    });

    await this.getRegisteruser_details(userId).then(details => {
      console.log(details);

      this.apiService
        .UpdateEventStatus(
          userId,
          notify.eventId,
          userPhoneNumber,
          1,
          "",
          currentTime,
          this.userName
        )
        .subscribe(res => {});

      this.apiService
        .FetchSingleUserById(notify.eventCreatedBy)
        .subscribe(userdetails => {
          console.log(userdetails);
          let senderPhone = JSON.parse(userdetails).PhoneNumber;
          this.apiService.FetchSingleUserById(userId).subscribe(currentUser => {
            this.apiService
              .GetOneSignalPlayerIds(senderPhone)
              .subscribe(playerIds => {
                this.sendPushNotifcationViaOneSignal(
                  "acceptedInvite",
                  playerIds,
                  notify.loteasyEvent,
                  JSON.parse(currentUser).UserName,
                  JSON.parse(currentUser).UserProfileImg,
                  "",
                  "",
                  ""
                );
                let index = this.eventNotificationsArray.indexOf(notify);
                this.eventNotificationsArray.splice(index, 1);
              });
          });

          // this.apiService.SendPushNotificationFCM(senderPhone, `${this.userName} accepted the invite`, notify.loteasyEvent, '', 'acceptedInvite')
          //     .subscribe(res => {
          //     })
        });
      console.log("enter");
    });
  }
  Getlistofuserdetails: Observable<any> = Observable.fromPromise(
    this.storage.get("userDetails").then(user_details => {
      return user_details;
    })
  );

  async getRegisteruser_details(userId): Promise<any> {
    return this.loteasyService.fetch("get", "FetchSingleUserById", {
      UserId: userId
    });
  }
  async decline(notify: any) {
    console.log(notify);
    let userPhoneNumber;
    let userId;
    let currentTime = this.datepipe.transform(new Date(), "HH mm a");
    await this.Getlistofuserdetails.subscribe(user_details => {
      userPhoneNumber = user_details.phone;
      userId = user_details.UserId;
    });

    await this.getRegisteruser_details(userId).then(details => {
      console.log(details);

      this.apiService
        .UpdateEventStatus(
          userId,
          notify.eventId,
          userPhoneNumber,
          2,
          "",
          currentTime,
          this.userName
        )
        .subscribe(res => {});

      this.apiService
        .FetchSingleUserById(notify.eventCreatedBy)
        .subscribe(userdetails => {
          console.log(userdetails);
          let senderPhone = JSON.parse(userdetails).PhoneNumber;
          this.apiService
            .GetOneSignalPlayerIds(senderPhone)
            .subscribe(playerIds => {
              this.apiService
                .FetchSingleUserById(userId)
                .subscribe(currentUser => {
                  this.sendPushNotifcationViaOneSignal(
                    "declinedInvite",
                    playerIds,
                    notify.loteasyEvent,
                    JSON.parse(currentUser).UserName,
                    JSON.parse(currentUser).UserProfileImg,
                    "",
                    "",
                    ""
                  );
                  let index = this.eventNotificationsArray.indexOf(notify);
                  this.eventNotificationsArray.splice(index, 1);
                });
            });
          // this.apiService.SendPushNotificationFCM(senderPhone, `${this.userName} declined the invite`, notify.loteasyEvent, '', 'declinedInvite')
          //     .subscribe(res => {
          //     })
        });
      console.log("enter");
    });
  }

  close(notify: any) {
    let index = this.eventNotificationsArray.indexOf(notify);
    this.eventNotificationsArray.splice(index, 1);
  }

  async ionViewDidEnter() {
    this.ngRedux.select(["user"]).subscribe((user: IUser) => {
      this.userId = user.id;
      this.userName = user.name;
      this.phoneNumber = user.phoneNumber;
      this.login_user_phone = user.phoneNumber;
      console.log(user);
    });

    let storagePrmosies = await Promise.all([
      this.getItemFromLocalStorage("userDetails"),
      this.getItemFromLocalStorage("eventIds")
    ]);
    let userId = storagePrmosies[0].UserId;
    let eventIds = storagePrmosies[1];
    this.userId = userId;
    let notifications;
    let acceptedInvitees;
    console.log(this.userId, eventIds);
    if (eventIds != null && eventIds != undefined) {
      this.notificationsEventIds = eventIds;
      acceptedInvitees = await this.filterAcceptedInvitees(
        this.notificationsEventIds
      );
      console.log(acceptedInvitees);
    } else {
      notifications = await this.getNotificationsByUserId(this.userId);
      this.notifications = notifications;
      acceptedInvitees = await this.filterAcceptedInvitees(
        JSON.parse(notifications)
      );
      console.log(acceptedInvitees);
      let saveEventIdsToStorage = await this.setItemToLocalStorage(
        "eventIds",
        this.notificationsEventIds
      );
    }
    this.currentTime = this.getCurrentTimeFormat(new Date());
  }

  async filterAcceptedInvitees(notifications): Promise<any> {
    notifications.forEach(async noti => {
      if (typeof noti != "number") {
        this.notificationsEventIds.push(noti.EventId);
        if (noti.EventCreatedBy == this.userId) {
          let eventAcceptDeclineStatus = await this.getEventStatusByEventId(
            noti.EventId
          );
          if (eventAcceptDeclineStatus.Accepted_Count > 0) {
            this.acceptedInvites.push({
              event: noti,
              acceptCount: eventAcceptDeclineStatus.Accepted_Count
            });
          }
        }
      } else {
        if (noti == this.userId) {
          let eventAcceptDeclineStatus = await this.getEventStatusByEventId(
            noti
          );
          if (eventAcceptDeclineStatus.Accepted_Count > 0) {
            this.acceptedInvites.push({
              event: noti,
              acceptCount: eventAcceptDeclineStatus.Accepted_Count
            });
          }
        }
      }
    });

    return await new Promise((resolve, reject) => {
      resolve(this.acceptedInvites);
      reject(new Error("error occured"));
    });
  }

  async connectToSignalRHubAndInvoke(): Promise<any> {
    this.connection = $.hubConnection(this.signalRBaseUrl);
    this.proxy = this.connection.createHubProxy("EventsHub");
    this.proxy.on("sendNewEvent", async response => {
      console.log(response);
      let eventsWithUserNames = await this.addUserNamesToEvents(response);
      setTimeout(() => {
        this.ngZone.run(() => {
          if (this.notifications.length > 0) {
            this.showNotification = true;
            this.showNotifyMask = true;
          }
        });
        console.log(this.notifications);
      }, 2000);
    });

    if (
      this.connection &&
      this.connection.state === $.signalR.connectionState.disconnected
    ) {
      this.connection.start().done((data: any) => {
        this.proxy
          .invoke("SubscribeUsersToReceiveEventOnCreation")
          .done(data => {
            this.ngZone.run(() => {
              this.acceptedInvites = this.acceptedInvitesList;
            });
          });
      });
    } else {
      this.proxy
        .invoke("SubscribeUsersToReceiveEventOnCreation")
        .done(data => {});
    }

    this.getCurrentTimeFormat(new Date());
  }

  async addUserNamesToEvents(events: Array<any>): Promise<any> {
    events.forEach(async ev => {
      let _relevantEventToThisUser = JSON.parse(
        JSON.parse(ev._loteasyEvent)._event
      );
      if (
        _relevantEventToThisUser.InviteesList.indexOf(this.phoneNumber) > -1
      ) {
        if (
          this.notificationsEventIds.indexOf(
            _relevantEventToThisUser.EventId
          ) == -1
        ) {
          let user = await this.fetchSingleUserByUserId(
            _relevantEventToThisUser.EventCreatedBy
          );
          this.notifications.push({
            event: _relevantEventToThisUser,
            userName: JSON.parse(user).UserName
          });
        }
      }
    });

    return new Promise((resolve, reject) => {
      resolve(this.notifications);
      reject(new Error("error occured"));
    });
  }

  async closenotification(index, notify) {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.notifications.splice(index);
        if (this.notifications.length < 1) {
          this.showNotifyMask = false;
        }
      });
    }, 0);

    let _responseData = await this.updateNotification(
      this.userId,
      notify.EventId,
      1
    );
    console.log(_responseData);
    let eventIds = await this.getItemFromLocalStorage("eventIds");
    if (eventIds) {
      JSON.parse(eventIds).push(notify.EventId);
      let storeEventIds = await this.setItemToLocalStorage(
        "eventIds",
        JSON.stringify(eventIds)
      );
      console.log(storeEventIds);
    }
  }

  async declineInvite(index, notify) {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.notifications.splice(index);
        if (this.notifications.length < 1) {
          this.showNotifyMask = false;
        }
      });
    }, 0);
    let _responseData = await this.updateNotification(
      this.userId,
      notify.EventId,
      2
    );
    console.log(_responseData);
    let eventIds = await this.getItemFromLocalStorage("eventIds");
    if (eventIds) {
      JSON.parse(eventIds).push(notify.EventId);
      let storeEventIds = await this.setItemToLocalStorage(
        "eventIds",
        JSON.stringify(eventIds)
      );
      console.log(storeEventIds);
      let updateStatusRes = await this.updateEventStatus(
        this.userId,
        notify.EventId,
        this.phoneNumber,
        2,
        "",
        this.datepipe.transform(new Date(), "HH:mm a"),
        "ff"
      );
      console.log(updateStatusRes);
      let signalRnotifyResponse = this.connectToSignalRHubAndInvoke();
      console.log(signalRnotifyResponse);
      this.showInAppNotification();
    }
    //   this.updateNotificationStatus(this.userId,notify.EventId,1);
    //   this.storage.get('eventIds').then(data=>{
    //       if(data){
    //          let evtIds =  JSON.parse(data);
    //          evtIds.push(notify.EventId);
    //          setTimeout(() => {
    //             this.storage.set('eventIds',JSON.stringify(evtIds)).then(()=>{
    //                 console.log('event ids saved');
    //             })
    //          }, 1000);

    //       }
    //   })

    console.log(notify);
  }

  async acceptInvite(index, notify) {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.notifications.splice(index);
        if (this.notifications.length < 1) {
          this.showNotifyMask = false;
        }
      });
    }, 0);

    let _responseData = await this.updateNotification(
      this.userId,
      notify.EventId,
      1
    );
    console.log(_responseData);
    let eventIds = await this.getItemFromLocalStorage("eventIds");
    if (eventIds) {
      JSON.parse(eventIds).push(notify.EventId);
      let storeEventIds = await this.setItemToLocalStorage(
        "eventIds",
        JSON.stringify(eventIds)
      );
      console.log(storeEventIds);
      let updateStatusRes = await this.updateEventStatus(
        this.userId,
        notify.EventId,
        this.phoneNumber,
        1,
        "",
        this.datepipe.transform(new Date(), "HH:mm a"),
        "ff"
      );
      console.log(updateStatusRes);
      let signalRnotifyResponse = this.connectToSignalRHubAndInvoke();
      console.log(signalRnotifyResponse);
      this.showInAppNotification();
    }

    let user = await this.fetchSingleUserByUserId(this.userId);
    let userName = JSON.parse(user).UserName;
    let profileImg = JSON.parse(user).UserProfileImg;
    let message =
      userName +
      " has accepted your invite on " +
      notify.EventDate +
      " " +
      notify.EventTime;
    let eventCreatedBy = await this.fetchSingleUserByUserId(
      notify.EventCreatedBy
    );
    this.apiService
      .GetOneSignalPlayerIds(JSON.parse(eventCreatedBy).PhoneNumber)
      .subscribe(playerIds => {
        this.sendPushNotifcationViaOneSignal(
          "acceptedInvite",
          playerIds,
          JSON.stringify(notify),
          userName,
          profileImg,
          "",
          "",
          ""
        );
      });
    // this.apiService.SendPushNotificationFCM(JSON.parse(eventCreatedBy).PhoneNumber, message, JSON.stringify(notify), profileImg, 'acceptedInvite')
    //     .subscribe(res => {
    //         console.log(res);
    //     })
    // let pushResponse = await this.sendPushNotificationForAcceptEvent(JSON.parse(eventCreatedBy).PhoneNumber,message,profileImg);
  }

  updateNotificationStatus(userId, eventId, readStatus) {
    this.apiService
      .UpdateNotification(userId, eventId, readStatus)
      .subscribe(data => {
        console.log(data);
      });
  }

  getCurrentTimeFormat(date: Date) {
    var hours = date.getHours();
    hours = (hours + 24 - 2) % 24;
    var mid = "am";
    if (hours == 0) {
      //At 00 hours we need to show 12 am
      hours = 12;
    } else if (hours > 12) {
      hours = hours % 12;
      mid = "pm";
    }

    return (
      (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) +
      ":" +
      date.getMinutes() +
      " " +
      mid
    );
  }

  async getItemFromLocalStorage(itemName: string): Promise<any> {
    return await this.storage.get(itemName);
  }
  async setItemToLocalStorage(itemName: string, itemVal: any): Promise<any> {
    return await this.storage.set(itemName, itemVal);
  }

  async fetchSingleUserByUserId(userId: any): Promise<any> {
    return await this.loteasyService.fetch("get", "FetchSingleUserById", {
      UserId: userId
    });
  }

  async createNotification(
    userId: number,
    eventId: number,
    readStatus: number
  ): Promise<any> {
    return await this.loteasyService.fetch("post", "CreateNotification", {
      UserId: userId,
      EventId: eventId,
      ReadStatus: readStatus
    });
  }

  async sendPushNotificationForAcceptEvent(
    phoneNumber: string,
    notifyMessage: string,
    profileImg: string
  ): Promise<any> {
    return await this.loteasyService.fetch(
      "post",
      "SendPushNotificationForAcceptEvent",
      {
        PhoneNumber: phoneNumber,
        NotifyMessage: notifyMessage,
        profileImg: profileImg
      }
    );
  }

  async updateNotification(
    userId: number,
    eventId: number,
    readStatus: number
  ): Promise<any> {
    await this.loteasyService.fetch("post", "CreateNotification", {
      UserId: userId,
      EventId: eventId,
      ReadStatus: readStatus
    });
  }

  async updateEventStatus(
    userId: number,
    eventId: number,
    phoneNumber: string,
    status: any,
    declinemsg: string,
    statustime: any,
    userName: any
  ): Promise<any> {
    return await this.loteasyService.fetch("get", "UpdateEventStatus", {
      UserId: userId,
      Eventid: eventId,
      Mobile: phoneNumber,
      status: status,
      Declinemsg: declinemsg,
      statustime: statustime,
      inviteename: userName
    });
  }

  async getAllEventsCreatedByUser(phoneNumber: any): Promise<any> {
    return await this.loteasyService.fetch("get", "GetAllEventsCreatedByUser", {
      PhoneNumber: phoneNumber
    });
  }

  async getNotificationsByUserId(UserId: any): Promise<any> {
    return await this.loteasyService.fetch("post", "GetNotificationsByUserId", {
      UserId: UserId
    });
  }

  async getEventStatusByEventId(eventId: any): Promise<any> {
    return await this.loteasyService.fetch(
      "get",
      "GetPendingAcceptDeclineStatusOfInvitees",
      {
        EventId: eventId
      }
    );
  }

  showInAppNotification() {
    this.ngZone.run(() => {
      if (this.notifications.length > 0) {
        this.showNotification = true;
        this.showNotifyMask = true;
      }
    });
  }

  extractToDateTimeFormat(notify: any) {
    console.log(notify);
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  saveOSPushTokenToDb(osRes) {
    this.storage.get("userDetails").then(ud => {
      console.log(ud);
      let userPhone = ud.phone;
      this.apiService
        .SaveOSPushTokenToDb(osRes.userId, userPhone)
        .subscribe(savedConfirmation => {
          console.log(savedConfirmation);
        });
    });
  }

  sendPushNotifcationViaOneSignal(
    acceptOrDeclineInvite,
    playerIds,
    eventDetails,
    senderName,
    largeIcon,
    bigPicture,
    latlong,
    distance
  ) {
    let notificationObj: NotificationObject = {
      type: acceptOrDeclineInvite,
      playerIds: playerIds.PlayersIds,
      senderName: senderName,
      senderPhotoLink: this.cloudinaryUrl + largeIcon,
      eventDetails: eventDetails,
      latlong: latlong,
      distance: distance
    };

    this.oneSignalService.postOneSignalNotification(notificationObj);
  }
}
