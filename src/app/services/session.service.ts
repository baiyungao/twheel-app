import { NumberSymbol } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins, Capacitor, GeolocationPosition } from '@capacitor/core';
import { Observable } from 'rxjs';
import { AccessService } from './access.service';
import { InfoServiceService } from './info-service.service';

const { Geolocation } = Plugins;
const DIRECTION_MARK: number = 5;

export interface Record {
  counts: number; //total number of drive;
  time: number;
  nighttime: number;
  distance: number;
}

export interface Drive {
  id?: string;
  email: string;
  start: Date;
  stop: Date;
  drive: {
    time: number;  //driving time in second during daytime;
    nighttime: number; //driving time in second during nighttime;
    distance: number; //driving distance in meters caculated through speed;
   }
  idle: number;  //idling time during the drive;
  locations: Location[];
}

export interface Location {
  timestamp: number;
  /**
   * The GPS coordinates along with the accuracy of the data
   */
  /**
   * Latitude in decimal degrees
   */
  latitude: number;
  /**
   * longitude in decimal degrees
   */
  longitude: number;
  /**
   * Accuracy level of the latitude and longitude coordinates in meters
   */
  accuracy: number;
  /**
   * Accuracy level of the altitude coordinate in meters (if available)
   */
  altitudeAccuracy?: number;
  /**
   * The altitude the user is at (if available)
   */
  altitude?: number;
  /**
   * The speed the user is traveling (if available)
   */
  speed?: number;
  /**
   * The heading the user is facing (if available)
   */
  heading?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

 
  myRecord: Record;
  public locations: Location[] = [];
  lastLocation: GeolocationPosition;
  currentDrive: Drive = null;
  ideling: number = 0;
  paused: boolean;

  //all drive data with this account
  driveList: Drive[] = [];

  constructor(private http: HttpClient, 
              private access: AccessService,
              private info:InfoServiceService ) {
    this.loadDB();
  }

  //load data from cloud

  loadDB() {
    this.myRecord = {
      counts: 0, time: 0, nighttime: 0, distance: 0
    };
    //load the drive from DB;
    this.loadDrives().subscribe((data: []) => {
      for (let item of data) {
        let drive: Drive = this.getDriveFromDB(item);
        this.driveList.push(drive);
        this.myRecord.counts++;
        console.log ("stop:" + drive.stop.getTime());
        console.log ("start:" + drive.start.getTime());
        let drivetime:number = Math.round((drive.stop.getTime()-drive.start.getTime())/1000);
        console.log ("drive time:" + drivetime);
        
        this.myRecord.time += drivetime;
        console.log ("recorded time:" + this.myRecord.time);
        this.myRecord.nighttime += drive.drive.nighttime;
        this.myRecord.distance += drive.drive.distance;
        console.log(JSON.stringify(drive));
      }

      console.log(JSON.stringify(this.myRecord));
    });

    

  }

  //start a user drive session
  public async startDrive() {
    console.log("start drive");
    this.currentDrive = this.getDrive();
    this.currentDrive.email = this.access.currentUser.email;
    this.locations = [];
    let id = this.access.currentUser.email + new Date().getMilliseconds();
    this.currentDrive.start = new Date();
    this.currentDrive.locations = this.locations;

    //start log;
    this.start();

  }

  /**
   * if the new location is different from the last location, 
   * adding driving time; otherwise adding to idle time
   * @param location 
   * 
   * The geolocation data are the data per sceond;
   *  In order to control the data points, only recording sensititve datapoints.  The 
   *  algorithm is tracking heading and speed variable only.
   * 
   */
  public async trace(location: GeolocationPosition) {
    let needRecord:boolean = (this.lastLocation == null);
     if (this.lastLocation != null) {
      //location changed;
      if ((this.lastLocation.coords.latitude != location.coords.latitude)
        || (this.lastLocation.coords.longitude != location.coords.longitude)) {

        this.ideling = 0;
        //add distance caculation here;
        this.currentDrive.drive.distance += this.caculateDistance(
          location.coords.latitude, location.coords.longitude, this.lastLocation.coords.latitude,
          this.lastLocation.coords.longitude);

        let speadVariation =   Math.abs((location.coords.speed- this.lastLocation.coords.speed))/this.lastLocation.coords.speed;
        
        let directionVariation = Math.abs(location.coords.heading - this.lastLocation.coords.heading);
        //if the speed change exceed 10% or direction change with in bench mark degree - default 5 degree.
        if ((speadVariation >= 0.1) 
          || ( directionVariation < DIRECTION_MARK) 
          || ( directionVariation >(360-DIRECTION_MARK))) {
            needRecord = true;
        }
      }
      else {
        this.ideling++;
      }

    }

    //if the viechel is not moving for 5 seconds, start to count on idle time;
    if (this.ideling > 5) {
      this.currentDrive.idle++;
    }

    //apply logic to determine daytime or night time
    let now = new Date();
    this.currentDrive.drive.time = Math.round((now.getTime()-this.currentDrive.start.getTime())/1000);
    
    //update the lastLocation accordingly
    if (needRecord) {
      this.locations.unshift(this.getLocation(location));
      this.lastLocation = location;
    }
  }

  /**
   * Save the current drive to the cloud;
   * https://twheeldb.azurewebsites.net/api/adddrive
   * 
   * body //drive
   */
  save() {
    const saveUrl = "https://twheeldb.azurewebsites.net/api/adddrive"
    const body = this.currentDrive;
    this.currentDrive.stop = new Date();

    let dusk = new Date(this.info.solarTime.dusk);
    //caculate night time
    let nightTime = this.currentDrive.stop.getTime() - dusk.getTime();
    console.log ("night time of current drive:" + nightTime);
   
    if (nightTime > this.currentDrive.drive.time) {
      nightTime = this.currentDrive.drive.time;
    }

    console.log ("night time of current drive:" + nightTime);
    if (nightTime > 0) {
      if (nightTime > this.currentDrive.drive.time) {
        nightTime = this.currentDrive.drive.time;
      }
      this.currentDrive.drive.nighttime = Math.round(nightTime);
    }
    console.log(JSON.stringify(body));
    console.log(JSON.stringify(this.lastLocation));

    //skip save if the total disitance within 100 meters
    if (this.currentDrive.drive.distance < 100) {
      return new Observable((observer) => {
        // observable execution
        observer.next("No need to save")
        observer.complete()
    });
    }

    return this.http.post(saveUrl, body,);
  }


  loadDrives() {
    let url = "https://twheeldb.azurewebsites.net/api/drive/" + this.access.currentUser.email;
    return this.http.get(url);
  }

  reset() {
    this.currentDrive = null;
    this.paused = false;
    this.lastLocation = null;
  }






  //Proto type method
  getDrive(): Drive {
    let drive: Drive = {
      email: '',
      start: null, stop: null,
      drive: { time: 0, nighttime: 0, distance: 0 },
      idle: 0,
      locations: []
    };

    return drive;
  }

  // 
  getDriveFromDB(dbItem): Drive {
    let drive: Drive = {
      email: dbItem.email,
      start: new Date(dbItem.start), 
      stop: new Date(dbItem.stop),
      drive: {
        time: dbItem.time,
        nighttime: dbItem.nighttime,
        distance: dbItem.distance
      },
      idle: 0,
      locations: []
    };

    return drive;
  }


  getLocation(loc: GeolocationPosition): Location {

    let location: Location;
    location = {
      timestamp: loc.timestamp,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      altitude: loc.coords.altitude,
      accuracy: loc.coords.accuracy,
      altitudeAccuracy: loc.coords.altitudeAccuracy,
      speed: loc.coords.speed,
      heading: loc.coords.heading
    }


    return location;
  }

  // Timer logic
  //-------------------------------------

  interval;


  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.trace(coordinates);
  }

  //start tracing the movement or resume the tracing
  public async start() {
    this.interval = setInterval(() => {
      this.getCurrentPosition();
    }, 1000);
    this.paused = false;
  }

  //Paulse the tracing of movement
  public async pause() {
    clearInterval(this.interval);
    this.paused = true;
  }



  private caculateDistance
    (lat1: number, lon1: number,
      lat2: number, lon2: number) {

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result return in meters
    return (c * r) * 1000;
  }

}



