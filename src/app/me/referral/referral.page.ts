declare var require: any;
declare var window: any;

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import mergeImages from 'merge-images';
import QRCode from 'qrcode';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./referral.page.scss'],
})
export class ReferralPage implements OnInit, AfterViewInit {
  referralLink = '';
  url = '';
  refImage = '';

  constructor(
    private router: Router,
    private storage: Storage,
    private socialSharing: SocialSharing
  ) {
    this.checkVerified();
  }

  ngOnInit() {}

  ngAfterViewInit () {
    this.storage.get('user-id')
      .then(userID => {
        this.referralLink = `http://lepaiapp.com/referral?ref=${userID}`;
        // return this.storage.set('ref-link', this.referralLink);
      }).then((success) => {
        return QRCode.toDataURL(this.referralLink, { width: 250 });
      }).then(qrdata => {
        return mergeImages([
          {
            src: '../../assets/referral_background.png',
            x: 0,
            y: 0,
          },
          {
            src: qrdata,
            x: 150,
            y: 1320,
          }
        ]);
      }).then(refImage => {
        this.refImage = refImage;
        // this.storage.set('ref-image', refImage);
      }).catch(err => {
        // TODO: Add toast
        // something wrong with the server doesn't find the user id
      });
  }

  // ngOnInit() {
  //   this.storage.get('ref-link')
  //     .then((link) => {
  //       console.log('link === ', link);
  //       if (link === null) {
  //         this.generateRefImage();
  //       } else {
  //         this.referralLink = link;
  //         return this.storage.get('ref-image');
  //       }
  //     }).then(data => {
  //       this.refImage = data;
  //     }).catch(err => {
  //       console.log('error', err);
  //     });
  // }

  generateRefImage() {
    this.storage.get('user-id')
      .then(userID => {
        this.referralLink = `http://lepaiapp.com/referral?ref=${userID}`;
        return this.storage.set('ref-link', this.referralLink);
      }).then((success) => {
        return QRCode.toDataURL(this.referralLink, { width: 190 });
      }).then(qrdata => {
        return mergeImages([
          {
            src: '../../assets/referral_background.png',
            x: 0,
            y: 0,
          },
          {
            src: qrdata,
            x: 90,
            y: 920,
          }
        ]);
      }).then(refImage => {
        this.refImage = refImage;
        this.storage.set('ref-image', refImage);
      }).then(success => {
        // console.log('success');
      }).catch(err => {
        console.log(err)
        // TODO: Add toast
        // something wrong with the server doesn't find the user id
      });
  }

  download () {
    this.socialSharing.share(
      '欢迎使用我的邀请链接 lepaiapp.com 下载乐派App，赢取价值 500 元人民币的 50000 渴望币，还有彩票、红包、小说等你来玩！', '',
      this.refImage)
      .then(success => {
        console.log(success);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

}
