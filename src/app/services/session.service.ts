import { NumberSymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { GeolocationPosition } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public session:UserSession = { userid:"default", start:null};

  drive:Drive = {id: 'default', 
                 start: null, end: null, 
                 driving: {daytime: 0, nighttime:0, distance: 0},
                 idle: 0,
                 locations: []
                };
  public locations:GeolocationPosition[]=[];
  lastLocation: GeolocationPosition;
   
  constructor() { }

  //start a user session
  async start(upn:string)
  {
      if (upn != null){
        this.session.userid = upn;
        this.session.start = new Date();
      }
  }

    //start a user session
    public async startDrive(upn:string)
    {
        this.locations=[];
        let id=this.session.userid + new Date().getMilliseconds();
        this.drive.start= new Date();
        this.drive.locations = this.locations;
    }

    /**
     * if the new location is different from the last location, 
     * adding driving time; otherwise adding to idle time
     * @param location 
     */
    public async trace(location:GeolocationPosition){
      this.locations.unshift(location);
        if (this.lastLocation !=null) {
          if (!((this.lastLocation.coords.latitude == location.coords.latitude) 
               && (this.lastLocation.coords.longitude == location.coords.longitude))) {
                 this.drive.driving.daytime ++;
                 console.log("moving:" + this.drive.driving.daytime);
                 //add distance caculation here;

                 }
                 else {
                   this.drive.idle ++;
                   console.log("idle:" + this.drive.idle);
                 }

        }

       //update the lastLocation
       this.lastLocation = location;
    }
    
 }

export interface UserSession {
  userid:string;
  start: Date;
}

export interface Drive {
  id:string;
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


