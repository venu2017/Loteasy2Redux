import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform } from 'ionic-angular';
import { ApiServices } from '../../services/appAPIServices';
import { Storage } from '@ionic/Storage';
import { AppConstants } from '../../assets/appConstants';
import { Contacts } from '@ionic-native/contacts';
import { LoteasyService } from '../../services/loteasyService';
import { LoadingCreator } from '../../services/loadingcreator';
@IonicPage()
@Component({
selector: 'page-invitee-status',
templateUrl: 'invitee-status.html',
})
export class InviteeStatusPage {
public Userid:any;
public loading:any;
public Eventid:any;
public Pending_count:any;
public Accepted_count:any;
public Rejected_count:any;
public Pending_array:any[]=[];
public Accepted_array:any[]=[];
public Rejected_array:any[]=[];
public Rest_name:any;
public Cost_two:any;
public Address:any;
public Estmated_cost:any;
public Estimated_members:any;
public Event_date:any;
public Event_month:any;
public Event_time:any;
public cloudinary_pic:any;
public cancelEvent:boolean = false;
public Estimated_time:any;
public User_list_contacts:any[]=[];
public Register_users:any[]=[];
private profile_img:any;
public testing:any;
public Dummy_address:any;
public InviteSummaryDesc:any;
public Title_heading:any;
public titleHeadingRaw:any;
public  tabBarElement: any;
constructor(public navCtrl: NavController,platform: Platform, 
    public LotEasyservice_call:LoteasyService, private contacts:Contacts,
    public navParams: NavParams,public Service_call:ApiServices,
    public loadingCtrl:LoadingController,private storage:Storage, public loadingCreator:LoadingCreator) {
    this.Eventid= this.navParams.get("Eventid_status");
    this.isAndroid = platform.is('android');
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
this.storage.get("userDetails").then((user_details:any)=>{
this.Userid=user_details.UserId;
})

this.loading = this.loadingCtrl.create({

spinner:'hide',
duration: 4000
})
this.loading.data.content = this.loadingCreator.getLoadingSymbol();


this.loading.present();


}


  isAndroid: boolean = true;
async ionViewDidEnter(){
    console.log(this.navParams.get("EventTitle"))
if(this.navParams.get("EventTitle")!=null || this.navParams.get("EventTitle")!=undefined)
{  console.log("inviteess")
this.Title_heading=this.navParams.get("EventTitle");

   
}
else
{
    console.log("frominviteesummary")
    this.storage.get("Plan_a_GetTOGETHER").then(plan_details=>{

                  
        if(plan_details.flowType=='plan')
      {
          this.Title_heading="It\'s Party Time!";
          this.titleHeadingRaw = 'itspartytime'
    }
    else
    {
        this.Title_heading="Start a Hangout";
        this.titleHeadingRaw = 'startahangout';
    }
})
}
this.testing = "Pending";
let Created_event=await this.GetEventDetails(this.Eventid);

this.Rest_name=Created_event.EvtDetails[0].Name;
this.Cost_two=Created_event.EvtDetails[0].CostForTwo;
this.Address=Created_event.EvtDetails[0].Address.split('|~|').join('');
var objDate = new Date(Created_event.EvtDetails[0].EventDate.split("-").reverse().join("-"));
this.Event_month=objDate.toLocaleString("en-us", { month: "short" });
this.Event_time=Created_event.EvtDetails[0].EventTime;
this.Event_date=Created_event.EvtDetails[0].EventDate.split("-")[0];
this.Dummy_address=Created_event.EvtDetails[0].Event_Address;
this.InviteSummaryDesc=Created_event.EvtDetails[0].InviteSummaryDesc;
 let List_Registered_users= await  this.GetUsersRegisters();

List_Registered_users.Reg_users.forEach(element => {
    
this.Register_users.push({
"UserName":element.UserName,
"UserProfileImg":element.UserProfileImg,
"PhoneNumber":element.PhoneNumber
})
});

let phoneContacts = await this.getAllPhoneContacts();
phoneContacts.forEach(contact=>{
if(contact.phoneNumbers!=null )
{ 
this.profile_img="";
  let formattedNumber = contact.phoneNumbers[0].value.replace(/[^0-9+]/g, '')

  let profile_img="";
let user_index=this.Register_users.findIndex(user=>user.PhoneNumber==formattedNumber.split('').splice(formattedNumber.length-10).join(''))

  if(user_index>-1){
  
this.profile_img="https://res.cloudinary.com/venu2017/image/upload/v1517981740/root/profile_pics/"+this.Register_users[user_index].UserProfileImg;
  }
  else
  {
    this.profile_img="assets/images/Single Contact Icon.svg";
  }
  this.User_list_contacts.push({
    "phone":formattedNumber.split('').splice(formattedNumber.length-10).join(''),
    "Name": contact.displayName,
    "profile": this.profile_img
   

    })
  
  
  this.User_list_contacts = this.removeDuplicates(this.User_list_contacts);   


}


})

let Event_status=await this.GetEventCompleteDetails(this.Eventid);

this.loading.dismiss();

    this.Pending_count=Event_status.PendingCount;
    this.Accepted_count=Event_status.Accepted_Count;
    this.Rejected_count=Event_status.RejectedCount;
    
    this.Estmated_cost= (this.Cost_two/2)*parseInt( this.Pending_count+this.Rejected_count+this.Accepted_count+1);
    this.Estimated_members=parseInt( this.Pending_count+this.Rejected_count+this.Accepted_count+1);
    for(var i=0;i<Event_status.EventDeails.length;i++){
        if(Event_status.EventDeails[i].profile_pic=="No Pic")   
        this.cloudinary_pic="assets/images/Single Contact Icon.svg"
        else
        this.cloudinary_pic= AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH+Event_status.EventDeails[i].profile_pic
        AppConstants.CLOUDINARY_FETCH_IMAGE_BASE_PATH
   
        let index=this.User_list_contacts.findIndex(cont=>cont.phone==Event_status.EventDeails[i].MobileNumber);
       let Invitee_name="";
       
        if(index>-1){
       
        Invitee_name=this.User_list_contacts[index].Name;
        }
        else
        {
            Invitee_name=   Event_status.EventDeails[i].Invitee_name
        }
        if(Event_status.EventDeails[i].Event_status==0)
    {
    
    this.Pending_array.push({
    "Profilepic": this.cloudinary_pic,
    "Name":Invitee_name,
    "Decline":Event_status.EventDeails[i].DecinedMsg,
    "MobileNumber":Event_status.EventDeails[i].MobileNumber,
    "EstdTime":Event_status.EventDeails[i].StatuUpdatedTime,
    })

    }
    if(Event_status.EventDeails[i].Event_status==1)
    {
    this.Accepted_array.push({
    "Profilepic": this.cloudinary_pic,
    "Name":Invitee_name,
    "Decline":Event_status.EventDeails[i].DecinedMsg,
    "MobileNumber":Event_status.EventDeails[i].MobileNumber,
    "EstdTime":Event_status.EventDeails[i].StatuUpdatedTime,
    })
    }
    if(Event_status.EventDeails[i].Event_status==2)
    {
     
    this.Rejected_array.push({
    "Profilepic": this.cloudinary_pic,
    "Name":Invitee_name,
    "Decline":Event_status.EventDeails[i].DecinedMsg,
    "MobileNumber":Event_status.EventDeails[i].MobileNumber,
    "EstdTime":Event_status.EventDeails[i].StatuUpdatedTime,
    })
    }

  
    }
 
}
 removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
  }
  ionViewWillEnter(){
    this.tabBarElement.style.display = 'none';
  }
  
  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }
async getAllPhoneContacts():Promise<any>{
    return await this.contacts.find(['displayName', 'name', 'phoneNumbers'], {filter: "", multiple: true, desiredFields:['displayName', 'name', 'phoneNumbers']})
  }

  async GetEventDetails(Event_id):Promise<any>{

    return await this.LotEasyservice_call.fetch('get',"GetEventCompleteDetails",{Event_id:Event_id})
  }

async GetUsersRegisters():Promise<any>{
    return await this.LotEasyservice_call.fetch('get','GetRegisteredUsers',{});
  }

async GetEventCompleteDetails(EventId:any):Promise<any>{


    return await this.LotEasyservice_call.fetch('get','GetPendingAcceptDeclineStatusOfInvitees',{EventId:EventId})
  }
EventStatusChange(status_event):void{

    if(status_event=='1')
    {
        this.Service_call.UpdateEventStatusByowner(this.Userid,this.Eventid,status_event,'').subscribe((ownerupdateevent)=>{
            this.navCtrl.push('EventsPage')
            })
    }
    else
    {
        this.Service_call.UpdateEventStatusByowner(this.Userid,this.Eventid,status_event,'').subscribe((ownerupdateevent)=>{
            this.navCtrl.push('InvitesPage')
            })
    }

}

showDialog(val):void{

    this.cancelEvent=true;
}
Navigate_status():void{

    this.storage.get("Invitespage").then((navigation:any)=>{

        if(navigation.Invitnavigation=="invitees_page"){
        
            this.navCtrl.push('InvitesPage');
        }
        else
        {

            this.navCtrl.push('HomePage');
        }
        })

}

navigateToOrderFoodPage(){
    this.navCtrl.push('OrderFoodPage',{from:'InviteStatusPage'})
}
}