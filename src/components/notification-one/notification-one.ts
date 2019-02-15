import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'notification-one',
  templateUrl: 'notification-one.html',
  inputs:['currentTime','notification','senderName', 'showNotifyMask',
  'eventName','eventDateTime','declinedInvite','acceptedInvite',
  'nofriendsInVicinity', 'catchupInvite','funchOrPlanInvite','notWithinRange',
  'isWithinRange','inviteeName','cancelledInvite','confirmedInvite','excludedFromEvent',
  'exitedEvent','joinedbackEvent', 'venueChanged','newVenueForCatchup','msgBody'],
  outputs:['showNotifyMaskEventEmitter','onCloseNotification','onAcceptNotification',
  'onDeclineNotification']
})
export class NotificationOneComponent implements OnInit {
 public currentTime:any;
 public eventDateTime:any;
 public eventName:any;
 public senderName:any;
 public showNotifyMask:boolean;
 public nofriendsInVicinity:boolean;
 public acceptedInvite:boolean;
 public declinedInvite:boolean;
 public catchupInvite:boolean;
 public funchOrPlanInvite:boolean;
 public isWithinRange:boolean;
 public notWithinRange:boolean;
 public inviteeName:string;
 public cancelledInvite:boolean;
 public confirmedInvite:boolean;
 public excludedFromEvent:boolean;
 public exitedEvent:boolean;
 public joinedbackEvent:boolean;
 public venueChanged:boolean;
 public newVenueForCatchup:string;
 public msgBody:string;
 public showNotifyMaskEventEmitter:EventEmitter<boolean> = new EventEmitter<boolean>();
 public onAcceptNotification:EventEmitter<any>=new EventEmitter<any>();
 public onDeclineNotification:EventEmitter<any>=new EventEmitter<any>();
 public onCloseNotification:EventEmitter<any>=new EventEmitter<any>();
  constructor() {
   
  }

  ngOnInit(): void {
    console.log(this.currentTime);

  }
  closenotification(notify:any){
    this.onCloseNotification.emit(notify);
  }

  declineInvite(notify:any){
  this.onDeclineNotification.emit(notify);

  }

  acceptInvite(notify:any){
    this.onAcceptNotification.emit(notify);
  }

}
