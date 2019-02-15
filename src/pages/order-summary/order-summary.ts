import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController,Platform  } from 'ionic-angular';
import {GeolocationService} from '../../services/geolocation';
import {GeocoderService} from '../../services/geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/Storage';
import {Http} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { AppConstants } from '../../assets/appConstants';
import { LoadingCreator } from '../../services/loadingcreator';

@IonicPage()
@Component({
  selector: 'page-order-summary',
  templateUrl: 'order-summary.html',
})
export class OrderSummaryPage { 
  selectedItems:any;
  tabBarElement: any;
  public Grand_total:any;
  public Order_items:any[]=[];
  public tax_details:any[]=[];
  public numberofitems:any;
  public vendor_name:any;
  public vendor_cell:any;
  public customer_mobil:any;
  public loading:any;
  public txt_comments:any;
  public screen_id:any;
  selectedAddress: any;
addressList: string[]=[];
formattedAddress: any;
city:string ="";
addressOne:string="";
addressTwo:string="";
location:string;
  constructor( public http:Http, public navCtrl: NavController, 
    public geoService:GeolocationService,public platform:Platform, 
    public storage:Storage, public diagnostic:Diagnostic,
     public _geocode:GeocoderService,public navParams: NavParams,
     private alertCtrl: AlertController,public loadingCtrl:LoadingController, public loadingCreator:LoadingCreator) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
   
    this.selectedItems =  this.navParams.get("items");
   
    // console.log ( JSON.stringify( this.selectedItems)+"this.selectedItems")
  }
  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
    }
     ionViewWillEnter(){
      this.tabBarElement.style.display = 'none';
      this.getCurrentLocationFromGeocode();
    }

  
  getCurrentLocationFromGeocode(){
    this.platform.ready().then(()=>{

    this.diagnostic.isLocationAuthorized().then((enabled)=>{
    if(!enabled){
    this.diagnostic.requestLocationAuthorization().then(status=>{
    this.geoService._geolocate({enableHighAccuracy:true}).then((res)=>{
    let latlng:any ={lat:res.coords.latitude,lng:res.coords.longitude} ;
    this.storage.set("latlong",latlng).then(()=>{
    }).catch((err:any)=>{
    console.log(err.message);
    })
    this._geocode._reverseGeocode(latlng).then((address:any)=>{
    this.formattedAddress = address[0].formatted_address;
    this.city = address[0].address_components[4].long_name;
    this.addressOne = address[0].address_components[1].long_name +','
    + address[0].address_components[0].long_name;
    this.addressTwo = address[0].address_components[2].long_name;

    }).catch((err)=>{
    console.log(err);
    });
    }).catch((err)=>{
    console.log(err);
    })
    })
    .catch(err=>{
    console.log(err);
    })
    }else{
    this.geoService._geolocate({enableHighAccuracy:true}).then((res)=>{
    let latlng:any ={lat:res.coords.latitude,lng:res.coords.longitude} ;
    this.storage.set("latlong",latlng).then(()=>{
    }).catch((err:any)=>{
    console.log(err.message);
    })
    this._geocode._reverseGeocode(latlng).then((address:any)=>{
    this.formattedAddress = address[0].formatted_address;
    this.city = address[0].address_components[4].long_name;
    this.addressOne = address[0].address_components[1].long_name +','
    + address[0].address_components[0].long_name;
    this.addressTwo = address[0].address_components[2].long_name;
 
    }).catch((err)=>{
    console.log(err);
    });
    }).catch((err)=>{
    console.log(err);
    })
    }
    })
    .catch(err=>{
    console.log(err);
    })
    })
    }
 async ionViewDidLoad() {

  setTimeout(() => {
    this.loading.dismiss();
  }, 10000);
  this.loading = this.loadingCtrl.create({
    spinner:'hide'
    })
    this.loading.data.content = this.loadingCreator.getLoadingSymbol();
    this.loading.present();
  
  this.Order_items=[];
  this.selectedItems = await this.navParams.get("items");
  // console.log ( JSON.stringify( this.selectedItems)+"this.selectedItems")
 this.screen_id=await this.navParams.get("screen_id");
  this.Grand_total =  this.selectedItems.vendors.T1[0].data.tax_details.total;
  
  var items_data =await this.selectedItems.vendors.T1[0].data.orderinfo;
  this.vendor_name =await this.selectedItems.vendors.T1[0].name;
 this.numberofitems =await this.selectedItems.vendors.T1[0].data.orderinfo.length;
 this.vendor_cell = await this.selectedItems.vendors.T1[0].data.orderinfo[0].mobile_number;
 this.customer_mobil =  await this.selectedItems.vendors.T1[0].data.orderinfo[0].customer_mobil;
 this.loading.dismiss();
  for (var i = 0; i < items_data.length; i++) {

    // console.log(items_data[i].discount_div+"items_data[i].discount_div")
    var discount_div = items_data[i].discount_div;
    var ifcontainspercentagesymbol = discount_div.indexOf("percent");
    if (ifcontainspercentagesymbol == -1) {
      discount_div = discount_div.replace("  Rs off", "");
      discount_div = discount_div;
     


    if (discount_div <= 0) {
    } else {
        discount_div = discount_div + " off" ;
    }

    }
    else if (ifcontainspercentagesymbol != -1) {
      discount_div = discount_div.replace("percent", "%");
     
    }
    this.Order_items.push({
      item_name:items_data[i].name,
      quantity:items_data[i].quantity,
       strikeprice_cutoff:items_data[i].strikeprice_cutoff,
       price:items_data[i].price,
      discount_div:items_data[i].discount_div,
      discounttype:discount_div


    })
  }

  var orderOfdisplay =await this.selectedItems.vendors.T1[0].data.tax_order;
  for (var h = 0; h < orderOfdisplay.length; h++) {
    var tax_name = orderOfdisplay[h];
    var tax_value = this.selectedItems.vendors.T1[0].data.tax_details[orderOfdisplay[h]];
    if (tax_value && tax_value != 0) {

      if(tax_name)
      {
      if(tax_name=='convenience_charges')
      {
        tax_name = 'Convenience Charges'
      }

      if(tax_name=='delivery_charges')
      {
        tax_name = 'Delivery Charges'
      }
      }
       
         //praveen
      this.tax_details.push({
        name:tax_name,
        value:parseFloat(tax_value).toFixed(2)


      })  
   
    }
  }


  // console.log(this.selectedItems);
  }

  // navigateToPickItems(){
  //   this.navCtrl.pop();
  // }
  CancelOrder():void{


  let alert = this.alertCtrl.create({
    title: 'Are you sure,',
    message: 'you want to Cancel this Order?',
    buttons: [
      {
        text: 'Yes',
        role: 'Yes',
        handler: () => {

           this.navCtrl.push('pickItemsPage',{EditType:"CancelOrder",scrId:this.screen_id,seatno:this.navParams.get('seatno'),Rowno:this.navParams.get('Rowno')})
          console.log('Yes clicked');
        }
      },
      {
        text: 'No',
        role: 'No',
        handler: () => {
          console.log('No clicked');
        }
      }
    ]
  });
  alert.present();
}

ConformOrder():void{

  let alert = this.alertCtrl.create({
   
    message: 'Thank you, Click Done to place your order. Order once placed cannot be modified or cancelled',
    buttons: [
      {
        text: 'Go Back',
     
        handler: () => {
          console.log('back clicked');
        }
      },
      {
        text: 'Done',
        handler: () => {
          console.log('Done clicked');
          this.pay(this.Grand_total * 100);
        }
      }
    ]
  });
  alert.present();
}

EditOrder():void{


  this.navCtrl.push('pickItemsPage',{EditType:"EditOrder",scrId:this.screen_id,seatno:this.navParams.get('seatno'),Rowno:this.navParams.get('Rowno')})
}
public json_dataforsplit:any;
async Conform_order(){
  // txt_comments
  if(this.txt_comments!=undefined)
  this.selectedItems.vendors.T1[0].data.orderinfo[0].comments = this.txt_comments;
  else
  this.selectedItems.vendors.T1[0].data.orderinfo[0].comments = "";
  // console.log(JSON.stringify(this.selectedItems)+"Response")
  var orderinfo = {
		'ordersplitjson': JSON.stringify(this.selectedItems),
		'customer_id': "",
		'homedelivery':'No',
		'seatnum': this.navParams.get('seatno'),
		'locationname':this.vendor_name,
		'rownum': this.navParams.get('Rowno')
  };
  this.json_dataforsplit =await JSON.stringify(orderinfo);
 // console.log(JSON.stringify( this.json_dataforsplit)+"Response")
  let Response= await this.Getorderdesc();
//  console.log(JSON.stringify(Response)+"Response");
 await this.navCtrl.push('pickItemsPage',{EditType:"CancelOrder",scrId:this.screen_id,seatno:this.navParams.get('seatno'),Rowno:this.navParams.get('Rowno')})
}

async Getorderdesc():Promise<any>
{

  let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
  let options = new RequestOptions({ headers: headers });

  return await this.http.post(AppConstants.omsservices+'orderinsertservice', this.json_dataforsplit, options).toPromise();
}

pay(amount:number) {
  var options = {
    description: 'Payment towards food order',
    image: 'https://res.cloudinary.com/venu2017/image/upload/v1529650351/root/loteasy.svg',
    currency: 'INR',
    key: 'rzp_test_CwBSCKiReCZvGi',
    amount: amount,
    name: 'Loteasy',
    prefill: {
      email: '',
      contact: '',
      name: ''
    },
    theme: {
      color: '#F37254'
    },
    modal: {
      ondismiss: function() {
        alert('dismissed')
      }
    }
  };

  var successCallback = function(payment_id) {
    this.Conform_order();
    alert('payment_id: ' + payment_id);
    
  };

  var cancelCallback = function(error) {
    alert(error.description + ' (Error ' + error.code + ')');
  };

  RazorpayCheckout.open(options, successCallback, cancelCallback);
}

}




