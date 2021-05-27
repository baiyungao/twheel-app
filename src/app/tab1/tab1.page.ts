import { Component } from '@angular/core';
import { AccessService } from '../services/access.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public sessionService: SessionService,
    public access: AccessService) {
      console.log('entering Tab1, list of drive')
    }

}
