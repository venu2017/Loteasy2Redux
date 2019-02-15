import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import {ApiServices} from '../../services/appAPIServices';


@IonicPage()
@Component({
  selector: 'page-login-one',
  templateUrl: 'login-one.html',
})
export class LoginOnePage {
  LoginTwoPage:'LoginTwoPage';
  isEnabled:boolean;
  showStyle:string = "";
  public showStyleName:any;
  PhoneNumber:any;
  userId:any;
  tabBarElement:any;
  user:any = {
    mobile:'',
    name:''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
                public apiService:ApiServices,
                public storage:Storage) {
    this.isEnabled = false;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter(){
    this.tabBarElement.style.display = 'none';
  }
  
  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }

  ionViewDidLoad() {
   
   setTimeout(() => {
     this.storage.clear().then(d=>{
     
     }).catch(err=>{
       console.log(err.message);
     })
   }, 1000);
   
    
  }

  onInputChange(user)
  
  {
    if(user.mobile.length < 10 )
    {

      this.showStyle = 'red';
    }

    else
    {

      this.showStyle = '';
    }
    if(user.name =="")
    {

      this.showStyleName='red';
    }
    else
    {
      this.showStyleName='';

    }
  
      }

      navigateToOTPView(user){
      this.navCtrl.push('LoginTwoPage',{PhoneNumber:user.mobile,Name: user.name});
             
      }
    
}
