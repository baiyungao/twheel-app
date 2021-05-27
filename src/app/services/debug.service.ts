import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  debugMsg: string;
  constructor() { }

  debug(content: any){
    this.debugMsg +="\n" + content;
    console.log(content);
  }
}
