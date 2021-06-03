import { Injectable } from '@angular/core';
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
export interface solarTime{
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

export interface weatherInfo{
  currentCondition: string
}

@Injectable({
  providedIn: 'root'
})

export class InfoServiceService {
  interval;
  constructor() { 
    this.interval = setInterval(() => {
      this.update();      
    },15 * 60 * 1000)
  }


  /**
   * method to update the information;
   */
  async update(){

  }


}
