import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { Storage } from '@ionic/Storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CloudinaryServices } from '../../services/cloudinaryServices';
import { ImagePicker } from '@ionic-native/image-picker';
import { DatePipe } from '@angular/common';
import { LoadingCreator } from '../../services/loadingcreator'
@IonicPage()
@Component({
selector: 'page-memories-selection',
templateUrl: 'memories-selection.html',
})
export class MemoriesSelectionPage{
public eventId: any;
public  listOfEvenets:any[]=[];
public eventsCreated:any[]=[];
public  showCameraOrGallery:boolean=false;
public  phoneNumber:any;
public  userId:any;
public query:any;
public enddate:any;
public Event_complete_date:any;
constructor(public navCtrl: NavController, public navParams: NavParams, 
public apiService:ApiServices, public storage:Storage, public ngZone:NgZone,
public loadingCtrl:LoadingController, public camera:Camera, public datepipe: DatePipe,
public cloudinaryService:CloudinaryServices, public imgPicker:ImagePicker, public loadingCreator:LoadingCreator) {
    this.listOfEvenets=[];
    this.query="";
}

navigateToHome(){
 
this.navCtrl.pop();
        
}
ionViewWillEnter(){
this.listOfEvenets=[];
this.query="";
let loading = this.loadingCtrl.create({
spinner:'hide',

})
loading.data.content = this.loadingCreator.getLoadingSymbol();
loading.present();
this.storage.get("userDetails").then(data=>{
this.phoneNumber = data.phone;
this.userId = data.UserId;
console.log(this.phoneNumber);
this.apiService.GetTotalEventsCreatedByUser(data.phone).subscribe(Events_list=>{
loading.dismiss();
this.eventsCreated=Object.assign([],Events_list);//copy of object to array
for(var i=0;i<this.eventsCreated.length;i++){
var objDate = new Date(this.eventsCreated[i].Event[0].EventDate.split("-").reverse().join("-"));
var startDate = Date.parse(objDate.toDateString());

this.Event_complete_date=new Date(this.datepipe.transform(startDate , 'MM/dd/yyyy')+" "+ this.eventsCreated[i].Event[0].EventTime)
this.enddate = new Date();

var timeDiff =  startDate-this.enddate;
var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))+1;
if(daysDiff<=0 && this.eventsCreated[i].Event[0].EventStatusId==1 && this.Event_complete_date<this.enddate){
var dateString = this.eventsCreated[i].Event[0].EventDate+" "+this.eventsCreated[i].Event[0].EventTime;
var  dateTimeParts = dateString.split(' ');
var  timeParts = dateTimeParts[1].split(':');
var  dateParts = dateTimeParts[0].split('-');
var   event_date;
event_date = new Date(parseInt( dateParts[2]), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0]), parseInt(timeParts[0]), parseInt(timeParts[1]));
this.listOfEvenets.push({
"Event_time":this.eventsCreated[i].Event[0].EventTime,
"Event_date":this.eventsCreated[i].Event[0].EventDate.split("-")[0]+"  "+new Date(this.eventsCreated[i].Event[0].EventDate.split("-")[1]).toLocaleString("en-us", {month: "short"})+", "+this.eventsCreated[i].Event[0].EventDate.split("-")[2],
"RestName":this.eventsCreated[i].Event[0].Name,
"Event_Title":this.eventsCreated[i].Event[0].EventTitle,
"Events_date":event_date,
"Eventid":this.eventsCreated[i].Event[0].EventId,
})
}
}
setTimeout(() => {
this.listOfEvenets.sort(this.sortbydays).join(',');
}, 500);
})
})
.catch(err=>{
console.log(err.message);
})
}
sortbydays(a,b){
return b.Events_date - a.Events_date;
}
public Event_date:any;
public Event_title:any;
showCameraGalleryPopup(eventId,event_date,event_title){
this.showCameraOrGallery = true;
this.eventId = eventId;
this.Event_date=event_date;
this.Event_title=event_title;
}
cancelEventDialog(){
this.navCtrl.pop();
}
closeCameraOrGalleryPopup(){
this.showCameraOrGallery = false;
}
openCamera(eventId:number){
console.log('camera chosen');
this.showCameraOrGallery = false;
this.captureImageFromCamera(this.eventId);
}
captureImageFromCamera(eventId:number):void{
let loading = this.loadingCtrl.create({
spinner:'hide',

})

loading.data.content = this.loadingCreator .getLoadingSymbol();
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
console.log(data);
let imageUploaded = data.secure_url;
loading.dismiss();
this.navCtrl.push('MemoriesUploadPage',{imageUploaded:imageUploaded, userId:this.userId,eventId:this.eventId,from:'memoryselection-camera',EventDate:this.Event_date,EventTitle:this.Event_title});
})
}, (err) => {
console.log(err.message);
loading.dismiss();
});
}
openGallery(){
console.log('gallery chosen');
this.showCameraOrGallery = false;
let imagesPicked = [];
let options = {
maximumImagesCount:10,
quality:50,
outputType:1,
width:512,
height:512
}
let loading = this.loadingCtrl.create({
spinner:'hide',

})

loading.data.content = this.loadingCreator .getLoadingSymbol();
loading.present()
this.imgPicker.getPictures(options).then(results=>{
console.log(results);
results.forEach(res=>{
this.cloudinaryService.uploadPhoto("data:image/jpeg;base64,"+res,'memories')
.subscribe(data=>{
console.log(data);
imagesPicked.push(data.secure_url);
})

})
setTimeout(() => {
    loading.dismiss();
    this.navCtrl.push('MemoriesUploadPage',{imageUploaded:imagesPicked, userId:this.userId,eventId:this.eventId,from:'memoryselection-Gallery',EventDate:this.Event_date,EventTitle:this.Event_title});
    }, 4000);
}).catch(err=>{
console.log(err.message);
loading.dismiss();
})
}


}