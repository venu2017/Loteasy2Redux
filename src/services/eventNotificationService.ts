import { Component , Injectable} from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class EventNotificationService {
    newEventAddedObserver: Observer<any>;
    _event: any;
    newEventAdd: Observable<any>;
  
    constructor() {
      this.newEventAdd = new Observable((observer:Observer<any>)=> {
        this.newEventAddedObserver = observer;
      });
    }
  
    addNewEvent(event:any) {
      this._event = event;
      this.newEventAddedObserver.next(this._event);
    }

    getEvents():Observable<any>{
        return this.newEventAdd;
    }

  }