import { Injectable,EventEmitter} from '@angular/core';  
import { Storage } from '@ionic/Storage';
import { EventNotificationService } from '../services/eventNotificationService';
declare var $: any;  
@Injectable()  
export class EventsHubService{
    userId:number;
    userPhoneNumber:any;
    public connection: any; 
    public proxy:any; 
    public messageReceived: EventEmitter < any > ;  
    public connectionEstablished: EventEmitter < Boolean > ;  
    public connectionExists: Boolean;  
    baseUrl:string ='http://loteasysignalr-dev.ap-south-1.elasticbeanstalk.com';
    constructor(private storage:Storage, private eventNotifiService:EventNotificationService){
       this.connection = $.hubConnection(this.baseUrl);
       this.proxy = this.connection.createHubProxy('eventsHub');
       this.storage.get('userDetails').then(data=>{
           this.userId = data.UserId;
       })

    //    this.sendEventUpdateToAll();
    }

  
    sendEventUpdateToAll(){
        this.proxy.on('sendMessage',(data=>{
            console.log(data);
            this.connection.stop(()=>{
                console.log('hub connection closed');
            })
        }))
       this.connection.start(()=>{
           this.proxy.invoke('SubscribeToEvents',this.userId).done((result)=>{
               console.log(result);
            })
       })
    }

    sendEventCreatedMessageToUsers(loteasyEvent:string){
        this.proxy.on("sendLoteasyEventInviteToUsers",(data=>{
            
            console.log(data);
        }))

        this.connection.start(()=>{
            this.proxy.invoke('SubscribeUsersToReceiveEventOnCreation',loteasyEvent).done(result=>{
               console.log(result);
            })
        })
    }
     
}