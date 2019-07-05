import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NgZone } from '@angular/core';

class AppMeta {
  id: number;
  title: string;
  desc: string;
  color: string;
  slug: string;
  background_img: string;
}

@Component({
  selector: 'app-apps-home',
  templateUrl: './apps-home.component.html',
  styleUrls: ['./apps-home.component.scss']
})
export class AppsHomeComponent implements OnInit {
  appsList:AppMeta[] = [];
  isHide: boolean;
  constructor(private ngZone: NgZone, private router: Router, private storage: Storage) {
    this.isHide = true;
    this.checkVerified();
  }

  ngOnInit() {
    this.setDisplay();
    this.appsList = [
      {
        id: 1,
        title: 'Cryptogram',
        desc: 'dApp to send gifts and messages to your loved ones in this holiday',
        color: '#ff5722bd',
        slug: 'cryptogram',
        background_img: '../assets/cryptogram_card.png'
      },
      {
        id: 2,
        title: 'Cova Tumblr X',
        desc: 'Express and experience content without boundaries and control',
        color: '#03a9f4d9',
        slug: 'cova-tumblr',
        background_img: '../assets/bbook_card.png'
      }
    ]
  }

  showApp (data: AppMeta) {
    let slug = this.appsList.find(x => x.id == data.id).slug;
    this.router.navigate([`/apps/${slug}/home`]);

  }

  async setDisplay () {
    let flag = await this.storage.get('config_value');
    this.isHide = flag === 'hide' ? true : false;
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

  goTo (url) {
    this.router.navigate([url]);
  }
}
