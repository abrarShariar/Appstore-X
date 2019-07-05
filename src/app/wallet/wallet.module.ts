import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Toast } from '@ionic-native/toast/ngx';

import { IonicModule } from '@ionic/angular';
import { WalletPage } from './wallet.page';
import { WalletService } from '../services/wallet.service';

import { HistoryComponent } from './history/history.component';
import { MnemonicViewComponent } from './mnemonic-view/mnemonic-view.component';
import { ReceiveViewComponent } from './receive-view/receive-view.component';
import { SendViewComponent } from './send-view/send-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  {
    path: '',
    component: WalletPage,
    children: [
      {
        path: 'home', component: HomeViewComponent
      },
      {
        path: 'send', component: SendViewComponent
      },
      {
        path: 'invoice', component: InvoiceComponent
      },
      {
        path: 'inbox', component: ReceiveViewComponent
      },
      {
        path: 'mnemonic', component: MnemonicViewComponent
      },
      {
        path: 'history', component: HistoryComponent
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
    NgxQRCodeModule,
  ],
  declarations: [
      WalletPage,
      HistoryComponent,
      InvoiceComponent,
      HomeViewComponent,
      SendViewComponent,
      ReceiveViewComponent,
      MnemonicViewComponent,
      TabsComponent
    ],
  exports: [],
  providers: [
    WalletService,
    Clipboard,
    Toast,
  ]
})
export class WalletPageModule {}
