import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { WalletService } from '../../../services/wallet.service';
import { Storage } from '@ionic/storage';
import { CustomHttpService } from '../../../services/custom-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-send-view',
  templateUrl: './send-view.component.html',
  styleUrls: ['./send-view.component.scss']
})
export class SendViewComponent implements OnInit, OnDestroy {

  type: string;
  mode: string;
  userId: string;
  phoneNumber: string;
  msg: string;
  amount: string;
  address: string;
  isSent: boolean;
  isSendClicked: boolean;
  loader: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: CustomHttpService,
    private walletService: WalletService,
    private storage: Storage,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    // console.log("Loading send view..");
    this.type = "";
    this.mode = "phone";
    this.userId = "";
    this.msg = "";
    this.amount = "";
    this.address = "";
    this.phoneNumber = "";
    this.isSent = false;
    this.isSendClicked = false;
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.type = params.type;
        // console.log(params);
      });

      // const ethAddress = await this.storage.get('eth_address');
      // console.log(ethAddress);
  }

  ngOnDestroy() {
    if(this.loader) {
      this.loader.dismiss();
    }
  }

  onClickRadio() {
    this.router.navigate(['/apps/home']);
  }

  toggleMode () {
    this.mode = this.mode == 'address' ? 'phone' : 'address';
  }

  toggleType () {
    this.type = (this.type == 'COVA' || this.type == 'FakeCova') ? 'ETH' : 'FakeCova'
  }

  sendCrypto() {
    this.loadingController
    .create({
      spinner: 'crescent',
      message: '获取下一章'
    }).then((loader => {
      this.loader = loader;
      return loader.present();
    })).then((success) => {
      console.log('success', success);
      this.confirmSend();
    });
  }

  confirmSend () {
    this.isSendClicked = true;
    if (this.mode === 'phone') {
      this.sendToPhone()
        .catch(err => {
          this.createAlert('Error', `Error sending ${this.type}, please try again`, '/cryptogram/home')
            .then(alert => alert.present());
          this.router.navigate(['/cryptogram/home']);
        }).finally(() => {
          this.loader.dismiss();
        });
    } else {
      this.sendToAddress()
        .catch(err => {
          this.createAlert('Error', `Error sending ${this.type}, please try again`, '/cryptogram/home')
            .then(alert => alert.present());
          this.router.navigate(['/cryptogram/home']);
        }).finally(() => {
          this.loader.dismiss();
        });
    }
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

  async sendToPhone () {
    let res: any;
    if (this.type === 'COVA' || this.type === 'FakeCova') {
      res = await this.walletService.sendCovaPhone(this.phoneNumber, this.amount, this.msg);
    } else {
      res = await this.walletService.sendETHPhone(this.phoneNumber, this.amount, this.msg);
    }
    this.isSent = res.isSent;
    if (this.isSent) {
      if (res.verified_user === true) {
        const alert = await this.createAlert('Success', `Successfully sent ${this.type}`, '/cryptogram/home');
        alert.present();
        this.router.navigate(['/cryptogram/home']);
      } else {
        const alert = await this.createAlert('New user', `Successfully sent ${this.type}`, '/me/home');
        alert.present();
        this.router.navigate(['/me/home']);
      }
    } else {
      if(res.isSendable){
        const alert = await this.createAlert('Error', `Error sending ${this.type}, please try again`, '/cryptogram/home');
        alert.present();
        this.router.navigate(['/cryptogram/home']);
      }
      else {
        const alert = await this.createAlert('Error', `Error sending ${this.type}, Can't trasnfer from Bonus amount`, '/cryptogram/home');
        alert.present();
        this.router.navigate(['/cryptogram/home']);
      }
    }
  }

  async sendToAddress () {
    // console.log("Sending to address");
    let res: any;
    if (this.type === 'COVA' || this.type === 'FakeCova') {
      res = await this.walletService.sendCova(this.address, this.amount, this.msg);
    } else {
      res = await this.walletService.sendETH(this.address, this.amount, this.msg);
    }
    this.isSent = res.isSent;
    if (this.isSent) {
      const alert = await this.createAlert('Success', `Successfully sent ${this.type}`, '/cryptogram/home');
      alert.present();
      this.router.navigate(['/cryptogram/home']);
    }
    else {
      if(res.isSendable){
        const alert = await this.createAlert('Error', `Error sending ${this.type}, please try again`, '/cryptogram/home');
        alert.present();
        this.router.navigate(['/cryptogram/home']);
      }
      else {
        const alert = await this.createAlert('Error', `Error sending ${this.type}, Can't trasnfer from Bonus amount`, '/cryptogram/home');
        alert.present();
        this.router.navigate(['/cryptogram/home']);
      }
    }
  }

}
