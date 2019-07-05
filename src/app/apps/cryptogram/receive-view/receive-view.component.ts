import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import QRCode from 'qrcode';
import { environment } from '../../../../environments/environment';
import { CustomHttpService } from '../../../services/custom-http.service';



@Component({
  selector: 'app-receive-view',
  templateUrl: './receive-view.component.html',
  styleUrls: ['./receive-view.component.scss']
})
export class ReceiveViewComponent implements OnInit {

  ethReceivingAddress: string;
  covaReceivingAddress: string;
  phoneNumber: string;
  qrCodeETH: string;
  qrCodeCOVA: string;

  constructor(
    private router: Router,
    private walletService: WalletService,
    private storage: Storage,
    private http: CustomHttpService,
    ) {
    this.ethReceivingAddress = '';
    this.covaReceivingAddress = '';
  }

  ngOnInit() {
    this.walletService.changeBackground(true);
    this.getEthAddress();
    this.getPhoneNumber();
    this.getCustodianAddress();
  }

  async getEthAddress () {
    this.ethReceivingAddress = await this.storage.get('eth_address');
    this.qrCodeETH = await this.genQrCode(this.ethReceivingAddress);
  }

  async getCustodianAddress () {
    this.covaReceivingAddress = await this.storage.get('custodian_eth_address');
    this.qrCodeCOVA = await this.genQrCode(this.covaReceivingAddress);
  }

  async getPhoneNumber() {
    this.phoneNumber = await this.storage.get('user_phone_number');
  }

  async genQrCode(address: string) {
    return await QRCode.toDataURL(address);
  }

  onClickRadio() {
    this.router.navigate(['/apps/home']);
  }
}
