import {
  FETCH_USER_DETAILS,
  FETCH_EVENTS_BY_PHONE_NUMBER
} from "./actions/user.actions";
import { tassign } from "tassign";

export interface IAppState {
  user: IUser;
  leEvents: {
    eventsList: ILeEvent[];
    pendingEvents: ILeEvent[];
    pendingEventsCount: number;
    confirmedEvents: ILeEvent[];
    cancelledEvents: ILeEvent[];
  };
  leInvites: ILeInvite[];
  leMemories: ILeMemory[];
  preferences: IPreference[];
  phoneContacts: IPhoneContact[];
  selectedConatacts: IPhoneContact[];
  buddies: IBuddy[];
  currentLocation: ICurrentLocation;
  restaurants: IRestaurant[];
  catchUpEvent: ICatchUpEvent;
  otherEvent: IOtherEvent;
}

export interface IUser {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  profilePic: string;
  savedLocations: IUserAddress[];
}

export const INITIAL_USER_STATE: IUser = {
  id: null,
  name: null,
  email: null,
  phoneNumber: null,
  profilePic: null,
  savedLocations: null
};

export interface ICurrentLocation {
  currentAddress: string;
  latlng: string;
}

export const INITIAL_CURRENT_LOCATION: ICurrentLocation = {
  currentAddress: null,
  latlng: null
};

export const INITIAL_APP_STATE: IAppState = {
  user: INITIAL_USER_STATE,
  leEvents: null,
  leInvites: null,
  leMemories: null,
  preferences: null,
  phoneContacts: null,
  selectedConatacts: null,
  buddies: null,
  currentLocation: null,
  restaurants: null,
  catchUpEvent: null,
  otherEvent: null
};

export interface ILeEvent {
  _event: IEvent;
  _invitees: IInvitee[];
}

export interface ILeInvite {
  _event: IEvent;
  _invitees: IInvitee[];
}

export interface ILeMemory {
  AlbumId: number;
  EventId: number;
  SharedBy: number;
  SharedTo: string;
  Images: string;
  SharedDateTime: string;
  AlbumCaption: string;
}
export interface IPreference {
  UserId: number;
  FoodChoices: string;
  Amenities: string;
  FriendsRecommended: string;
  Food: string;
  CostForTwo: string;
}
export interface IPhoneContact {
  name: string;
  phoneNumber: string;
  profilePic: string;
}

export interface IBuddy {
  BuddiesListId: number;
  UserId: number;
  BuddiesListProfilePic: string;
  BuddiesListName: string;
  BuddiesDetails: string;
  Faviourate: number;
}

export interface IRestaurant {
  RestaurantId: number;
  Name: string;
  Tagline: string;
  HeroImg: string;
  ThaumnailImg: string;
  CostForTwo: string;
  OpenHours: string;
  Cuisines: string;
  Amenities: string;
  Reviews: string;
  Offers: string;
  SuitableFor: string;
  PaymentOptions: string;
  GalleryImages: string;
  Address: string;
  MenuImages: string;
  HappyHours: string;
  RecommendedBy: string;
  LatLong: string;
  SocialMedia: string;
  RestaurantType: string;
  RestContactDetails: string;
  OpenHours2: string;
  Restaurantscol: string;
  YearEstablished: string;
  ContactNumber: string;
  ContactName: string;
}

export interface ICatchUpEvent {
  createdBy: number;
  currentLocation: ICurrentLocation;
  invitees: ICatchUpInvitee;
  selectedDistanceRange: number;
  selectedPlace: string;
  restaurantId: number;
  inviteSentTime: string;
  isCatchUpValid: boolean;
}
export interface ICatchUpInvitee {
  invitee: IInvitee;
  inviteeLatLng: string;
  isWithinRange: boolean;
}

export interface IOtherEvent {
  createdBy: number;
  nameOfEvent: string;
  selectedDate: string;
  selectedTime: string;
  selctedInvitees: IInvitee[];
  selectedBuddies: IBuddy[];
  restaurant: number;
  selectedPlace: string;
  eventSummaryDesc: string;
  planEventType: string;
  createdTime: string;
}

export interface IUserAddress {
  userId: number;
  UserAddressType: number;
  AddressLine1: string;
  AddressLine2: string;
  AddressLine3: string;
}

export interface IEvent {
  Address: string;
  CostForTwo: string;
  eventAddress: string;
  EventCreatedBy: string;
  EventDate: string;
  EventId: number;
  EventSentTime: string;
  EventStatusId: number;
  EventTime: string;
  EventTitle: string;
  EventUserName: string;
  InviteSummaryDesc: string;
  Name: string;
  ReasonForCancellation: string;
}

export interface IInvitee {
  username: string;
  UserProfileImg: string;
  PhoneNumber: string;
  AcceptStatus: number;
  DeclinedMessage: string;
  StatusUpdateTime: string;
}

export function rootReducer(state: IAppState, action): IAppState {
  switch (action.type) {
    case FETCH_EVENTS_BY_PHONE_NUMBER:
      return tassign(state, {
        leEvents: {
          eventsList: action.payload.eventsList,
          pendingEvents: action.payload.pendingEvents,
          pendingEventsCount: action.payload.pendingEventsCount,
          confirmedEvents: action.payload.confirmedEvents,
          cancelledEvents: action.payload.cancelledEvents
        }
      });

    case FETCH_USER_DETAILS:
      return tassign(state, {
        user: {
          id: action.payload.id,
          name: action.payload.name,
          phoneNumber: action.payload.phoneNumber,
          email: action.payload.email,
          profilePic: action.payload.profilePic,
          savedLocations: action.payload.savedLocations
        }
      });
  }

  return state;
}
