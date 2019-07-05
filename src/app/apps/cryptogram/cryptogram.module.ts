import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CryptogramPage } from './cryptogram.page';
import { TabsComponent } from './tabs/tabs.component';
import { SendViewComponent } from './send-view/send-view.component';
import { ReceiveViewComponent } from './receive-view/receive-view.component';
import { CryptogramHomeComponent } from './cryptogram-home/cryptogram-home.component';

const routes: Routes = [
  {
    path: '',
    component: CryptogramPage,
    children: [
      {
        path: 'home', component: CryptogramHomeComponent
      },
      {
        path: 'send', component: SendViewComponent
      },
      {
        path: 'receive', component: ReceiveViewComponent
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
    CryptogramPage,
    TabsComponent,
    CryptogramHomeComponent,
    SendViewComponent,
    ReceiveViewComponent
  ],
  exports: [CryptogramPage]
})
export class CryptogramPageModule {}
