import { Component } from "@angular/core";
import { NavController, IonicPage, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { ApiServices } from '../../../services/appAPIServices';
import { AppConstants } from '../../../assets/appConstants';
import { LoadingCreator } from '../../../services/loadingcreator';
@IonicPage()
@Component({
selector:'page-memories',
templateUrl:'memories.html'
})
export class MemoriesPage{
userId:number;
public enddate:any;
phoneNumber:any;
eventAlbums:any[]=[];

public shared_images:any;
public shared_images_count:any;
public  Event_album_name:any;
public shared_user_images:any[]=[];
cloudinaryMemoriesPath:string = AppConstants.CLOUDINARY_FETCH_MEMORIES_ALBUMS;
constructor(private navCtrl:NavController,private storage:Storage, 
private loading:LoadingController, private loadingCreator:LoadingCreator,
private apiService:ApiServices){
this.eventAlbums=[];
}
sortbydays(a,b){
return b.Events_date - a.Events_date;
}
ionViewWillEnter(){
this.eventAlbums=[];
let loading = this.loading.create({
spinner:'hide',

})

loading.data.content = this.loadingCreator.getLoadingSymbol();
loading.present();
this.storage.get("userDetails").then(data=>{
this.userId = data.UserId;
this.phoneNumber = data.phone;
this.apiService.GetUserSharedAlbums(this.phoneNumber)
.subscribe(Album_details=>{
loading.dismiss();

Album_details.forEach((album,indexedDB) => {
if(Object.keys((album.Shared_ImageDetails).length !== 0))
{
    
var dateString = album.Shared_ImageDetails[0].EventDate+" "+album.Shared_ImageDetails[0].EventTime;
var  dateTimeParts = dateString.split(' ');
var  timeParts = dateTimeParts[1].split(':');
var  dateParts = dateTimeParts[0].split('-');
var   event_date;
event_date = new Date(parseInt( dateParts[2]), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0]), parseInt(timeParts[0]), parseInt(timeParts[1]));
this.shared_images="";
this.shared_images_count=0;
this.shared_user_images=[];
album.Shared_ImageDetails.forEach(element => {
    this.Event_album_name="";

if(element.SharedBy==this.userId && element.AlbumCaption!='undefined' && element.AlbumCaption!='NULL'  && element.AlbumCaption!='')
this.Event_album_name=element.AlbumCaption;
if(element.SharedBy!=this.userId && element.AlbumCaption!='undefined'  && element.AlbumCaption!='NULL'  && element.AlbumCaption!='')
this.Event_album_name=element.AlbumCaption;

if(element.images!=null)
{
if (element.images.indexOf(',') > -1) { 
let count=element.images.split(",");
this.shared_images_count=parseInt( this.shared_images_count+count.length);
}
else
{    
if(element.images!="")
this.shared_images_count=this.shared_images_count+1;
}

}
if(element.SharedTo!='NULL')
{
if (element.SharedTo.indexOf(',') > -1) { 

    for(var i=0;i<element.SharedTo.split(",").length;i++)
    {
this.shared_user_images.push(element.SharedTo.split(",")[i])   
    }
 
}
else
{
    this.shared_user_images.push("xxxx")
}

}
if( this.shared_images!="")
this.shared_images=this.shared_images+element.images+","
else
{
    if(element.images!=null)
    this.shared_images=element.images+",";
}

});

if(this.shared_images!="" )
{
    var uniqueArray = function(arrArg) {
        return arrArg.filter(function(elem, pos,arr) {
          return arr.indexOf(elem) == pos;
        });
      };
     
 
    this.eventAlbums.push({
        "EventTitle":album.Shared_ImageDetails[0].EventTitle,
        "Event_Date":album.Shared_ImageDetails[0].EventDate.split("-")[0]+"  "+new Date(album.Shared_ImageDetails[0].EventDate.split("-")[1]).toLocaleString("en-us", {month: "short"})+", "+album.Shared_ImageDetails[0].EventDate.split("-")[2],
        "Events_date":event_date,
        "Event_images": this.shared_images.replace(/,\s*$/, ""),
        "Images_count": this.shared_images_count,
        "Shared_count":uniqueArray(this.shared_user_images).length,
        "Event_Id":album.Shared_ImageDetails[0].EventId,
        "Event_caption":this.Event_album_name,
        })
}
setTimeout(() => {
    this.eventAlbums.reverse();
    }, 500);   
}
});
   
})
})
}


navigateToHome(){
this.navCtrl.push('HomePage');
}
memoryView(event:any,memories:any){
this.navCtrl.push('MemoriesDetailsPage',{event:event,memories:memories});
}
navigateToEventSelection(){
this.navCtrl.push('MemoriesSelectionPage');
}
Navigation_memory_details(images:any,event_id:any,){

this.navCtrl.push('MemoriesDetailsPage',{event:event_id,memories:images});
}
navigateToMemoriesShare(memory:any){
this.navCtrl.push('MemoriesSharePage',{memory:memory});
}
}