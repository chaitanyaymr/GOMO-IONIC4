import { GomodbService } from './../Providers/gomodb.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private gomodb:GomodbService) {
    this.gomodb.getAllUsers().then(result=>{
      console.log("userdata",result)
    })
  }

}
