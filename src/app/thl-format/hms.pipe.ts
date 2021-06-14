import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name:'hms'})
export class HMSPipe implements PipeTransform {

  transform(value: number): string {

    let result: string = "";
    let hour:number = Math.floor(value / 3600);
    let min: number =  Math.floor((value-hour * 3600)/60);
    let sec: number = Math.round(value - hour * 3600 - min * 60);

    if (hour >0) {
      result =  hour + " H ";
    }
    if ((hour > 0) || (min > 0)){
      result += min + " M ";
    }

    result += sec + " S "

    return result;
  }

}
