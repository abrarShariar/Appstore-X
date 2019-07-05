import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SlotModalComponent } from '../slot-modal/slot-modal.component';
import { SlotService } from '../../../services/slot.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

class BetData {
  public start_position?: any;
  public digit_position?: any;
  public seed: any;
  public money: any;
  public type: any;
}

@Component({
  selector: 'app-slots-home',
  templateUrl: './slots-home.component.html',
  styleUrls: ['./slots-home.component.scss']
})
export class SlotsHomeComponent implements OnInit, OnDestroy {
  listOfSelectors = [
    "整合",
    "前三",
    "中三",
    "后三",
    "万位",
    "千位",
    "百位",
    "十位",
    "个位"
  ];

  typeMap = {
    '总和大': 'greater23',
    '总和小': 'less23',
    '总和单': 'odd',
    '总和双': 'even',
    '豹子': 'identical',
    '顺子': 'threeConsecutive',
    '对子': 'pair',
    '半顺': 'towConsecutive',
    '杂六': 'none',
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9'
  }

  // set a default value here
  selectedSection: string = this.listOfSelectors[0];
  randomNumbers = [];
  timerId: any;
  selectedType: any;
  seedData: any;
  amountData: any;
  keyName: any;

  countDownHour: number;
  countDownMin: number;
  countDownSec: number;
  deadline: any;

  constructor (
      private modalController: ModalController,
      private slotService: SlotService,
      private router: Router,
      private alertController: AlertController
    ) { }

  ngOnInit() {
    // get random 5 digit number in every min and update UI
    this.getRandomNumber();
    const source = timer(1000, 1000 * 60);
    const subscribe = source.subscribe(val => {
      this.getRandomNumber();
    });

    this.deadline = new Date(new Date().getTime() + (1*60000));
    const countDown = timer(0, 1000);
    const subscribeCountDown = countDown.subscribe(val => {
      this.setCountDown();
    });
  }

  ngOnDestroy () {
    clearInterval(this.timerId);
  }


  setCountDown () {
    const diff = 1;
    let now: any;
    let deadline: any;
    let t: any;
    now = new Date().getTime();
    t = this.deadline - now;
    if (t < 0) {
      this.deadline = new Date(new Date().getTime() + (1*60000));
      return;
    }
    this.countDownHour = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60));
    this.countDownMin = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    this.countDownSec = Math.floor((t % (1000 * 60)) / 1000);
  }


  async showModal () {

    // generate pseudo random from system if not given by user
    if (!this.seedData) {
      this.seedData = this.generateRandomNumber();
    }

    if (!this.selectedType || !this.seedData || !this.amountData) {
      const alert = await this.alertController.create({
        header: 'Bet Alert Msg',
        message: "Required fields are empty! Please try again",
        buttons: ['OK']
      });
      await alert.present();
      throw 0;
    }

    let payload: BetData = {
      type: '',
      seed: 0,
      money: 0
    }
    let tag = '';
    const selectedIndex = this.listOfSelectors.indexOf(this.selectedSection);
    if (selectedIndex === 0) {
      // /sum
      payload = {
          type: this.selectedType,
          seed: this.seedData,
          money: this.amountData
        };
      tag = 'sum';
    } else if (selectedIndex >= 1 && selectedIndex <= 3) {
      // /consecutive
      payload = {
        start_position: Math.abs(1 - selectedIndex),
        type: this.selectedType,
        seed: this.seedData,
        money: this.amountData
      };
      tag = 'consecutive';
    } else if (selectedIndex >= 4 && selectedIndex <= 8) {
      // digits
      payload = {
        digit_position: Math.abs(4 - selectedIndex),
        type: this.selectedType,
        seed: this.seedData,
        money: this.amountData
      };
      tag = 'digits';
    }

    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: SlotModalComponent,
        cssClass: 'slot-modal',
        componentProps: {
          aParameter: "Hello World From Modal",
          payload: payload,
          tag: tag,
          selectedSection: this.selectedSection,
          keyName: this.keyName
        }
      });

      modal.onDidDismiss().then((detail) => {
        this.resetBetData();
        if (detail !== null) {
          console.log("The result: ", detail.data);
        }
      });

      await modal.present();
  }

  resetBetData () {
    this.selectedType = '';
    this.seedData = '';
    this.amountData = '';
    this.keyName = '';
  }

  radioChangeHandler (val) {
    this.selectedSection = val;
  }

  async getRandomNumber () {
    this.randomNumbers = [];
    const result = await this.slotService.getRandomNumber();
    if (result.data.bet && !result.error) {
      const alert = await this.alertController.create({
        header: 'Bet Status',
        message: result.data.amount > 0 ? "Congratulations! You won the bet." : "Sorry! You lost the bet.",
        buttons: ['OK']
      });
      await alert.present();
    }

    if (!result.error) {
      for (let i = 0;i < 5; i++) {
        this.randomNumbers.push(result.data.randomNumber.charAt(i));
      }
    } else {
      console.log("Error in fetching random number");
    }
  }

  generateRandomNumber () {
    let digits = "";
    for (let i=0;i<5;i++) {
      let num = Math.random() * 100;
      digits += num.toString().charAt(0);
    }
    return digits;
  }

  // trigger the modal for confirmation of bet
  confirmBet () {
    this.showModal();
  }

  cancelBet () {
    this.resetBetData();
  }


  // DEPRECATED
  // BETTING THE SHIT OUT HERE:
  // async doBet () {
  //   // place a check if the any input data are empty and throw
  //   if (!this.selectedType || !this.seedData || !this.amountData) {
  //     console.log("Required fields are empty!");
  //     throw 0;
  //   }
  //
  //   let payload: BetData = {
  //     type: '',
  //     seed: 0,
  //     money: 0
  //   }
  //   let tag = '';
  //   const selectedIndex = this.listOfSelectors.indexOf(this.selectedSection);
  //   if (selectedIndex === 0) {
  //     // /sum
  //     payload = {
  //         type: this.selectedType,
  //         seed: this.seedData,
  //         money: this.amountData
  //       };
  //     tag = 'sum';
  //   } else if (selectedIndex >= 1 && selectedIndex <= 3) {
  //     // /consecutive
  //     payload = {
  //       start_position: Math.abs(1 - selectedIndex),
  //       type: this.selectedType,
  //       seed: this.seedData,
  //       money: this.amountData
  //     };
  //     tag = 'consecutive';
  //   } else if (selectedIndex >= 4 && selectedIndex <= 8) {
  //     // digits
  //     payload = {
  //       digit_position: Math.abs(4 - selectedIndex),
  //       type: this.selectedType,
  //       seed: this.seedData,
  //       money: this.amountData
  //     };
  //     tag = 'digits';
  //   }
  //
  //   const result = await this.slotService.setBet(payload, tag);
  //   console.log(result.data.status);
  // }

  setType (key: string) {
    this.selectedType = this.typeMap[key];
    this.keyName = key;
  }

  showHistory () {
    this.router.navigate(['/slots/history']);
  }

  goToHome () {
    this.router.navigate(['/apps/home']);
  }

  showRandomHistory () {
    this.router.navigate(['/slots/random-history']);
  }

  onSelectChange (event) {
    this.selectedType = '';
  }

}
