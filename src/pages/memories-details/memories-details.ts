import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Loading } from 'ionic-angular';
import { AppConstants } from '../../assets/appConstants';
import { ApiServices } from '../../services/appAPIServices';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CloudinaryServices } from '../../services/cloudinaryServices';
import { ImagePicker } from '@ionic-native/image-picker';
import { Storage } from '@ionic/Storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LoadingCreator } from '../../services/loadingcreator';
@IonicPage()
@Component({
selector: 'page-memories-details',
templateUrl: 'memories-details.html',
})
export class MemoriesDetailsPage {
deletepopup:boolean=false;
cameraOrGalleryPopup:boolean=false;
deletePhotosCount:number =0;
eventAndMemoriesData:any;
editSaveDeleteIconsView:boolean = false;
cloudinaryMemoriesPath:string = AppConstants.CLOUDINARY_FETCH_MEMORIES_ALBUMS;
selectedPhotos:any[]=[]
eventAlbumsWithInitialCheckedStatus:any=[];
userId:any;
public EventDate:any;
public Event_caption:any;
galleryImagesSelectedArrayLength:any;
constructor(public navCtrl: NavController, public navParams: NavParams, 
public loadingCtrl:LoadingController, public ngZone:NgZone, 
public apiService:ApiServices, public socialShare:SocialSharing, 
public alertCtrl:AlertController, public imagePicker:ImagePicker, 
public camera:Camera, public cloudinaryService:CloudinaryServices, public storage:Storage,
public diagnostic:Diagnostic,public androidPermissions:AndroidPermissions, public loadingCreator:LoadingCreator) {
    this.Selected_items=[];
}
ionViewWillEnter(){
   

this.Load_Images();
}
Load_Images(){
this.eventAndMemoriesData =Object.assign([],this.navParams.data);
if(this.navParams.get("from")=="EventPage")   
{
this.Event_id=this.navParams.get("event");

}
else
{
this.Event_id=this.eventAndMemoriesData.event.Event_Id;
}
this.eventAlbumsWithInitialCheckedStatus = [];
let loading = this.loadingCtrl.create({
spinner:'hide',

})

loading.data.content = this.loadingCreator.getLoadingSymbol();
loading.present();
this.ngZone.run(()=>{
this.storage.get("userDetails").then(data=>{
this.userId = data.UserId;
})
.catch(err=>{
console.log(err.message);
}) 
if(this.navParams.get("from")!="EventPage")   
{
let Event_dates=this.eventAndMemoriesData.event.Event_Date.replace(",", " ");
this.EventDate=Event_dates.split(" ")[0]+"th  "+Event_dates.split("  ")[1]+" ,"+Event_dates.split("  ")[2];
this.Event_caption=this.eventAndMemoriesData.event.Event_caption;
if(this.eventAndMemoriesData != null && this.eventAndMemoriesData.memories != null){
if(this.eventAndMemoriesData.memories.split(',').length>0){
let albumPhotos:any=Object.assign([],this.eventAndMemoriesData.memories.split(','));
albumPhotos.forEach((ph,ind,albumArr) =>{
this.eventAlbumsWithInitialCheckedStatus.push({photo:ph,isChecked:false})
})
}
}
}
if(this.navParams.get("from")=="EventPage")   
{
   
this.Event_id=this.navParams.get("event");
this.Event_caption=this.navParams.get("Event_title")
this.EventDate= this.navParams.get("Event_date").split("-")[0]+"th  "+new Date(this.navParams.get("Event_date").split("-")[1]).toLocaleString("en-us", {month: "short"})  +" ,"+this.navParams.get("Event_date").split("-")[2];
//console.log(JSON.stringify( this.eventAndMemoriesData.memories)+"this.eventAndMemoriesData.memories")
if(this.eventAndMemoriesData.memories.length>0){
this.eventAndMemoriesData.memories.forEach((ph,ind) =>{
console.log(ph.img+"this.eventAndMemoriesData.memories")
this.eventAlbumsWithInitialCheckedStatus.push({photo:ph.img,isChecked:false})
})
}
}
})
loading.dismiss();
}
navigateBackToMemories(){
this.navCtrl.pop();
}
cancelEventDialog(){
this.navCtrl.pop();
}
public album_id:any;
public Event_id:any;
showEditSaveDeleteIcons(){
 //this.Selected_items=[];   
this.editSaveDeleteIconsView = true;
this.eventAlbumsWithInitialCheckedStatus = [];
if(this.navParams.get("from")=="EventPage")   
{
this.Event_id=this.navParams.get("event");
}
else
{
this.Event_id=this.eventAndMemoriesData.event.Event_Id;
}

this.apiService.GetSharedAlbums(this.userId,this.Event_id).subscribe((Album_images=>{
//this.eventAlbumsWithInitialCheckedStatus.push({photo:ph,isChecked:false})
Album_images.AlbumImages.forEach(element => {

this.album_id=element.AlbumId;
let albumPhotos:any=Object.assign([],element.Images.split(','));
albumPhotos.forEach((ph,ind,albumArr) =>{
this.eventAlbumsWithInitialCheckedStatus.push({photo:ph,isChecked:false})
})
});
}))

//this.Reload();
}
onPhotoSelection(){
}
showDeletePhotosPrompt(){
this.deletePhotosCount=0;
this.eventAlbumsWithInitialCheckedStatus.forEach(photo=>{
if(photo.isChecked==true){
this.deletePhotosCount += 1;
}
})
setTimeout(() => {
this.ngZone.run(()=>{
if(this.Selected_items.length > 0){
this.deletepopup=true;
}else{
let alert = this.alertCtrl.create({
subTitle:'Please select atleast 1 image to delete',
buttons:[
{
text:'OK',
role:'cancel',
handler:()=>{
console.log('alert dismissed');
}
}
]
})
alert.present();
}
})
}, 500);
}
deleteSelectedPhotos(){
this.deletepopup=false;
let loading = this.loadingCtrl.create({
spinner:'hide',

})
loading.data.content = this.loadingCreator.getLoadingSymbol();
loading.present();
let unSelectedPhotos:any[]=[];
this.eventAlbumsWithInitialCheckedStatus.forEach((photo,index,self)=>{
if(photo.isChecked==false){
unSelectedPhotos.push(photo);
}
})
setTimeout(() => {
this.eventAlbumsWithInitialCheckedStatus = [];
//let eventId = this.eventAndMemoriesData.event.Event_Id;
let  albumId= this.album_id;
let imagesToBeUpdated:any[]=[];
unSelectedPhotos.forEach(photo=>{
imagesToBeUpdated.push(photo.photo);
})
this.apiService.UpdateEventAlbumsSharedToUserByPhoneNumber(this.album_id,this.Event_id,imagesToBeUpdated.toString())
.subscribe(data=>{
this.eventAlbumsWithInitialCheckedStatus =Object.assign([],unSelectedPhotos);
loading.dismiss();
this.delete_Set=true;
})
}, 2000);
}
sharePhotosThruSocialMedia(){
let selectedPhotos:any[]=[];
if(this.Selected_items.length < 1){
let alert = this.alertCtrl.create({
subTitle:'Please select atleast 1 image to share',
buttons:[
{
text:'OK',
role:'cancel',
handler:()=>{
console.log('alert dismissed');
}
}
]
})
alert.present();
return;
}
else
{
let loading = this.loadingCtrl.create({
spinner:'hide',

})
loading.data.content = this.loadingCreator.getLoadingSymbol();
loading.present();
this.eventAlbumsWithInitialCheckedStatus.forEach(photo=>{
if(photo.isChecked == true){
selectedPhotos.push(this.cloudinaryMemoriesPath+photo.photo);
}
})
setTimeout(() => {
this.socialShare.share("Photos sharing thru Loteasy App","",selectedPhotos).then(()=>{
console.log("Images shared successfully");
loading.dismiss();
})
.catch(err=>{
console.log(err.message);
loading.dismiss();
})
}, 3000);
}
}
showCameraGaleeryOption(){
this.cameraOrGalleryPopup = true;
}
captureImageFromCamera(eventId:number){
setTimeout(() => {
loading.dismiss();
}, 8000); 
this.cameraOrGalleryPopup = false;
let loading = this.loadingCtrl.create({
spinner:'hide',

})
loading.data.content = this.loadingCreator.getLoadingSymbol();
loading.present();
const options: CameraOptions = {
quality: 50,
destinationType: this.camera.DestinationType.DATA_URL,
encodingType: this.camera.EncodingType.JPEG,
mediaType: this.camera.MediaType.PICTURE
}
this.camera.getPicture(options).then((imageData) => {
let base64Image = 'data:image/jpeg;base64,' + imageData;
this.cloudinaryService.uploadPhoto(base64Image,'memories')
.subscribe(data=>{
let imageUploaded = data.secure_url;
loading.dismiss();
this.navCtrl.push('MemoriesUploadPage',{from:'memories-details-camera',imageUploaded:imageUploaded, userId:this.userId,eventId:this.Event_id,EventDate:this.eventAndMemoriesData.event.Event_Date,EventTitle:this.eventAndMemoriesData.event.EventTitle});
})
}, (err) => {
console.log(err.message);
loading.dismiss();
});
}

async requestPermissionForExternalStorage():Promise<any>{
   
    let permission = this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
   return await new Promise((resolve,reject)=>{
       setTimeout(() => {
           resolve(permission);
       }, 2000);
   })
    
}
async captureImagesFromGallery():Promise<any>{
    let gallPerm = await this.diagnostic.isExternalStorageAuthorized();
    console.log(gallPerm);
    let imagesPicked = [];
// let galleryPermission = await this.requestPermissionForExternalStorage();
// console.log(galleryPermission);
let loading = this.loadingCtrl.create({
    spinner:'hide',
    
    })
    loading.data.content = this.loadingCreator.getLoadingSymbol();
    if(gallPerm){
        this.cameraOrGalleryPopup = false;
       
        let options = {
            maximumImagesCount:5,
            quality:50,
            outputType:1,
            width:512,
            height:512
        }
       
        loading.present().then(()=>{
        this.imagePicker.getPictures(options).then(results=>{
        this.galleryImagesSelectedArrayLength = results.length;
        results.forEach(res=>{
        this.cloudinaryService.uploadPhoto("data:image/jpeg;base64,"+res,'memories')
        .subscribe(data=>{
        imagesPicked.push(data.secure_url);
              
        })
        
        })
        
        return imagesPicked;
        
        
        }).then(images=>{
            console.log(images);
            loading.dismiss();

            console.log(this.Event_id+"eventuifd")
            this.navCtrl.push('MemoriesUploadPage',{from:'memories-details-gallery',imageUploaded:images, 
            userId:this.userId,eventId:this.Event_id,EventDate:this.eventAndMemoriesData.event.Event_Date,
            EventTitle:this.eventAndMemoriesData.event.EventTitle}); 
        })
        loading.dismiss();
        }).catch(err=>{
        console.log(err.message);
        loading.dismiss();
        })
       
}else{
    alert('access to gallery denied');
}

}

//    navigateToUpload(){
//       let loading = this.loadingCtrl.create({
//           spinner:'',
//           content:'Loading please wait...'
//       })
//       loading.present();
//         this.captureImagesFromGallery()
//             .then(images=>{
//                 setTimeout(async () => {
//                   await 
//                     loading.dismiss() ;
//                 }, 2000);
//             })  
                  
//         }

navigateToPhotoSlider(){
if(this.editSaveDeleteIconsView==true)return;
if(this.navParams.get("from")=="EventPage") 
this.navCtrl.push('MemoriesSliderPage',{data:this.eventAlbumsWithInitialCheckedStatus,from:'EventMemories',Event_date:this.EventDate,Event_caption:this.Event_caption, eventId:this.Event_id});
else
this.navCtrl.push('MemoriesSliderPage',{data:this.eventAndMemoriesData.memories,Event_date:this.EventDate,Event_caption:this.Event_caption,eventId:this.Event_id});
}
public Selected_items:any[]=[];
Reload(){

this.Selected_items.forEach(element => {
let index =  this.eventAlbumsWithInitialCheckedStatus.findIndex(x => x.photo==element);
this.eventAlbumsWithInitialCheckedStatus.splice(index, 1);
});
}
public delete_Set:boolean=false;
async showSharedImages(){
 await   this.eventAlbumsWithInitialCheckedStatus.forEach((element,index) => {

        if(this.eventAlbumsWithInitialCheckedStatus[index].isChecked)
        {
            console.log("checked")
            let index=this.Selected_items.findIndex(x=>x==element.photo)
        
            if(index>-1){
                console.log("removedchecked")
                this.Selected_items.splice(index,1)
            }
        }
      
  });
      
//this.Selected_items=[];
this.eventAlbumsWithInitialCheckedStatus=[];
this.editSaveDeleteIconsView=false;
if(this.navParams.get("from")!="EventPage")   
{
if(this.eventAndMemoriesData.memories.split(',').length>0){
let albumPhotos:any=Object.assign([],this.eventAndMemoriesData.memories.split(','));
albumPhotos.forEach((ph,ind,albumArr) =>{
this.eventAlbumsWithInitialCheckedStatus.push({photo:ph,isChecked:false})
})
}
if(this.delete_Set)
this.Reload();
}
if(this.navParams.get("from")=="EventPage")  { 
if(this.eventAndMemoriesData.memories.length>0){
this.eventAndMemoriesData.memories.forEach((ph,ind) =>{
this.eventAlbumsWithInitialCheckedStatus.push({photo:ph.img,isChecked:false})
})
}
if(this.delete_Set)
this.Reload();
}
//this.Selected_items=[];
}
selectimgfordelettion(photo):void{
let index =  this.eventAlbumsWithInitialCheckedStatus.findIndex(x => x.photo==photo);
let dbindex =  this.Selected_items.findIndex(x => x==photo);
if(this.eventAlbumsWithInitialCheckedStatus[index].isChecked)
{
this.Selected_items.push(photo);
}
else
{
this.Selected_items.splice(dbindex, 1);
}
}
selectimg(photo){
let index =  this.eventAlbumsWithInitialCheckedStatus.findIndex(x => x.photo==photo);
if(this.eventAlbumsWithInitialCheckedStatus[index].isChecked)
{
this.eventAlbumsWithInitialCheckedStatus[index].isChecked=false;
this.Selected_items.splice(index, 1);
}
else
{
this.eventAlbumsWithInitialCheckedStatus[index].isChecked=true;
this.Selected_items.push(photo);
}
}
}