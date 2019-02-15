import { Component, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';
import { CallNumber } from '@ionic-native/call-number';
import { ApiServices } from '../../services/appAPIServices';
import { Storage } from '@ionic/Storage';
import { AppConstants } from '../../assets/appConstants';
import { LoteasyService } from '../../services/loteasyService';
import { LoadingCreator } from '../../services/loadingcreator';
interface Buddy {
    buddy: any;
    checked: boolean;
}
@IonicPage()
@Component({
    selector: 'page-choose-invitees',
    templateUrl: 'choose-invitees.html',
})
export class ChooseInviteesPage {
    cloudImagePath: any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
    public NotSelected: any;
    fromPage: any;
    isContactPhotoNull: boolean;
    public user_list_contacts: any[] = [];
    autocompleteContatcs: { input: string; };
    autocompleteContacstList: any[] = [];
    showContactsSearchResults: boolean;
    selectedContacts: any[] = [];
    buddiesList: Array<Buddy> = [];
    selectedAddress: any;
    selectedDate: any;
    selectedTime: any;
    noMatchFound: boolean;
    showphonecontacts: boolean = false;
    selectedInvitees: any[] = []
    showTabbedView: boolean;
    userId: any;
    public activatesearch: any;
    allContactList: any[] = []
    phoneContacts: Array<any> = [];
    cloudinaryPhotoPath: any = AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH;
    enableProceedToButton: boolean = false;
    clubbedListOfInvitees: any[] = []
    public Phone_contacts_count: any;
    public editPhonecontacts: any[] = [];
    public Buddies_count: any;
    public AddName: any;
    public EntryPhno: any;
    public Error_msg: any;
    public User_ph: any;
    public user_name: any;
    public Register_users: any[] = [];
    public allFieldsNotAvailable: boolean;
    public Rest_details: any[] = [];
    public Register_phone: any;
    public FlowType: any;
    public profile_img: any;
    public Title_heading: any;
    public testing: any;
    constructor(public navCtrl: NavController, public navParams: NavParams,
        public LotEasyservice_call: LoteasyService,
        public contacts: Contacts, public platform: Platform,
        public zone: NgZone, public sanitizer: DomSanitizer, private callNumber: CallNumber,
        public apiService: ApiServices, public storage: Storage, public loadingCtrl: LoadingController,
        public toastCtrl: ToastController, public loadingCreator: LoadingCreator) {
        this.proceedButton();
        this.testing = "Accepted";
        this.fromPage = this.navParams.get("from");
        this.showContactsSearchResults = false;
        this.autocompleteContatcs = { input: '' };
        this.autocompleteContacstList = [];
        this.selectedContacts = [];
        this.FlowType = this.navParams.get("flowType");
        this.fromPage = this.navParams.get("from");
        if (this.fromPage == 'chooseLocationDateTime') {
            this.selectedAddress = this.navParams.get("_address");
            this.selectedTime = this.navParams.get("_timeSelected");
            this.selectedDate = this.navParams.get("_dateSelected");
        } else {
            this.storage.get("EventLocationDateTime").then(data => {
                this.selectedAddress = data.location;
                this.selectedTime = data.time;
                this.selectedDate = data.date;
            })
        }
        this.noMatchFound = false;
        this.showTabbedView = true;
        //back code
        //end
    }

  
    //end of constructor
    proceedButton() {
        if (this.selectedInvitees.length > 0) {
            this.allFieldsNotAvailable = false;
            this.NotSelected = false;
        }
        else {
            this.allFieldsNotAvailable = true;
            this.NotSelected = true;
        }
    }
    async getAllPhoneContacts(): Promise<any> {
        return await this.contacts.find(['displayName', 'name', 'phoneNumbers'], { filter: "", multiple: true, desiredFields: ['displayName', 'name', 'phoneNumbers'] })
    }



    async GetUsersRegisters(): Promise<any> {
        return await this.LotEasyservice_call.fetch('get', 'GetRegisteredUsers', {});
    }

    public buddiesListdata: any[] = [];

    async ionViewDidEnter() {
        if(this.fromPage == 'invitesummary'){
            this.selectedInvitees = [];
            setTimeout(() => {
                this.storage.get('Invitees_names').then(data=>{
                    this.storage.set('Invitees_names',data).then(()=>{
                        console.log('Invitees_names has been restored')
                    })
                })
            }, 50);
        }
        let Reg_data = await this.GetUsersRegisters();
        Reg_data.Reg_users.forEach(element => {
            this.Register_users.push({
                "UserName": element.UserName,
                "UserProfileImg": element.UserProfileImg,
                "PhoneNumber": element.PhoneNumber
            })
        });
        let phoneContacts = await this.getAllPhoneContacts();

        phoneContacts.forEach((contact, indexedDB) => {
            if (contact.phoneNumbers != null && contact.displayName != null) {
                this.profile_img = "";
                let formattedNumber = contact.phoneNumbers[0].value.replace(/[^0-9+]/g, '')

                if (formattedNumber != this.Register_phone) {
                    this.Phone_contacts_count = indexedDB;
                    let phone_exist = this.Register_users.findIndex(x => x.PhoneNumber == formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
                    if (phone_exist > -1) {
                        this.profile_img = "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[phone_exist].UserProfileImg
                    }
                    else
                        this.profile_img = "assets/images/Single Contact Icon.svg";


                    this.phoneContacts.push({
                        phone: formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
                        checked: false,
                        profileimg: this.profile_img,
                        name: contact.displayName
                    });
                    this.user_list_contacts.push({
                        phone: formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
                        checked: false,
                        profileimg: this.profile_img,
                        name: contact.displayName
                    });
                }

            }
        })
        this.storage.get("Plan_a_GetTOGETHER").then(data => {

            if (data.flowType == "plan") {

                this.Title_heading = "It\'s Party Time!";
            }
            else {
                this.Title_heading = "Start a Hangout"
            }

        })

        this.storage.get("userDetails").then(data => {
            this.Register_phone = data.phone;

        }).catch(err => {
            console.log(err.message);
        })
        this.buddiesList = [];
        this.storage.get("userDetails").then(data => {
            this.userId = data.UserId;
            this.apiService.FetchBuddiesListsByUserId(data.UserId)
                .subscribe(data => {
                    let buddies = JSON.parse(data);
                    this.Buddies_count = buddies.length;
                    buddies.forEach(buddy => {
                        this.buddiesList.push({ buddy: buddy, checked: false });
                    })
                })
        })
        this.fromPage = this.navParams.get("from");
        setTimeout(() => {
            this.zone.run(() => {
                if (this.fromPage == 'invitesummary' || this.fromPage == 'Restuarantpage') {
                    
                    this.storage.get("Selected_Contacts").then(data => {
                        this.allFieldsNotAvailable = false;
                        this.NotSelected = false;
                        data.Selected_Users.forEach((si, indexdb) => {
                            let user_phone = "";
                            let User_name_selected = "";
                            if (si["phoneNumbers[0].value"] == undefined) {
                                user_phone = si._objectInstance["phoneNumbers[0].value"],
                                    User_name_selected = si._objectInstance.displayName
                            }
                            else {
                                user_phone = si["phoneNumbers[0].value"];
                                User_name_selected = si.displayName;
                                let index = this.buddiesList.findIndex(x => x.buddy.BuddiesListName === si.displayName);
                                if (index > -1) {
                                    this.buddiesList[index].checked = true;
                                }
                            }
                            this.selectedInvitees.push({
                                "displayName": User_name_selected,
                                "phoneNumbers[0].value": user_phone,
                                "image": si.image,
                                "buddy_group": si.buddy_group
                            }
                            )
                        })
                    })
                }
            })
        }, 1000);
    }

    filterUniqueItemsfromArray = function (origArr) {
        var newArr = [],
            origLen = origArr.length,
            found, x, y;
        for (x = 0; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newArr.length; y++) {
                if (origArr[x] === newArr[y]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newArr.push(origArr[x]);

            }
        }
        return newArr;
    }
    async onContatsSearch(event) {
        this.phoneContacts = this.user_list_contacts;
        var events = [];
        this.autocompleteContacstList = [];

        let searchContactKeyword = event.target.value.trim().toLowerCase();
        if (!this.activatesearch) {

            this.autocompleteContatcs.input == '' ? this.showContactsSearchResults = true
                : this.showContactsSearchResults = false;
            await this.contacts.find(['displayName', 'name', 'phoneNumbers'], { filter: "", multiple: true, desiredFields: ['displayName', 'name', 'phoneNumbers'] })
                .then(data => {
                    this.allContactList = data;

                    this.allContactList.forEach((contact, indexedDB) => {

                        if (contact.phoneNumbers != null && contact.displayName != null) {

                            this.profile_img = "";
                            let formattedNumber = contact.phoneNumbers[0].value.replace(/[^0-9+]/g, '');
                            let phone_exist = this.Register_users.findIndex(x => x.PhoneNumber == formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
                            if (phone_exist > -1) {
                                this.profile_img = "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[phone_exist].UserProfileImg
                            }
                            else
                                this.profile_img = "assets/images/Single Contact Icon.svg";
                            console.log(contact.displayName + "contact.displayName")
                            if (contact.displayName != null) {


                                events.push({
                                    phone: formattedNumber.split('').splice(formattedNumber.length - 10).join(''),
                                    name: contact.displayName,
                                    image: this.profile_img
                                })
                            }
                        }

                    })
                })
            console.log(JSON.stringify(event) + "event")
            this.autocompleteContacstList = events.filter((event) => {
                return event.name.toLowerCase().indexOf(searchContactKeyword) > -1 || event.phone.indexOf(searchContactKeyword) > -1;
            })

            if (this.autocompleteContacstList.length < 1) {
                this.noMatchFound = true;
                this.autocompleteContacstList = [];
                this.showphonecontacts = false;
                //.phoneContacts=[];
            } else {
                this.noMatchFound = false;
                this.autocompleteContacstList = this.filterUniqueItemsfromArray(this.autocompleteContacstList);
            }
            if (this.autocompleteContatcs.input == '') {
                this.noMatchFound = false;
                this.showTabbedView = true;
                this.showphonecontacts = false;
            }
            else
                this.showTabbedView = false;


        }
        else {

            let searchContactKeyword = event.target.value.trim().toLowerCase();




            this.phoneContacts = this.phoneContacts.filter((item, index, self) => {
                return (item.name.toLowerCase().indexOf(searchContactKeyword) > -1
                    || item.phone.indexOf(searchContactKeyword) > -1);
            });

            if (this.phoneContacts.length > 0) {

                this.noMatchFound = false;
            }
            else {
                this.noMatchFound = true;
            }
        }


        //end
        //this.showTabbedView = false;
    }
    selectSearchResultContact(contact: any) {
        this.selectedContacts.push(contact);
    }
    navtigateToChooseDateTime() {
        this.storage.get("Plan_a_GetTOGETHER").then(data => {
            if (data.flowType == "plan") {
                if (this.fromPage == 'invitesummary') {
                    this.onProceedToRestaurants();
                }
                else {
                    this.navCtrl.push('ChooseLocationDatetimePage', { from: 'chooseInvitees', flowName: 'plan' });
                }
            }
            else {

                if (this.fromPage == 'invitesummary') {
                    this.onProceedToRestaurants();
                }
                else {
                    this.navCtrl.push('ChooseLocationDatetimePage', { from: 'chooseInvitees', flowName: 'Funch' });
                }
            }

        })
    }
    remove(arrOriginal, elementToRemove) {
        return arrOriginal.filter(function (el) { return el !== elementToRemove });
    }
    onContactSelected(contact: any) {
        if (contact.phone == this.Register_phone) {
            this.Errormsg();
        }
        else {
            let toast = this.toastCtrl.create({
                message: 'This contact: ' + contact.phone + ' is already selected!',
                duration: 3000,
                position: 'bottom'
            })
            this.zone.run(() => {
                if (this.selectedInvitees.length > 0) {
                    let phone_index = this.selectedInvitees.findIndex(x => x.displayName == contact.name);
                    if (this.phoneContacts.length > 0) {
                        let index = this.phoneContacts.findIndex(x => x.name == contact.name);
                        this.phoneContacts[index].checked = true;
                    }
                    if (phone_index > -1) {
                        toast.present();
                    }
                    else {

                        this.selectedInvitees.push({
                            "displayName": contact.name,
                            "phoneNumbers[0].value": contact.phone,
                            "image": contact.image,
                            "buddy_group": "NotBuddy"
                        }
                        )
                    }
                }
                else {
                    this.selectedInvitees.push({
                        "displayName": contact.name,
                        "phoneNumbers[0].value": contact.phone,
                        "image": contact.image,
                        "buddy_group": "NotBuddy"
                    }
                    )
                }
                this.showTabbedView = true;
                this.noMatchFound = false;
                this.autocompleteContatcs.input = '';
                this.AddName = '';

            })
            this.proceedButton();
        }
    }
    removeContact(contact: any, i: any) {
        this.selectedInvitees.splice(i, 1);

        let phone_index = this.phoneContacts.findIndex(x => x.name == contact.displayName);
        let index_check_contacts = this.selected_user.findIndex(x => x.phone == contact.phone);
        if (index_check_contacts > -1) {
            this.selected_user.splice(index_check_contacts, 1);
        }
        if (phone_index > -1) {
            if (this.phoneContacts[phone_index].checked) {
                this.phoneContacts[phone_index].checked = false;
            }
            else {
                this.phoneContacts[phone_index].checked = true;
            }
        }
        let index = this.buddiesList.findIndex(x => x.buddy.BuddiesListName == contact.displayName);
        if (index > -1) {
            this.buddiesList[index].checked = false;
        }
        this.proceedButton();
        //this.buddiesList[index].checked=false;
    }
    callTheselectedInvitee(phoneNumber: any, i: any) {
        this.callNumber.callNumber(phoneNumber["phoneNumbers[0].value"], false)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }
    callTheInvitee(contact: any, i: number) {
        let phoneNumber = contact.phoneNumbers[0].value;
        this.callNumber.callNumber(phoneNumber, false)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }
    addToBuddyList(contact: any) {


        this.navCtrl.push('AddnewbuddyPage', { UserId: this.userId, contact: contact });
    }
    //count phone numbers
    //end
    public Groupcontact: boolean = false;
    public Singlecontact: boolean = true;
    public GroupContactsDisplay: any;
    displayBuddies(): void {
        this.phoneContacts = this.user_list_contacts;
        this.autocompleteContatcs.input = "";
        this.activatesearch = false;
        this.noMatchFound = false;
    }
    selectedListContacts(): void {
        this.noMatchFound = false;
        this.autocompleteContatcs.input = "";
        this.activatesearch = false;

    }
    async displayAllContacts() {
        this.noMatchFound = false;


        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            duration: 5000
        })

        loading.data.content = this.loadingCreator.getLoadingSymbol();
        loading.present();
        setTimeout(() => {
            loading.dismiss();

        }, 1000);
        this.autocompleteContatcs.input = "";
        this.activatesearch = true;
        this.showphonecontacts = true;



        if (this.selectedInvitees.length > 0) {
            this.phoneContacts = await this.user_list_contacts;
            this.selectedInvitees.forEach(element => {
                let user_phone = "";

                user_phone = element["phoneNumbers[0].value"];
                let phone_index = this.phoneContacts.findIndex(x => x.phone == user_phone);
                if (phone_index > -1)
                    this.phoneContacts[phone_index].checked = true;

            });
        }

    }
    selectimgfordelettion(buddy_name: any, indexdb: any): void {
        let index = this.buddiesList.findIndex(x => x.buddy.BuddiesListName == buddy_name);
        let buddy = this.selectedInvitees.findIndex(x => x.displayName == buddy_name);
        if (buddy > -1) {
            this.selectedInvitees.splice(buddy, 1);
        }
        else {
            let imges = "";
            if (this.buddiesList[index].buddy.BuddiesListProfilePic != "undefined") {
                imges = this.cloudImagePath + this.buddiesList[index].buddy.BuddiesListProfilePic;
            }
            else {
                imges = "assets/images/new buddies group icon.svg";
            }
            console.log(this.buddiesList);
            this.selectedInvitees.push({
                "displayName": buddy_name,
                "phoneNumbers[0].value": indexdb + indexdb + indexdb + indexdb,
                "image": imges,
                "buddy_group": "Buddy"
            }
         )
        }
        // if (this.buddiesList[index].checked) {
        //     this.buddiesList[index].checked = true;
        // }
        // else {
        //     this.buddiesList[index].checked = false;
        // }
        this.proceedButton();
    }
    phonecontactselection(contact_name: any, phone: any): void {

        let index = this.phoneContacts.findIndex(x => x.name == contact_name);

        if (phone == this.Register_phone) {
            this.Errormsg();
        }
        else {
            let phone_exist = this.Register_users.findIndex(x => x.PhoneNumber == phone);
            let profile_pic = "";
            if (phone_exist > -1) {
                profile_pic = "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[phone_exist].UserProfileImg
            }
            else {
                profile_pic = "assets/images/Single Contact Icon.svg"
            }

            console.log(this.phoneContacts);
            if (this.phoneContacts[index].checked) {

                this.selectedInvitees.push({
                    "displayName": contact_name,
                    "phoneNumbers[0].value": phone,
                    "image": profile_pic,
                    "buddy_group": "NotBuddy"
                }
                )
                //
            }
            else {
                this.selectedInvitees.splice(this.selectedInvitees.findIndex(x => x.displayName == contact_name), 1);
            }
            this.proceedButton();


        }
    }
    public checkelemets: any[] = [];
    public selected_user: any[] = [];
    Errormsg() {
        let checkduplicates = this.toastCtrl.create({
            message: "This " + this.Register_phone + " Number is Registered with the device",
            duration: 1000,
            position: 'bottom'
        })
        checkduplicates.present();
    }
    addPhoneNumberToList() {
        if (this.AddName == undefined || this.AddName == null || this.AddName == '') {
            let checkduplicates = this.toastCtrl.create({
                message: "Provider Number Cannot be empty",
                duration: 1000,
                position: 'bottom'
            })
            checkduplicates.present();
        }
        else {

            if (this.selectedInvitees.length == 0) {
                this.selected_user = []; this.checkelemets = [];
            }
            let formattedNumber = this.AddName.replace(/[^0-9+]/g, '');
            //
            if (formattedNumber == this.Register_phone) {
                //reg
                this.Errormsg();
            }
            else {
                this.User_ph = formattedNumber.split('').splice(formattedNumber.length - 10).join('')
                this.noMatchFound = false;
                this.showTabbedView = true;
                this.user_name = this.autocompleteContatcs.input;
                this.autocompleteContatcs.input = '';
                this.AddName = '';
                //  this.adhocPhoneEntries.push(this.autocompleteContatcs.input);
                let index = this.selectedInvitees.findIndex(x => x["phoneNumbers[0].value"] == this.User_ph)
                if (index > -1) {
                    let checkduplicates = this.toastCtrl.create({
                        message: "The Number with " + this.User_ph + " is already added to Invitess",
                        duration: 2000,
                        position: 'bottom'
                    })
                    checkduplicates.present();
                }
                else {
                    this.NotSelected = false;
                    this.selected_user.push({
                        "name": this.user_name,
                        "phone": this.User_ph
                    })
                    // this.checkelemets.push(this.User_ph);
                    let phone_exist = this.Register_users.findIndex(x => x.PhoneNumber == this.User_ph);
                    let profile_pic = ""
                    if (phone_exist > -1) {
                        profile_pic = "https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/" + this.Register_users[phone_exist].UserProfileImg
                    }
                    else {
                        profile_pic = "assets/images/Single Contact Icon.svg";
                    }
                    this.selectedInvitees.push({
                        "displayName": this.user_name,
                        "phoneNumbers[0].value": this.User_ph,
                        "image": profile_pic,
                        "buddy_group": "NotBuddy"
                    }
                    )
                    if (this.activatesearch) {
                        if (this.selectedInvitees.length > 0) {
                        this.phoneContacts = this.user_list_contacts;
                            this.selectedInvitees.forEach(element => {
                                let user_phone = "";
                                if (element["phoneNumbers[0].value"] == undefined) {
                                    user_phone = element._objectInstance["phoneNumbers[0].value"]
                                    let phone_index = this.phoneContacts.findIndex(x => x.contact.phoneNumbers[0].value == user_phone);
                                    if (phone_index > -1)
                                        this.phoneContacts[phone_index].checked = true;
                                }
                                else {
                                    user_phone = element["phoneNumbers[0].value"];
                                    let phone_index = this.phoneContacts.findIndex(x => x.contact.phoneNumbers[0].value == user_phone);
                                    if (phone_index > -1)
                                        this.phoneContacts[phone_index].checked = true;
                                }
                            });
                        }
                    }
                }
                this.proceedButton();
            }
        }
    }

    public selected_contact_names: any[] = [];

    onProceed(){
        this.allFieldsNotAvailable = true;
        this.NotSelected = false;
        let loading = this.loadingCtrl.create({
            spinner: 'hide',

        })
        loading.data.content = this.loadingCreator.getLoadingSymbol();
        loading.present();
        let _buddies = this.buddiesList.filter(buddyList=>{
            return buddyList.checked == true;
        })
        .map(checkedBuddyList=>{
          return JSON.parse(checkedBuddyList.buddy.BuddiesDetails)
          .map(buddy=>{
            let formattedNumber = buddy.phone.replace(/[^0-9+]/g, '');
            let tenDigitNumber = formattedNumber.split('').splice(formattedNumber.length - 10).join('');
              return {name:buddy.name,phone:tenDigitNumber}
          })
            
        });

        _buddies.forEach(b=>{
            this.selected_contact_names.concat(b);
            this.buddiesListdata.push(b.phone)
        })
       

        console.log(_buddies, this.selected_contact_names, this.buddiesListdata);
        this.storage.set("Selected_Contacts", {
            Selected_Users: this.selectedInvitees
        })
            .then(() => {
            }).catch(err => {
                console.log(err.message);
            })
        let selectedInviteesPRAVEEN: any[] = []
        let toast = this.toastCtrl.create({
            message: this.Error_msg,
            duration: 2000,
            position: 'bottom'
        })
        //if(selectedInviteesPRAVEEN.length>0 || buddiesList.length>0 || phoneContacts.length>0 )
        if (this.selectedInvitees.length > 0) {
            if (this.fromPage != 'invitesummary') {
                this.selected_user.forEach(element => {
                    this.selected_contact_names.push({
                        "name": element.name,
                        "phone": element.phone
                    })
                    selectedInviteesPRAVEEN.push(element.phone)
                });
                this.selectedInvitees.forEach(si => {

                    if (si.buddy_group == "NotBuddy" && si["phoneNumbers[0].value"] != undefined) {
                        let formattedNumber = si["phoneNumbers[0].value"].replace(/[^0-9+]/g, '');

                        this.selected_contact_names.push({
                            "name": si.displayName,
                            "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
                        })
                    }

                    if (si.phoneNumbers != undefined || si.phoneNumbers != null) {
                        let formattedNumber = si.phoneNumbers[0].value.replace(/[^0-9+]/g, '');
                        this.selected_contact_names.push({
                            "name": si.displayName,
                            "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
                        })
                        selectedInviteesPRAVEEN.push(formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
                    }
                })

                loading.dismiss();
                let uniqueArray = this.removeDuplicates(this.selected_contact_names, "phone");
                
                    this.storage.set("Invitees_names", { selectedInviteesnames: uniqueArray })
                        .then(() => {
                            if (this.FlowType == "plan") {
                                this.storage.set('eventParams', { location: this.selectedAddress, time: this.selectedTime, date: this.selectedDate, invitees: selectedInviteesPRAVEEN, restaurant: this.selectedAddress })
                                    .then(() => {
                                        setTimeout(() => {
                                            this.navCtrl.push('InviteSummaryPage', {
                                                flow: this.FlowType, from: 'planchooseInvitees',
                                                location: this.selectedAddress, _date: this.selectedDate,
                                                _time: this.selectedTime, selectedInvitees: selectedInviteesPRAVEEN,
                                                buddiesList: this.buddiesListdata
                                            });
                                        }, 200);
                                       
                                    })
                            }
                            else {
                                this.navCtrl.push('RestaurantsListPage', {
                                    flow: this.FlowType, from: 'chooseInvitees',
                                    location: this.selectedAddress, _date: this.selectedDate,
                                    _time: this.selectedTime, selectedInvitees: selectedInviteesPRAVEEN,
                                    buddiesList: this.buddiesListdata
                                });
                            }

                        }).catch(err => {
                            console.log(err.message);
                        })


                
                this.allFieldsNotAvailable = false;
                this.NotSelected = false;
                this.storage.set("Invitees", {
                    selectedInvitees: selectedInviteesPRAVEEN
                        .concat(this.buddiesListdata)
                })
                    .then(() => {
                    }).catch(err => {
                        console.log(err.message);
                    })


            } else {
                this.selectedInvitees.forEach(si => {
                    if (si.buddy_group == "NotBuddy" && si["phoneNumbers[0].value"] != undefined) {
                        this.selected_contact_names.push({
                            "name": si.displayName,
                            "phone": si["phoneNumbers[0].value"].replace(/[^0-9+]/g, '')
                        })
                        selectedInviteesPRAVEEN.push(si["phoneNumbers[0].value"].replace(/[^0-9+]/g, ''));
                    }
                    if (si.buddy_group == undefined && si["phoneNumbers[0].value"] != undefined) {
                        let formattedNumber = si["phoneNumbers[0].value"].replace(/[^0-9+]/g, '');
                        this.selected_contact_names.push({
                            "name": si.displayName,
                            "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
                        })
                        selectedInviteesPRAVEEN.push(formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
                    }
                    if (si["phoneNumbers[0].value"] == undefined) {
                        this.selected_contact_names.push({
                            "name": si._objectInstance.displayName,
                            "phone": si._objectInstance["phoneNumbers[0].value"].replace(/[^0-9+]/g, '')
                        })
                        selectedInviteesPRAVEEN.push(si._objectInstance["phoneNumbers[0].value"].replace(/[^0-9+]/g, ''))
                    }
                })
              let   uniqueArray = this.removeDuplicates(this.selected_contact_names, "phone");
                
                   
                    this.storage.set("Invitees_names", { selectedInviteesnames: uniqueArray })
                        .then(() => {
                            loading.dismiss();
                             this.allFieldsNotAvailable = false;
                            this.NotSelected = false;
                            setTimeout(() => {
                                this.navCtrl.push('InviteSummaryPage', {
                                    from: 'chooseInvitees', flow: this.FlowType,
                                    location: this.selectedAddress, _date: this.selectedDate,
                                    _time: this.selectedTime, selectedInvitees: selectedInviteesPRAVEEN,
                                    buddiesList: this.buddiesListdata
                                });
                            }, 300);
                           

                        }).catch(err => {
                            console.log(err.message);
                        })

                


                this.storage.set("Invitees", { selectedInvitees: selectedInviteesPRAVEEN.concat(this.buddiesListdata) })
                    .then(() => {
                    }).catch(err => {
                        console.log(err.message);
                    })
            }
        }
        else {
            this.Error_msg = "please select alteast one invitee for creating event:";
            toast.present();
        }
        
        // .forEach(selctedBuddy=>{
        //     let phone = selctedBuddy.phone.replace(/[^0-9+]/g, '');
        //     let tenDigitPhone = phone.split('').splice(phone.length - 10).join('');

        // })
    }

    onProceedToRestaurants() {
        this.allFieldsNotAvailable = true;
        this.NotSelected = false;
        let loading = this.loadingCtrl.create({
            spinner: 'hide',

        })
        loading.data.content = this.loadingCreator.getLoadingSymbol();
        loading.present();
        this.buddiesListdata = [];
        this.selected_contact_names = [];
        this.buddiesList.filter(buddy => {
            if (buddy.checked == true) {
                let _buddies = JSON.parse(buddy.buddy.BuddiesDetails);
                _buddies.forEach(b => {
                    let formattedNumber = b.phone.replace(/[^0-9+]/g, '');
                    this.selected_contact_names.push({
                        "name": b.name,
                        "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
                    })
                    this.buddiesListdata.push(formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
                })
            }
        })
        this.storage.set("Selected_Contacts", {
            Selected_Users: this.selectedInvitees
        })
            .then(() => {
            }).catch(err => {
                console.log(err.message);
            })
        let selectedInviteesPRAVEEN: any[] = []
        let toast = this.toastCtrl.create({
            message: this.Error_msg,
            duration: 2000,
            position: 'bottom'
        })
        //if(selectedInviteesPRAVEEN.length>0 || buddiesList.length>0 || phoneContacts.length>0 )
        if (this.selectedInvitees.length > 0) {
            if (this.fromPage != 'invitesummary') {
                this.selected_user.forEach(element => {
                    this.selected_contact_names.push({
                        "name": element.name,
                        "phone": element.phone
                    })
                    selectedInviteesPRAVEEN.push(element.phone)
                });
                this.selectedInvitees.forEach(si => {

                    if (si.buddy_group == "NotBuddy" && si["phoneNumbers[0].value"] != undefined) {
                        let formattedNumber = si["phoneNumbers[0].value"].replace(/[^0-9+]/g, '');

                        this.selected_contact_names.push({
                            "name": si.displayName,
                            "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
                        })
                    }

                    if (si.phoneNumbers != undefined || si.phoneNumbers != null) {
                        let formattedNumber = si.phoneNumbers[0].value.replace(/[^0-9+]/g, '');
                        this.selected_contact_names.push({
                            "name": si.displayName,
                            "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
                        })
                        selectedInviteesPRAVEEN.push(formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
                    }
                })

                loading.dismiss();
                let  uniqueArray = this.removeDuplicates(this.selected_contact_names, "phone");
               
                    this.storage.set("Invitees_names", { selectedInviteesnames: uniqueArray })
                        .then(() => {
                            if (this.FlowType == "plan") {
                                this.storage.set('eventParams', { location: this.selectedAddress, time: this.selectedTime, date: this.selectedDate, invitees: selectedInviteesPRAVEEN, restaurant: this.selectedAddress })
                                    .then(() => {
                                        setTimeout(() => {
                                            this.navCtrl.push('InviteSummaryPage', {
                                                flow: this.FlowType, from: 'planchooseInvitees',
                                                location: this.selectedAddress, _date: this.selectedDate,
                                                _time: this.selectedTime, selectedInvitees: selectedInviteesPRAVEEN,
                                                buddiesList: this.buddiesListdata
                                            });
                                        }, 200);
                                       
                                    })
                            }
                            else {
                                this.navCtrl.push('RestaurantsListPage', {
                                    flow: this.FlowType, from: 'chooseInvitees',
                                    location: this.selectedAddress, _date: this.selectedDate,
                                    _time: this.selectedTime, selectedInvitees: selectedInviteesPRAVEEN,
                                    buddiesList: this.buddiesListdata
                                });
                            }

                        }).catch(err => {
                            console.log(err.message);
                        })


                
                this.allFieldsNotAvailable = false;
                this.NotSelected = false;
                this.storage.set("Invitees", {
                    selectedInvitees: selectedInviteesPRAVEEN
                        .concat(this.buddiesListdata)
                })
                    .then(() => {
                    }).catch(err => {
                        console.log(err.message);
                    })


            } else {
                this.selectedInvitees.forEach(si => {
                    if (si.buddy_group == "NotBuddy" && si["phoneNumbers[0].value"] != undefined) {
                        this.selected_contact_names.push({
                            "name": si.displayName,
                            "phone": si["phoneNumbers[0].value"].replace(/[^0-9+]/g, '')
                        })
                        selectedInviteesPRAVEEN.push(si["phoneNumbers[0].value"].replace(/[^0-9+]/g, ''));
                    }
                    if (si.buddy_group == undefined && si["phoneNumbers[0].value"] != undefined) {
                        let formattedNumber = si["phoneNumbers[0].value"].replace(/[^0-9+]/g, '');
                        this.selected_contact_names.push({
                            "name": si.displayName,
                            "phone": formattedNumber.split('').splice(formattedNumber.length - 10).join('')
                        })
                        selectedInviteesPRAVEEN.push(formattedNumber.split('').splice(formattedNumber.length - 10).join(''));
                    }
                    if (si["phoneNumbers[0].value"] == undefined) {
                        this.selected_contact_names.push({
                            "name": si._objectInstance.displayName,
                            "phone": si._objectInstance["phoneNumbers[0].value"].replace(/[^0-9+]/g, '')
                        })
                        selectedInviteesPRAVEEN.push(si._objectInstance["phoneNumbers[0].value"].replace(/[^0-9+]/g, ''))
                    }
                })
                let uniqueArray = this.removeDuplicates(this.selected_contact_names, "phone");
                setTimeout(() => {
                    this.storage.set("Invitees_names", { selectedInviteesnames: uniqueArray })
                        .then(() => {
                            loading.dismiss();
                            
                            this.allFieldsNotAvailable = false;
                            this.NotSelected = false;
                            this.navCtrl.push('InviteSummaryPage', {
                                from: 'chooseInvitees', flow: this.FlowType,
                                location: this.selectedAddress, _date: this.selectedDate,
                                _time: this.selectedTime, selectedInvitees: selectedInviteesPRAVEEN,
                                buddiesList: this.buddiesListdata
                            });

                        }).catch(err => {
                            console.log(err.message);
                        })

                }, 500);


                this.storage.set("Invitees", { selectedInvitees: selectedInviteesPRAVEEN.concat(this.buddiesListdata) })
                    .then(() => {
                    }).catch(err => {
                        console.log(err.message);
                    })
            }
        }
        else {
            this.Error_msg = "please select alteast one invitee for creating event:";
            toast.present();
        }
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
}