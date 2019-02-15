import { Component, ElementRef, Renderer,OnInit,Injectable, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { ApiServices} from '../../services/appAPIServices';

interface Item{
  item_Type:string;
  item_Name:string;
  item_imgCode:number;
}
@Injectable()
@IonicPage()
@Component({
  selector: 'page-restaurant-search',
  templateUrl: 'restaurant-search.html',
})
export class RestaurantSearchPage implements OnInit {
  searchVal: string;
  tabBarElement: any;
  recentItems:Item[]=[];
  items: Item[]=[];
  itemImage1:string="assets/images/search/dish-icon.svg";
  itemImage2:string="assets/images/footer/map-restaurant-icon.svg";
  @ViewChild("searchbar") searchBarCtrl:any;
  showSearchHeading:boolean=true;
  getrestaurant:any;
  clearvalue:boolean = false;
  inputFocusClass: boolean = false;
  dishOrRestaurant:string;
  constructor(private elRef: ElementRef,private renderer: Renderer,private navCtrl:NavController,
              private storage:Storage, private apiService:ApiServices ) {
      
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter(){
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }

  ngOnInit(){
    // let hElement: HTMLElement = this.elRef.nativeElement;
    // let searchbar = hElement.getElementsByClassName('searchbar-search-icon');
    // searchbar[0].addEventListener('click',()=>{
    //   this.navCtrl.push(HomePage);
    // })
    // searchbar[0].setAttribute("style","background-image:url(assets/images/backarrow.svg)");
   
    // setTimeout(() => {
    //   this.storage.get("recentSearches").then((items)=>{
    //     if(items)items.forEach(item => {
    //       this.items.push(item);
    //     });
    //   }).catch(err=>{
    //     console.log(err);
    //   })
     
    
    // }, 500);
       
  }

  

  getItems(ev: any) {
    let val = ev.target.value;
    if(val.length > 0){
      this.clearvalue = false;
    }
    else{
      this.clearvalue = true; 
      this.items = [];
    }
   if (val && val.trim() != '') {
    this.apiService.GetRestaurantsAndMenuItemsByKeyword(val)
    .subscribe(searchResults =>{
    this.items =JSON.parse(searchResults).Restaurants.concat(JSON.parse(searchResults).MenuItems)
    .filter((item, index, inputArray)=>{
      return inputArray.indexOf(item) == index;
    });
    
    this.inputFocusClass = true;
    })
    }
    console.log(this.items);
    this.showSearchHeading=false;
  }


  onSelectItem(item:any){
     this.recentItems.push(item);
     this.storage.set("recentSearches",this.recentItems);
      item.split(':')[2] == 'dish' ? this.navCtrl.push('RestaurantsListPage',{RestaurantId:item.split(':')[1]}):
                                 this.navCtrl.push('RestaurantDetailPage',{RestaurantId:item.split(':')[1]});

    }

    _clearvalue(){
      this.getrestaurant = "";
      this.searchVal = '';
      this.clearvalue = false;
      this.items = [];
  
    }
    _onfocus(){
      
      this.inputFocusClass = true;
    }

    navigateBackToHome(){
      this.navCtrl.push('HomePage');
    }
}
