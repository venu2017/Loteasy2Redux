import { Injectable } from '@angular/core';
import {Observable , Subject } from 'rxjs/Rx';



@Injectable()
export class NetworkService{
    networkstatus:boolean;
    constructor(){
        
    }

    getNetworkStatus(){
        return this.networkstatus;
    }

    setNetworkStatus(status:boolean){
      this.networkstatus=status;
    }


}