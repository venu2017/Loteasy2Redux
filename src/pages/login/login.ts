import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import {ApiServices} from '../../services/appAPIServices';
declare var SMS:any;


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  formData:any;
  isEnabled:boolean;
  placeholder:string;
  _showOtpView:boolean;
  _btnText:string="Login";
  val:any="";
  _phoneNumber:any;
  _Otp:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl:LoadingController, public androidPermissions:AndroidPermissions,
              public platform:Platform, public apiService:ApiServices) {
    this.isEnabled = false;
    this.placeholder="Phone number";
    this._showOtpView = false;
    
  }

  ionViewWillEnter(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
      success => console.log('Permission granted'),
    err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
    );
    
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }

  ionViewDidEnter(){
   
      
  }

  showOTPView(val:any){
    let loading = this.loadingCtrl.create({
      spinner:'circles'
    })
    loading.present();
    
      this._phoneNumber = val;
      this.apiService.SendOtp("","91"+this._phoneNumber).subscribe((otpSentMessage:any) =>{
       
      });
      // console.log(this._phoneNumber);
     this.val = "";
     this._btnText = "Submit";
     this.placeholder = "Please enter the OTP";
     this._showOtpView=true;
     this.isEnabled = true;
     
     
         
  }

  onInputChange(val:any){
    if(this.placeholder=='Phone number' && val.length >=10){
      this.isEnabled = true;
      
      
    }else if(this.placeholder=='Please enter the OTP' && val.length >= 6){
      this.isEnabled = true;
    
    }else{
      this.isEnabled=false;
    }
  }
  onSubmit(val:any){
    this._Otp=val;
    // console.log(this._phoneNumber,this._Otp);
   
    
    
    this.navCtrl.push('TabsPage',{loginData:{phone:this._phoneNumber,otp:this._Otp}});
  }

  resendOtp(){

  }
}
