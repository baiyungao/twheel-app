import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabHomePageRoutingModule } from './tab-home-routing.module';

import { TabHomePage } from './tab-home.page';
import { HMSPipe } from '../thl-format/hms.pipe';
import { ThlFormatModule } from '../thl-format/thl-format.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabHomePageRoutingModule,
    ThlFormatModule
  ],
  declarations: [TabHomePage]
})
export class TabHomePageModule {}
