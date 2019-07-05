import { Injectable } from '@angular/core';
import { Http, Headers, HttpModule } from "@angular/http";

@Injectable({
 providedIn: 'root',
})
export class CustomHttpService {

  constructor(private http: Http) { }

  get(url: string, token: string = '') {
    let headers = new Headers();
    headers.append('Authorization', token);
    return this.http.get(url, { headers: headers });
  }

  post(url: string, d: any, token: string = '') {
    let headers = new Headers();
    headers.append('Authorization', token);
    // console.log(headers);
    return this.http.post(url, d, { headers: headers });
  }

  put(url: string, d: any) {
    let headers = new Headers();
    return this.http.put(url, d, { headers: headers });
  }

  delete(url: string) {
    let headers = new Headers();
    return this.http.delete(url, { headers: headers });
  }
}
