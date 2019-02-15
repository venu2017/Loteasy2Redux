import { Component,ElementRef,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import {SavedLocationsService} from '../../services/fetchSavedLocationsService';
import {ApiServices} from '../../services/appAPIServices';
import { Diagnostic } from '@ionic-native/diagnostic';
declare var google:any;

@IonicPage()
@Component({
  selector: 'page-edit-location',
  templateUrl: 'edit-location.html',
})
export class EditLocationPage {
   promptUser: any;
  showCurrentLocation:boolean;
  autocompleteItems: any[];
  autocomplete: { input: string; };
  GoogleAutocomplete: any;
  currentListView: boolean;
  addressList: string[]=[];
  tabBarElement: any;
  savedLocations:{}[]=[];
  constructor(public navCtrl: NavController, public service_call:ApiServices,
              public navParams: NavParams,
              public elRef:ElementRef,
              public storage:Storage,public diagnostic:Diagnostic,
              public zone:NgZone,
              // public locaccuracy:LocationAccuracy,
              public deviceLocAlert:AlertController,
              public addressService:SavedLocationsService) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    
  }
 
 async  ionViewWillEnter(){
 

    this.tabBarElement.style.display = 'none';
     let hElement: HTMLElement = this.elRef.nativeElement;
    let searchbar = hElement.getElementsByClassName('searchbar-search-icon');
    searchbar[0].addEventListener('click',()=>{
      this.navCtrl.push('ChooseLocationDatetimePage',{selectedAddress:'Hyderabad',from:'editLocation',flowName:this.navParams.get('flowName')});
    })
    searchbar[0].setAttribute("style","background-image:url(assets/images/backarrow.svg)");

    await  this.storage.get("recentAddressesList").then((items:string[])=>{
        console.log(items);
        if(!items)return;
      let filteredList =  items.filter(item=> item !='');
        
       
      if(!filteredList)return;
      filteredList.forEach(addressItem => {

          this.addressList.push(addressItem);
        });
      
      }).catch(err=>{
        console.log(err);
      })
 
       
    this.showCurrentLocation = true;
     this.addressList=this.removeDuplicates(this.addressList,"Address");

    console.log(JSON.stringify(this.addressList)+"address")
  await  this.storage.get("userDetails").then((data:any)=>{
                    
   

      this.service_call.fetchSavedAddresses(data.UserId)
      .subscribe((addresses=>{

        this.savedLocations =JSON.parse(addresses);
        console.log( this.savedLocations);
       }))
    })
    
  }

  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }

  ngOnInit(){
   
   

   
  }
  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};
    for(var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for(i in lookupObject) {
    newArray.push(lookupObject[i]);
    }
    return newArray;
    }
  updateSearchResults(){
    this.autocomplete.input == '' ? this.showCurrentLocation=true:this.showCurrentLocation=false;
    
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input , types: ['geocode','establishment'], componentRestrictions: { country: 'in' }},
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
    console.log(this.autocompleteItems);
  }

  selectSearchResult(item){
      this.navCtrl.push('ChooseLocationDatetimePage',{selectedAddress:item.description,Edit_from:'editLocation', flowName:this.navParams.get('flowName')});
  }
  switchToLocationSettings():Promise<any>{
    return new Promise((resolve,reject)=>{
   resolve(this.diagnostic.switchToLocationSettings());
   reject(new Error('failed'));
   
    })

    

}

  getCurrentLocation(){


    this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
     
      if(isAvailable)
      {
        this.navCtrl.push('ChooseLocationDatetimePage');
      }
      else
      {
        let alert1 = this.deviceLocAlert.create({
          title:'Error on GPS',
        message:'Error on GPS You need active the GPS',
        buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Enable',
              handler: data => {
               this.diagnostic.switchToLocationSettings();
              }
            }
          ]
        })
        alert1.present();
      }
    })
   
  }

  onSaveToFavAddresses(address){
   
    this.navCtrl.push('MyProfilePage',{ from :"EditLocationRecentLocation",Address:address, "flowName":this.navParams.get("flowName")})
  }
  RecentLocation(address:any){
   
    this.navCtrl.push('ChooseLocationDatetimePage',{selectedAddress:address,Edit_from:'RecentLocation',"flowName":this.navParams.get("flowName")});
  }
  onLocationSelected(address1:any,address2:any,address3:any){
 
    this.navCtrl.push('ChooseLocationDatetimePage',{selectedAddress:address1+","+address2+","+address3,Edit_from:'editLocation',"flowName":this.navParams.get("flowName")});
  }

}
