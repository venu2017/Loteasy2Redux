import { Component, ViewChild } from '@angular/core';
import {
    IonicPage, NavController, NavParams, Platform, LoadingController, AlertController,
    ModalController, ToastController, Navbar
} from 'ionic-angular';
import { GeolocationService } from '../../services/geolocation';
import { GeocoderService } from '../../services/geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/Storage';
import { DatePicker } from '@ionic-native/date-picker';
import { Diagnostic } from '@ionic-native/diagnostic';
import { DatePipe } from '@angular/common';
import { ApiServices } from '../../services/appAPIServices';
import { LoadingCreator } from '../../services/loadingcreator';
declare var google: any;

@IonicPage()
@Component({
    selector: 'page-choose-location-datetime',
    templateUrl: 'choose-location-datetime.html',
})
export class ChooseLocationDatetimePage {
    selectedAddress: any;
    addressList: any[] = [];
    formattedAddress: any;
    city: string = "";
    addressOne: string = "";
    addressTwo: string = "";
    location: string;
    _today: any;
    _timeNow: any;
    userId: any;
    fromPage: any;
    flowName: any;
    isFlowNamePlanAGetTogether: boolean;
    allFieldsNotAvailable: boolean;
    calendarIcon: boolean = false;
    clockIcon: boolean = false;
    selectedContactsTab: string = "#selected";
    allContactsTab: string = "#contacts";
    buddiesTab: string = "#buddies";
    public selectedDevice: any;
    invitees: Array<any> = [];
    restaurant: any;
    private Occasions_list: any[] = [];
    public getcurrenttime: any;
    public loading: any;
    public hours: any;
    public Minutes: any;
    public Title_heading: any;
    public datePickerConfig = {

        btnClasses: 'dateClass',
        navBtnClasses: 'sideNavBtnClass',
        showDays: false,
        selectedItemClass: 'selectedDateClass',
        selectedDateFormat: 'dd/MM/yyyy',
        dateVal: new Date().getDate()
        // dayFormat:'EEEE'
    };
    @ViewChild('dateTime') dateTime;
    @ViewChild(Navbar) navBar: Navbar;
    constructor(public navCtrl: NavController, public navParams: NavParams, public service_call: ApiServices,
        public loadingCtrl: LoadingController, public modalCtrl: ModalController,
        public geoService: GeolocationService, public _geocode: GeocoderService, public datepipe: DatePipe,
        private datePicker: DatePicker, public toastCtrl: ToastController, public alertctr: AlertController,
        public storage: Storage, public platform: Platform, public diagnostic: Diagnostic, public geoLocation: Geolocation,
        public loadingCreator: LoadingCreator) {

        this.isFlowNamePlanAGetTogether = false;
        this.service_call.FetchOccasiondetails().subscribe(details => {
            this.Occasions_list = details.Album_details;
        })


        this.storage.get("userDetails").then(data => {
            this.userId = data.UserId;
        }).catch(err => {
            console.log(err.message);
        })

        this.getcurrenttime = new Date();
        let latest_date = this.datepipe.transform(this.getcurrenttime, 'HH:mm');

        this._today = null;
        this._timeNow = null;
        this.allFieldsNotAvailable = true;
    }



    async ionViewWillEnter() {

        this.formattedAddress = '';

        this.fromPage = this.navParams.get("from");
        this.flowName = this.navParams.get("flowName");
        if (this.flowName == 'plan') {
            this.Title_heading = "It\'s Party Time!";
            this.isFlowNamePlanAGetTogether = true;
        } else {
            this.Title_heading = "Start a Hangout"
            this.isFlowNamePlanAGetTogether = false;
        }
        let navigatedFrom = this.navParams.get("Edit_from");

        if (navigatedFrom == undefined) {

            this.platform.ready().then((readySource) => {

                this.diagnostic.isLocationEnabled().then(
                    (isAvailable) => {

                        if (!isAvailable) {


                            let alert1 = this.alertctr.create({
                                title: 'Error on GPS',
                                message: 'Error on GPS You need active the GPS',
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

                                            let value = this.diagnostic.switchToLocationSettings();
                                            this.switchToLocationSettings().then((data) => {


                                                this.fetchAddress();
                                            })
                                                .catch(err => {

                                                })
                                        }
                                    }
                                ]
                            })

                            alert1.present();


                        }
                        else {
                            console.log("enter")
                            this.getCurrentLocationFromGeocode();

                        }

                    }).catch((e) => {
                        console.log(e);

                    });


            });
        }

        else if (navigatedFrom == 'editLocation') {

            this.formattedAddress = this.navParams.get("selectedAddress");

        }
        else if (navigatedFrom == 'RecentLocation') {

            let address = this.navParams.get("selectedAddress").Address.split(",");

            address.forEach(element => {

                this.formattedAddress = this.formattedAddress + element
            });
        }
        else if (navigatedFrom == 'EditLocationRecentLocation') {

            this.storage.get("recentAddressesList").then((items: any) => {
                //if recent location exist  
                if (items != null) {



                    if (!items) return;
                    let filteredList = items.filter(item => item != '');
                    if (!filteredList) return;
                    else {
                        this.city = "Hyderabad";
                        this.formattedAddress = filteredList[0].Address;
                    }



                }
                //if recent location does not exist
                else {

                    this.formattedAddress = "Hyderabad";


                }
            }).catch(err => {
                console.log(err);
            })
        }


        //end

        if (this.fromPage != 'invitesummary') {
            this.datePickerConfig.dateVal = new Date().getDate();
            this.userId = this.navParams.get("userId");


        }
        else {

            if (this.navParams.get("EventType") == "PlanTogether") {

                this.flowName = "plan";
                this.isFlowNamePlanAGetTogether = true;
                this.selectedDevice = this.navParams.get("occasiontype");

            }


            var iso_date = new Date().toISOString().split("T");
            var created_dates = new Date(this.datepipe.transform(this.navParams.get("Date_Selected"), 'MM-dd-yyyy') + " " + this.navParams.get("time_selected"));
            this.hours = created_dates.getHours() % 12;
            this.hours = this.hours ? this.hours : 12;
            this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
            this.Minutes = created_dates.getMinutes() < 10 ? '0' + created_dates.getMinutes() : created_dates.getMinutes();
            var value = iso_date[0] + "T" + this.hours + ":" + this.Minutes + ":00";
            this.dateTime.setValue(value);



            this.allFieldsNotAvailable = false;

        }




    }

    switchToLocationSettings(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.diagnostic.switchToLocationSettings());
            reject(new Error('failed'));

        })



    }


    fetchAddress() {
        this.getCurrentLocationFromGeocode();

    }

    getCurrentLocationFromGeocode() {
        this.platform.ready().then(() => {
            let loading = this.loadingCtrl.create({
                spinner: 'hide',
              });

            loading.data.content = this.loadingCreator.getLoadingSymbol();
            loading.present();
            
            this.geoService._geolocate({ enableHighAccuracy: true, timeout:120000,maximumAge:600000 }).then((res) => {
                console.log(res)
                // this.geoLocation.watchPosition({enableHighAccuracy:true,timeout:20000,maximumAge:300000})
                // .subscribe(pos=>{
                //     console.log(pos);
                    let latlng: any = { lat: res.coords.latitude, lng: res.coords.longitude };
                    this.storage.set("latlong", latlng).then(() => {
                        loading.dismiss();
                        this._geocode._reverseGeocode(latlng).then((address: any) => {
                            this.formattedAddress = address[0].formatted_address;
                            this.city = address[0].address_components[4].long_name;
                            this.addressOne = address[0].address_components[1].long_name + ','
                                + address[0].address_components[0].long_name;
                            this.addressTwo = address[0].address_components[2].long_name;
                            
                        }).catch((err) => {
                            console.log(err);
                            loading.dismiss();
                        });
                    }).catch((err: any) => {
                        console.log(err.message);
                        loading.dismiss();
                    })
    
                   
                // })
               
            }).catch((err) => {
                console.log(err);
                loading.dismiss();
            })
        })
    }



    navigateBackToHomeTab() {
        this.navCtrl.push('HomePage');
    }
    navigateToEditLocation() {
        this.navCtrl.push('EditLocationPage', { "flowName": this.flowName });
    }
    onChange($event) {

    }
    Error_msg(msg) {

        let toast = this.toastCtrl.create({
            message: msg,
            duration: 1500,
            position: 'bottom'
        })
        toast.present();
    }
    proceedToChooseInvitees() {
        this.storage.set("Plan_a_GetTOGETHER", { flowType: this.flowName, Selected_event: this.selectedDevice })
        if ((this._timeNow != null || this._timeNow != undefined) && (this._today != null || this._today != undefined)) {
            var objDate = new Date(this._today.split("-").reverse().join("-"));
            var startDate = Date.parse(objDate.toDateString());
            var present_date = new Date();
            let Event_complete_date = new Date(this.datepipe.transform(startDate, 'MM/dd/yyyy') + " " + this._timeNow.split(' ')[0])

            if (Event_complete_date < present_date) {

                this._timeNow = this.formatAMPM(this._timeNow.split(':'));;
                this.Error_msg('Please select event schedule ahead of the current time')
            }
            else {


                this._timeNow = this.formatAMPM(this._timeNow.split(':'));;

                this.loading = this.loadingCtrl.create({
                    spinner: 'hide',

                })
                this.loading.data.content = this.loadingCreator.getLoadingSymbol();
               this.loading.present();
                this.addressList.push({

                    "Address": this.formattedAddress + this.city,
                    "SavedType": "icon"
                })

                setTimeout(() => {
                    this.storage.get("recentAddressesList").then((addresses: any) => {
                        if (addresses) addresses.forEach(address => {
                            this.addressList.push(address);
                        });

                    }).catch((err: any) => {
                        console.log(err.message);
                    });
                }, 500)


                this.storage.set("EventLocationDateTime", {
                    location: this.formattedAddress,
                    time: this._timeNow, date: this._today
                }).then(() => {
                    if (this.fromPage != 'invitesummary') {
                        this.storage.set("recentAddressesList", this.removeDuplicates(this.addressList, 'Address')).then((res: any) => {
                        }).catch(() => {
                            console.log("Error storing " + this.addressList);
                        })

                        this.loading.dismiss();
                        this.navCtrl.push('ChooseInviteesPage', {
                            _address: this.formattedAddress +
                                this.city, _timeSelected: this._timeNow, _dateSelected: this._today, userId: this.userId, from: 'chooseLocationDateTime', flowType: this.flowName
                        });
                    } else {
                        this.storage.get("eventParams").then(data => {
                            this.invitees = Object.assign([], data.invitees);
                            this.loading.dismiss();
                            this.storage.set("eventParams", { location: this.formattedAddress, date: this._today, time: this._timeNow, invitees: this.invitees, restaurant: data.restaurant })
                                .then(() => {
                                    this.navCtrl.push('InviteSummaryPage', { from: 'chooseLocationDateTime', time_selected: this._timeNow, Date_Selected: this._today, _address: this.formattedAddress })
                                })

                        })
                    }
                }).catch(err => {
                    console.log(err.message);
                })


            }
        }





    }


    formatAMPM(date) {

        var hours = date[0];
        var minutes = date[1].substring(0, 2);

        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours < 10 ? '0' + hours : hours;

        var strTime = hours + ':' + minutes + ' ' + ampm;

        return strTime;
    }

    tidyDate(theDate) {
        var parts = theDate.toString().split(/[:\s]+/);

        var month = theDate.getMonth() + 1;
        var AMPM = " AM";

        if (parseInt(parts[4]) >= 12) {
            AMPM = " PM";
        }
        month = month < 10 ? '0' + month : month;
        return parts[2] + "-" + month + "-" + parts[3];
    }

    dateChangeHandler(event: any) {

        // this.chooseDate();
        this._today = this.tidyDate(event);

    }
    chooseTime() {
        this.datePicker.show({
            date: new Date(),
            mode: 'time',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
        }).then(
            time => {
                this._timeNow = this.tidyTime(time);
                this.clockIcon = false;
                // this.showClockIcon();
                if ((this._timeNow != null || this._timeNow != undefined) && (this._today != null || this._today != undefined)) {
                    this.allFieldsNotAvailable = false;

                }

            }),
            (err => console.log('Error occurred while getting date: ', err)
            );


    }

    tidyTime(theDate) {
        // split up the string into parts separated by colons or whitespace
        var parts = theDate.toString().split(/[:\s]+/);
        // Get the number of the month - Don't forget that it's zero-indexed
        var month = theDate.getMonth() + 1;
        // Let's say that it's morning
        var AMPM = " AM";
        // But we should check whether it's after noon
        if (parseInt(parts[4]) >= 12) {
            AMPM = " PM";
        }
        return parts[4] + ":" + parts[5] + AMPM;
    }
    showCalendarIcon() {
        this.calendarIcon = !this.calendarIcon;
    }

    showClockIcon() {
        this.clockIcon = !this.clockIcon;
    }


    async getMonthDayDateYearGivenNumberOfDays(days: number): Promise<any> {
        let daysObj = {};
        let daysObjArr = [];
        let today = new Date();
        for (var i = 0; i < days; i++) {
            let calcDateVal = today.getTime() + (i * 24 * 60 * 60 * 1000);
            let calcDate = new Date(calcDateVal).getDate();
            let calcDay = new Date(calcDateVal).getDay();
            let calcMonth = new Date(calcDateVal).getMonth();
            let calcYear = new Date(calcDateVal).getFullYear();
            /* daysObj.day=calcDay;
            daysObj.date= calcDate;
            daysObj.month = calcMonth; */
            daysObjArr.push({ day: calcDay, date: calcDate, month: calcMonth, year: calcYear });
        }
        return await new Promise((resolve, reject) => {
            JSON.stringify(daysObjArr);
        });
    }
    removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject = {};
        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }
        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }
    //validation of select button
    Check_timeDate() {

        if (this.flowName == 'plan') {
            if ((this._timeNow != null || this._timeNow != undefined) && (this._today != null || this._today != undefined) && (this.selectedDevice != null || this.selectedDevice != undefined)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            if ((this._timeNow != null || this._timeNow != undefined) && (this._today != null || this._today != undefined)) {
                return false;
            }
            else {
                return true;
            }
        }
    }


}