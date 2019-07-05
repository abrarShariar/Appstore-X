import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../content.service';
import { environment } from 'src/environments/environment';
import { IonInfiniteScroll, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cova-tumblr-history',
  templateUrl: './cova-tumblr-history.component.html',
  styleUrls: ['./cova-tumblr-history.component.scss']
})
export class CovaTumblrHistoryComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  content: any;
  offset: number;
  size: number;
  chunk: any;
  loader: any;

  constructor(
    private contentService: ContentService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController) {
    this.contentService.toggleBar(false);
    this.contentService.toggleCategories(false);
    this.contentService.toggleTab(true);
    this.contentService.toggleParams(false);
    this.offset = 0;
    this.size = environment.blockSize;
  }

  async createAlert() {
    const alert = await this.alertController.create({
      // title: 'Confirm purchase',
      header: '无阅读记录',
      message: '您还未阅读任何书籍',
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

  async checkForAlert(currContent) {
    if (!Array.isArray(currContent) || !currContent.length) {
      const alert = await this.createAlert();
      alert.present();
    }
  }

  loadHistoryData() {
    return this.contentService
          .getContent(`library/history?offset=${this.offset}&size=${this.size}`);
  }

  ngOnInit() {
    this.offset = 0;
    // console.log("this.offset set to 0 at ngOnInit() of History");
  }

  async loadHistoryWithLoader() {
    // console.log("here", this.offset);
    this.loader = await this.loadingController.create({
      spinner: 'crescent',
      message: '获取下一章'
    });
    this.loader.present().then(() => {
      this.loadHistoryData()
          .then(data => {
            // console.log("wow this is some data!!!" , data);
            this.content = data;
            this.loader.dismiss();
            this.checkForAlert(this.content);
          })
          .catch(err => {
            this.loader.dismiss();
            // console.log("Error thrown in ngOnInit() of cova-tumblr-history");
            // console.log(err);
          });
    });
  }

  ngAfterViewInit() {
    // console.log("ngAfterViewInit() on history")
    this.loadHistoryWithLoader();
  }

  ngOnDestroy() {
    if (this.loader) {
      this.loader.dismiss();
    }
    this.offset = 0;
  }

  onClickContent(singleContent) {
    singleContent.history = true;
    this.contentService.currentContent = singleContent;
    this.router.navigate(['/cova-tumblr/single-content']);
  }

  onClickBack() {
    this.router.navigate(['/cova-tumblr/home']);
  }

  onClickRadio() {
    this.router.navigate(['/apps/home']);
  }

  isEmptyData(currData) {
    if (!Array.isArray(currData) || !currData.length) {
      return true;
    }
    return false;
  }

  loadNextChunk(event, data) {
    if (this.isEmptyData(data) || typeof data === 'undefined') {
      event.target.complete();
      this.infiniteScroll.disabled = true;
      return;
    }

    this.chunk = data;

    // console.log(this.chunk);
    // console.log(this.chunk.length);

    if (!this.isEmptyData(this.chunk)) {
      this.chunk.map(piece => this.content.push(piece));
    }
    event.target.complete();

    if (this.chunk.length < this.size) {
      this.infiniteScroll.disabled = true;
    }
  }

  loadMore(event) {
    this.offset += this.size;
    this.loadHistoryData()
        .then(data => {
          // console.log("next chunk of data: ", data);
          this.loadNextChunk(event, data);
        })
        .catch(err => {
          // console.log("Error thrown at loadMore() of cova-tumblr-history");
          // console.log(err);
        });
  }
}
