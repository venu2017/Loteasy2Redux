import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import "rxjs/add/operator/map";
import { FileTransfer } from '@ionic-native/file-transfer';

@Injectable()
export class CloudinaryServices{
    CLOUD_NAME:string = "venu2017";
    CLOUDINARY_URL:string = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/upload`;
   
    constructor(private http:Http, private transfer: FileTransfer){

    }

    uploadImagesToClodinary(imagePath:any,imageType:string):Promise<any>{
        let CLOUD_UPLOAD_PRESET:string;
        if(imageType=='profile'){
            CLOUD_UPLOAD_PRESET = 't0jqcshj'
        }else{
            CLOUD_UPLOAD_PRESET = 'dnzvbb6p'
        }
        const fileTransfer: any = this.transfer.create();
      return  fileTransfer.upload(imagePath,this.CLOUDINARY_URL,{});
    }

    uploadPhoto(image:any,imageType:string):Observable<any>{
        let CLOUD_UPLOAD_PRESET:string;
        if(imageType=='profile'){
            CLOUD_UPLOAD_PRESET = 't0jqcshj'
        }else{
            CLOUD_UPLOAD_PRESET = 'dnzvbb6p'
        }
      
       return this.http.post(this.CLOUDINARY_URL,{
           'upload_preset':CLOUD_UPLOAD_PRESET,
           'file':image         
        
       }).map((res:any)=>{
        return res.json();
       })
       

    }

    fetchImage(secure_url:string){
        return this.http.get(secure_url)
        .map((data:any)=>{
           return data.json();
        })
    }
}