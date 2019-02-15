import {  
    Injectable,  
    EventEmitter  
} from '@angular/core';  

// declare the global variables  
declare var $: any;  
@Injectable()  
export class SignalRService {  
    // Declare the variables  
    private proxy: any;  
    private proxyName: string = 'EventsHub';  
    private connection: any;  
    // create the Event Emitter  
    public messageReceived: EventEmitter < any > ;  
    public connectionEstablished: EventEmitter < Boolean > ;  
    public connectionExists: Boolean;  
    baseUrl:string ='http://loteasysignalr-dev.ap-south-1.elasticbeanstalk.com';
    constructor() {  
       // Constructor initialization  
        this.connectionEstablished = new EventEmitter < Boolean > ();  
        this.messageReceived = new EventEmitter < any > ();  
        this.connectionExists = false;  
        // create hub connection  
        this.connection = $.hubConnection(this.baseUrl);  
       
        // create new proxy as name already given in top  
        this.proxy = this.connection.createHubProxy(this.proxyName); 
       
        // register on server events  
        this.registerOnServerEvents();  
        // call the connecion start method to start the connection to send and receive events.  
        this.startConnection();  
    }  
    // method to hit from client  
    public SendEvents() {  
        // server side hub method using proxy.invoke with method name pass as param  
        this.proxy.invoke('SubscribeToEvents');  
    }  
    // check in the browser console for either signalr connected or not  
    private startConnection(): void {  
        this.connection.start({ transport: ['webSockets', 'longPolling','serverSentEvents','foreverFrame'] }).done((data: any) => {  
            console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);  
            this.connectionEstablished.emit(true);  
            this.connectionExists = true;  
        }).fail((error: any) => {  
            console.log('Could not connect ' + error);  
            this.connectionEstablished.emit(false);  
        });  
    }  
    private registerOnServerEvents(): void {  
       this.proxy.on('getNewEvent', (data: any) => {  
            console.log('received in SignalRService: ' + JSON.stringify(data));  
            this.messageReceived.emit(data);  
        });  
    }  
}  