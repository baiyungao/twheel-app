import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ValueAccessor } from '@ionic/angular/directives/control-value-accessors/value-accessor';

const { Storage } = Plugins;

/**
 * 
 * npm install @capacitor/storage
 * npx cap sync
 */

//https://capacitorjs.com/docs/guides/storage

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {
  constructor() {
  }


  // Create and expose methods that users of this service can
  // call, for example:
  async set(_key: string, _value: any) {
    console.log( "storage" + Storage + "save to local store:" + " key:" + _key + " value:" + _value);
    
    await Storage.set({
      key: _key,
      value: _value
    });
        
    const keys = await Storage.keys();
    console.log ('Keys:' + keys);
   }

  //get the item
  async get(_key: string) {
    const keys = await Storage.keys();
    let input = {
        key: _key
    }
    console.log ('Key:' + JSON.stringify(input));
    const ret = await Storage.get(input);
    console.log ('value:' + JSON.stringify(ret));
    const value = ret.value;
    console.log ('' + JSON.stringify(ret) + " value:" + value);
    return value;
  }

}

/**
 * key: 
 *  this.localstore.set("email", mail);
    this.localstore.set("password", password);
 * 
 */
