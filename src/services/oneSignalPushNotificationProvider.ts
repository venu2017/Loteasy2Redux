import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';

export interface NotificationObject {
  type: string,
  eventDetails?: any,
  senderName?: string,
  senderPhotoLink?: string,
  bodyMessage?: string,
  playerIds: Array<string>,
  latlong?: string,
  distance?: number,
  bigPicture?: string,
  largeIcon?: string,
  eventCreator?: string,
  changedVenue?: string,
  reasonForCancellation?:string,
  reasonForExitingEvent?:string
}
@Injectable()
export class OneSignalServiceProvider {
  notificationTitle: string = 'Loteasy notification service';

  constructor(public http: HttpClient, public oneSignal: OneSignal) {
    console.log('Hello ServicesOneSignalServiceProvider Provider');
  }

  postOneSignalNotification(notification: NotificationObject) {
    switch (notification.type) {
      case "catchupInvite":
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' is available for a meal. Would You like to join?' },
            headings: { en: 'Loteasy notification' },
            include_player_ids: notification.playerIds,
            payload: {
              title: 'Loteasy notification service',
              body: 'Hi, This message is delivered from onesignal push service',
              notificationID: '',
              sound: '',
              actionButtons: [{ id: 'accept_btn_catchup', text: 'Accept', icon: '' }],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            buttons: [{
              id: 'decline_btn_catchup',
              text: 'Decline',
              icon: ''
            },
            {
              id: 'accept_btn_catchup',
              text: 'Accept',
              icon: ''

            }],
            big_picture: notification.bigPicture,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              senderLatLong: notification.latlong,
              distanceSelected: notification.distance,
              loteasyEvent: notification.eventDetails,
              notifyType: 'catchupInvite',
              
            },
            


          })
        break;

      case "funchOrPlanInvite":
        this.oneSignal.postNotification({
          app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
          contents: { en: notification.senderName + ' has sent you an invite!' },
          headings: { en: 'Loteasy notification' },
          payload: {
            title: '',
            body: '',
            notificationID: '',
            sound: '',
            actionButtons: [],
            rawPayload: '',
            largeIcon: notification.senderPhotoLink

          },
          include_player_ids: notification.playerIds,
          buttons: [{
            id: 'decline_event',
            text: 'Decline',
            icon: ''
          },
          {
            id: 'accept_event',
            text: 'Accept',
            icon: ''
          }],
          big_picture: notification.bigPicture,
          large_icon: notification.senderPhotoLink,
          small_icon: '',
          data: {
            loteasyEvent: notification.eventDetails,
            notifyType: 'funchOrPlanInvite'
          }
        })
        break;
      case "notWithinRange":
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.eventCreator + ' Sorry, you are out of the range selected by the event host' },
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            buttons: [{
              id: 'decline_event',
              text: 'Decline',
              icon: ''
            },
            {
              id: 'accept_event',
              text: 'Accept',
              icon: ''
            }],
            big_picture: notification.bigPicture,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'notWithinRange'
            }


          })
        break;
      case "declinedInvite":
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' has declined to join the event' },
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'declinedInvite'
            }

          })
        break;
      case "acceptedInvite":
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' has accepted to join the event' },
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'acceptedInvite'
            }

          })
        break;
      case "confirmedInvite":
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' has confirmed the event' },
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'confirmedInvite'
            }

          })
        break;
      case "cancelledInvite":
      let cancelReason = notification.reasonForCancellation?notification.reasonForCancellation:' no reason mentioned by sender.';
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' has cancelled the event due to ' +  cancelReason},
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'cancelledInvite'
            }

          })
        break;
      case "exitedEvent":
      let exitReason = notification.reasonForExitingEvent?notification.reasonForExitingEvent:' no reason mentioned by sender.';
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' has exited from the event due to ' + exitReason },
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'exitedEvent',
            }

          })
        break;
      case "joinedbackEvent":
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' has accepted to join back the event' },
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'joinedbackEvent'
            }

          })
        break;
      case "venueChanged":
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' has changed the event venue to: ' + notification.changedVenue },
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'venueChanged',
              changedVenue:notification.changedVenue
            }

          })
        break;
      case "excludedFromEvent":
        this.oneSignal.postNotification(
          {
            app_id: 'af88399f-192c-48fd-b0ad-1bc57483ed6c',
            contents: { en: notification.senderName + ' has excluded you from event' },
            headings: { en: 'Loteasy notification' },
            payload: {
              title: '',
              body: '',
              notificationID: '',
              sound: '',
              actionButtons: [],
              largeIcon: notification.senderPhotoLink,
              rawPayload: ''
            },
            include_player_ids: notification.playerIds,
            large_icon: notification.senderPhotoLink,
            adm_large_icon: notification.senderPhotoLink,
            small_icon: 'http://res.cloudinary.com/venu2017/image/upload/v1533031608/root/event_albums/p3finmk6avjz1god6lyw.jpg',
            data: {
              loteasyEvent: notification.eventDetails,
              notifyType: 'excludedFromEvent'
            }

          })
        break;
      default:

    }
  }

}

