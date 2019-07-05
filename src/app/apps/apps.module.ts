import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppsPage } from './apps.page';
import { AppsHomeComponent } from './apps-home/apps-home.component';
// import { CryptogramPage } from './cryptogram/cryptogram.page';
// import { CryptogramHomeComponent } from './cryptogram/cryptogram-home/cryptogram-home.component';
// import { SendViewComponent as CryptogramSendView } from './cryptogram/send-view/send-view.component';
import { CovaTumblrPage } from './cova-tumblr/cova-tumblr.page';
import { CovaTumblrHomeComponent } from './cova-tumblr/cova-tumblr-home/cova-tumblr-home.component';
import { SingleContentComponent } from './cova-tumblr/single-content/single-content.component';
import { ContentDetailsComponent } from './cova-tumblr/content-details/content-details.component';
import { CovaTumblrHistoryComponent } from './cova-tumblr/cova-tumblr-history/cova-tumblr-history.component';
import { TabsComponent } from './tabs/tabs.component';
import { TumblrTabsComponent } from './cova-tumblr/tumblr-tabs/tumblr-tabs.component';
import { ReceiveViewComponent as CryptogramReceiveView } from './cryptogram/receive-view/receive-view.component';


const routes: Routes = [
  {
    path: '',
    component: AppsPage,
    children: [
    {
      path: 'home', component: AppsHomeComponent
    }]
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AppsPage,
    AppsHomeComponent,
    // CryptogramPage,
    // CryptogramHomeComponent,
    // CryptogramSendView,
    // CovaTumblrPage,
    // CovaTumblrHomeComponent,
    // SingleContentComponent,
    // ContentDetailsComponent,
    // CovaTumblrHistoryComponent,
    // TumblrTabsComponent,
    TabsComponent,
    // CryptogramReceiveView
  ]
})
export class AppsPageModule { }
