import { Component, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  LoadingController,
  AlertController,
  Loading
} from "ionic-angular";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { ApiServices } from "../../services/appAPIServices";
import { Storage } from "@ionic/Storage";
import { LoadingCreator } from "../../services/loadingcreator";
declare var SMS: any;

@IonicPage()
@Component({
  selector: "page-login-two",
  templateUrl: "login-two.html"
})
export class LoginTwoPage {
  isEnabled: boolean = false;
  showStyle: any;
  phoneNumber: any;
  userName: string;
  userId: any;
  otp: any;
  smsPermission: any;
  errormessage: string;
  tabBarElement: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public apiService: ApiServices,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public androidPermissions: AndroidPermissions,
    public ngZone: NgZone,
    public alertCtrl: AlertController,
    public loadingCreator: LoadingCreator
  ) {
    this.showStyle = "";
    this.phoneNumber = this.navParams.get("PhoneNumber");
    this.userName = this.navParams.get("Name");
    //  this.userId = this.navParams.get("UserId");
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
  }

  ionViewCanEnter() {
    return this.userId == null;
  }
  ionViewWillEnter() {
    this.tabBarElement.style.display = "none";
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = "flex";
  }

  ionViewDidEnter() {
    let loading = this.loadingCtrl.create({
      spinner: "hide"
    });

    loading.data.content = this.loadingCreator.getLoadingSymbol();
    this.apiService.SendOtp(this.userName, this.phoneNumber).subscribe(res => {
      this.userId = res.split(":")[2];
    });

    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.READ_SMS
    ]);
  }

  navigateBackToLoginView() {
    this.navCtrl.pop();
  }

  createLoding() {
    return this.loadingCtrl.create({
      spinner: "hide"
    });
  }

  onInputChange(val) {
    if (val != null) {
      if (val.length < 6) {
        this.errormessage = "";
      } else if (val.length < 6 || !/^[0-9]{1,10}$/.test(val)) {
        this.isEnabled = false;
        this.showStyle = "red";
      } else {
        this.otp = val;
        this.isEnabled = true;
        this.showStyle = "";
      }
    }
  }
  resendOtp() {
    let loading = this.loadingCtrl.create({
      spinner: "hide"
    });

    loading.data.content = this.loadingCreator.getLoadingSymbol();
    loading.present();
    this.apiService.SendOtp(this.userName, this.phoneNumber).subscribe(res => {
      loading.dismiss();
      this.userId = res.split(":")[2];
    });
  }
  loginSubmit() {
    let loading = this.loadingCtrl.create({
      spinner: "hide"
    });

    loading.data.content = this.loadingCreator.getLoadingSymbol();
    this.apiService.VerifyOTP(this.phoneNumber, this.otp).subscribe(
      res => {
        this.storage
          .set("userDetails", {
            phone: this.phoneNumber,
            loginStatus: 1,
            UserId: this.userId
          })
          .then(result => {
            this.apiService
              .UpdateUserOnlineStatus(res.User, 1)
              .subscribe(data => {
                loading.dismiss();
              });
          })
          .catch(err => console.log(err.message));
        this.navCtrl.push("TabsPage", {
          userId: this.userId,
          phone: this.phoneNumber
        });
      },
      err => {
        this.errormessage = "Please check and enter correct OTP";
      }
    );
  }
}
