import { NumberSymbol } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins, Capacitor, GeolocationPosition } from '@capacitor/core';
import { AccessService } from './access.service';

const { Geolocation } = Plugins;

export interface Drive {
  id?: string;
  email: string;
  start: Date;
  end: Date;
  drive: {
    daytime: number;  //driving time in second during daytime;
    nighttime: number; //driving time in second during nighttime;
    distance: number; //driving distance in meters caculated through speed;
    distanceB: number; //drive distance caculated through location;
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

  public locations: Location[] = [];
  lastLocation: GeolocationPosition;
  currentDrive: Drive = null;
  ideling: number = 0;
  paused: boolean;

  constructor(private http: HttpClient, public access: AccessService) { }



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
   */
  public async trace(location: GeolocationPosition) {
    this.locations.unshift(this.getLocation(location));
    if (this.lastLocation != null) {
      //location changed;
      if ((this.lastLocation.coords.latitude != location.coords.latitude)
        || (this.lastLocation.coords.longitude != location.coords.longitude)) {

        this.ideling = 0;
        //add distance caculation here;
        this.currentDrive.drive.distance += this.caculateDistance(
          location.coords.latitude, location.coords.longitude, this.lastLocation.coords.latitude,
          this.lastLocation.coords.longitude);

      }
      else {
        this.ideling++;
        console.log("idling:" + this.ideling);
      }

    }

    //if the viechel is not moving for 5 seconds, start to count on idle time;
    if (this.ideling > 5) {
      this.currentDrive.idle++;
    }

    //apply logic to determine daytime or night time
    this.currentDrive.drive.daytime++;
    this.currentDrive.drive.distanceB += location.coords.speed;
    console.log("moving:" + this.currentDrive.drive.daytime);


    //update the lastLocation
    this.lastLocation = location;
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
    this.currentDrive.end = new Date();
    console.log(JSON.stringify(body));
    console.log(JSON.stringify(this.lastLocation));
    return this.http.post(saveUrl, body,);
  }

  reset() {
    this.currentDrive = null;
    this.paused = false;
  }




  //Proto type method
  getDrive(): Drive {
    let drive: Drive = {
      email: '',
      start: null, end: null,
      drive: { daytime: 0, nighttime: 0, distance: 0, distanceB: 0 },
      idle: 0,
      locations: []
    };

    return drive;
  }



  getLocation(loc: GeolocationPosition):Location{

    let location: Location;
    location = {
      timestamp: loc.timestamp,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      altitude:loc.coords.altitude,
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



