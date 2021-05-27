import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { AccessService } from '../services/access.service';

@Component({
  selector: 'app-tab-home',
  templateUrl: './tab-home.page.html',
  styleUrls: ['./tab-home.page.scss'],
})
export class TabHomePage implements OnInit {

  constructor(public sessionService: SessionService,
     public access: AccessService) {
       console.log('login user:' + JSON.stringify(this.access.currentUser));
     }

    start(){
    this.sessionService.startDrive();
    }

    resume(){
    this.sessionService.start();
    }

    pause(){
    this.sessionService.pause();
    }
    cancel(){

    }

    save(){
      this.pause();
      this.sessionService.save().subscribe((data)=>{
        console.log("save the drive success");
        this.sessionService.reset();
      })

    }


    /**
   *  The session has multipe status
   * 
   *  1. not active drive;
   *  2. active drive in tracing;
   *  3. active drive pausled 
   */

  started():boolean{
    //console.log(" can start:" + this.sessionService.currentDrive)
    return this.sessionService.currentDrive != null;
  }
  
  isPaused(){
    return this.sessionService.paused;
  }

  ngOnInit() {
  }

}
