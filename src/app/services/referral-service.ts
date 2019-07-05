import { Injectable } from '@angular/core';
import { Http, Headers, HttpModule } from "@angular/http";

@Injectable({
 providedIn: 'root',
})
export class ReferralService {
  constructor () {
    console.log("From referral service");
  }
}
