import { Component, ElementRef, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Storage } from '@ionic/Storage';
import { ApiServices } from '../../services/appAPIServices';
import { AppConstants } from '../../assets/appConstants';
import { LoadingCreator } from '../../services/loadingcreator';
import { LoteasyService } from '../../services/loteasyService'
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-restaurant-detail',
  templateUrl: 'restaurant-detail.html',
})
export class RestaurantDetailPage implements AfterViewInit{
  restaurantId: any;
  restaurantDetails: any;

  @ViewChild('map') gmapElement: any;
  public map: any;
  suitableFor1: boolean;
  suitableFor2: boolean;
  suitableFor3: boolean;
  suitableFor4: boolean;
  lat: any;
  long: any;
  locationChosen: any;
  timeChosen: any;
  dateChosen: any;
  isFlowOrSearch: boolean;
  reviews: Array<any> = [];
  cuisines: Array<any> = [];
  amenities: Array<any> = [];
  chosenInvitees: Array<any> = [];
  offers: Array<any> = [];
  restoGallery: Array<any> = [];
  rest_offers_count: any;
  public Rest_img: any;
  public Rest_hero: any;
  public Rest_Address: any;
  public Review_count: any;
  public loading: any;
  public flow_type: any;
  eventdetails: any;
  public Eventid: any;
  cloudinaryHeroUrl: string = AppConstants.CLOUDINARY_FETCH_HERO_IMAGE_PATH;
  cloudinaryLogoUrl: string = AppConstants.CLOUDINARY_FETCH_LOGO_IMAGE_PATH;
  cloudinaryGalleryUrl: string = AppConstants.CLOUDINARY_FETCH_GALLERY_IMAGE_PATH;
  slideConfig = {
    "slidesToScroll": 1,
    "infinite": false,
    "variableWidth": true,
    "dots": false
  };
  constructor(private navCtrl: NavController, private modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, private callNumber: CallNumber,
    private navParams: NavParams, private apiService: ApiServices,
    private _ngZone: NgZone, private loadingCreator: LoadingCreator, private storage: Storage,
    private alertCtrl: AlertController, public loteasyService: LoteasyService) {

    if (this.navParams.get("from") == 'restaurants') {
      this.isFlowOrSearch = true;
    } else {
      this.isFlowOrSearch = false;
      this.restaurantId = this.navParams.get("RestaurantId");

    }
    this.eventdetails = this.navParams.get("EventDetails");

  }
  ngAfterViewInit(){
    setTimeout(() => {
          this.apiService.FetchRestaurantDetailsById(this.restaurantId)
          .subscribe(restoDetails=>{
            this.displayMap(restoDetails);
          })
      }, 2000);
    
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.storage.get("Invitees").then(data => {
        data.selectedInvitees.forEach(si => {
          this.chosenInvitees.push(si);
        })
      }).catch(err => {
        console.log(err.message);
      })
    }, 500);
    if (this.isFlowOrSearch == false) {
      setTimeout(() => {
        this._ngZone.run(() => {
          this.apiService.GetRestuarntsReviews(this.restaurantId).subscribe((reviws: any) => {
            this.reviews == Object.assign([], reviws);
            console.log(reviws.Rest_reviews.length);
            this.Review_count = reviws.Rest_reviews.length;
          })
          this.apiService.FetchRestaurantDetailsById(this.restaurantId)
            .subscribe((data: any) => {
              this.rest_offers_count = 0;
              // this.loading.dismiss();
              this.restaurantDetails = Object.assign([], data);
              this.Rest_Address = this.restaurantDetails.Address ? this.restaurantDetails.Address.split('|~|').join('') : 0;
              this.lat = this.restaurantDetails ? (this.restaurantDetails.LatLong ? this.restaurantDetails.LatLong.split(",")[0] : 0) : 0;
              this.long = this.restaurantDetails ? (this.restaurantDetails.LatLong ? this.restaurantDetails.LatLong.split(",")[1] : 0) : 0;
              this.cuisines = this.restaurantDetails ? (this.restaurantDetails.Cuisines ? this.restaurantDetails.Cuisines.split(",") : []) : [];
              this.amenities = this.restaurantDetails ? (this.restaurantDetails ? this.restaurantDetails.Amenities.split(",") : []) : [];
              this.offers = this.restaurantDetails ? (this.restaurantDetails.Offers ? this.restaurantDetails.Offers.split(",") : []) : [];
              this.offers.forEach(off => {
                if (off != "|~|")
                  this.rest_offers_count++;
              })
              this.restoGallery = this.restaurantDetails ? (this.restaurantDetails.GalleryImages ? this.restaurantDetails.GalleryImages.split(",") :
                ['assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg'])
                : ['assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg'];
                //  this.displayMap(this.restaurantDetails);
              })
            
        })
        
      }, 500);
           
    } else {
      this.rest_offers_count = 0;
      setTimeout(() => {
        this._ngZone.run(() => {
          this.restaurantDetails = Object.assign([], this.navParams.get("resto"));
          console.log(this.restaurantDetails)
          // this.loading.dismiss();
          this.Rest_Address = this.restaurantDetails.Address ? this.restaurantDetails.Address.split('|~|').join('') : 0;
          this.restaurantId = this.restaurantDetails.RestaurantId;
          this.lat = this.restaurantDetails ? (this.restaurantDetails.LatLong ? this.restaurantDetails.LatLong.split(",")[0] : 0) : 0;
          this.long = this.restaurantDetails ? (this.restaurantDetails.LatLong ? this.restaurantDetails.LatLong.split(",")[1] : 0) : 0;
          this.cuisines = this.restaurantDetails ? (this.restaurantDetails.Cuisines ? this.restaurantDetails.Cuisines.split(",") : []) : [];
          this.amenities = this.restaurantDetails ? (this.restaurantDetails.Amenities ? this.restaurantDetails.Amenities.split(",") : []) : [];
          this.offers = this.restaurantDetails ? (this.restaurantDetails.Offers ? this.restaurantDetails.Offers.split(",") : []) : [];
          this.offers.forEach(off => {
            if (off != "|~|")
              this.rest_offers_count++;
          })
          this.restoGallery = this.restaurantDetails ? (this.restaurantDetails.GalleryImages ? this.restaurantDetails.GalleryImages.split(",") :
            ['assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg'])
            : ['assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg', 'assets/images/homebanner.jpg'];
            // this.displayMap(this.restaurantDetails);
          })
        
      }, 500);

    }
    
  }

  backToSearch() {
    this.navCtrl.pop();
  }


  displayMap(restaurantDetails) {
    const myLatlng = new google.maps.LatLng(restaurantDetails.LatLong.split(",")[0], restaurantDetails.LatLong.split(",")[1]);
    var mapProp = {
      center: myLatlng,
      zoom: 15,
      scrollwheel: false,
      gestureHandling: 'cooperative'

    };
    console.log(myLatlng);
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map.panTo(myLatlng);
    var markeraa = new google.maps.Marker({
      position: myLatlng,
      map: this.map,
      icon: 'https://codeshare.co.uk/images/blue-pin.png',

    });
    var infowindow = new google.maps.InfoWindow({
      content: restaurantDetails.Name,
      map: this.map,
      position: myLatlng
    });
    
    this.map.setCenter(myLatlng);
    this.map.setZoom(16);


  }



  openSlideshow(slidesType: string) {
    let slides: Array<any> = [];

    if (slidesType == 'gallery') {
      slides = Object.assign([], this.restoGallery);
    } else {
      slides = Object.assign([], this.restaurantDetails.MenuImages ?
        this.restaurantDetails.MenuImages.split(',') : ['assets/images/homebanner.jpg', 'assets/images/homebanner.jpg']);
    }
    if(slides.length>0){
      let profileModal = this.modalCtrl.create('RestoMenuPage',
      { slides: slides, type: slidesType });
      profileModal.present();
    }
    
    
  }

  launchDialer() {
    let alert = this.alertCtrl.create({
      subTitle: 'The phone number is invalid',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss().then(() => {
              console.log('alert dismissed');
            })
          }
        }
      ]
    })

    let phoneNumber = this.restaurantDetails.ContactNumber.split(",")[0];
    if (phoneNumber != null) {
      this.callNumber.callNumber(phoneNumber, false)
        .then(() => console.log('Launched dialer!'))
        .catch(() => {
          alert.present().then(() => {
            console.log('alert present');
          }).catch(err => {
            console.log
          }
          )
        });
    } else {
      alert.present().then(() => {
        console.log('alert present');
      }).catch(err => {
        console.log(err.message);
      })
    }

  }

  selectThisRestaurant(resto: any) {

    console.log("catch : " + this.navParams.get("catchup"));
    console.log("flow: " + this.navParams.get("flow"));
    console.log(this.navParams.get("EventDetails"));
    if (this.navParams.get("catchup") == "catchupstateEventeditaddress") {
      console.log("1222" + this.navParams.get("from"));
      if (this.navParams.get("from") == "set-availability_address") {

        console.log("13");

        let result = this.UpdateEventDetails(this.navParams.get("Eventid"), resto.RestaurantId);
        console.log(resto.RestaurantId);

        this.navCtrl.push('SetAvailabilityPage', { from: 'restaurantList', restaurant: resto, Booking_type: "Booking", EventDetails: this.navParams.get("EventDetails") });
      }
      else {
        let result = this.UpdateEventDetails(this.navParams.get("Eventid"), resto.RestaurantId);
        console.log(resto.RestaurantId);

        //this.navCtrl.push('SetAvailabilityPage', { from: 'restaurantList', restaurant: resto, Booking_type: "Booking", EventDetails: this.navParams.get("EventDetails") });
        this.navCtrl.push('SetAvailabilityPage', { from: 'selected_restaurantListaddress', restaurant: resto, Booking_type: "No-Booking", EventDetails: this.navParams.get("EventDetails") });

      }
    }
    // if( this.navParams.get("flow")=='Catch-up over a Meal'){
    //   this.Eventid=this.navParams.get("Eventid");
    //   this.UpdateEventDetails(this.Eventid, resto.RestaurantId).then(res=>{
    //     this.navCtrl.push('SetAvailabilityPage', { from: 'restaurantList', restaurant: resto, Booking_type: "Booking", EventDetails: this.navParams.get("EventDetails") });
    //   })
    // }
    else if (this.navParams.get("flow") == 'funch') {
      //&& this.navParams.get("from")=='restaurants'
      this.storage.get("EventLocationDateTime").then(data => {
        this.locationChosen = data.location;
        this.timeChosen = data.time;
        this.dateChosen = data.date;

        this.navCtrl.push('InviteSummaryPage', {
          from: 'restaurantList', _time: this.timeChosen, _date: this.dateChosen,
          location: this.locationChosen, invitees: this.chosenInvitees, restaurant: resto
        });

      }).catch(err => {
        console.log(err.message);
      })
    }
    else if (this.navParams.get("from") == 'invitesummary') {

      this.storage.get("EventLocationDateTime").then(data => {
        this.locationChosen = data.location;
        this.timeChosen = data.time;
        this.dateChosen = data.date;

        this.navCtrl.push('InviteSummaryPage', {
          from: 'restaurantList', _time: this.timeChosen, _date: this.dateChosen,
          location: this.locationChosen, invitees: this.chosenInvitees, restaurant: resto
        });

      }).catch(err => {
        console.log(err.message);
      })
    }
    else {
      this.storage.get("EventLocationDateTime").then(data => {
        this.locationChosen = data.location;
        this.timeChosen = data.time;
        this.dateChosen = data.date;

        this.navCtrl.push('InviteSummaryPage', {
          from: 'restaurantList', _time: this.timeChosen, _date: this.dateChosen,
          location: this.locationChosen, invitees: this.chosenInvitees, restaurant: resto
        });

      }).catch(err => {
        console.log(err.message);
      })
    }
  }
  async UpdateEventDetails(Event_id: any, Rest_id: any): Promise<any> {
    return await this.loteasyService.fetch('get', 'UpdateEventDetails', { Event_id: Event_id, Rest_id: Rest_id });
  }
  UpdateRestoLike() {
    let alertCtrl = this.alertCtrl.create({
      message: 'Thank you for giving like to this Restaurant!',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    })
    this.storage.get("userDetails").then((details: any) => {
      let userId = details.UserId;
      this.apiService.UpdateRestoLike(userId, this.restaurantId)
        .subscribe(resp => {

          alertCtrl.present();
        })
    }).catch(err => {
      console.log(err.message);
    })
  }

  openModal(modal: any) {

    let data: any;
    let name = this.restaurantDetails.Name;
    if (modal == 'cuisines') {
      data = this.restaurantDetails.Cuisines;

      this.navCtrl.push('CuisinesModalPage', { modalType: 'Cuisines', name: name, Restuarntid: this.restaurantId, data: data, icon: '../assets/images/common/Cusines-icon-big.svg' });
    } else if (modal == 'amenities') {
      data = this.restaurantDetails.Amenities;
      this.navCtrl.push('CuisinesModalPage', { modalType: 'Amenities', name: name, Restuarntid: this.restaurantId, data: data, icon: '../assets/images/common/Cusines-icon-big.svg' });
    } else if (modal == 'reviews') {
      data = this.restaurantDetails.Reviews;
      if(data){
        this.navCtrl.push('CuisinesModalPage', { modalType: 'Reviews', name: name, Restuarntid: this.restaurantId, data: data, icon: '../assets/images/common/Cusines-icon-big.svg' });
      }
     
    } else {
      data = this.restaurantDetails.Offers;
      this.navCtrl.push('CuisinesModalPage', { modalType: 'Offers', name: name, Restuarntid: this.restaurantId, data: data, icon: '../assets/images/common/Cusines-icon-big.svg' });
    }


  }




}
