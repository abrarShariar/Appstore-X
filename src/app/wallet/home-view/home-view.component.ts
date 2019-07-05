declare var require: any;
declare const Buffer;
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx';
import { environment } from '../../../environments/environment';
import { CustomHttpService } from "../../services/custom-http.service";
import { WalletService } from "../../services/wallet.service";
import { map } from 'rxjs/operators';
import { Http, Headers, HttpModule } from "@angular/http";
import { AlertController } from '@ionic/angular';
import * as hdkey from 'ethereumjs-wallet/hdkey';
import * as bip39 from 'bip39';
const  base58 =  require('bs58');
const nacl = require('tweetnacl');


@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit, AfterViewInit {

  ethBalance: string;
  covaBalance: string;
  mnemonic: string;
  type:string;

  constructor (
    private router: Router,
    private storage: Storage,
    private http: CustomHttpService,
    private walletService: WalletService,
    private http2: Http,
    private alertController: AlertController,
    private clipboard: Clipboard,
    private toast: Toast,
    ) {
      this.covaBalance = '-';
      this.ethBalance = '-';
      this.getMnemonic();
      this.checkVerified();
    }

  ngOnInit() {}

  ngAfterViewInit () {
    this.storage.get("mnemonic")
      .then(mnemonic => {
        if (mnemonic == null) {
          // this.toast.show("You already have an account. But your mnemonic is not set. please set your mnemonic", "5000", "center")
          //           .subscribe(data => { console.log(data + '.'); });
          this.toast.show('您已成功注册账户。为了保护账户安全，请您尽快设置助记词', "2000", "center")
                    .subscribe(data => { console.log(data + '.'); });
        }
      }).catch(err => {
        console.log(err);
      });
    this.walletService.changeBackground(false);
    this.getBalance()
      .catch(err => {
        this.createAlert('Error', `Error checking balance, please try again`, this.router.url)
            .then(alert => alert.present());
      });
  }

  async createAlert(header: string, message: string, routeTo: string) {
    let alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: '好',
          handler: () => {
            this.router.navigate([routeTo]);
          }
        }
      ]
    });
    return alert;
  }

  async getMnemonic() {
    this.mnemonic = await this.storage.get('mnemonic');
  }

  showHistory () {
    this.router.navigate(['/wallet/history']);
  }

  copyToClipBoard () {
    this.clipboard.copy(this.mnemonic);
    this.toast.show("已复制到剪贴板", "1000", "center").subscribe(data => { console.log(data + '.'); });
  }

  goToSend (type) {
    this.router.navigate(['/wallet/send'], { queryParams: { type: type } });
  }

  goToInbox (type) {
    this.router.navigate(['/wallet/inbox'], { queryParams: { type: type } });
  }

  async getBalance () {
    this.ethBalance = await this.walletService.getEthBalance();
    this.covaBalance = await this.walletService.getBdbBalance();
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

  onClickRadio () {
    this.router.navigate(['/apps/home']);
  }

  getKeypair(seed) {
    const keyPair = seed !== null ? nacl.sign.keyPair.fromSeed(seed) : nacl.sign.keyPair()
    const publicKey = base58.encode(Buffer.from(keyPair.publicKey))
    const privateKey = base58.encode(Buffer.from(keyPair.secretKey.slice(0, 32)))
    return {
        publicKey,
        privateKey
    }
  }

  async showRecoverWindow() {
    let alert = await this.alertController.create({
      header: '账户恢复',
      subHeader: '请您输入先前记录的 12 个助记词，并以空格分隔。这将帮助您找回账户私钥。',
      inputs: [
        {
          name: 'recover_mnemonic',
          placeholder: '输入助记词',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: '恢复',
          role: 'button',
          handler: data => {
            let splitList = (data.recover_mnemonic.trim()).split(' ')
            let mnemonicList = []
            for (const word of splitList) {
              if (word.length > 0) {
                mnemonicList.push(word);
              }
            }
            let mnemonic = mnemonicList.join(' ');
            let wallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic)).getWallet();
            let privateKey = wallet.getPrivateKeyString();
            let ethAddress = wallet.getAddressString();
            let bdbKeypair = this.getKeypair(bip39.mnemonicToSeed(mnemonic).slice(0, 32));

            mnemonic = this.walletService.encrypt(mnemonic, ethAddress);
            privateKey = this.walletService.encrypt(privateKey, ethAddress);
            bdbKeypair.privateKey = this.walletService.encrypt(bdbKeypair.privateKey, ethAddress);

            this.storage.get('jwt-token')
            .then((jwt_token) => {
              const token = `Bearer ${jwt_token}`;
              const d = {
                fields: {
                  deviceInfo: 'xxxx',
                  name: 'Hello world',
                  ethAddress: ethAddress,
                  bdbPublicKey: bdbKeypair.publicKey
                }
              };
              this.http.post(`${environment.api_server}/user/check-mnemonic`, d, token)
              .subscribe (result => {
                // console.log("User updated",result);
                if(result.json().correct == true) {
                  this.storage.set('eth_address', ethAddress);
                  this.storage.set('mnemonic', mnemonic);
                  this.storage.set('eth_private_key', privateKey);
                  this.storage.set('bdb_public_key', bdbKeypair.publicKey);
                  this.storage.set('bdb_private_key', bdbKeypair.privateKey);
                  this.toast.show("恭喜！您的账户已恢复", "2000", "center")
                    .subscribe(data => { console.log(data + '.'); });
                } else {
                  this.toast.show("助记词错误。请您输入正确的助记词", "2000", "center")
                    .subscribe(data => { console.log(data + '.'); });
                }
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

  goToHistory (type) {
    this.router.navigate(['/wallet/history'], { queryParams: { type: type } });
  }

  showMnemonic () {
    this.router.navigate(['/wallet/mnemonic']);
  }
}
