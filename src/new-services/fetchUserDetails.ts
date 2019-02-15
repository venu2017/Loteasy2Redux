import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { ApiServices } from "../services/appAPIServices";
import { NgRedux } from "ng2-redux";
import { IAppState, IUser } from "../app/stores";
import { FETCH_USER_DETAILS } from "../app/actions/user.actions";

@Injectable()
export class UserDetailsService {
  constructor(
    private http: Http,
    private apiservice: ApiServices,
    private ngRedux: NgRedux<IAppState>
  ) {}

  fetchUserDetails(phoneNumber) {
    this.apiservice
      .FetchUserDetailsByPhoneNumber(phoneNumber, "91")
      .subscribe(user => {
        console.log("user details: " + JSON.stringify(user));
        let u: IUser = {
          id: user.UserId,
          name: user.UserName,
          email: user.EmailId,
          phoneNumber: user.PhoneNumber,
          profilePic: user.UserProfileImg,
          savedLocations: user.UserAddresses
        };
        this.ngRedux.dispatch({
          type: FETCH_USER_DETAILS,
          payload: u
        });
      });
  }
}
