import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingCreator } from '../../services/loadingcreator'

@IonicPage()
@Component({
  selector: 'page-memories-upload',
  templateUrl: 'memories-upload.html',
})
export class MemoriesUploadPage {
  userId:number;
  eventId:number;
  public memory_caption:any;
  public Event_date:any;
  public Event_title:any;
  public memory_state:any;
  imagesToUpload:Array<any>=[];
  imageCountArray:Array<any>=[];
  @ViewChild('memoriesCaption') caption:ElementRef;
   constructor(public navCtrl: NavController, public navParams: NavParams, 
            public apiService:ApiServices, public loadingCtrl:LoadingController,
            public ngZone:NgZone, public sanitizer:DomSanitizer, public loadingCreator:LoadingCreator) {
  

    this.apiService.GetAlbumoption(this.navParams.get("eventId")).subscribe(Event_details=>{

      if(Event_details.Album_details=='NoDetails' )
      {

      this.memory_state=true;

      }
      else
      {
      this.memory_state=false;
      }
    
      
      
    })
    if(this.navParams.get("from")=='memoryselection-camera'){
      this.imagesToUpload.push(this.navParams.get("imageUploaded"));
    }
    if(this.navParams.get("from")=='memoryselection-Gallery')
   {
   
    this.imagesToUpload =this.navParams.get("imageUploaded");
    console.log(this.imagesToUpload);
   }
   if(this.navParams.get("from")=='memories-details-gallery'){

    this.imagesToUpload =this.navParams.get("imageUploaded");
    console.log(this.imagesToUpload);
    
   }
   if(this.navParams.get("from")=='memories-details-camera'){
    this.imagesToUpload.push(this.navParams.get("imageUploaded"));
  }
   
  
   this.userId = this.navParams.get("userId");
    this.eventId = this.navParams.get("eventId");
    this.Event_date=this.navParams.get("EventDate");
    this.Event_title=this.navParams.get("EventTitle")
  }

  sanitizeImageSecureUrl(imgUrl:string){
 return  this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + imgUrl);
  //  return this.sanitizer.bypassSecurityTrustHtml(imgUrl);
  //  return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  navigateToSelection(){
    this.navCtrl.pop();
  }
  
  ionViewWillEnter(){
    setTimeout(() => {
      this.ngZone.run(()=>{
        this.imageCountArray = Object.assign([],this.imagesToUpload);
      })
    }, 1000);
   
  }

  navigateToMemories(){
   // let caption = this.caption.nativeElement.value;
   let caption=this.memory_caption;
    let loading = this.loadingCtrl.create({
      spinner:'hide',
      
    })

    loading.data.content = this.loadingCreator.getLoadingSymbol();

    loading.present();
    let imageUploadPathsToDb = [];
    this.imagesToUpload.forEach(img=>{
      imageUploadPathsToDb.push(img.split('/')[9]);
    })
      console .log(this.memory_caption);
      loading.dismiss();
    this.apiService.MemoryImageUpload(this.userId,this.eventId,imageUploadPathsToDb.toString(), this.memory_caption)
    .subscribe(data=>{
      console.log(data);
     setTimeout(() => {
      this.navCtrl.push('MemoriesPage', {from:'memories-upload'});
     }, 300);
      
     //this.navCtrl.push(MemoriesDetailsPage)
    })
    
  }

}
