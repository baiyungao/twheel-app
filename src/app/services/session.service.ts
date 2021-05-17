import { NumberSymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { Plugins, Capacitor,GeolocationPosition} from '@capacitor/core';
import { AccessService } from './access.service';

const { Geolocation } = Plugins;

export interface Drive {
  id:string;
  email: string;
  start: Date;
  end: Date;
  driving:{
    daytime: number;  //driving time in second during daytime;
    nighttime: number; //driving time in second during nighttime;
    distance: Number; //driving distance in meters;
  }
  idle: number;  //idling time during the drive;
  locations:GeolocationPosition[];
}


@Injectable({
  providedIn: 'root'
})
export class SessionService {
   
  public locations:GeolocationPosition[]=[];
  lastLocation: GeolocationPosition;
  currentDrive:Drive;
  ideling: number;
   
  constructor(public access:AccessService) { }



    //start a user drive session
    public async startDrive()
    {
        this.currentDrive = this.getDrive();
        this.currentDrive.email = this.access.currentUser.email;
        this.locations=[];
        let id=this.access.currentUser.email + new Date().getMilliseconds();
        this.currentDrive.start= new Date();
        this.currentDrive.locations = this.locations;

        //start log;

    }

    /**
     * if the new location is different from the last location, 
     * adding driving time; otherwise adding to idle time
     * @param location 
     * 
     * The geolocation data are the data per sceond;
     */
    public async trace(location:GeolocationPosition){
      this.locations.unshift(location);
        if (this.lastLocation !=null) {
          if (!((this.lastLocation.coords.latitude == location.coords.latitude) 
               && (this.lastLocation.coords.longitude == location.coords.longitude))) {
                 
                this.ideling = 0;
                 //add distance caculation here;

                 }
                 else {
                   this.ideling++;
                   console.log("idling:" + this.ideling);
                 }

        }

        //if the viechel is not moving for 5 seconds, start to count on idle time;
        if (this.ideling > 5) {
          this.currentDrive.idle ++;
        }

        //apply logic to determine daytime or night time
        this.currentDrive.driving.daytime ++;
        console.log("moving:" + this.currentDrive.driving.daytime);
                 

       //update the lastLocation
       this.lastLocation = location;
    }

    //Proto type method
    getDrive():Drive{
      let drive: Drive = {id: 'default', 
                 email: '',
                 start: null, end: null, 
                 driving: {daytime: 0, nighttime:0, distance: 0},
                 idle: 0,
                 locations: []
                };

      return drive;          
    }
    
    // Timer logic
    //-------------------------------------

    interval;


  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.trace(coordinates);
    }
  
  //start tracing the movement or resume the tracing
  public async start(){
    this.interval = setInterval(() => {
      this.getCurrentPosition();      
    },1000);
    console.log("started:" + this.interval);
  }

  //Paulse the tracing of movement
  public async paulse(){
    clearInterval(this.interval);
    console.log("pausled:" + this.interval);
  } 

  /**
   *  The session has multipe status
   * 
   *  1. not active drive;
   *  2. active drive in tracing;
   *  3. active drive pausled 
   */

  hasActiveDrive():boolean{
    return this.currentDrive != null;
  }
  
  isPulsed(){
    this.interval
  }


 }



