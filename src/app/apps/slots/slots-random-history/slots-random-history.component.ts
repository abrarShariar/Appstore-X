import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlotService } from '../../../services/slot.service';
import { AlertController, LoadingController } from '@ionic/angular';

class RandomHistory {
  randomNumberArray: any[] = [];
  timestamp: string;
}

@Component({
  selector: 'app-slots-random-history',
  templateUrl: './slots-random-history.component.html',
  styleUrls: ['./slots-random-history.component.scss']
})
export class SlotsRandomHistoryComponent implements OnInit {

  randomHistoryData: RandomHistory[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 20;
  loader: any;


  constructor(
    private router: Router,
    private slotService: SlotService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getRandomBetHistory();
  }

  goToHome () {
    this.router.navigate(['/slots/home']);
  }

  async getRandomBetHistory () {
    this.loader = await this.loadingController.create({
      spinner: 'crescent',
      message: 'History Data Loading...'
    });

    this.loader.present().then(async () => {
      this.randomHistoryData = [];
      const offset = this.currentPage * this.itemsPerPage;
      const result = await this.slotService.getRandomBetHistory(offset);
      // display the bet history from here
      console.log("Random Bet History: ", result);
      if (!result.data.error && result.data) {
        result.data.forEach((el) => {
          let randomHistory = new RandomHistory();
          randomHistory.timestamp = el.timestamp;
          for (let i = 0;i < 5;i++) {
            randomHistory.randomNumberArray.push(el.randomNumber.charAt(i));
          };
          this.randomHistoryData.push(randomHistory);
        })
      } else {
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

  changePage (event: number) {
    this.currentPage = event;
    console.log("currentPage: ", this.currentPage);
    this.getRandomBetHistory();
  }


  goPrev () {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getRandomBetHistory();
    }
  }

  goNext () {
    this.currentPage++;
    this.getRandomBetHistory();
  }
}
