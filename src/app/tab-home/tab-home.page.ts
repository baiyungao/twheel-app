import { Component, OnInit } from '@angular/core';
import { TracingService } from '../services/tracing.service';
import { SessionService } from '../services/session.service';
import { AccessService } from '../services/access.service';

@Component({
  selector: 'app-tab-home',
  templateUrl: './tab-home.page.html',
  styleUrls: ['./tab-home.page.scss'],
})
export class TabHomePage implements OnInit {

  constructor(public tracingService: TracingService, 
     public sessionService: SessionService,
     public access: AccessService) {}

    start(){
    this.sessionService.startDrive();
    }

    resume(){
    this.tracingService.stop();
    }

    paulse(){

    }

    save(){

    }


  ngOnInit() {
  }

}
