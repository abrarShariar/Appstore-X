import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from "../../environments/environment";
import { Http, Headers, HttpModule } from "@angular/http";
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { WalletService } from './wallet.service';

class BetData {
  public start_position?: number;
  public digit_position?: number;
  public seed: number;
  public money: number;
  public type: string;
}

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  headers: Headers;
  randomHistotrySize: number;

  constructor (
    private storage: Storage,
    private http: Http,
    private walletService: WalletService
  ) {
    this.randomHistotrySize = 20;
    this.setHeaders();
  }

  async setHeaders () {
    const token = await this.storage.get('jwt-token');
    const temp = `Bearer ${token}`;
    this.headers = new Headers();
    this.headers.append('Authorization', temp);
  }

  // GETTING THE RANDOM NUMBER FOR BETTING HERE
  // method to get random numbers
  async getRandomNumber () {
    const url = `${environment.slots_api_server}/getRandom/`;
    try {
      const result = await this.http.get(url, { headers: this.headers }).toPromise();
      const d = result.json();
      return {
        data: d,
        error: null
      }
    } catch (err) {
      return {
        data: null,
        error: err
      }
    }
  }

  // BETTING THE SHIT OUT HERE
  // method to post bet of sum
  async setBet (data: BetData, tag: string, selectedSection: string) {
    // call sendCova and check success response
    const msg = `bet on random number ${data.seed} for ${selectedSection} on ${data.type}`;
    console.log("msg: ", msg);
    console.log("data.money: ", data.money);
    const checkCova = await this.walletService.sendCova(environment.CENTRAL_BDB_PUBLIC_KEY, data.money, msg);
    console.log("check COva:", checkCova);
    if (checkCova.isSent) {
      const url = `${environment.slots_api_server}/${tag}`;
      try {
        const result = await this.http.post(url, data, { headers: this.headers }).toPromise();
        const d = result.json();
        return {
          data: d,
          error: null
        }
      } catch (err) {
        return {
          data: null,
          error: err
        }
      }
    } else {
      return {
        data: { status: "Failed to send cova" },
        error: true
      }
    }
  }

  // get BET history
  async getBetHistory (offset: number) {
    const url = `${environment.slots_api_server}/getBetHistory`;
    try {
      const result = await this.http.get(url, { headers: this.headers, params: { offset: offset, size: this.randomHistotrySize} }).toPromise();
      const d = result.json();
      return {
        data: d,
        error: null
      }
    }
    catch (err) {
      return {
        data: null,
        error: err
      }
    }
  }

  // get random BET
  async getRandomBetHistory (offset: number) {
    const url = `${environment.slots_api_server}/getRandomHistory`;
    try {
      const result = await this.http.get(url, { headers: this.headers, params: { offset: offset, size: this.randomHistotrySize } }).toPromise();
      const d = result.json();
      return {
        data: d,
        error: null
      }
    } catch (err) {
      return {
        data: null,
        error: err
      }
    }
  }

  // get Bet Amount
  async getBetAmountHistory () {
    const url = `${environment.slots_api_server}/getBetAmountHistory`;
    try {
      const result = await this.http.get(url, { headers: this.headers }).toPromise();
      const d = result.json();
      return {
        data: d,
        error: null
      }
    } catch (err) {
      return {
        data: null,
        error: err
      }
    }
  }
}
