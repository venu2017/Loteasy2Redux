import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { Storage } from '@ionic/Storage';
import { AppConstants } from '../../assets/appConstants';
import { LoteasyService } from '../../services/loteasyService'
import { LoadingCreator } from '../../services/loadingcreator';
import { SearchLocationWiseRestuarntsComponent } from '../../components/search-location-wise-restuarnts/search-location-wise-restuarnts';
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-restaurants-list',
  templateUrl: 'restaurants-list.html',
})
export class RestaurantsListPage {
  // @ViewChild('gmap') gmapElement: any;
  // public map: any;
  // public marker: any;
  // public currentLong: any;
  // public currentLat: any;

  public map_details;
  public searchKeyword: any;
  public flow_type: any;
  isSearchActive: boolean;
  restaurantId: any;
  fromPage: any;
  isSearchResults: boolean;
  locationChosen: any;
  timeChosen: any;
  dateChosen: any;
  public loading: any;
  chosenInvitees: Array<any> = [];
  latlong: any;
  public rest_count: any = 0;
  restaurantsData: Array<any> = [];
  restaurantItems: Array<any> = [];
  public showcatchstate: any;
  public Restaurantshow: any;
  public title_heading: any;
  eventdetails: any;
  pageto:any;
  cloudinaryHeroUrl: string = AppConstants.CLOUDINARY_FETCH_HERO_IMAGE_PATH;
  fakeRestaurantItems: Array<any> = new Array(5);
  userFilters ={
    Food:['Veg','Non Veg'],
    Amenities:['Smoking','Vallet parking','WiFi','Air Conditioned','Disabled Friendly'],
    "Friends Recommended":['Recommended'],
    "Food Choices":['Organic','Barbeque','Diabetic Choices'],
    price:''
  }
  //https://www.concretepage.com/angular-2/angular-4-ngfor-example
  constructor(public navCtrl: NavController, public navParams: NavParams, public loteasyService: LoteasyService,
    public apiService: ApiServices, public storage: Storage,
    public ngZone: NgZone, public loadingCtrl: LoadingController, public loadingCreator: LoadingCreator) {
    this.mapview = false;

    this.restaurantId = this.navParams.get("RestaurantId");
    this.searchKeyword = "";
    this.Restaurantshow = true;
    
    this.showcatchstate = false;
    
    //catch up

    if (this.navParams.get("catchup") == "catchupstate") {

      this.Restaurantshow = true;
      this.showcatchstate = true;
    }
    if (this.fromPage == 'chooseInvitees' || this.fromPage == 'invitesummary') {
      this.isSearchResults = false;
    } else {
      this.isSearchResults = true;
    }


    if ((this.navParams.get("catchup") == 'catchupstateEventeditaddress' && this.flow_type == 'catchupoverameal') || this.navParams.get("catchup") == 'catchupstateEventeditaddress' && this.flow_type == 'catchupoverameal') {

      this.title_heading = 'Meet Friends Now';
    }
    else if(this.navParams.get("catchup") == 'catchupstateEventeditaddress' || this.flow_type == 'catchupoverameal')
    {
     
      this.title_heading = 'Meet Friends Now';
    
    }
    else if(this.navParams.get("from")=="Locationset-availability")
    {
      this.title_heading = 'Meet Friends Now';
    }
    else if (this.fromPage == 'chooseInvitees' || this.fromPage == 'invitesummary' || this.fromPage == 'restaurantList') {

      this.title_heading = 'Start a Hangout';
    }

    else {

      this.title_heading = 'Start a Hangout';
    }
  }
  filterRestuarnts(searchKeyword) {

    if (this.Restaurantshow) {
      this.filterItem(searchKeyword);
    }

  }

  ionViewWillEnter() {
    this.flow_type = this.navParams.get("flow");
    this.fromPage = this.navParams.get("from");
    this.pageto=this.navParams.get("pageto");
    this.searchKeyword = "";
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     this.showPosition(position);
    //   });
    // } else {
    //   console.log("Geolocation is not supported by this browser.");
    // }

    this.storage.get("latlong").then(latlng => {
      this.latlong = latlng;
    })
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',

    })

    this.loading.data.content = this.loadingCreator.getLoadingSymbol();

    if (this.Restaurantshow) {
      // this.loading.present();
    }
    else {
      // this.loading.dismiss();
    }


    this.restaurantsData = [];
    this.rest_count = 0;
    this.apiService.FetchAllRestaurants()
      .subscribe(data => {
        setTimeout(() => {
          data.forEach(rd => {
            if (rd.LatLong != null) {
              let lat1 = rd.LatLong ? rd.LatLong.split(",")[0] : 0;
              let long1 = rd.LatLong ? rd.LatLong.split(",")[1] : 0;
              let lat2 = this.latlong.lat;
              let long2 = this.latlong.lng;
              let distance = this.getDistanceFromLatLonInKm(lat1, long1, lat2, long2);
              this.restaurantsData.push({ resto: rd, _distance: Math.round(distance) });
              this.restaurantsData.sort((a, b) => {
                return a._distance - b._distance;
              });
            }

          })

          this.assignCopy();
        }, 2000);

      })



    this.storage.get("EventLocationDateTime").then(data => {

      this.locationChosen = data.location;
      this.timeChosen = data.time;
      this.dateChosen = data.date;
    }).catch(err => {
      console.log(err.message);
    })

    setTimeout(() => {
      this.storage.get("Invitees").then(data => {

        data.selectedInvitees.forEach(si => {
          this.chosenInvitees.push(si);
        })



      }).catch(err => {
        console.log(err.message);
      })
    }, 2000);


  }

  navigateBackToSearchOrInvitees() {
    // if(this.navParams.get("catchup")=="catchupstate")
    // {
    //   this.navCtrl.push(SetAvailabilityPage,{from:'restaurantList'})
    // }
    if (this.navParams.get("from") == "set-availability") {
      this.navCtrl.push('SetAvailabilityPage', { from: 'Backtocatchup' })
    }
    else {

      if (this.fromPage == 'chooseInvitees') {

        this.navCtrl.push('ChooseInviteesPage', { from: 'Restuarantpage' });
      } else {
        this.navCtrl.push('RestaurantSearchPage', { from: 'restaurantList' });
      }
    }
  }

  navigateToRestaurantDetails(resto: any) {
    console.log("flow:"+this.flow_type);
   let eventid:any;
   eventid= this.navParams.get("EventDetails");
   
    this.navCtrl.push('RestaurantDetailPage', { from: 'restaurants',flow:this.navParams.get("flow"),catchup:this.navParams.get("catchup"),Eventid:eventid,resto: resto });

  }
  async UpdateEventDetails(Event_id: any, Rest_id: any): Promise<any> {
    return await this.loteasyService.fetch('get', 'UpdateEventDetails', { Event_id: Event_id, Rest_id: Rest_id });
  }
  //  Navigate_catchup(){
  //   let result=this.UpdateEventDetails(this.navParams.get("EventDetails"),101);
  //   this.navCtrl.push(SetAvailabilityPage,{from:'restaurantList',Booking_type:"No-Booking"});

  //  }
  navigateToInviteSummary(resto: any) {
    console.log(this.navParams.get("catchup"));


    //console.log(this.navParams.get("catchup")+"this.navParams.get");
    //   if(this.fromPage =='set-availability' && this.flow_type=='Catch-up over a Meal'){

    //     this.navCtrl.push(SetAvailabilityPage,{from:'selected_restaurantListaddress',restaurant:resto});
    //   }
    //  else 

    if (this.navParams.get("catchup") == "catchupstateeditaddress") {

      console.log("1");
      this.navCtrl.push('SetAvailabilityPage', { from: "Locationset-availability", selected_place: resto.Address, EventDetails: this.navParams.get("EventDetails") });
    }

    else if (this.navParams.get("catchup") == "catchupstateEventeditaddress")
     {
      this.eventdetails=this.navParams.get("EventDetails");
      console.log(this.eventdetails);
      
          console.log("1222"+this.navParams.get("from"));
          if(this.navParams.get("from")=="set-availability_address")
          {
               
            console.log("13");

            let result = this.UpdateEventDetails(this.eventdetails, resto.RestaurantId);
            console.log(resto.RestaurantId);
            
            this.navCtrl.push('SetAvailabilityPage', { from: 'restaurantList', restaurant: resto, Booking_type: "Booking", EventDetails: this.navParams.get("EventDetails") });
          }
          else
          {
            console.log("14");
            let result = this.UpdateEventDetails(this.navParams.get("EventDetails"), resto.RestaurantId);
            console.log(resto.RestaurantId);

            //this.navCtrl.push('SetAvailabilityPage', { from: 'restaurantList', restaurant: resto, Booking_type: "Booking", EventDetails: this.navParams.get("EventDetails") });
             this.navCtrl.push('SetAvailabilityPage', { from: 'selected_restaurantListaddress', restaurant: resto, Booking_type: "No-Booking", EventDetails: this.navParams.get("EventDetails") });

          }
        }
       else if (this.navParams.get("catchup") == "catchupstate") {
      console.log("3");
      let result = this.UpdateEventDetails(this.navParams.get("EventDetails"), resto.RestaurantId);

      this.navCtrl.push('SetAvailabilityPage', { from: 'restaurantList', restaurant: resto, Booking_type: "Booking", EventDetails: this.navParams.get("EventDetails") });
    }
    else if (this.flow_type == "funch" && this.fromPage == 'chooseInvitees') {
      console.log("4");
    //  let result = this.UpdateEventDetails(this.navParams.get("EventDetails"), resto.RestaurantId);

      //this.navCtrl.push('InviteSummaryPage', { from: 'restaurantList', restaurant: resto, Booking_type: "Booking", EventDetails: this.navParams.get("EventDetails") });
      this.navCtrl.push('InviteSummaryPage', {
        from: 'restaurantList', _time: this.timeChosen, _date: this.dateChosen,
        location: this.locationChosen, invitees: this.chosenInvitees, restaurant: resto, flowType: this.flow_type});
    }
   
    else {
      this.navCtrl.push('InviteSummaryPage', {
        from: 'restaurantList', _time: this.timeChosen, _date: this.dateChosen,
        location: this.locationChosen, invitees: this.chosenInvitees, restaurant: resto, flowType: this.flow_type
      });
    }
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  onSearchInputChange(searchKeyword: any) {

    setTimeout(() => {
      this.ngZone.run(() => {
        // this.restaurantsData.filter(res =>{
        //   return res.resto.Name.toLowerCase().indexOf(searchKeyword) > -1;
        //  })

        this.filterItem(searchKeyword);
      }, 1000);

    })

  }

  assignCopy() {
    // this.loading.dismiss();
    this.restaurantItems = Object.assign([], this.restaurantsData);
    this.rest_count = this.restaurantItems.length;
  }
  public markers: any[] = [];

  async  filterItem(value) {

    //  this.loading.present();
    if (!value || value.length < 1) this.assignCopy(); //when nothing has typed
    this.restaurantItems = Object.assign([], this.restaurantsData).filter(
      item => item.resto.Name.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
    // this.loading.dismiss();
    this.rest_count = this.restaurantItems.length;

    //  await this.restaurantItems.forEach(element => {
    //     let lat1 = element.resto.LatLong?element.resto.LatLong.split(",")[0]:0;
    //     let long1 = element.resto.LatLong?element.resto.LatLong.split(",")[1]:0;
    //     let location = new google.maps.LatLng(lat1, long1);
    //     var marker = new google.maps.Marker({
    //       position: location,
    //       map: this.map,
    //       // icon:'http://maps.google.com/mapfiles/ms/micons/blue.png',
    //       title:"praveen"
    //     });
    //     this.markers.push(marker);
    //    // this.map.setZoom(14);
    //     this.map.panTo(marker.position);
    //   });
  }

  showDialog() {
    // this.navCtrl.push(HomePagesss)
    this.isSearchActive = true;
  }


  // showPosition(position) {
  //   for (var i = 0; i < this.markers.length; i++) {
  //     this.markers[i].setMap(null);
  //   }

  //   this.apiService.FetchAllRestaurants()
  //     .subscribe(data => {
  //       setTimeout(() => {
  //         data.forEach((rd, indexedDB) => {
  //           if (rd.LatLong != null) {
  //             let lat1 = rd.LatLong ? rd.LatLong.split(",")[0] : 0;
  //             let long1 = rd.LatLong ? rd.LatLong.split(",")[1] : 0;
  //             let location = new google.maps.LatLng(lat1, long1);
  //             let lat2 = this.latlong.lat;
  //             let long2 = this.latlong.lng;
  //             let distance = this.getDistanceFromLatLonInKm(lat1, long1, lat2, long2);

  //             var marker = "";
  //             if (Math.round(distance) < 2) {
  //               this.map.panTo(location);
  //               marker = new google.maps.Marker({
  //                 position: location,
  //                 map: this.map,
  //                 icon: 'assets/images/Location Red.svg',
  //                 title: "Loteasy"
  //               });


  //               google.maps.event.addListener(marker, 'click', () => {

  //                 infowindow.setContent('<div id="infoWindowButton" ><img src=http://res.cloudinary.com/venu2017/image/upload/v1519907462/root/resto_hero/' + rd.HeroImg + ' style="width: 30px;height: 24px;"><strong>' + rd.Name + '</strong><br></div>');
  //                 infowindow.open(this.map, marker);

  //                 infowindow.addListener('domready', () => {
  //                   document.getElementById("infoWindowButton").addEventListener("click", () => {

  //                     this.navigateToInviteSummary(rd);
  //                   });


  //                 });

  //               });
  //               this.markers.push(marker);
  //             }

  //           }


  //         })
  //       })
  //     })


  //   const myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //   var mapProp = {
  //     center: myLatlng,
  //     zoom: 15,
  //     scrollwheel: false

  //   };



  //   this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  //   this.map.panTo(myLatlng);
  //   var markeraa = new google.maps.Marker({
  //     position: myLatlng,
  //     map: this.map,
  //     icon: 'assets/images/My Location.png',

  //   });

  //   var infowindow = new google.maps.InfoWindow({
  //     content: 'My location!',
  //     map: this.map,
  //     position: myLatlng
  //   });




  // }

  onClick(event) {
    console.log(event);
  }
  showExcerptInfo: (any) => void = (event: any): void => {

  }
  public mapview: any;


  showRestuarnts() {

    console.log(this.fromPage + "this.fromPage")
    if (this.flow_type == 'Meet Friends Now') {
      console.log("if")
      console.log("list:"+this.navParams.get('EventDetails'));
      this.navCtrl.push(SearchLocationWiseRestuarntsComponent, { from: 'set-availability_address', EventDetails: this.navParams.get('EventDetails') });
    }
    else {
      console.log("false")
      this.navCtrl.push(SearchLocationWiseRestuarntsComponent, {
        from: 'restaurantList', _time: this.timeChosen, _date: this.dateChosen,
        location: this.locationChosen, invitees: this.chosenInvitees
      });
      this.searchKeyword = "";
    }

  }

}
