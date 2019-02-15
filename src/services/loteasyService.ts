import {Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import  'rxjs/Operator/map';
import {AppConstants} from '../assets/appConstants';
import { serviceHelper } from '../services/serviceHelper';

@Injectable()

export class LoteasyService{
    _baseUrl:string = "http://le2project-dev.ap-south-1.elasticbeanstalk.com/LoteasyService/api";
    _baseUrlSsql:string = AppConstants.PROD_API_SQL_SIGNALR;
    _httpRequestType:any;
    __controllerName:any;
    constructor(private http:Http){
        
    }

    fetch(requestType:string,controllerName:string, params:any):Promise<any>{
        let queryStringParams:Array<any>=[];
        let url:string;
       if(params != null && params != undefined){
        Object.keys(params).forEach(key=>{
            if(params.hasOwnProperty(key)){
                queryStringParams.push(`${key}=${params[key]}`);
            }
        })
        url=`${this._baseUrl}/${controllerName}?${queryStringParams.join("&")}`;
       }else{
        url=`${this._baseUrl}/${controllerName}`;
       }
           
        if(requestType=='get'){
            return this.http.get(url,{}).map(res=>{
                return res.json();
            }).toPromise()
            .catch((e: any) => Observable.throw(this.errorHandler(e)));
            }else if(requestType=='post'){
                return this.http.post(url,{}).map(res=>{
                    return res.json();
                }).toPromise()
                .catch((e: any) => Observable.throw(this.errorHandler(e)));
            }
        }

    errorHandler(err:any){
        return err;
     }

   async  getDataFromLocalStorage(storage:any,itemName:string):Promise<any>{

        let data:Promise<any> =  await  storage.get(itemName);
        return Promise.resolve(data);

     }

     async  setDataToLocalStorage(storage:any,itemName:string, itemValue:any):Promise<any>{

        let data:Promise<any> =  await  storage.set(itemName,itemValue);
        return Promise.resolve(data) ;       

     }

        

}