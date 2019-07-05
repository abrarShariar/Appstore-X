/*
  This component is deprecated, only kept for backup/historical evidence :)
*/

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http, Headers, HttpModule } from "@angular/http";
import { Storage } from '@ionic/storage';
import { environment } from "../../../environments/environment";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

class Transactiion {
  amount: number;
  claimedAt: string;
  fromUserId: number;
  id: number;
  message: string;
  sentAt: string;
  toUserId: number;
  tokenName: string;
  fromAddress: string;
  toAddress: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterViewInit {

  transactionList: Transactiion[] = [];
  type: string;
  loader: any;
  constructor(
    private http: Http,
    private storage: Storage,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.type = params.type;
      });
    // this.transactionList = [
    //   {
    //     transactionId: 'DX123456',
    //     datetime: 'JAN 19',
    //     from: '2089123123',
    //     message: 'Happy New Year',
    //     status: 'sent'
    //   },
    //   {
    //     transactionId: 'DX123454',
    //     datetime: 'JAN 19',
    //     from: '2089123190',
    //     message: 'Happy New Year',
    //     status: 'received'
    //   }
    // ]
  }

  ngAfterViewInit () {
    this.createLoader()
      .then(() => {
        this.loader.present();
        this.getTransactions();
      });
  }

  async createLoader() {
    this.loader = await this.loadingController.create({
      spinner: 'crescent',
      message: '载入中...'
    });
    return this.loader;
  }


  async createAlert() {
    let alert = await this.alertController.create({
      // title: 'Confirm purchase',
      header: '无交易记录',
      message: '您还未发起任何交易',
      buttons: [
        {
          text: '好',
          handler: () => {
            this.router.navigate(['wallet/home']);
          }
        }
      ]
    });
    return alert;
  }

  async getTransactions () {
    const token = await this.storage.get('jwt-token');
    // console.log("TOK: ", token);
    const temp = `Bearer ${token}`;
    let headers = new Headers();
    headers.append('Authorization', temp);

    let url = `${environment.api_server}/transaction/list`;
    let res = await this.http.get(url, { headers: headers }).toPromise();
    const data = res.json();
    this.transactionList = data.filter((ele: any) => (ele.tokenName === this.type));
    if (this.transactionList.length > 0) {
      if (this.loader) {
        this.loader.dismiss();
      }
    }

    if (!Array.isArray(this.transactionList) || !this.transactionList.length) {
      const alert = await this.createAlert();
      this.loader.dismiss();
      alert.present();
    }
  }

}
