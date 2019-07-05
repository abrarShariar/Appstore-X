import { Component, OnInit, Input } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import QRCode from 'qrcode';


@Component({
  selector: 'app-receive-view',
  templateUrl: './receive-view.component.html',
  styleUrls: ['./receive-view.component.scss']
})
export class ReceiveViewComponent implements OnInit {
  receiveAddress: string;
  phoneNumber: string;
  qrCode: string;
  type: string;

  constructor (
    private walletService: WalletService,
    private storage: Storage,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.checkVerified();
    this.receiveAddress = '';
  }

  ngOnInit() {
    this.walletService.changeBackground(true);
    this.getPhoneNumber();
    this.route
      .queryParams
      .subscribe(params => {
        this.type = params.type;
        this.getEthAddress();
      });
  }

  async getEthAddress () {
    if (this.type === 'ETH') {
      this.receiveAddress = await this.storage.get('eth_address');
    } else {
      this.receiveAddress = await this.storage.get('custodian_eth_address');
    }
    this.qrCode = await this.genQrCode(this.receiveAddress);
  }

  async getPhoneNumber() {
    this.phoneNumber = await this.storage.get('user_phone_number');
  }

  async genQrCode(address: string) {
    return await QRCode.toDataURL(address);
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }
}
