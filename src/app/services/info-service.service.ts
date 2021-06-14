import { Inject, Injectable,LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins, Capacitor, GeolocationPosition } from '@capacitor/core';
const { Geolocation } = Plugins;

/**
 *  This service to provide information of current location, including 
 *  Geo Location, SolarTime, Weath info;
 * 
 * 
 * 
 * https://www.weather.gov/documentation/services-web-api
    https://api.weather.gov/points/{latitude},{longitude}
    For example: https://api.weather.gov/points/39.7456,-97.0892
    https://api.weather.gov/points/38.8894,-77.0352
    https://api.weather.gov/gridpoints/LWX/96,70/stations
    https://api.weather.gov/stations/KDCA/observations/latest
 */
export interface SolarTime {
  solarNoon: Date,
  nadir: Date,
  sunrise: Date,
  sunset: Date,
  sunriseEnd: Date,
  sunsetStart: Date,
  dawn: Date,
  dusk: Date,
  nauticalDawn: Date,
  nauticalDusk: Date,
  nightEnd: Date,
  night: Date,
  goldenHourEnd: Date,
  goldenHour: Date
}

export interface weatherInfo {
  currentCondition: string
}

@Injectable({
  providedIn: 'root'
})

export class InfoServiceService {
  interval;
  nightTime:boolean = false;
  solarTime: SolarTime;
  timezoneOffset: number;
  constructor(private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string) {
    console.log("start Info Services");
    this.update();
    this.interval = setInterval(() => {
      this.update();
    }, 15 * 60 * 1000);
    this.solarTime = {
      solarNoon: null,
      nadir: null,
      sunrise: null,
      sunset: null,
      sunriseEnd: null,
      sunsetStart: null,
      dawn: null,
      dusk: null,
      nauticalDawn: null,
      nauticalDusk: null,
      nightEnd: null,
      night: null,
      goldenHourEnd: null,
      goldenHour: null
    }
  }


  /**
   * method to update the information;
   */
  async update() {

    
    let currentLocation = await Geolocation.getCurrentPosition();
    console.log ("Longtitude:" + currentLocation.coords.longitude + " Latitue:" + currentLocation.coords.latitude);

    //1. get current location;

      console.log ("updated Longtitude:" + currentLocation.coords.longitude 
      + " Latitue:" + currentLocation.coords.latitude
      + " hight:" + currentLocation.coords.altitude);
      //2. retrieve solar time
     this.updateTime(
      currentLocation.coords.longitude,
      currentLocation.coords.latitude,
      await currentLocation.coords.altitude).subscribe((data:SolarTime) => {
        console.log("Data:" + JSON.stringify(data));

        this.solarTime=data;
        console.log("solorTime:" + JSON.stringify(this.solarTime));
        let now:Date = new Date();
        let dusk = new Date(this.solarTime.dusk);
        this.nightTime = (now >= dusk);
        console.log("local: " + this.locale  + " timezoneOffset:" + now.getTimezoneOffset());
        this.timezoneOffset = now.getTimezoneOffset();
        }
      )

    

  }
    
   updateTime(longitude:number, latitude:number, height: number)
    {
      const url = "https://thlutil.azurewebsites.net/api/solarcalc"
      const body = {
        "latitude": latitude,
        "longtitude":longitude,
        "height":height	
        }
      console.info ("Call webservices: " + url);
      return this.http.post(url,body);
    }  


  }
