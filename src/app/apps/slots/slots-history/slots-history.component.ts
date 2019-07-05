import { Component, OnInit } from '@angular/core';
import { SlotService } from '../../../services/slot.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';


class History {
  account: string;
  amount: number;
  bet: string;
  betTxHash: string;
  betType: string;
  factor: string;
  id: number;
  isTransactionCompleted: boolean;
  randomNumber: string;
  startingPosition: number;
  timestamp: string;
  txHash: string;
  userId: number;
}

@Component({
  selector: 'app-slots-history',
  templateUrl: './slots-history.component.html',
  styleUrls: ['./slots-history.component.scss']
})
export class SlotsHistoryComponent implements OnInit {

  historyList: History[] = [];
  totalWin: number;
  totalBet: number;

  currentPage: number = 0;
  itemsPerPage: number = 20;
  loader: any;

  constructor(
    private slotService: SlotService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getBetHistory();
    this.getBetAmountHistory();
  }

  async getBetHistory () {
    const offset = this.currentPage * this.itemsPerPage;
    this.loader = await this.loadingController.create({
      spinner: 'crescent',
      message: 'History Data Loading...'
    });

    this.loader.present().then(async () => {
      const result = await this.slotService.getBetHistory(offset);
      this.historyList = result.data;
      if (this.historyList.length <= 0) {
        const alert = await this.alertController.create({
          header: 'No Data',
          message: result.data.status,
          buttons: ['OK']
        });
        await alert.present();
      }
      this.loader.dismiss();
    })
  }

  async getBetAmountHistory () {
      const result = await this.slotService.getBetAmountHistory();
      console.log("Bet Amount History: ", result);
      if (!result.error) {
        this.totalBet = result.data.total_bet;
        this.totalWin = result.data.total_win;
      }
  }

  goToHome () {
    this.router.navigate(['/slots/home']);
  }

  goPrev () {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getBetHistory();
    }
  }

  goNext () {
    this.currentPage++;
    this.getBetHistory();
  }

}
