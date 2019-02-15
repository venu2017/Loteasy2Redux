import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { HttpModule, JsonpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { IonicStorageModule } from "@ionic/Storage";
import { ImagePicker } from "@ionic-native/image-picker";
import { SocialSharing } from "@ionic-native/social-sharing";
import { BackgroundMode } from "@ionic-native/background-mode";
import { Network } from "@ionic-native/network";
import { FilePath } from "@ionic-native/file-path";
import { EventNotificationService } from "../services/eventNotificationService";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { Keyboard } from "@ionic-native/keyboard";
import { Geolocation } from "@ionic-native/geolocation";
import { SharedService } from "../services/globalvariable";
import { UploadFileService } from "../services/UploadFileService";
import { LoadingCreator } from "../services/loadingcreator";
import { SavedLocationsService } from "../services/fetchSavedLocationsService";
import { LoteasySignalRService } from "../services/loteasySignalRService";
import { CloudinaryServices } from "../services/cloudinaryServices";
import { Dialogs } from "@ionic-native/dialogs";
import { Contacts } from "@ionic-native/contacts";
import { Camera } from "@ionic-native/camera";
import { Diagnostic } from "@ionic-native/diagnostic";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { DatePicker } from "@ionic-native/date-picker";
import { Badge } from "@ionic-native/badge";
import { ApiServices } from "../services/appAPIServices";
import { LoteasyService } from "../services/loteasyService";
import { EventsService } from "../new-services/eventsService";
import { SendFirebaseNotification } from "../services/SendFirebaseNotification";
import { SignalRService } from "../services/signalRService";
import { ConfirmationService } from "primeng/api";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MyApp } from "./app.component";
// import { AgmCoreModule } from '@agm/core';
// import { Push} from '@ionic-native/push';
// import { FCM } from '@ionic-native/fcm';
import { OneSignal } from "@ionic-native/onesignal";
import { OneSignalServiceProvider } from "../services/oneSignalPushNotificationProvider";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { EventsHubService } from "../services/EventsHubService";
import { NetworkService } from "../services/networkservice";
import { ConcreteBehaviourStrategy } from "../storageOrNavParams";
import { SearchLocationWiseRestuarntsComponent } from "../components/search-location-wise-restuarnts/search-location-wise-restuarnts";
import { GMapModule } from "primeng/gmap";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { GeolocationService } from "../services/geolocation";
import { NativeGeocoder } from "@ionic-native/native-geocoder";
import { NgReduxModule, NgRedux, DevToolsExtension } from "ng2-redux";
import { IAppState, rootReducer, INITIAL_APP_STATE } from "./stores";
import { UserDetailsService } from "../new-services/fetchUserDetails";

@NgModule({
  declarations: [MyApp, SearchLocationWiseRestuarntsComponent],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, { pageTransition: "md-transition" }),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    JsonpModule,
    GMapModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBTG2mDqpU5UMtn7qeT-y6xioqpGaPN7rY'
    // })
    NgReduxModule
  ],

  bootstrap: [IonicApp],
  entryComponents: [MyApp, SearchLocationWiseRestuarntsComponent],
  providers: [
    StatusBar,
    SplashScreen,
    Dialogs,
    Geolocation,
    Contacts,
    SavedLocationsService,
    CloudinaryServices,
    Camera,
    Diagnostic,
    AndroidPermissions,
    ApiServices,
    DatePicker,
    SignalRService,
    // Push,
    // FCM,
    OneSignal,
    OneSignalServiceProvider,
    EventsHubService,
    ImagePicker,
    Badge,
    Keyboard,
    SocialSharing,
    EventNotificationService,
    DatePipe,
    BackgroundMode,
    LoteasySignalRService,
    SharedService,
    LoteasyService,
    EventsService,
    UserDetailsService,
    SendFirebaseNotification,
    BarcodeScanner,
    ConcreteBehaviourStrategy,
    ConfirmationService,
    FileTransfer,
    File,
    FilePath,
    UploadFileService,
    Network,
    NetworkService,
    LoadingCreator,
    InAppBrowser,
    GeolocationService,
    NativeGeocoder,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>, devTools: DevToolsExtension) {
    ngRedux.configureStore(rootReducer, INITIAL_APP_STATE);
  }
}
