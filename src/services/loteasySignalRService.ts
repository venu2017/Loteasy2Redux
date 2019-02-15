import {  
    Injectable,  
    EventEmitter  
} from '@angular/core';  
import { Observable } from 'rxjs/Observable';

// declare the global variables  
declare var $: any;  
@Injectable() 
export class LoteasySignalRService{
    baseUrl:string ='http://loteasysignalr-dev.ap-south-1.elasticbeanstalk.com';
    eventsHub:any;
    connection:any;
    constructor(){
        this.connection = $.hubConnection(this.baseUrl);
        this.eventsHub = this.connection.createHubProxy('EventsHub');
      }

    sendEventNotifyToUsers(loteasyEvent:any):Observable<any>{
       
           
          let eventObservable=    Observable.create(observer=>{
            this.eventsHub.invoke('SubscribeUsersToReceiveEventOnCreation',loteasyEvent)
            .done((result)=>{
                console.log(result);
                  observer.next(result);
                  observer.complete();
                  observer.error(new Error('something went wrong!'));
              });
            })
    
             return eventObservable;
    }

    registerEventHubClientMethod():Observable<any>{
       
        let clinetMethodObservable = Observable.create(observer=>{
            this.eventsHub.on('sendLoteasyEventInviteToUsers',(data)=>{
                console.log(data);
                observer.next(data);
                observer.complete();
                observer.error(new Error('something went wrong!'));
                })
            
        })
            return clinetMethodObservable;
    
    }

     startConnection(): void {  
        this.connection.start({ transport: ['webSockets', 'longPolling','serverSentEvents','foreverFrame'] }).done((data: any) => {  
            console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);  
            
        }).fail((error: any) => {  
            console.log('Could not connect ' + error);  
            
        });  
    }  
}