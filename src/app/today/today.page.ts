import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TabsComponent } from './tabs/tabs.component';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-today',
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
})
export class TodayPage implements OnInit, AfterViewInit {

  isHide: boolean;
  isLoaded: boolean;

  constructor (
    private router: Router,
    private storage: Storage,
    private alertController: AlertController
  ) {
    this.isHide = true;
    this.isLoaded = false;
  }

  ngOnInit() {
    this.checkVerified();
    // const alert = await this.alertController.create({
    //   header: 'Alert',
    //   subHeader: 'Subtitle',
    //   message: 'This is an alert message.',
    //   buttons: ['OK']
    // });
    // await alert.present();
  }

  ngAfterViewInit () {
    this.setDisplay();
    this.isLoaded = true;
  }

  async setDisplay () {
    let flag = await this.storage.get('config_value');
    this.isHide = flag === 'hide' ? true : false;
  }

  goToCryptogram () {
    console.log(this.router);
    this.router.navigate(['/cryptogram/home']);
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    // console.log("token: ", token);
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

}
