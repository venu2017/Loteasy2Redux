import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import {TreeNode} from 'primeng/api';
import {Http } from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/Storage';
import { AppConstants } from '../../assets/appConstants';
import { LoadingCreator } from '../../services/loadingcreator';
@IonicPage()
@Component({
selector: 'page-pick-items',
templateUrl: 'pick-items.html',
})
export class PickItemsPage {
tabBarElement: any;
menuItemsOfVendor: any;
menuItems:any[]=[];;
scrId:any;
selectedItem:TreeNode;
showCard:any;
selectedItems:any[]=[];
subTotal:number=0;
public Rest_minorder:any=0;
numberOfItemsSelected:number=0;
public loading:any;
public orderjson:any[]=[];
public Vendor_items:any[]=[];
public User_order:any[]=[];
public convenience_charge:any;
public screen:any;
public toppings:any[]=[];
public crusts:any[]=[];
public vendor_item_id_array :any[]=[];
public toppings_array :any[]=[];
public crusting_array :any[]=[];
public discount_text:any;
public items_discount:any;
public selected_items_qty:any=0;
public json_dataforsplit:any;
public Rest_seatno:any;
public isCollapsed = false;
public Rest_rowno:any;
constructor(public navCtrl: NavController, public navParams: NavParams,
  public loadingCtrl:LoadingController,public storage:Storage,public loadingCreator:LoadingCreator,
public http:Http, public ngZone:NgZone) {
this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

}
ionViewWillLeave(){
this.tabBarElement.style.display = 'flex';
}
//get rest min order 
async GetMinorderforRest(scrId):Promise<any>
{
return await this.http.get(AppConstants.omsservices+'getlocationscreen?screen_ids='+scrId).toPromise();
}
async ionViewWillEnter(){

  this.selected_items_qty=0;
  this.subTotal=0;
  this.orderjson=[];
  this.Rest_seatno= this.navParams.get('seatno');
  this.Rest_rowno =this.navParams.get('Rowno');


  
let navigatedFrom:string =  this.navParams.get("EditType");
await  this.Rest_menuitems();
//for edit order
if(navigatedFrom =='EditOrder'){
this.ngZone.run(()=>{

this.storage.get("orderjson").then(User_selected_items=>{
this.selected_items_qty=User_selected_items.TotalQty;
this.subTotal=User_selected_items.Total_items;

this.orderjson=User_selected_items.orderselected_items;
//console.log(JSON.stringify(User_selected_items.orderselected_items)+"data")
//console.log(JSON.stringify(this.menuItems)+"innerItem");

// User_selected_items.orderselected_items.forEach(element => {

//   let index=this.menuItems.findIndex(items=>items.children.children.ItemID==element.itemid);

//   console.log(index+"index")
// // if(innerItem.data.vendor_items_id==element.itemid){
// // innerItem.data.orderQty=element.quantity
// // }
// });
this.menuItems.forEach(item=>{
item.children.forEach(child=>{
child.children.forEach(innerItem=>{

User_selected_items.orderselected_items.forEach(element => {

  
if(innerItem.data.vendor_items_id==element.itemid){
innerItem.data.orderQty=element.quantity
}

else
{
  if(innerItem.data.orderQty==0){
    innerItem.data.orderQty=0;
  }
}
});
})
})
})
})
})
}
// else if(navigatedFrom=='CancelOrder'){
// this.selected_items_qty=0;
// this.subTotal=0;
// this.orderjson=[];
// }
else
{

}
//jsoncallback is used in function
}
//for Restuarnts menu items
async Rest_menuitems(){
this.loading = this.loadingCtrl.create({
spinner:'hide'
})
this.loading.data.content = this.loadingCreator.getLoadingSymbol();
this.loading.present();
this.tabBarElement.style.display = 'none';
let  jsonCallback =async (data)=>{
this.menuItemsOfVendor = data[0].item;   
//  console.log(this.menuItemsOfVendor);
let primeNgTree =await this.arrangeItemsToAlignPrimeNgTree(this.menuItemsOfVendor);
this.loading.dismiss();
this.menuItems=primeNgTree;
this.menuItems.forEach(item=>{
item.children.forEach(child=>{
child.children.forEach(innerItem=>{
innerItem.data.orderQty =0;
innerItem.itemWiseTotal = 0;
})
})
})
}
this.scrId =await this.navParams.get('scrId');
let menuItemsResponse = await  this.getMenuItemsByScreenId(this.scrId);
eval(menuItemsResponse._body);
}
async ionViewDidEnter(){
setTimeout(() => {
this.loading.dismiss();
}, 10000);
this.showCard = 0;
let  jsonCallbackforscreen =async (data)=>{
this.Rest_minorder=data.min_order;
this.convenience_charge=data.convenience_charges;
this.screen=data.screen;
}
let min_order = await this.GetMinorderforRest(this.scrId);
eval(min_order._body);
}
onTreeNodeSelect(event:any){
// console.log(event);
}
async arrangeItemsToAlignPrimeNgTree(menuItems):Promise<any>
{
// this.orderjson=[];
let data = [];
let initialItems = menuItems.T1;
initialItems.forEach(item=>{
//console.log(item.name,item.T2);
let levelOneTemplate:any ={};
levelOneTemplate.label = item.name;
levelOneTemplate.expandedIcon = 'fa-folder-open';
levelOneTemplate.collapsedIcon = 'fa-folder';
levelOneTemplate.children = [];
data.push(levelOneTemplate);
item.T2.forEach(t2 => {
let levelTwoTemplate:any = {};
// console.log(t2.name, t2.leaf);
levelTwoTemplate.label = t2.name;
levelTwoTemplate.expandedIcon = 'fa-folder-open';
levelTwoTemplate.collapsedIcon = 'fa-folder';
levelTwoTemplate.children = [];
levelOneTemplate.children.push(levelTwoTemplate);
t2.leaf.forEach(leafItems=>{
//console.log(leafItems);
let levelThreeTemplate:any = {};
levelThreeTemplate.label = leafItems.name;
levelThreeTemplate.CostPrice = leafItems.cost;
levelThreeTemplate.Sellingprice = leafItems.selling_price;
levelThreeTemplate.ispercent = leafItems.is_percent;
levelThreeTemplate.Discount=leafItems.discount;
levelThreeTemplate.vegterian = leafItems.is_non_vegetarian;
if(leafItems.has_topping=="1" || leafItems.has_crust=="1")
levelThreeTemplate.Additions = "Avaliable";
else
levelThreeTemplate.Additions = "NotAvaliable";
if(leafItems.description=="" )
levelThreeTemplate.ItemDescription ='NULL';
else
levelThreeTemplate.ItemDescription = leafItems.description;
levelThreeTemplate.ItemID = leafItems.id;
//   if(t2.is_percent==0)
levelThreeTemplate.data = leafItems;
levelTwoTemplate.children.push(levelThreeTemplate);
})
})
})
//https://stackoverflow.com/questions/35598765/inr-currency-format
return await new Promise((resolve,reject)=>{
resolve(data);
reject(new Error('error occured while processing request'));
})
}
ionViewDidLoad() {
// console.log('ionViewDidLoad PickItemsPage');
}
async getMenuItemsByScreenId(scrId):Promise<any>
{
return await this.http.get(AppConstants.omsservices+'fromscratchmodified?screen_ids=' + scrId).toPromise();
}
navigateToOrderFood(){
this.navCtrl.push('OrderFoodPage');
}
showItemsCard(index:any)
{
setTimeout(() => {
this.showCard = index;
}, 1000);
}
async plusItem(item,itemqty){
this.items_discount="";
this.discount_text="";
this.Vendor_items=[];
this.selected_items_qty++;
let index = this.orderjson.findIndex(items=>items.itemid==item.ItemID);
if(index>-1)
{
this.orderjson[index].quantity=itemqty+1;
for(var i=0;i< this.orderjson[index].quantity;i++)
{
this.Vendor_items.push(item.ItemID)
}
this.orderjson[index].vendor_itms_arr=this.Vendor_items;
}
else
{
this.Vendor_items.push(item.ItemID);
if (item.ispercent == 0) {
this.discount_text = '  Rs off';
} else if (item.ispercent == 1) {
this.discount_text = '   percent off';
}
if (item.Discount > 0) {
this.items_discount = parseFloat( item.Discount).toFixed(2)  + this.discount_text;
}
else {
this.items_discount =parseFloat( item.Discount).toFixed(2)
}
await  this.orderjson.push({
itemid : item.ItemID,
name : item.label,
image : "images/icon_logo.png",
quantity :  1,
price : parseFloat( item.CostPrice).toFixed(2),
screen : this.screen,
additions : "0",
strikeprice_cutoff : parseFloat( item.Sellingprice).toFixed(2),
discount_div :this.items_discount,
item_description : "",
toppings:this.toppings,
crusts:this.crusts,
toppings_array:this.toppings_array,
crusts_array:this.crusting_array,
vendor_itms_arr:this.Vendor_items,
tablenum : "",
vegornonveg : item.vegterian,
toppings_quantitywise:"{}",
crustings_quantitywise:"{}",
seatnum : this.Rest_seatno,
row :this.Rest_seatno,
topping_name : "toppings",
crusting_name : "Crust",
storetoppsandcrusts:""
})
}
await this.selectedItems.push(item);
item.data.orderQty ++;
this.subTotal = this.subTotal + item.Sellingprice;

//console.log(JSON.stringify(this.orderjson)+"order")
}
minusItem(item,itemqty){
if( item.data.orderQty>0)
{
this.selected_items_qty--;
item.data.orderQty>0?item.data.orderQty--:0;
let index = this.orderjson.findIndex(items=>items.itemid==item.ItemID);
if(index>-1)
{ 
if(itemqty-1==0)
{
this.orderjson.splice(index,1);
}
else
{
this.Vendor_items=[];
this.orderjson[index].quantity=itemqty-1;
for(var i=0;i< this.orderjson[index].quantity;i++)
{
this.Vendor_items.push(item.ItemID)
}
this.orderjson[index].vendor_itms_arr=this.Vendor_items;
}
}
this.subTotal = this.subTotal - item.Sellingprice;
}
}
calculateSubTotal(){
this.menuItems.forEach(item=>{
item.children.forEach(child=>{
child.children.forEach(innerItem=>{
let itemWiseTotal =   innerItem.data.orderQty * innerItem.Sellingprice;
this.subTotal += itemWiseTotal;
})
})
})
}
toggleAccordian(k){
let accordianElem = document.querySelector('#collapse-' + k);
let isShow =accordianElem.classList.contains('show');
// document.getElementById('#collapse-' + k).classList.toggle("show");
// console.log(isShow);
// console.log(accordianElem.classList);
if(isShow){
setTimeout(() => {
this.ngZone.run(()=>{
// accordianElem.classList.add('collapse');
accordianElem.classList.remove('show');
})
}, 1000);
}else{
setTimeout(() => {
this.ngZone.run(()=>{

accordianElem.classList.add('show');
})
}, 1000);
}
}

async Getorderdesc():Promise<any>
{
let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
let options = new RequestOptions({ headers: headers });
return await this.http.post(AppConstants.omsservices+'vendorsplit', this.json_dataforsplit, options).toPromise();
}

async onProceedToConfirmOrder(){
this.loading.present();
// console.log(JSON.stringify( this.orderjson)+" this.orderjson")
this.storage.set("orderjson",{orderselected_items: this.orderjson,TotalQty: this.selected_items_qty,Total_items:this.subTotal
})
.then(()=>{
}).catch(err=>{
console.log(err.message);
})
var orderinfoforsplitjson = {
'orderjson':JSON.stringify ( this.orderjson),
'screen_ids': this.scrId,
'convenience_charge': this.convenience_charge,
'cust_id': "",
'tablenum': "QRScan",
'addreslabel': "QRScan"
};
this.json_dataforsplit =await JSON.stringify(orderinfoforsplitjson);
let Response= await this.Getorderdesc();
//  console.log(JSON.stringify(orderinfoforsplitjson))
//  console.log(JSON.stringify( Response._body)+"JSON.parse( Response._body)")
this.loading.dismiss();
await this.navCtrl.push('OrderSummaryPage',{items:JSON.parse(Response._body),screen_id:this.scrId,seatno:this.navParams.get('seatno'),Rowno:this.navParams.get('Rowno') });
}
//viewdecription
async GetItemsAddicons(Items_id):Promise<any>
{
return await this.http.get(AppConstants.omsservices+'fetchtoppscrusts?vendoritemid=' + Items_id+'&callback=jsonCallbacktopcruts').toPromise();
}
async GetAddicons(Items_id:any){
//   let  jsonCallbacktopcruts =async (data)=>{
//  console.log(JSON.stringify(data)+"data");
//  //this.navCtrl.push(OrderFoodAddonsPage,{foodAddOnsData:data});
//   }
//   let icons= await this.GetItemsAddicons(Items_id);
//   eval(icons._body)
}
}