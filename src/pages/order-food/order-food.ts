import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LoteasyService } from '../../services/loteasyService';
import {Http, Jsonp} from '@angular/http';
import  'rxjs/Operator/map';
import { Storage } from '@ionic/Storage';
import { AppConstants } from '../../assets/appConstants';


@IonicPage()
@Component({
  selector: 'page-order-food',
  templateUrl: 'order-food.html',
})
export class OrderFoodPage {
 tabBarElement: any;
  vendorId:any;
  menuItemsOfVendor:any;
  public seat_no:any;
  public Row_no:any;
  public screen_id:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
               public barcodeScanner:BarcodeScanner,  public loteasyService:LoteasyService,public storage:Storage,
                public http:Http, public jsonp:Jsonp) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  navigateToAddressLabelsPage(){
    this.navCtrl.push('AddressLabelsPage',{from:'orderFoodHome'});
  }
  ionViewWillEnter(){
    this.tabBarElement.style.display = 'none';
  }
  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }
  navigateBackToRoot(){
    // this.navCtrl.push(HomePage);
    this.navCtrl.popToRoot();
  }

  async getBarcodeDetails(){
    let scrId;
  let   jsonqrscsnCallback = async(data)=>{
 
    this.vendorId=data.qrcode[0].vendor_id;
    var  json_qrresponse=data.qrcode[0].json_url.split("json=");
    this.seat_no=JSON.parse( json_qrresponse[1]).seat
    this.Row_no=JSON.parse( json_qrresponse[1]).identification;
    this.screen_id=JSON.parse( json_qrresponse[1]).screen;
  
    this.seat_no = escape(this.seat_no.trim());
    this.Row_no = escape(this.Row_no.trim());
    // console.log(this.seat_no);
    // console.log(this.Row_no);
    // console.log(this.screen_id+"this.screen_id");

    
    this.navCtrl.push('PickItemsPage',{scrId:this.screen_id,seatno:this.seat_no,Rowno:this.Row_no});
    // this.menuItemsOfVendor = await this.getscreenidforvendor(this.vendorId);

    // eval(this.menuItemsOfVendor._body);
    
    }
    // let jsonCallback =async (data)=>{
     
     

    //     this.screen_id=data.scr_id;
 
    //   this.navCtrl.push(PickItemsPage,{scrId:this.screen_id,seatno:this.seat_no,Rowno:this.Row_no});
     
    // }
    let details = await this.scanBarcode();
  
    eval( details._body);
    
  }

  


 async scanBarcode():Promise<any>{
  let barcodeText =   await  this.barcodeScanner.scan();
  console.log(barcodeText.text+"barcodeText.text")
 return await this.http.get(AppConstants.omsservices+ 'qrcodescandetails?state=' + barcodeText.text+ '&callback=jsonqrscsnCallback')
                                      .toPromise();
 
  }

  getscreenidforvendor(vendorId:any):Promise<any>{
    return  this.http.get(AppConstants.omsservices+'getscreenidforvendor?vendor_id=' +vendorId )
            .toPromise();
  }

}
