import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  constructor (
    private router: Router,
    private walletService: WalletService,
    private storage: Storage
  ) {
      this.checkVerified();
   }

  async confirm () {
    // TODO: Figure out what this is
    const result = await this.walletService.sendETH(null, null, null);
    // console.log("From invoice confirmation ", result);
  }

  cancel () {
    this.router.navigate(['/tabs/wallet/home']);
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

}
