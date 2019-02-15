import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';

@Injectable()
export class SharedService {
    globalVar:any = "No Value";
    globalVarUpdate:Observable<any>;
    globalVarObserver:Observer<any>;
  
    constructor() {
      this.globalVarUpdate = Observable.create((observer:Observer<any>) => {
        this.globalVarObserver = observer;
      });
    }
  
    updateGlobalVar(newValue:string) {
      this.globalVar = newValue;
      this.globalVarObserver.next(this.globalVar);
    }
  }