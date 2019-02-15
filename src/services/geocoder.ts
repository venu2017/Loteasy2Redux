import {Injectable} from '@angular/core';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, } from '@ionic-native/native-geocoder';
import { Observable } from 'rxjs/Observable';
declare var google:any;

@Injectable()
export class GeocoderService{
  constructor(public nativeGeocoder:NativeGeocoder){}
 _reverseGeocode(latlng:any):Promise<any>{
        return new Promise((resolve,reject)=>{
            let geocoder = new google.maps.Geocoder;
            geocoder.geocode({'location':latlng},(results, status) =>{
             resolve(results);
      
            })
        })

    }

    reverseGeocode(latlng:any):Promise<any>{
        return new Promise(resolve=>{
            this.nativeGeocoder.reverseGeocode(latlng.lat,latlng.lng)
            .then(result=>{
                resolve(result);
            })
        })
    }

   

}