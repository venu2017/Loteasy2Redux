import {Injectable} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class GeolocationService{
constructor(private _geolocation:Geolocation){

}
_geolocate(options?:any):Promise<any> {
    return new Promise((resolve,reject)=>{
        this._geolocation.getCurrentPosition(options)
            .then((response:any)=>{
            resolve(response);
        }).catch((err)=>{
            console.log(err.message);
        })
    }) 
       
 }


 


 }