import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MePage } from './me.page';
import { MeHomeComponent } from './me-home/me-home.component';
import { TabsComponent } from './tabs/tabs.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ReferralPage } from './referral/referral.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


const routes: Routes = [
  {
    path: '',
    component: MePage,
    children: [
      {
        path: 'home', component: MeHomeComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxQRCodeModule
  ],
  declarations: [
    MePage,
    MeHomeComponent,
    TabsComponent,
    ReferralPage
  ],
  providers: [SocialSharing]
})
export class MePageModule {}
