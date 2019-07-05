import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ContentService } from '../content.service';
import { Router } from '@angular/router';
import { IonInfiniteScroll, IonContent, LoadingController, AlertController, Platform } from '@ionic/angular';
import * as  Driver from '../../../token/token-driver.js';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { WalletService } from '../../../services/wallet.service';

const ENCRYPTION_KEY = 'montu83772RuiMachKhait&$#@eMoja';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: ['./content-details.component.scss']
})
export class ContentDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) ionContent: IonContent;

  currentBook: any;
  currentChapter: any;
  loader: any;

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private contentService: ContentService,
    private walletService: WalletService,
    public plt: Platform) {
    this.contentService.toggleTab(false);
    this.contentService.toggleBar(false);
    this.contentService.toggleCategories(false);
    this.contentService.toggleParams(false);
  }

  generateChapter() {
    this.contentService
        .getSpecificChapter(`book/${this.currentBook.id}?chapter_id=${this.currentBook.chapter_num}`)
        .then((chapter: any) => {
          // console.log("chapter found from call: ", chapter);
          chapter.text = this.walletService.decrypt(chapter.text, ENCRYPTION_KEY);
          const re = new RegExp('<br/>', 'g');
          chapter.text = chapter.text.replace(re, '\n');
          // console.log("chapter text: ", chapter.text);
          this.currentChapter = chapter;
          this.loader.dismiss();

          if (!this.plt.is('ios')) {
              this.ionContent.scrollToTop();
            }
        })
        .catch(err => {
          this.loader.dismiss();
          // console.log("Error thrown in ngOnInit() of ContentDetailsComponent");
          // console.log(err);
        });
  }

  ngOnDestroy() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  async createAlert() {
    const alert = await this.alertController.create({
      // title: 'Confirm purchase',
      header: '余额不足',
      message: '您的账户余额已不足以购买本章内容',
      buttons: [
        {
          text: '好',
          handler: () => {
            this.router.navigate(['cova-tumblr/home']);
          }
        }
      ]
    });
    return alert;
  }

  fetchChapterPrice(bookID, chapterID) {
    return this.contentService
          .getChapterPrice(`${environment.BOOK_PRICE_ENDPOINT}/${bookID}?chapter_id=${chapterID}`);

  }

  async getChapter(transferPromise) {
    try {
      const txHash = await transferPromise;
      this.contentService
          .postChapterPaid(`${environment.BOOK_PAID_ENDPOINT}/${this.currentBook.id}`, this.currentBook.chapter_num)
          .then(res => {
            // console.log(`Successfully paid`);
          })
          .catch(err => {
            // console.log('Error thrown at getChapter() of content details component');
            // console.log(err);
          });
      // console.log(txHash);
    } catch (e) {
      // console.log("Error message from txHash: ", e.message);
      // show blackscreen
      this.loader.dismiss();
      const alert = await this.createAlert();
      alert.present();
      this.router.navigateByUrl('cova-tumblr/home');
    }
  }

  async trxAndGenerate(myBdbKeyPair) {
    this.fetchChapterPrice(this.currentBook.id, this.currentBook.chapter_num)
        .then((chapterInfo: any) => {
          // console.log("Found chapter price ", chapterInfo);
          // console.log("mybdbkeypair", myBdbKeyPair);
          // console.log("bdbpublickey", environment.CENTRAL_BDB_PUBLIC_KEY);
          this.generateChapter();
          // TODO NADIM : CHECK IF USER HAS LESS THAN 5 COVA
          // THEN THROUGH AN ERROR OR ALERT
          if (chapterInfo.price !== 0) {
            const driver = new Driver(environment.DRIVER_URL, environment.DRIVER_ASSET_ID);
            const transferPromise = driver.transfer_tokens(myBdbKeyPair, environment.CENTRAL_BDB_PUBLIC_KEY, chapterInfo.price, {
              reason: 'payment for chapter',
            });
            this.getChapter(transferPromise);
          }
        })
        .catch(err => {
          // console.log("Error thrown at fetchChapterPrice() on ContentDetailsComponent");
          // console.log(err);
        });

    // console.log('My Bdb Keypair: ', myBdbKeyPair);
  }

  async fetchChapter() {
    const ethAddress = await this.storage.get('eth_address');
    const myBdbKeyPair = {
      publicKey: await this.storage.get('bdb_public_key'),
      privateKey: this.walletService.decrypt(await this.storage.get('bdb_private_key'), ethAddress),
    };

    this.loader = await this.loadingController.create({
      spinner: 'crescent',
      message: '获取下一章'
    });

    this.loader.present().then(() => {
      this.trxAndGenerate(myBdbKeyPair);
      // this.generateChapter();
    });
  }

  ngOnInit() {
    this.currentBook = this.contentService.detailContent;
    // console.log("Content details: ", this.currentBook);
  }

  ngAfterViewInit() {
    this.fetchChapter();
  }

  onClickBack() {
    this.router.navigate(['/cova-tumblr/single-content']);
  }

  onClickRadio() {
    this.router.navigate(['apps/home']);
  }

  complete(event) {
    event.target.complete();
  }

  onClickBottomBack() {
    if (this.currentBook.chapter_num > this.currentBook.firstChapter) {
      this.currentBook.chapter_num = this.currentChapter.prev_chapter;
      this.fetchChapter();
    }
  }

  onClickBottomForward() {
    // console.log(this.currentBook.chapter_num);
    if (this.currentBook.chapter_num < this.currentBook.lastChapter) {
      this.currentBook.chapter_num = this.currentChapter.next_chapter;
      this.fetchChapter();
    }
  }

  loadMore(event) {
    event.target.disabled = true;
  }
}
