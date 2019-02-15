import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import { Http } from "@angular/http";

@Injectable()
export class SavedLocationsService{

constructor(private http:Http){
        
}
_fetchSavedLocations(){

   let locObservable:Observable<any> =  Observable.create(observer=>{
        this.http.get('assets/models/addresses.json').
        subscribe((items)=>{
            observer.next(items);
            observer.complete();
            observer.error(new Error('error occured'));

        })
        
    })

  return locObservable;

}

_saveLocation(address){

}

}