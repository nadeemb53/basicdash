import { isPlatformBrowser } from '@angular/common';
import { Component } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
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
  internet = "OFFLINE"
  intranet ="OFFLINE"
  bunker = "HALTED"
  date = ""
  time = ""
  total_mass = "8888"
  display = ""
  sentinel = ""
  vessel_name = ""
  ip = ""

  constructor(private status: BackendService){}

  ngOnInit(){
    this.getIP();
    this.network();
    this.bunkering();
    this.getCurrentTime();
  }

  getIP(){
    var pullLatest = setInterval(() => {
      this.status.getIP().subscribe(res => {
        this.display = res.display
        this.sentinel = res.sentinel
        this.ip = res.ip
      })
    }, 10000);
  }

  getCurrentTime(){
    var pullLatest = setInterval(() => {
      var myDate = new Date();

      let daysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
      let monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Aug', 'Oct', 'Nov', 'Dec'];
      let date = myDate.getDate();
      let month = monthsList[myDate.getMonth()];
      let year = myDate.getFullYear();
      let day = daysList[myDate.getDay()];

      let today = `${day}, ${date} ${month} ${year}`;

      let amOrPm;
      let twelveHours = function (){
          if(myDate.getHours() > 12)
          {
              amOrPm = 'PM';
              let twentyFourHourTime = myDate.getHours();
              let conversion = twentyFourHourTime - 12;
              return `${conversion}`

          }else {
              amOrPm = 'AM';
              return `${myDate.getHours()}`}
      };
      let hours = twelveHours();
      let minutes = myDate.getMinutes();

      let currentTime = `${hours}:${minutes} ${amOrPm}`;

      console.log(today + ' ' + currentTime);
      this.date = today;
      this.time = currentTime;
    }, 10000)
  }



  network(){
    var pullLatest = setInterval(() => {
      this.status.getNetworkStatus().subscribe(res => {
        this.internet_status = res.internet_status;
        this.intranet_status = res.intranet_status;
        this.vessel_name = res.vessel_name
        if (this.internet_status == 1) this.internet = "ONLINE"
        else this.internet = "OFFLINE"
        if (this.intranet_status == 1) this.intranet = "ONLINE"
        else this.intranet = "OFFLINE"
      }, error => {
        this.internet_status = 0;
        this.intranet_status = 0;
        this.internet = "OFFLINE";
        this.intranet = "OFFLINE"
      })
    }, 10000);
  }

  bunkering(){
    var pullLatest = setInterval(() => {
      this.status.getBunkeringStatus().subscribe(res => {
        this.bunkering_status = res.bunkering_status;
        if (this.bunkering_status == 1){
          this.bunker = "ONGOING"
          this.status.getBunkeredMass().subscribe(res => {
            var mass = res.total_mass
            this.total_mass = String(mass).substring(0,6)
          })

        }
        else this.bunker = "HALTED"
      }, error => {
        this.internet_status = 0;
        this.intranet_status = 0;
      })
    }, 10000);
  }
}
