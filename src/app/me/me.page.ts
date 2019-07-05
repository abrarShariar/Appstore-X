import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  constructor (
    private router: Router,
    private storage: Storage
  ) {
    this.checkVerified();
  }

  ngOnInit() {
    this.router.navigate(['/me/home']);
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

  onClickRadio() {
    this.router.navigate(['/apps/home']);
  }
}
