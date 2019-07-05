import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CovaTumblrPage } from './cova-tumblr.page';
import { TumblrTabsComponent } from './tumblr-tabs/tumblr-tabs.component';
import { CovaTumblrHistoryComponent } from './cova-tumblr-history/cova-tumblr-history.component';
import { CovaTumblrHomeComponent } from './cova-tumblr-home/cova-tumblr-home.component';
import { SingleContentComponent } from './single-content/single-content.component';
import { ContentDetailsComponent } from './content-details/content-details.component';


const routes: Routes = [
  {
    path: '', 
    component: CovaTumblrPage,
    children: [
      {
        path: 'home', component: CovaTumblrHomeComponent
      },
      {
        path: 'single-content', component: SingleContentComponent
      },
      {
        path: 'content-details', component: ContentDetailsComponent
      },
      {
        path: 'history', component: CovaTumblrHistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    RouterModule.forChild(routes)
  ],
  declarations: [
    CovaTumblrPage,
    TumblrTabsComponent,
    CovaTumblrHomeComponent,
    ContentDetailsComponent,
    CovaTumblrHistoryComponent,
    CovaTumblrHomeComponent,
    SingleContentComponent
  ]
})
export class CovaTumblrPageModule {}
