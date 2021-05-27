import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HMSPipe } from './thl-format/hms.pipe';

const routes: Routes = [
  {
    path: 'authenticated',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  }
 ];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
