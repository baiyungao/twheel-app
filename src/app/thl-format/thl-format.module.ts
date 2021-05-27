import { NgModule } from '@angular/core';
import { HMSPipe } from './hms.pipe';



@NgModule({
  declarations: [HMSPipe],
  exports: [HMSPipe]
})
export class ThlFormatModule {
  static forRoot() {
    return {
        ngModule: ThlFormatModule,
        providers: [],
    };
 }
 }
