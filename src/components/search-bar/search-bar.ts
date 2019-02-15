import { Component,EventEmitter,Output,Input} from '@angular/core';

@Component({
  selector: 'search-bar',
  templateUrl: 'search-bar.html',
  
})
export class SearchBarComponent {
@Input('search-label') searchPhrase:string = "";
@Output('clicksearch') clickSearcBar:EventEmitter<any> = new EventEmitter<any>();
  constructor() {
   
  }

  onSearchBarClick(event){

    this.clickSearcBar.emit()

  }
}
