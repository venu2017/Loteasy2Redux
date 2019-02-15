import {Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http/';

@Injectable()
export class SendFirebaseNotification{
    constructor( private http: HttpClient) {

    }
    //Add this function and call it where you want to send it.
    sendNotification(title:string,message:string,fcmToken:string, profileImg:string):Promise<any>
    {  
    let body = {
        "notification":{
            "title":title,
            "body":message,
            "sound":"chime",
            "click_action":"FCM_PLUGIN_ACTIVITY",
            "icon":'icon',
        //   "image":profileImg,
        //   "image-type":'circle',
            "image":profileImg,
            "summaryText":message,
            "image-type":'circle',
            "picture":'http://res.cloudinary.com/venu2017/image/upload/v1524119572/root/event_albums/i28ku688wfd0mjz9r1mc.jpg',
            "style":'picture',
            "visibility":1
         
        },
        "data":{
            // "sound":"chime",
            // "click_action":"FCM_PLUGIN_ACTIVITY",
            // "icon":'icon',
            // "title":title,
            "message":message,
            "image":profileImg,
            "summaryText":message,
            "image-type":'circle',
            "picture":'http://res.cloudinary.com/venu2017/image/upload/v1524119572/root/event_albums/i28ku688wfd0mjz9r1mc.jpg',
            "style":'picture',
            "visibility":1
          
        },
          "to":fcmToken,
          "priority":"high"
          
      }
     
      let options = new HttpHeaders().set('Content-Type','application/json');
     return this.http.post("https://fcm.googleapis.com/fcm/send",body,{
        headers: options.set('Authorization', 'key=AAAAaJo4SXE:APA91bFpu7DNaHhAuQ3s7dbthx3q533ZWujY2_8NzYjOq8B3E6l6nuXSCRBOzoZc7BRXL0T2NNPSX8wJLC1P6DZW0w5ANW6HBcF_zuSfncnwgOWujhb8_A3RUJ4WwBXTfky7xuOkQyxs'),
      }).toPromise();
        
    }
    
}
