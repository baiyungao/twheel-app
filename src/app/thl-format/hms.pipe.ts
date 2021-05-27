import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name:'hms'})
export class HMSPipe implements PipeTransform {

  transform(value: number): string {

    let result: string = "";
    let hour:number = Math.floor(value / 3600);
    let min: number =  Math.floor((value-hour * 3600)/60);
    let sec: number = value - hour * 3600 - min * 60;

    if (hour >0) {
      result =  hour + " Hour";
    }
    if ((hour > 0) || (min > 0)){
      result += min + " Minute";
    }

    result += sec + " Second"

    return result;
  }

}
