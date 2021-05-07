import { Component, OnInit } from '@angular/core';
import { TracingService } from '../services/tracing.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-tab-home',
  templateUrl: './tab-home.page.html',
  styleUrls: ['./tab-home.page.scss'],
})
export class TabHomePage implements OnInit {

  constructor(public tracingService: TracingService, 
     public sessionService: SessionService) {}

    startLogger(){
    this.tracingService.start();
    }

    stopLogger(){
    this.tracingService.stop();
    }


  ngOnInit() {
  }

}
