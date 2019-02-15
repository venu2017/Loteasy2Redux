import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController,ToastController } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { Storage } from '@ionic/Storage';
import { LoadingCreator } from '../../services/loadingcreator';
@IonicPage()
@Component({
selector: 'page-my-preferences',
templateUrl: 'my-preferences.html',
})
export class MyPreferencesPage {
  tabBarElement: any;
priceValue:any;
checkedFoodType:string="";
amenities:Array<any>=[];
recommended:boolean;
foodChoices:Array<any>=[];
userId:any;
checkedAmenities:Array<any>=[];
checkedChoices:Array<any>=[];
savedPriceValue:any;
savedFoodType:any;
savedAmenities:Array<any>=[];
savedFoodChoices:Array<any>=[];
savedRecommended:any;
_foodChoices:Array<any>=[];
_amenities:Array<any>=[];
public Food_selection:any[]=[];
public minvalue:any;
public maxvalue:any; 
constructor(public navCtrl: NavController, public navParams: NavParams,  public storage:Storage,
public _ngZone:NgZone, public apiService:ApiServices, private toast:ToastController,
public loadingCtrl:LoadingController, public alertCtrl:AlertController, public loadingCreator:LoadingCreator) {
  this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  this.minvalue=0;
  this.maxvalue=2000;
this.userId = this.navParams.get("UserId");
this.amenities = [{val:"Smoking",isChecked:false},{val:"Vallet Parking",isChecked:false},{val:"WiFi",isChecked:false},{val:"Air Conditioned",isChecked:false},{val:"Disabled Friendly",isChecked:false}];
this.recommended = false;
this.foodChoices = [{val:"Organic",isChecked:false},{val:"Barbeque",isChecked:false},{val:"Diabetic Choices",isChecked:false}];
this.priceValue = 0;
this.checkedAmenities = new Array(this.amenities.length);
this.checkedChoices = new Array(this.foodChoices.length);
}
ionViewWillEnter(){
  this.tabBarElement.style.display = 'none';
}

ionViewWillLeave(){
  this.tabBarElement.style.display = 'flex';
}
ionViewDidEnter(){
this.apiService.fetchUserPreferencesById(this.userId)
.subscribe(data=>{

if(data){
this.savedAmenities =JSON.parse(data.Amenities);
this.savedFoodType = data.Food;
this.priceValue = data.CostForTwo;
this.savedRecommended = data.FriendsRecommended;
this.savedFoodChoices =JSON.parse(data.FoodChoices);
this.savedAmenities.forEach(am =>{
this._amenities.push(am.val);
})
this.savedFoodChoices.forEach(fc =>{
this._foodChoices.push(fc.val);
})
}
})
}
onPreferenceSelectionChanged(val:string, isChecked: boolean) {
if(isChecked) {
this.savedFoodType=val;
} 
}
onFriendRecommed(val,isChecked){
if(isChecked){
this.savedRecommended=1;
}
else
this.savedRecommended=0;
}
backToMoreHomePage(){
this.navCtrl.pop();
}
public amenties_array:any[]=[];
public amenties_selected:any[]=[];
public food_array:any[]=[];
public food_selected:any[]=[];
SaveOrUpdateUserPreferences(){
this.amenties_selected = [];
this.food_selected=[];
let loading = this.loadingCtrl.create({
spinner:'hide'
})
loading.data.content = this.loadingCreator.getLoadingSymbol();
loading.present();
let alert = this.alertCtrl.create({
message: 'Your preferences have been successfully saved',
buttons: [
{
text: 'OK',
role: 'cancel',
handler: () => {
this.navCtrl.pop();
}
}]
})
this._ngZone.run(()=>{
let foodChoices = [];
let recommended:number;
for(let i=0;i<this.checkedAmenities.length;i++){
this.storage.get("MyPerefernces").then(records=>{
this.amenties_array=records.amenties;
this.amenties_array.forEach(element => {
if(element.val==this.amenities[i].val && this.checkedAmenities[i]==undefined)
{
this.amenties_selected.push({val:this.amenities[i].val,isChecked:true});
}
})
});
if(this.checkedAmenities[i]==true){
this.amenties_selected.push({val:this.amenities[i].val,isChecked:true});
}
}
for(let j=0;j<this.checkedChoices.length;j++){
this.storage.get("MyPerefernces").then(records=>{
this.food_array=records.food;
this.food_array.forEach(element => {
if(element.val==this.foodChoices[j].val && this.checkedChoices[j]==undefined)
{
this.food_selected.push({val:this.foodChoices[j].val,isChecked:true});
}
})
})
if(this.checkedChoices[j]==true){
this.food_selected.push({val:this.foodChoices[j].val,isChecked:true});
}
}
if(this.savedRecommended!=null)
this.savedRecommended=this.savedRecommended;
else
this.savedRecommended=0;
setTimeout(() => {
//if preferences is not empty
if(this.amenties_selected.length>0 || this.food_selected.length>0 || this.savedFoodType != 'undefined' || this.priceValue!=0 )
{

this.apiService.SaveOrUpdateUserPreferences(this.userId,this.savedFoodType,JSON.stringify(this.amenties_selected), this.savedRecommended,JSON.stringify(this.food_selected),this.priceValue)
.subscribe(data=>{
loading.dismiss();
alert.present();
this.storage.set("MyPerefernces",{amenties:this.amenties_selected,food:this.food_selected
})
.then(()=>{
}).catch(err=>{
console.log(err.message);
this.amenties_selected=[];
this.food_selected=[];
this.Food_selection=[];
})
})
}
//prefernces cannot be set empty
else
{
loading.dismiss();
this.toast.create({
message:"Preferences cannot be set empty",
duration:1000
}).present();
}
}, 1000);   
//for making loading off
setTimeout(() => {
loading.dismiss();
}, 10000);
})
}
}