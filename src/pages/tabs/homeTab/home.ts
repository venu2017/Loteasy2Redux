import { Component, NgZone, OnInit } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  Platform,
  IonicPage
} from "ionic-angular";
import { Storage } from "@ionic/Storage";
// import { FCM } from '@ionic-native/fcm';
import { ApiServices } from "../../../services/appAPIServices";
import { SharedService } from "../../../services/globalvariable";
import { LoteasyService } from "../../../services/loteasyService";
import { NgRedux } from "ng2-redux";
import { IAppState, IUser } from "../../../app/stores";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  userName: any;
  showCatchUpAlert: boolean = false;
  showNotifyMask: boolean;
  showNotification: boolean;
  canSendMessage: boolean;
  searchPhrase: string = "Search Restaurant...";
  public title: string = "Loteasy Version 2.0";
  userId: any;
  message: any;
  tabBarElement: any;
  phoneNumber: any;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private ngZone: NgZone,
    private alertCtrl: AlertController,
    private platform: Platform,
    private apiService: ApiServices,
    private globalVar: SharedService,
    private loteasyService: LoteasyService,
    private ngRedux: NgRedux<IAppState>
  ) {
    this.tabBarElement = document.querySelector(".tabbar");

    this.platform.ready().then(() => {
      // this.firebaseToken()
      // .then(r=>{
      //   console.log(r);
      // })

      this.storage.get("userDetails").then(d => {
        this.apiService.FetchSingleUserById(d.UserId).subscribe(user => {
          this.userName = JSON.parse(user).UserName;
        });
      });
    });
  }

  async getCatchupFromStorage(): Promise<any> {
    let catchup = await this.storage.get("catchup");
    return catchup;
  }

  ionViewDidEnter() {
    this.ngRedux.select(["leEvents"]).subscribe(leEvents => {
      console.log("events state: ");
      console.log(leEvents);
    });

    this.ngRedux.select(["user"]).subscribe((user: IUser) => {
      console.log("user name: " + user.name, "user id: " + user.id);
    });
  }

  // async getStorageData(){
  //     await  this.loteasyService.getDataFromLocalStorage(this.storage,'userDetails')
  //             .then(res=>{
  //     if(typeof res =='string'){
  //       let parsedVal = JSON.parse(res);
  //       this.userId = parsedVal.UserId;
  //       this.phoneNumber = parsedVal.phone;
  //     }else if(typeof res == 'object'){
  //       this.userId = res.UserId;
  //       this.phoneNumber = res.phone;
  //     }

  //   })
  // }

  //  async firebaseTokenCaptureAndUpdate(){
  //     this.fcm.subscribeToTopic('marketing');
  //     await  this.fcm.getToken().then(token => {
  //      console.log(token);
  //      this.SaveFCMTokenToDatabase(this.phoneNumber,token,new Date().toString())
  //     .then(r=>{
  //       console.log(r);
  //     }).catch(e=>{
  //       console.log(e.message);
  //     })

  //     });

  //     this.fcm.onNotification().subscribe(data => {

  //      if(data.wasTapped){
  //         alert(JSON.stringify(data));

  //       } else {
  //         alert('You have received a notification');

  //       };
  //     });

  //     this.fcm.onTokenRefresh().subscribe(token => {
  //     console.log("refreshed token: " + token);
  //     this.SaveFCMTokenToDatabase(this.phoneNumber,token,new Date().toString())
  //     .then(r=>{
  //       console.log(r);
  //     }).catch(e=>{
  //       console.log(e.message);
  //     })

  //     },(err:any)=>{
  //       console.log(err);
  //     },()=>{
  //       console.log('completed');
  //     });

  //   }

  //   async SaveFCMTokenToDatabase(phoneNumber:string,token:string,_date:string):Promise<any>{
  //       let response:Promise<any> = await this.loteasyService.fetch('post','SaveFCMTokenToDatabase',
  //       {PhoneNumber:phoneNumber,FcmToken:token,_DateTimeStamp:_date});
  //       return response;
  //   }

  ionViewWillEnter() {
    this.tabBarElement.className += " " + "show-tabbar";
    this.tabBarElement.style.display = "flex";
    this.tabBarElement.style.opacity = "1";
    this.platform.ready().then(() => {});
    this.getCatchupFromStorage().then(data => {
      console.log(data);
      if (data) {
        this.showCatchUpAlert = true;
      }
    });
  }

  // async firebaseToken(){
  //     await  this.getStorageData().then(async data=>{
  //     await this.firebaseTokenCaptureAndUpdate();
  //   })
  //  }

  onPageChangeToRestaurantSearch() {
    this.navCtrl.push("RestaurantSearchPage");
  }

  navigateToLocationDatetime(type_of_event: string) {
    console.log(type_of_event);
    if (type_of_event == "Funch")
      this.navCtrl.push("ChooseLocationDatetimePage", {
        from: "homeTab",
        flowName: "funch",
        userId: this.userId
      });
    else {
      this.navCtrl.push("ChooseLocationDatetimePage", {
        from: "homeTab",
        flowName: "plan",
        userId: this.userId
      });
    }
  }
  setAvailability() {
    this.storage.remove("List_contactseleced");

    this.navCtrl.push("SetAvailabilityPage", {
      from: "homepage",
      flow: "Meet Friends Now"
    });
  }

  navigateToOrderFood() {
    this.navCtrl.push("OrderFoodPage", { from: "home" });
  }
}
