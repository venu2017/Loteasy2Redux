import { Component, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'inviteecount-list',
  templateUrl: 'inviteecount-list.html'
})
export class InviteecountListComponent {


  @Input() 
  Inviteecount : string;
  @Output() 
invitee_count = new EventEmitter<string>();	 

constructor(){
  this.invitee_count.emit("10");
}


}
