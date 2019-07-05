import { Component, OnInit,  ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CustomHttpService } from "../../services/custom-http.service";
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Http, Headers, HttpModule } from "@angular/http";

import * as FileSaver from "file-saver";
declare var require: any;
declare var window: any;

var domtoimage = require('dom-to-image');

@Component({
  selector: 'app-me-home',
  templateUrl: './me-home.component.html',
  styleUrls: ['./me-home.component.scss']
})
export class MeHomeComponent implements OnInit, AfterViewInit {
  phoneNumber: string;
  token: string;
  name: string;
  ethAddress: string;
  support: string;

  constructor (
    private router: Router,
    private storage: Storage,
    private http: CustomHttpService,
    private http2: Http
  ) {
    this.checkVerified();
    this.phoneNumber = "";
    this.token = "";
    this.ethAddress = "";
    this.name = "";

    this.storage.get('jwt-token').then((val) => {
      this.token = val;
    })
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // set phone number from localstorage
    this.getUserInfo();
  }

  /*
    GET /user/get-user/:phone-number
    return {
      name, eth_addresss
    }
  */
 async getUserInfo () {
      const s_res = await this.http2.get(`${environment.api_server}/app/support_contact`).toPromise();
      this.support = s_res.json().phone;
      this.phoneNumber = await this.storage.get('user_phone_number');
      this.token = await this.storage.get('jwt-token');
      const url = `${environment.api_server}/user/get-user/${this.phoneNumber}`;
      // this.http.get(url, this.token)
      //         .subscribe(result => {
      //           const obj = JSON.parse(result['_body']);
      //           this.name = obj.user.name;
      //           this.ethAddress = obj.user.ethAddress;
      //         });
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

}
