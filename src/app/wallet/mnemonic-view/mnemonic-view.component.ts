import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-mnemonic-view',
  templateUrl: './mnemonic-view.component.html',
  styleUrls: ['./mnemonic-view.component.scss']
})
export class MnemonicViewComponent implements OnInit, AfterViewInit {
  mnemonicList: string[];
  ethAddress: string;
  mnemonic: string;

  constructor(
    private walletService: WalletService,
    private storage: Storage,
    private router: Router,
    private clipboard: Clipboard,
    private toast: Toast
  ) {
        this.checkVerified();
  }

  ngOnInit() {
    // this.mnemautoonicList = [];
    // this.walletService.makeMenemonicWallet().subscribe(val => {
    //   this.ethAddress = val.ethAddress;
    //   this.mnemonicList = val.mnemonic.split(' ');
    // });
  }

  ngAfterViewInit () {
    this.getMnemonic();
  }

  async getMnemonic() {
    const ethAddress = await this.storage.get('eth_address');
    this.mnemonic = this.walletService.decrypt(await this.storage.get('mnemonic'), ethAddress);
  }


  onBackupClick () {}

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

  copyToClipBoard () {
    // console.log("calling copy");
    this.clipboard.copy(this.mnemonic);
    this.toast.show("已复制到剪贴板", "1000", "center").subscribe(data => { console.log(data + '.'); });
  }

}
