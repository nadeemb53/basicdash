import { Component } from '@angular/core';
import {BackendService} from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dashboard';
  internet_status = 0
  intranet_status = 0
  bunkering_status = 0


  constructor(private status: BackendService){}

  ngOnInit(){
    this.network();
    this.bunkering();
  }


  network(){
    var pullLatest = setInterval(() => {
      this.status.getNetworkStatus().subscribe(res => {
        this.internet_status = res.internet_status;
        this.intranet_status = res.intranet_status;
      })
    }, 10000);
  }

  bunkering(){
    var pullLatest = setInterval(() => {
      this.status.getBunkeringStatus().subscribe(res => {
        this.bunkering_status = res.BunkeringFlag;
      })
    }, 30000);
  }
}
