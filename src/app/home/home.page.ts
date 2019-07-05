import { Component, OnInit, AfterViewInit } from '@angular/core';
import { signupTexts } from '../config/texts';
import { Router } from '@angular/router';
import { CustomHttpService } from "../services/custom-http.service";
import { WalletService } from '../services/wallet.service';
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx';

import { Device } from '@ionic-native/device/ngx';

import * as rsa from '../token/rsa.js'

class HomeText {
  title: string;
  subTitle: string;
  getCode: string;
  verify: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})


export class HomePage implements OnInit, AfterViewInit {
  mnemonicList: string[];

  texts: HomeText;
  phoneNumber: string;
  code: string;
  gotCode: boolean;
  ethAddress: string;

  isVerifyClicked: boolean;
  isCodeReceived: boolean;

  constructor (
    private router: Router,
    private http: CustomHttpService,
    private storage: Storage,
    private walletService: WalletService,
    private device: Device,
    private toast: Toast,
  ) {
    // this.checkVerified();
    // this.checkVerified();
    this.phoneNumber = "";
    this.code = "请填写验证码";
    this.gotCode = false;
    this.isVerifyClicked = false;
    this.isCodeReceived = false
  }

  ngOnInit() {
    this.mnemonicList = [];
  }

  ngAfterViewInit () {
    this.checkVerified();
  }
  // call /send-otp
  getCode () {
    // console.log("calling get code");
    this.isCodeReceived = true;
    const url = `${environment.api_server}/user/send-otp`;
    const data = {
      phoneNumber: this.phoneNumber
    };

    this.http.post(url, data)
      .subscribe(result => {
        this.gotCode = true;
        // const obj = JSON.parse(result['_body']);
        // console.log("object");
        // this.code = obj.success;
        // this.code = result['_body']
        this.isCodeReceived = false;
      }, err => {
        // console.log("ERROR bokkor", err);
        this.toast.show('This app only works in mainland China. Please try again with a valid chinese', '2000', 'center').subscribe(data => {});
      });
  }

  // call /verify @params { phoneNumber: string, code: string }
  // returns jwt token store for sending in header
  verify () {
    this.isVerifyClicked = true;
    const url = `${environment.api_server}/user/verify`;
    // console.log("--> hehe ", this.code);
    const data = {
      phoneNumber: this.phoneNumber,
      code: this.code
    };

    this.http.post(url, data)
              .subscribe(result => {
                const obj = JSON.parse(result['_body']);
                if (obj.token) {
                  this.storage.set('user_phone_number', this.phoneNumber);
                  this.storage.set('jwt-token', obj.token);
                  this.storage.set('user-id', obj.id);
                  this.walletService.makeMenemonicWallet().subscribe(val => {
                    // console.log("Val: ", val);
                    this.ethAddress = val.ethAddress;
                    this.mnemonicList = val.mnemonic.split(' ');
                    const token = `Bearer ${obj.token}`;
                    const { uuid, manufacturer, version, cordova, platform, model } = this.device;
                    const d = {
                      fields: {
                        deviceInfo: JSON.stringify({
                          uuid,
                          manufacturer,
                          version,
                          cordova,
                          platform,
                          model
                        }),
                        name: 'Hello world',
                        ethAddress: val.eth_address,
                        bdbPublicKey: val.bdb_public_key,
                      }
                    };
                    this.http.get(`${environment.api_server}/tee/getAddressToSend/${this.phoneNumber}`)
                    .subscribe (result => {
                      if (result) {
                        this.http.post(`${environment.api_server}/tee/update-user`, d, token)
                        .subscribe(result => {
                            if (result.json().updated == true) {
                              this.storage.set('eth_address', val.eth_address);
                              this.storage.set('mnemonic', val.mnemonic);
                              this.storage.set('eth_private_key', val.eth_private_key);
                              this.storage.set('bdb_private_key', val.bdb_private_key);
                              this.storage.set('bdb_public_key', val.bdb_public_key);
                            }
                            this.http.get(`${environment.api_server}/tee/getCustodian/${this.phoneNumber}`, token)
                              .subscribe(res => {
                                const custodian_data = res.json();
                                this.storage.set('custodian_eth_address', custodian_data.eth_address);
                                this.storage.set('custodian_bdb_public_key', custodian_data.bdb_public_key);
                              });
                        });
                        this.router.navigate(['/today']);
                      }
                    });
                  });
                } else if (obj.error && obj.error === 'Wrong code!') {
                  this.isVerifyClicked = false;
                  this.toast.show('Wrong otp code. Try again', '2000', 'center')
                      .subscribe(data => data = {});
                }
                // else if (obj.error && obj.error === 'Wrong code!') {
                //   // show err msg for otp here
                //   this.toast.show('Wrong otp code. Try again', '2000', 'center')
                //       .subscribe(data => console.log(data))
                // }

          });
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/today'])
    }
  }


}
