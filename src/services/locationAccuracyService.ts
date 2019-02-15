// import {Injectable } from '@angular/core';
// import { LocationAccuracy } from '@ionic-native/location-accuracy';
// import {Observable } from 'rxjs';
// import 'rxjs/add/operator/map';
// @Injectable()
// export class LocationAccuracyService{
//     locationAccuracyResult:Observable<any>;
//     constructor(private locationAccuracy:LocationAccuracy){

//     }
//     _locAccuracy():Observable<any>{

//         let observable = Observable.create(observer=>{
//            this.locationAccuracy.canRequest().then((canRequest: boolean)=>{
//             console.log("canrequest: " + canRequest);
//              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
//             .then((res:any)=>{
//                 console.log("REQUEST_PRIORITY_HIGH_ACCURACY " + res);
//                 observer.next(res);
//                 observer.complete();
//                 observer.error(new Error('error occured in observable'));

//             })

//            .catch((err:any)=>{
//                 console.log(err.message);
//             })

//                 }).catch((err:any)=>{
//                     console.log(err.message);
//                 })

//         })
        
//        return observable;
//     }
// }
