import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Http, Headers, HttpModule } from "@angular/http";
import { environment } from "../environments/environment";
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor (
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private http: Http,
    private storage: Storage,
    private router: Router,
    private alertController: AlertController
  ) {
    // this.resetToken();
    this.initializeApp();
  }

  initializeApp () {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#333");
      this.splashScreen.hide();
      this.setInitialView();
    })
  }

  async setInitialView () {
    // make api call here to db and set config values to localstorage
    const token = await this.storage.get('jwt-token');
    // console.log("token: ", token);
    if (token) {
      this.storage.set('config_value', "show");
      // const temp = `Bearer ${token}`;
      // let headers = new Headers();
      // headers.append('Authorization', temp);
      //
      // const url = `${environment.api_server}/app/settings`;
      // const result = await this.http.get(url, { headers: headers }).toPromise();
      // let d = result.json();
      //
      // console.log("From app settings: ", d);
      const url = `${environment.api_server}/app/check_version`;
      const result = await this.http.get(url).toPromise();
      let d = result.json();
      // console.log("from check version: ", d);
      // console.log(d.version);
      // console.log(environment.APP_VERSION);
      if (!d.update_necessary && await environment.APP_VERSION !== d.version) {
        this.storage.set('APP_VERSION', d.version);
        // push a pop up for update
        const alert = await this.alertController.create({
          header: '乐派App 现已更新',
          // subHeader: 'Subtitle',
          message: `为了保证您的正常使用，并获取产品最新功能，我们建议您即刻更新乐派。您可点击下方链接获取最新版应用。 <br><a href=${d.link}>${d.link} </a>`,
          buttons: ['OK']
        });
        await alert.present();
      } else {
        this.router.navigate(['/today']);
      }
    }
    // only for dev
    // this.storage.set('config_table_id', '1');
    // this.storage.set('config_id', '2');
    // this.storage.set('config_value', d.hide ? "hide" : "show");
    // for dev only
  }

  // to be called once sign off is implemented
  resetToken () {
    this.storage.set('jwt-token', '');
  }
}
