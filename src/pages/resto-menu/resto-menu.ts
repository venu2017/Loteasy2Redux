import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,Platform, Slides } from 'ionic-angular';
import { AppConstants } from '../../assets/appConstants';


@IonicPage()
@Component({
  selector: 'page-resto-menu',
  templateUrl: 'resto-menu.html',
})
export class RestoMenuPage implements AfterViewInit {
  restoImages:string[]=[];
  @ViewChild(Slides) slides: Slides;
  cloudinaryUrl:string;
   constructor(public navCtrl: NavController, public navParams: NavParams,
              private viewCtrl:ViewController, private platform:Platform) {
               this.restoImages =Object.assign(this.navParams.get("slides"));
        if(this.navParams.get("type")=='gallery'){
          this.cloudinaryUrl = AppConstants.CLOUDINARY_FETCH_GALLERY_IMAGE_PATH;
        }else{
          this.cloudinaryUrl=AppConstants.CLOUDINARY_MENU_IMAGE_PATH;
        }
               
  }

  closeMenuModal(){
   
   this.viewCtrl.dismiss();
  }


  ngAfterViewInit() {  setTimeout(()=>{
    if(this.restoImages && this.restoImages.length > 0){
       this.slides.freeMode = true;
         this.slides.autoplay = 2000;
         this.slides.speed = 2000;
         this.slides.loop = true;
         this.slides.startAutoplay()
     }

     },1000)
   }
}
