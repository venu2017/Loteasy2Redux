import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppConstants } from '../../assets/appConstants';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ApiServices} from '../../services/appAPIServices';


@IonicPage()
@Component({
  selector: 'page-memories-slider',
  templateUrl: 'memories-slider.html',
})
export class MemoriesSliderPage {
  options: boolean;
  tabBarElement: any;
  private Event_date: any;
  private Event_caption: any;
  eventId:any;
  eventAndMemoriesData: any;
  cloudinaryMemoriesPath: string = AppConstants.CLOUDINARY_FETCH_MEMORIES_ALBUMS;
  memoriesSlides: Array<any> = [];
  @ViewChild('imageOptions') imageOptions: ElementRef;
  slideConfig = {
    "slidesToScroll": 1,
    "infinite": false,
    "variableWidth": false,
    "dots": false
  };
  imageOptionsBar: any;
  slideChanged$event: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public transfer: FileTransfer,
    public file: File, public alert: AlertController, public apiService:ApiServices) {
    this.eventAndMemoriesData = this.navParams.get('data');
    this.Event_date = this.navParams.get('Event_date');
    this.Event_caption = this.navParams.get('Event_caption');
    this.eventId = this.navParams.get('eventId');

    if (this.navParams.get("from") == 'EventMemories') {
      this.eventAndMemoriesData.forEach(element => {
        this.memoriesSlides.push(element.photo)
      });


    }
    else {

      this.memoriesSlides = Object.assign(this.eventAndMemoriesData.split(','));
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    }

  }

  ionViewDidLoad() {
    this.imageOptionsBar = this.imageOptions.nativeElement;
    this.tabBarElement.style.display = 'none';
    console.log(this.imageOptionsBar);

    setInterval(() => {
      this.imageOptionsBar.style.display = 'none';
    }, 5000);

    document.body.addEventListener('click', () => {
      if (this.imageOptionsBar.style.display == 'none') {
        this.imageOptionsBar.style.display = 'block';
      } else if (this.imageOptionsBar.style.display == 'block') {
        this.imageOptionsBar.style.display = 'none';
      }

    })
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }



  navigateBackToMemories() {
    this.navCtrl.pop();
  }



  hideOptions() {
    this.options = !this.options;
  }

  afterSlideChanged($event) {
    console.log($event);
    this.slideChanged$event = $event;
  }


  saveImage() {
    // let fileName:string;
    let currentslide = this.memoriesSlides[this.slideChanged$event.currentSlide];
    console.log(currentslide);

    this.file.checkDir(this.file.externalRootDirectory, 'Gallery')
      .then(() => {
        console.log('Directory exists');
        let fileUrl = this.file.externalRootDirectory + 'Gallery/' + currentslide;
        let fileTransfer = this.transfer.create();
        fileTransfer.download(this.cloudinaryMemoriesPath + currentslide, fileUrl, true)
          .then((d) => {
            console.log('file has been successfully downloaded to :' + fileUrl);
            let alert = this.alert.create({
              message: 'Photo has been saved to ' + fileUrl,
              enableBackdropDismiss:true,
              buttons:[
                {
                  text:'OK',
                  handler:()=>{
                    console.log('OK')
                  }
                }
              ]
            })
            alert.present();
          })

      })
      .catch(() => {
        console.log('directory \"Loteasy\" does not exist')
        this.file.createDir(this.file.externalRootDirectory, 'Gallery', false)
          .then(() => {
            let fileUrl = this.file.externalRootDirectory + 'Gallery/' + currentslide;
            let fileTransfer = this.transfer.create();
            fileTransfer.download(this.cloudinaryMemoriesPath + currentslide, fileUrl, true)
              .then((d) => {
                console.log('file has been successfully downloaded to :' + fileUrl);
                let alert = this.alert.create({
                  message: 'Photo has been saved to ' + fileUrl,
                  buttons:[
                    {
                      text:'OK',
                      handler:()=>{
                        console.log('OK')
                      }
                    }
                  ]

                })
                alert.present();
              })

          })
      })
  }

  deleteImage() {
    let memoriesAfterSplice=this.memoriesSlides.splice(this.slideChanged$event.currentSlide, 1);
    console.log(memoriesAfterSplice);
    // this.apiService.UpdateEventAlbumsSharedToUserByPhoneNumber(this.eventId,)
  }

  editImage() {

  }

}
