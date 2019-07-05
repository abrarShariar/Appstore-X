import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { WalletService } from '../services/wallet.service';
import { TabsComponent } from './tabs/tabs.component';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  title: string;
  isShowBackground: boolean;

  constructor(
    private router: Router,
    private walletService: WalletService,
    private storage: Storage
  ) {
    this.checkVerified();
  }

  ngOnInit () {
    this.walletService.currentBackground.subscribe(flag => this.isShowBackground = flag);
    // this.router.navigate(['/wallet/home']);
  }

  /*
    get list of transactions to show for history
    /transaction/list
    @param { id: string, to: string, msg: string, amount: number, timestamp: string }
  */

  getTransactionList () {}

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }


}
