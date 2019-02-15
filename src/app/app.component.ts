import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/Storage';
import { AndroidPermissions} from '@ionic-native/android-permissions';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html',
  
})
export class MyApp {
 rootPage:any;
 constructor(private platform: Platform,  
              private splashScreen: SplashScreen,
              private storage:Storage,
               private androidPermissions:AndroidPermissions,
               private keyboard:Keyboard
              ) {
    
    this.platform.ready().then(() => {

      this.hideSplashScreen();
    
      this.storage.get("userDetails").then((data:any)=>{
        console.log(data);
        if(data ==null || data == undefined){
          this.rootPage = 'LoginOnePage';

        }else{
          this.rootPage = 'TabsPage';
        }

      }).catch((err)=>{
        console.log(err.message);
      })
 
      this.keyboard.onKeyboardShow().subscribe(()=>{
        document.body.classList.add('keyboard-is-open');
      })
              
      this.keyboard.onKeyboardHide().subscribe(() => {
        document.body.classList.remove('keyboard-is-open');
    });
    this.androidPermissions.requestPermissions(
      [
        androidPermissions.PERMISSION.CAMERA, 
        androidPermissions.PERMISSION.CALL_PHONE, 
        androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
        androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS,
        androidPermissions.PERMISSION.ACCESS_NETWORK_STATE,
        androidPermissions.PERMISSION.READ_CONTACTS,
        androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE

      ])

     
    });

   
     
  }

  hideSplashScreen(){
    if(this.splashScreen){
     setTimeout(() => {
      this.splashScreen.hide();
     }, 0);
           
    }
  }

  
 }



