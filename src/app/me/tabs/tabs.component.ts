import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  isHide: boolean;
  constructor(private storage: Storage) {
    this.isHide = true;
  }

  ngOnInit() {
    this.setDisplay();
  }


    async setDisplay () {
      let flag = await this.storage.get('config_value');
      this.isHide = flag === 'hide' ? true : false;
    }

}
