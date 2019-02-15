import {Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import  'rxjs/Operator/map';
import {AppConstants} from '../assets/appConstants';

@Injectable()

export class ApiServices{
    _baseUrl:string = AppConstants.PROD_API_BASE_URL;
    _baseUrlSsql:string = AppConstants.PROD_API_SQL_SIGNALR;

    public Network_Errors:any[]=[];
    constructor(private http:Http){
        
    }

    SendOtp(_Name:string,_phoneNumber:string):Observable<any>{
      return   this.http.post(this._baseUrl + "LoteasyService/api/Login?UserName=" +_Name + 
      "&PhoneNumber=" + _phoneNumber,{
            
        }).map(res => {
            return res.json();
        })
    }

    VerifyOTP(_phoneNumber:string,OTP:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/VerifyOTP?phoneNumber=" +  _phoneNumber +"&code="+ OTP,{
           }).map(res=>{
                return res.json();
            })
    }

    addOrSaveImage(userId:number,imagePath:string,imageType:string,buddyListId?:number):Observable<any>{
      return  this.http.post(this._baseUrl + "LoteasyService/api/ImageUpload?UserId="
                             + userId +"&ImagePath="+imagePath + "&ImageType=" + 
                             imageType + "&BuddyListId="+buddyListId,{})

            .map(res =>{
                     return res.json();
                        })
            .catch((e: any) => Observable.throw(this.errorHandler(e)));
                            
    }

    retrieveImage(UserId:number, ImageType:string):Observable<any>{
        return this.http.post(this._baseUrl +"LoteasyService/api/FetchImage?UserId=" + UserId +"&ImageType=" + ImageType,{} )
        .map(res=>{
            return res.json();
        })
    }

    updateUserProfile(UserId:number,UserName:string,EmailId:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/UpdateUserProfile?UserId=" + UserId + "&UserName=" + UserName + "&EmailId=" + EmailId,{})
        .map(res=>{
            return res.json();
        })
    }

    fetchSavedAddresses(UserId:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/FetchSavedAddresses?UserId=" + UserId,{})
        .map(res=>{
            return res.json();
        }).catch((e: any) => Observable.throw(this.errorHandler(e)));
            
    }

    errorHandler(err:any){
       return err;
    }

    saveUserAddress(UserId:number, address:string, addressType:number):Observable<any>{
    return this.http.post(this._baseUrl + "LoteasyService/api/SaveUserAddress?UserId=" + UserId + "&UserAddress=" + address
            +"&AddressType=" + addressType, {})
    .map(res=>{
        return res.json();
    })
    }

    editUserAddress(UserId:number,AddressSNo:number, newAddress:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/EditUserAddress?UserId=" + UserId + "&AddressSNo=" + AddressSNo + "&NewAddress=" + newAddress,{})
        .map(res=>{
            return res.json();
        })
        
    }

    deleteUserAddress(UserId:number, AddressType:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/DeleteUserAddress?UserId=" + UserId + "&AddressType=" + AddressType, {})
        .map(res=>{
            return res.json();
        })
    }

    FetchSingleUserById(UserId:number):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/FetchSingleUserById?UserId=" + UserId, {})
        .map(res=>{
            return res.json();
        })
    }

    SaveUserPreferences(userId:number, pref:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/SaveUserPreferences?UserId=" + userId + "&Preferences=" + pref,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    fetchUserPreferencesById(UserId:number):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetUserPreferencesByUserId?UserId=" + UserId)
        .map(res=>{
            return res.json()
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    SaveOrUpdateUserPreferences( UserId:number,Food:string,Amenities:string,FriendsRecommended:number,
                                        FoodChoices:string,CostForTwo:number):Observable<any>{
            return this.http.post(this._baseUrl + "LoteasyService/api/SaveOrUpdateUserPreferences?UserId=" +
             UserId + "&Food=" + Food + "&Amenities=" + Amenities + "&FriendsRecommended=" + FriendsRecommended
             + "&FoodChoices=" + FoodChoices + "&CostForTwo=" + CostForTwo,{})
                    .map(res =>{
                        return res.json();
                    })
                    .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    GetRestaurantsAndMenuItemsByKeyword(keyword:string):Observable<any>{
        return  this.http.post(this._baseUrl + "LoteasyService/api/FetchSearchResultsByKeyWord?keyword=" + keyword,{})
        .debounceTime(100)
        .map(res=>{
         return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    FetchRestaurantDetailsById(RestaurantId:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/FetchRestaurantDetailsById?RestaurantId=" + RestaurantId,{})
        .map(res =>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    UpdateRestoLike(userId:number,restoId:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/UpdateRestoLike?UserId=" + userId + "&RestoId=" + restoId, {})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    CreateNewBuddyList(UserId:number,BuddyListName:string,BuddyListProfileImg:string,BuddyPhoneNumber:string):Observable<any>{
      return   this.http.post(this._baseUrl + "LoteasyService/api/CreateNewBuddyList?UserId="+UserId + "&BuddyListName="+
        BuddyListName + "&BuddyListProfileImg=" + BuddyListProfileImg + "&BuddyPhoneNumber=" + BuddyPhoneNumber, {}  )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    ModifyBuddyList(BuddyListId:number, PhoneNumber:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/ModifyBuddyList?BuddyListId=" + BuddyListId + "&PhoneNumber=" + PhoneNumber,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    FetchBuddiesListsByUserId(UserId:number):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/FetchBuddiesListsByUserId?UserId=" + UserId )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    UpdateUserOnlineStatus(UserId:number,UserStatus:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/UpdateUserOnlineStatus?UserId=" + UserId + "&UserStatus=" + UserStatus,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));

    }

    // FetchUsersOnlineStatus():Observable<any>{

    // }

    FetchUserDetailsByPhoneNumber(PhoneNumber:string, CountryCode:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/FetchUserDetailsByPhoneNumber?PhoneNumber=" + 
                                    PhoneNumber + "&CountryCode=" + CountryCode ,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));

    }

    FetchBuddyListDetailsByBuddyListId(BuddyListId:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/FetchBuddyListDetailsByBuddyListId?BuddyListId=" + 
                                BuddyListId,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    FetchAllRestaurants():Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/FetchAllRestaurants",{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    SendInviteSMSToNonRegdUser(PhoneNumber:string, MessageText:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/SendInviteSMSToNonRegdUser?PhoneNumber="+ 
                PhoneNumber + "&MessageText="+ MessageText,{})
                .map(res=>{
                    return res.json();
                })
                .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    CreateNewEvent(UserId:number,VenueId:number,EventDateTime:string,
        InviteesList:string,ImagesShared:string,EventStatusId:number,
        ReasonForCancellation:string,EventDescription:string,
        EventDate:string,EventTime:string,EventTitle:string,EventAddress:string):Observable<any>{

    return  this.http.post(this._baseUrl + "LoteasyService/api/CreateNewEvent?UserId=" + UserId +
            "&VenueId=" + VenueId + "&EventDateTime=" + EventDateTime + "&InviteesList="+
            InviteesList + "&ImagesShared=" + ImagesShared + "&EventStatusId=" + EventStatusId +"&ReasonForCancellation="+
            "&EventDescription=" + EventDescription + "&EventDate=" + EventDate + "&EventTime=" +EventTime+"&EventTitle=" 
            +EventTitle+"&EventAddress=" +EventAddress,{})
            .map(res=>{
                return res.json();
            })
            .catch((e: any) => Observable.throw(this.errorHandler(e)));
}

    CreateNewEventSqlServer(UserId:number,VenueId:number,EventDateTime:string,
        InviteesList:string,ImagesShared:string,EventStatusId:number,
        ReasonForCancellation:string,EventDescription:string,
        EventDate:string,EventTime:string,EventTitle:string):Observable<any>{
            return  this.http.post(this._baseUrlSsql + "api/CreateNewEvent?UserId=" + UserId +
            "&VenueId=" + VenueId + "&EventDateTime=" + EventDateTime + "&InviteesList="+
            InviteesList + "&ImagesShared=" + ImagesShared + "&EventStatusId=" + EventStatusId +"&ReasonForCancellation="+
            "&EventDescription=" + EventDescription + "&EventDate=" + EventDate + "&EventTime=" +EventTime+"&EventTitle=" +EventTitle,{})
            .map(res=>{
                return res.json();
            })
            .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    GetAllEventsByPhoneNumber(PhoneNumber:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/GetAllEventsByPhoneNumber?PhoneNumber=" + PhoneNumber,{})
        .map(res=>{
            return res.json();
        })

        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    GetAllEventAlbumsSharedToUserByPhoneNumber(PhoneNumber:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/GetAllEventAlbumsSharedToUserByPhoneNumber?PhoneNumber="+ PhoneNumber,{})
        .map(res=>{
            return res.json();
        })

        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    MemoryImageUpload(UserId:number,EventId:number,ImagePath:string, Caption:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/MemoryImageUpload?UserId=" + UserId+ 
                "&EventId=" + EventId + "&ImagePath=" + ImagePath + "&Caption=" + Caption,{})
                .map(res=>{
                    return res.json();
                })
                .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    GetEventDetailsByEventId(EventId:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/GetEventDetailsByEventId?EventId=" + EventId,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    FetchEventListsByMobileNumber(MobileNumber:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/GetAllEventsByPhoneNumber?PhoneNumber=" + MobileNumber,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    UpdateEventAlbumsSharedToUserByPhoneNumber(EventAlbumId:number,EventId:number,Photos:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/UpdateEventAlbumsSharedToUserByPhoneNumber?AlbumId="+ 
                EventAlbumId + "&EventId=" + EventId + "&Photos=" + Photos,{})
                .map(res=>{
                    return res.json();
                })
                .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }
     //events

   
   
  
    fetchUserEventdetails(Mobile:string,eventid:number):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/EventUserdetails?mobile=" + Mobile +"&eventid=" + eventid  )
        .map(res=>{
            return res.json()
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    UpdateEventStatus(UserId:number,Eventid:number,Mobile:string,status:number,Declinemsg:string,statustime:string,inviteename:string):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/UpdateEventStatus?UserId=" + UserId +"&Eventid=" + Eventid+"&Mobile=" + Mobile+"&status=" + status+"&Declinemsg=" + Declinemsg+"&statustime=" + statustime+"&inviteename=" + inviteename)
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }
    UpdateEventStatusByowner(UserId:number,Eventid:number,Eventstatus:number,EventReason:any):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/UpdateEventStatusByuser?UserId=" + UserId +"&Eventid=" + Eventid+"&Eventstatus=" + Eventstatus+"&EventReason=" + EventReason)
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    

    GetEventStatus(Eventid:number):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetPendingAcceptDeclineStatusOfInvitees?EventId=" + Eventid )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    SharePhotosToBuddies(UserId:number,EventId:number,ImagePath:string , PhoneNumbers:string,_DateStamp:string):Observable<any>{
        return  this.http.post(this._baseUrl + "LoteasyService/api/SharePhotosToBuddies?UserId=" + UserId + "&EventId=" + EventId 
        + "&ImagePath="  + ImagePath    + "&PhoneNumbers="  + PhoneNumbers + "&_DateStamp=" + _DateStamp,{})
          .map(res=>{
              return res.json();
          })
  
          .catch((e: any) => Observable.throw(this.errorHandler(e)));
      }

      SaveFCMTokenToDatabase(PhoneNumber:string,FcmToken:string,_DateTimeStamp:string):Observable<any>{
          return this.http.post(this._baseUrl + "LoteasyService/api/SaveFCMTokenToDatabase?PhoneNumber=" + PhoneNumber+
                        "&FcmToken=" + FcmToken + "&_DateTimeStamp=" + _DateTimeStamp,{})
                        .map(res=>{
                            return res.json();
                        })
                        .catch((e: any) => Observable.throw(this.errorHandler(e)));
      }

      SendPushNotificationFCM(PhoneNumners:string,NotifyMessage:string,eventDetails:any, profileImg:string,typeOfNotification:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/SendPushNotificationFCM?PhoneNumbers=" + PhoneNumners+
                                "&NotifyMessage=" + NotifyMessage +"&eventDetails=" +eventDetails +"&profileImg=" + profileImg
                                +"&typeOfNotification=" + typeOfNotification,{})
                                .map(res=>{
                                    return res.json();
                                })
                                .catch((e: any) => Observable.throw(this.errorHandler(e)));
      }

      SendPushNotificationFCMWithoutNotifyContent(PhoneNumners:string,NotifyMessage:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/SendPushNotificationFCM?PhoneNumbers=" + PhoneNumners+
        "&NotifyMessage=" + NotifyMessage,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
      }

      GetRestuarntsReviews(Rest_id:number):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetRestuarntsReviews?Rest_id=" + Rest_id )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    CreateRestReview(UserId:number,EventId:number,ReviewText:string,rating:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/CreateRestReview?UserId="+ 
        UserId + "&Rest_id=" + EventId + "&ReviewText=" + ReviewText+ "&Rating=" + rating,{})
                .map(res=>{
                    return res.json();
                })
                .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    GetTotalEventsCreatedByUser(PhoneNumber:string):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetAllIEventsCreatedByUser?PhoneNumber=" + PhoneNumber )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    GeTuserFaviourties(user_id:string):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetUserFaviourties?user_id=" + user_id )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));

    }
    UpdateFaviourateBuddies(user_id:number,buddy_id:number):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/UpdateFaviourtiesBuddies?UserId=" + user_id+"&buddy_id="+buddy_id )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));

    }

    GetUserSharedAlbums(PhoneNumber:any):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetEventAlbumSharedByUser?PhoneNumber=" + PhoneNumber )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));

    }

   
    GetSharedAlbums(user_id:any,Event_id:any):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetUserSharedAlbums?User_id=" + user_id + "&Event_id=" + Event_id )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));

    }
    GetRegisteredUsers(user_id:any):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetUserSharedDetails?User_id=" + user_id )
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));

    }

    GetNotificationsByUserId(UserId:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/GetNotificationsByUserId?UserId="+UserId,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    CreateNotification(UserId:number, EventId:number,ReadStatus:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/CreateNotification?UserId=" + UserId + 
        "&EventId=" + EventId + "&ReadStatus=" + ReadStatus,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    UpdateNotification(UserId:number, EventId:number,ReadStatus:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/CreateNotification?UserId=" + UserId + 
        "&EventId=" + EventId + "&ReadStatus=" + ReadStatus,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    SendPushNotificationForAcceptEvent(PhoneNumber:string,NotifyMessage:string,profileImg:string):Observable<any>{
        return this.http.post(this._baseUrl+"LoteasyService/api/SendPushNotificationForAcceptEvent?PhoneNumber=" + PhoneNumber+
        "&NotifyMessage=" + NotifyMessage + "&profileImg=" + profileImg,{})
    .map(res=>{
        return res.json();
    })
    }

    GetUsersRegisters():Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetRegisteredUsers")
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));

    }

    GetAlbumoption(Event_id:any):Observable<any>{
        return this.http.get(this._baseUrl+"LoteasyService/api/GetEventAlbumDetails?Event_id="+Event_id).map(res=>{
            return res.json();
        })
    }
    async GetListofRegisters(): Promise<number> {
        const response = await this.http.get(this._baseUrl + "LoteasyService/api/GetRegisteredUsers").toPromise();
        return response.json();
      }
      FetchOccasiondetails():Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/GetOccasionDetails")
        .map(res=>{
            return res.json()
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    UploadImagePickerImagesToCloudinary(img:any):Observable<any>{
     return  this.http.post(this._baseUrl+"LoteasyService/api/UploadImagePickerImagesToCloudinary?image="+img,{})
     .map(res=>{
        return res.json();
     })
     .catch((e: any) => Observable.throw(this.errorHandler(e)))

    }
GetRegisterUsers():Promise<any>{

    return this.http.get(this._baseUrl + "LoteasyService/api/GetRegisteredUsers").map((response)=> response.json()).toPromise().catch();
}

GetSelectedRestuarntswithpagination(page_number:any,page_length:any):Observable<any>{

        return this.http.get(this._baseUrl + "LoteasyService/api/RestuarntInformation?&pageNumber="+page_number+"&pageSize="+page_length, {}).map(res=>{

            return res.json();

        }).catch((e:any)=>Observable.throw(this.errorHandler(e)));
    }

    RestuarntSearchResults(search_value:any):Observable<any>{

        return this.http.get(this._baseUrl + "LoteasyService/api/RestuarntSearchResults?&Address="+search_value, {}).map(res=>{

            return res.json();
        }).catch((e:any)=>Observable.throw(this.errorHandler(e)));
    }

    UpdateUncheckedinviteeStatus(Uncheckedinviteeslist:string,Eventid:number,InviteeStatus:number,selectedInviteesList:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/UpdateCatchupInviteesStatus?Uncheckedinviteeslist=" + Uncheckedinviteeslist +"&Eventid=" + Eventid+"&InviteeStatus=" + 2 +"&inviteesList=" + selectedInviteesList,{})
        .map(res=>{
            return res.json();
        })
        .catch((e: any) => Observable.throw(this.errorHandler(e)));
    }

    SaveOSPushTokenToDb(PushToken:string,PhoneNumber:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/SaveOSPushTokenToDb?PushToken=" + PushToken + "&PhoneNumber=" + PhoneNumber,{})
        .map(res=>{
            return res.json();
        })
        .catch((e:any)=>Observable.throw(this.errorHandler(e)));
    }


    GetOneSignalPlayerIds(PhoneNumbers:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/GetOneSignalPlayerIds?PhoneNumbers=" + PhoneNumbers,{})
        .map(res=>{
            return res.json();
        })
        .catch((e)=>Observable.throw(e));
    }

    CreateOrUpdateCatchUpInviteeAvailability(CatchUpEventId:number, PhoneNumber:string, IsWithinRange:number, InviteeId:number, UserProfileImg:string,UserName:string):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/CreateOrUpdateCatchUpInviteeAvailability?CatchUpEventId="+CatchUpEventId+"&PhoneNumber=" 
        + PhoneNumber + "&IsWithinRange=" + IsWithinRange + "&InviteeId=" + InviteeId + "&UserProfileImg=" + UserProfileImg + "&UserName=" + UserName,{} )
        .map(res=>{
            return res.json();
        })
        .catch((e)=> Observable.throw(e));
    }

    GetAvailabileInviteesOfCatchupEvent(CatchupEventId:number):Observable<any>{
        return this.http.post(this._baseUrl + "LoteasyService/api/GetAvailabileInviteesOfCatchupEvent?CatchupEventId="+CatchupEventId,{})
        .map(res=>{
            return res.json();
        })
        .catch((e)=> Observable.throw(e));
    }

    deleteCatchupEventByUser(userId,eventId, eventDeleted):Observable<any>{
        return this.http.get(this._baseUrl + "LoteasyService/api/DelCatchupEventByUser?UserId=" + userId + "&EventId=" + eventId+"&EeventDeletedByUser=" + eventDeleted,{})
        .map(res=>{
            return res.json();
        })
        .catch((e)=>Observable.throw(e))
      }


      GetEventStatusUpdatesByEventId(eventId,userId):Observable<any>{
          return this.http.get(this._baseUrl + "LoteasyService/api/GetEventStatusUpdatesByEventId?EventId="+ eventId + "&UserId=" + userId,{})
          .map(res=>{
              let jsoniFied = res.json();
              return jsoniFied?(jsoniFied[0]?jsoniFied[0].EventId:0):0
          }).filter(elem=>{
              return elem != 0;
          })
          .catch((e)=>Observable.throw(e))
      }
}