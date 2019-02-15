import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { SavedLocationsService } from '../../services/fetchSavedLocationsService';
import { RestaurantsListPage } from '../../pages/restaurants-list/restaurants-list';
import { LoteasyService } from '../../services/loteasyService';
import { Keyboard } from '@ionic-native/keyboard';
import { GeolocationService } from '../../services/geolocation';
import { Observable } from '../../../node_modules/rxjs';
declare var google: any;

@Component({
  selector: 'search-location-wise-restuarnts',
  templateUrl: 'search-location-wise-restuarnts.html'
})
export class SearchLocationWiseRestuarntsComponent  implements AfterViewInit{

  promptUser: any;

  autocompleteItems: any[] = [];
  autocomplete: any;
  GoogleAutocomplete: any;

  addressList: string[] = [];
  tabBarElement: any;
  savedLocations: {}[] = [];
  public hiddennewplace: any;
  @ViewChild('gmap') gmapElement: any;
  public map = google.maps.Map;
  public marker: any;
  public currentLong: any;
  public currentLat: any;

  public map_details;

  public overlays: any[] = [];

  public options: any;
  public Address_selected: any;

  public Event_time: any;
  public Event_date: any;
  public Location_choosen: any;
  public Event_members: any;
  public Rest_details: any[] = [];
  public hiddeen: any;
  public Newplace_value: any;
  public Toggle_value: any;
  public isKeyPadOpen: boolean;
  eventDetails: any;
  lat: number;
  lng: number;
  //https://github.com/ultrasonicsoft/gmap-geolocation-demo/blob/master/src/app/app.component.ts
  //https://stackoverflow.com/questions/47939240/how-to-use-createembeddedview-method-of-templateref-in-angular4
  public selectedAddr: any;
  enableProceedBtn: boolean;
  latlong: any;

  constructor(public navCtrl: NavController,
    private vcRef: ViewContainerRef,
    public loteasyService: LoteasyService,
    public navParams: NavParams,
    public elRef: ElementRef,
    public storage: Storage,
    public zone: NgZone,
    // public locaccuracy:LocationAccuracy,
    public deviceLocAlert: AlertController,
    public addressService: SavedLocationsService,
    public keyboard: Keyboard,
    public geolocation: GeolocationService,
     public platform: Platform) {
    if (this.navParams.get("from") == "restaurantList") {
      this.Event_date = this.navParams.get("_date");
      this.Event_time = this.navParams.get("_time");
      this.Location_choosen = this.navParams.get("location");
      this.Event_members = this.navParams.get("invitees");

    }

    this.platform.ready().then(() => {
      this.geolocation._geolocate({ enableHighAccuracy: true, timeout: 120000, maximumAge: 600000 })
        .then(position => {
          console.log(position);
          this.lat = parseFloat(position.coords.latitude);
          this.lng = parseFloat(position.coords.longitude);
        }).catch(e => {
          this.geolocation._geolocate({ enableHighAccuracy: true, timeout: 120000, maximumAge: 600000 })
            .then(position => {
              this.lat = parseFloat(position.coords.latitude);
              this.lng = parseFloat(position.coords.longitude);
            })
        })

        
    })

    this.hiddeen = false;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    // this.autocomplete = { input: '' };
    this.autocomplete = '';
    this.autocompleteItems = [];

    this.hiddennewplace = false;
    // let geolocationPromise = new Promise(resolve=>{
    //   if(navigator){
    //     navigator.geolocation.getCurrentPosition(position=>{
    //       // this.latlong = {lat:position.coords.latitude,lng:position.coords.longitude};
    //      resolve(position);
    //     })

    //  }
    // })

    this.keyboard.onKeyboardShow().subscribe(() => {
      this.isKeyPadOpen = true;
    })

    this.options = {
      center: { "lat": typeof this.lat == 'number' ? this.lat : parseFloat(this.lat), "lng": typeof this.lng == 'number' ? this.lng : parseFloat(this.lng) },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scaleControl: false,
      mapTypeControl: false,
      disableDefaultUI: true,
      scrollwheel: false,
      streetViewControl: false,          
      componentRestrictions: { country: 'in' },
      zoom: 15
    };
    setTimeout(() => {
      this.zone.run(()=>{
      let marker = new google.maps.Marker({ position: { "lat": typeof this.lat == 'number' ? this.lat : parseFloat(this.lat), "lng": typeof this.lng == 'number' ? this.lng : parseFloat(this.lng) }, title: "You are here!",  icon: 'assets/images/My Location.png' })
      this.overlays.push(marker);
      // let center = this.map.getCenter();
      google.maps.event.trigger(this.map, "resize");
      this.map.setCenter(new google.maps.LatLng(this.lat,this.lng));
      // let bounds = new google.maps.LatLngBounds();
      // this.map.fitBounds(bounds); // Map object used directly
      })

      const myLatlng = new google.maps.LatLng(this.lat, this.lng);

      this.infoWindow = new google.maps.InfoWindow({
        content: 'You are here!',
        map: this.map,
        position: myLatlng
      });
  
      },1000)
  }

  // ionViewWillEnter(){
  //   this.platform.ready().then(()=>{
  //     this.geolocation._geolocate({enableHighAccuracy:false})
  //     .then(pos=>{
  //       console.log(pos);
  //       setTimeout(() => {
  //         this.options = {
  //         center: { lat:pos.coords.latitude, lng:pos.coords.longitude },
  //         scaleControl: false,
  //         mapTypeControl: false,
  //         disableDefaultUI: true,
  //         scrollwheel: false,
  //         streetViewControl: false,
  //         mapTypeId: google.maps.MapTypeId.ROADMAP,
  //         componentRestrictions: { country: 'in' },
  //         zoom: 15
  //       };
  //      }, 500);
  //     })
  //     this.infoWindow = new google.maps.InfoWindow();
  //   })

  // }
  private getPlacePredictions(query: string): Promise<any> {
    let autocompleteSrv = new google.maps.places.AutocompleteService();
    return new Promise((resolve, reject) => {
      autocompleteSrv.getPlacePredictions({
        types: ['geocode', 'establishment'],
        input: query,
        componentRestrictions: { country: 'in' }
      }, function (predictions, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          resolve(predictions);
        } else {
          reject(status);
        }
      });
    });


  }

  handleMapClick(event, gmap) {
  console.log(event, gmap);
    this.hiddeen = false;
    this.selectedAddr = '';
    // const myLatlng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
    if (this.overlays.length > 1) {
      this.overlays.splice(1, 1)
      this.overlays.splice(2, 1)
      this.overlays.push(new google.maps.Marker({ position: { lat: event.latLng.lat(), lng: event.latLng.lng() }, title: "this.markerTitle", draggable: true, icon: 'assets/images/Location Pointer.png' }));
    }

    else {
      this.overlays.push(new google.maps.Marker({ position: { lat: event.latLng.lat(), lng: event.latLng.lng() }, title: "this.markerTitle", draggable: true, icon: 'assets/images/Location Pointer.png' }));
    }

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      'latLng': event.latLng
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {

          this.Rest_details = [];

          this.autocompleteItems = [];

          if (this.Toggle_value) {
            this.selectedAddr = this.Newplace_value + " - " + results[0].formatted_address;
            this.enableProceedBtn = true;
          }

          else {
            this.selectedAddr = results[0].formatted_address;
            this.enableProceedBtn = true;
            this.Rest_details.push({
              Name: "Dummy Restuarnt",
              Address: this.selectedAddr,
              CostForTwo: 0,
              RestaurantId: 101
            })
            this.autocomplete = "";
          }

        }
      }
    });
  }

  ngAfterViewInit(){
    this.Event_date = this.navParams.get("_date");
    this.Event_time = this.navParams.get("_time");
    let hElement: HTMLElement = this.elRef.nativeElement;
    let searchbar = hElement.getElementsByClassName('searchbar-search-icon');
    searchbar[0].addEventListener('click', () => {
      if (this.navParams.get("from") == "Locationset-availability" || this.navParams.get("from") == "set-availability_address" || this.navParams.get("from") == "chooseInvitees") {
        this.navCtrl.pop();
      }
      else {
        this.navCtrl.push(RestaurantsListPage, { from: this.navParams.get("from"), flow: 'Meet Friends Now', catchup: "catchupstate", EventDetails: this.navParams.get('EventDetails') })
      }
    })

    this.tabBarElement.style.display = 'none';
    
  }


  setMap(event){
    this.map = event.map;
    }

  // displayMap(position) {

    // const myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //   var mapProp = {
  //     center: myLatlng,
  //     zoom: 15,
  //     scrollwheel: false,
  //     gestureHandling: 'cooperative'

  //   };
  //   console.log(myLatlng);
  //   this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  //   this.map.panTo(myLatlng);
  //   var markeraa = new google.maps.Marker({
  //     position: myLatlng,
  //     map: this.map,
  //     icon: 'https://codeshare.co.uk/images/blue-pin.png',

  //   });
    
  //   this.map.setCenter(myLatlng);
  //   this.map.setZoom(16);


  // }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  infoWindow: any;
  handleOverlayClick(event) {
    console.log(event);
    let isMarker = event.overlay.getTitle != undefined;
    if (isMarker) {
      let title = event.overlay.getTitle();
      this.infoWindow.setContent('' + title + '');
      this.infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());
    }

  }



  updateSearchResults() {

    this.selectedAddr = this.autocomplete;
    this.Toggle_value = false;
    if (this.overlays.length > 1) {
      this.overlays.splice(1, 1)
      this.overlays.splice(2, 1)

    }

    this.Rest_details = [];
    this.hiddeen = false;



    if (this.autocomplete == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete, types: ['geocode', 'establishment'], componentRestrictions: { country: 'in' } }
      ,

      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          if (predictions != null) {


            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          }
        });
      });
    setTimeout(() => {
      if (this.autocompleteItems.length == 0) {
        this.hiddeen = true;
        this.Rest_details.push({
          Name: "Dummy Restuarnt",
          Address: this.autocomplete,
          CostForTwo: 0,
          RestaurantId: 101
        })
      }
    }, 500);
  }
  onSaveToFavAddresses(address) {

  }

  getGeoLocationFromAddress(address: any): Observable<any> {
    console.log('Getting address: ', address);
    let geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
        geocoder.geocode({
            'address': address
        }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                observer.next(results[0].geometry.location);
                observer.complete();
            } else {
                console.log('Error: ', results, ' & Status: ', status);
                observer.error();
            }
        });
    });
}

  onLocationSelected(address: any) {

  }
  async UpdateEventDetails(Event_id: any, Rest_id: any, rest_address: any): Promise<any> {
    return await this.loteasyService.fetch('get', 'UpdateEventstatusDetails', { Event_id: Event_id, Rest_id: Rest_id, Rest_address: rest_address });
  }
  slected_place() {


    if (this.navParams.get("from") == "Locationset-availability") {

      this.navCtrl.push('SetAvailabilityPage', { from: 'Locationset-availability', selected_place: this.selectedAddr });
      // this.navCtrl.push('SetAvailabilityPage', { from: 'Locationset-availability',Booking_type: "No-Booking", selected_place: this.selectedAddr,EventDetails:this.navParams.get("EventDetails") });
    }
    else if (this.navParams.get("from") == "set-availability_address") {
      let result = this.UpdateEventDetails(this.navParams.get("EventDetails"), 101, this.selectedAddr);
      this.navCtrl.push('SetAvailabilityPage', { Booking_type: "EditAddress", selected_place: this.selectedAddr });
    }
    else if (this.navParams.get("from") == "set-availability") {

      let result = this.UpdateEventDetails(this.navParams.get("EventDetails"), 101, this.selectedAddr);
      this.navCtrl.push('SetAvailabilityPage', { from: 'Decide a place', selected_place: this.Rest_details[0].Address, Booking_type: "No-Booking", EventDetails: this.navParams.get("EventDetails") });
    }
    else {
      //  this.Rest_details[0].Address=this.Address_selected;
      console.log("L4");
      this.navCtrl.push('InviteSummaryPage', {
        from: 'LocationwiseRestuarnt', _time: this.Event_time, _date: this.Event_date,
        location: this.selectedAddr ? this.selectedAddr : this.Location_choosen, invitees: this.Event_members, restaurant: this.Rest_details
      });
    }

  }
  selectSearchResult(item) {
    console.log(item);
    this.Rest_details = [];
    this.autocomplete = item.description;
    this.autocompleteItems = [];
    this.selectedAddr = item.description;
    this.Rest_details.push({
      Name: "Dummy Restuarnt",
      Address: item.description,
      CostForTwo: 0,
      RestaurantId: 101

    }),
      setTimeout(() => {
        this.enableProceedBtn = true;
      }, 100);

      this.getGeoLocationFromAddress(item.description)
      .subscribe(loc=>{
         console.log(loc);
        this.options = {
          center: { "lat": loc.latitude,"lng":loc.longitude},
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scaleControl: false,
          mapTypeControl: false,
          disableDefaultUI: true,
          scrollwheel: false,
          streetViewControl: false,          
          componentRestrictions: { country: 'in' },
          zoom: 15
        };
  
        setTimeout(() => {
          this.zone.run(()=>{
          let marker = new google.maps.Marker({ position: { "lat":loc.lat(),"lng":loc.lng()}})
          this.overlays.push(marker);
          // let center = this.map.getCenter();
          google.maps.event.trigger(this.map, "resize");
          this.map.setCenter(new google.maps.LatLng(loc.lat(),loc.lng()));
          // let bounds = new google.maps.LatLngBounds();
          // this.map.fitBounds(bounds); // Map object used directly
          })
    
          const myLatlng = new google.maps.LatLng(loc.lat(), loc.lng());
    
          this.infoWindow = new google.maps.InfoWindow({
            content: item.description,
            map: this.map,
            position: myLatlng
          });
      
          },1000)
      })
     
      
  }
  public latlongarray: any;
  getGeoLocation(address: string) {


    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      'address': address
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {

          if (this.overlays.length > 1) {
            //   map.setZoom(map.getZoom()+1)

            this.overlays.splice(1, 1)
            this.overlays.splice(2, 1)
            this.overlays.push(new google.maps.Marker({ position: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }, title: "this.markerTitle", draggable: true, icon: 'assets/images/Location Pointer.png' }));
          }

          else {

            //  map.setZoom(map.getZoom()+1);
            this.overlays.push(new google.maps.Marker({ position: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }, title: "this.markerTitle", draggable: true, icon: 'assets/images/Location Pointer.png' }));
          }

        }
      }
    })

    // return Observable.create(observer => {
    //     geocoder.geocode({
    //         'address': address
    //     }, (results, status) => {
    //         if (status == google.maps.GeocoderStatus.OK) {
    //             observer.next(results[0].geometry.location);
    //             observer.complete();
    //         } else {
    //             console.log('Error: ', results, ' & Status: ', status);
    //             observer.error();
    //         }
    //     });
    // });
  }
  updateItem() {

    if (this.Toggle_value) {
      this.autocompleteItems = [];
      this.Newplace_value = this.selectedAddr;
      this.autocomplete = '';
    }
    else
      this.Newplace_value = '';
  }
  showRestuarnts() {
    this.eventDetails = this.navParams.get("EventDetails");

    if (this.navParams.get("from") == "Locationset-availability" || this.navParams.get("from") == "set-availability") {

      this.navCtrl.push('RestaurantsListPage', { flow: 'Meet Friends Now', catchup: "catchupstateEventeditaddress", EventDetails: this.eventDetails })
    }
    else if (this.navParams.get("from") == "set-availability") {

      this.navCtrl.push('RestaurantsListPage', { flow: 'Meet Friends Now', catchup: "catchupstateEventeditaddress", EventDetails: this.eventDetails })
    }

    else if (this.navParams.get("from") == "set-availability_address") {

      this.navCtrl.push('RestaurantsListPage', { flow: 'Meet Friends Now', from: "set-availability_address", catchup: "catchupstateEventeditaddress", EventDetails: this.eventDetails })
    }
    else if (this.navParams.get("from") == 'restaurantList') {

      this.navCtrl.push('RestaurantsListPage', { flow: 'restaurantList' })
    }
    else if (this.navParams.get("from") == 'chooseInvitees') {

      this.navCtrl.push('RestaurantsListPage', { flow: 'restaurantList' })
    }
    else {
      console.log(this.navParams.get("from") + "3")
      this.navCtrl.push('RestaurantsListPage', { from: this.navParams.get("from"), flow: 'Meet Friends Now', catchup: "catchupstate", EventDetails: this.navParams.get('EventDetails') })
    }


  }

}
