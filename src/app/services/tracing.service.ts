import { Injectable } from '@angular/core';
import { Plugins, Capacitor,GeolocationPosition} from '@capacitor/core';
import { SessionService } from './session.service';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class TracingService {
 
  interval;
  constructor(private session:SessionService) { }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.session.trace(coordinates);
    }
  
  //start the logger
  public async start(){
    this.interval = setInterval(() => {
      this.getCurrentPosition();      
    },1000)
  }

  public async stop(){
    clearInterval(this.interval);
  } 
}