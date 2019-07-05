import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SlotService } from '../../../services/slot.service';
import { AlertController, LoadingController } from '@ionic/angular';

class BetData {
  public start_position?: number;
  public digit_position?: number;
  public seed: number;
  public money: number;
  public type: string;
}

@Component({
  selector: 'app-slot-modal',
  templateUrl: './slot-modal.component.html',
  styleUrls: ['./slot-modal.component.scss']
})
export class SlotModalComponent implements OnInit {

  myParameter: string;
  payload: BetData;
  tag: string;
  loader: any;
  selectedSection: string;
  keyName: string;

  constructor(private modalController: ModalController,
              private navParams: NavParams,
              private slotService: SlotService,
              private alertController: AlertController,
              private loadingController: LoadingController
              ) { }

  async ionViewWillEnter () {
    this.myParameter = this.navParams.get('aParameter');
    this.payload = this.navParams.get('payload');
    this.tag = this.navParams.get('tag');
    this.selectedSection = this.navParams.get('selectedSection');
    this.keyName = this.navParams.get('keyName');
  }

  async myDismiss() {
      const result: Date = new Date();
      await this.modalController.dismiss(result);
    }

  ngOnInit () {
    console.log("JUst spitted out SlotModal");
  }

  async doBet () {
    this.loader = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Bet Loading...'
    });

    this.loader.present().then(async () => {
      const result = await this.slotService.setBet(this.payload, this.tag, this.selectedSection);
      console.log(result.data.status);
      const alert = await this.alertController.create({
        header: 'Bet Alert Msg',
        message: result.data.status,
        buttons: ['OK']
      });
      await alert.present();
      await this.modalController.dismiss(result);
      if (result.data.status) {
        this.loader.dismiss();
      }
    });

  }

  ngOnDestroy () {
    if (this.loader) {
      this.loader.dismiss();
    }
  }
}
