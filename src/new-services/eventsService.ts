import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { NgRedux } from "ng2-redux";
import { IAppState } from "../app/stores";
import { AppConstants } from "../assets/appConstants";
import { FETCH_EVENTS_BY_PHONE_NUMBER } from "../app/actions/user.actions";
@Injectable()
export class EventsService {
  _baseUrl: string = AppConstants.PROD_API_BASE_URL;
  constructor(private ngRedux: NgRedux<IAppState>, private http: Http) {}

  GetAllEventsByPhoneNumber(PhoneNumber: string) {
    this.http
      .get(
        this._baseUrl +
          "LoteasyService/api/GetAllEventsByPhoneNumber?PhoneNumber=" +
          PhoneNumber,
        {}
      )
      .map(res => {
        let eventsList = res.json();
        let filteredPendingEvents = eventsList.filter(ev => {
          return this.filterEventsByExpiryDateAndStatus(ev, 0);
          // console.log(ev, new Date());
        });

        let confirmedEvents = eventsList.filter(ev => {
          return this.filterEventsByExpiryDateAndStatus(ev, 1);
        });

        let cancelledEvents = eventsList.filter(ev => {
          return this.filterEventsByExpiryDateAndStatus(ev, 2);
        });

        return {
          eventsList: eventsList,
          pendingEvents: filteredPendingEvents,
          pendingEventsCount: filteredPendingEvents.length,
          confirmedEvents: confirmedEvents,
          cancelledEvents: cancelledEvents
        };
      })
      .subscribe(
        filteredEvents => {
          console.log(filteredEvents, new Date());

          this.ngRedux.dispatch({
            type: FETCH_EVENTS_BY_PHONE_NUMBER,
            payload: {
              eventsList: filteredEvents.eventsList,
              pendingEvents: filteredEvents.pendingEvents,
              pendingEventsCount: filteredEvents.pendingEventsCount,
              confirmedEvents: filteredEvents.confirmedEvents,
              cancelledEvents: filteredEvents.cancelledEvents
            }
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  filterEventsByExpiryDateAndStatus(ev, statusCode) {
    let status: boolean = false;
    let event1 = ev.Event[0];
    let eventDate = event1.EventDate.split("-")
      .reverse()
      .join("-");
    let eventTime = event1.EventTime;
    let eventTimeVal = new Date(eventDate + " " + eventTime).getTime();
    let currentTimeVal = new Date().getTime();
    switch (statusCode) {
      case 0:
        status =
          eventTimeVal > currentTimeVal && ev.Event[0].EventStatusId == 0;
        break;
      case 1:
        status = ev.Event[0].EventStatusId == 1;
        break;
      case 2:
        status =
          eventTimeVal > currentTimeVal && ev.Event[0].EventStatusId == 2;
        break;
      default:
    }

    return status;
  }
}
