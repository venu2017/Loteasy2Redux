import { Component } from '@angular/core';

/**
 * Generated class for the NotificationTwoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'notification-two',
  templateUrl: 'notification-two.html'
})
export class NotificationTwoComponent {

  text: string;

  constructor() {
    console.log('Hello NotificationTwoComponent Component');
    this.text = 'Hello World';
  }

}
