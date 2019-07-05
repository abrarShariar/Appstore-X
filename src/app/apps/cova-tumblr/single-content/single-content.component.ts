import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ContentService } from '../content.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoadingController, AlertController } from '@ionic/angular';

const BUY_ENDPOINT = environment.BUY_ENDPOINT;
const LOGVIEW_ENDPOINT = environment.LOGVIEW_ENDPOINT;

@Component({
  selector: 'app-single-content',
  templateUrl: './single-content.component.html',
  styleUrls: ['./single-content.component.scss']
})
export class SingleContentComponent implements OnInit, OnDestroy, AfterViewInit {
  content: any;
  chapterList: any;
  firstChapter: number;
  lastChapter: number;
  isAllNotLoaded: boolean;
  loader: any;

  constructor(private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router,
              private contentService: ContentService
  ) {
      this.contentService.toggleBar(false);
      this.contentService.toggleCategories(false);
      this.contentService.toggleTab(true);
      this.contentService.toggleParams(false);
      this.isAllNotLoaded = true;
    }

  populateChapters(loadParam: string) {
    return this.contentService
          .getChapterList(`book/${this.content.id}/chapters?loadAll=${loadParam}`);
  }

  async createAlert() {
    const alert = await this.alertController.create({
      // title: 'Confirm purchase',
      header: '网络错误',
      message: '请您检查互联网连接，或稍后重试',
      buttons: [
        {
          text: '好',
          handler: () => {
            this.router.navigate(['cova-tumblr/home']);
          }
        }
      ],
    });
    return alert;
  }

  async fetchChapters(howMany: string, flag: boolean) {
    this.loader = await this.loadingController.create({
      message: '装载',
      spinner: 'crescent',

    });

    const alert = await this.createAlert();

    this.loader.present().then(() => {
      this.populateChapters(howMany)
        .then((listChapters: any) => {
          this.chapterList = listChapters;
          this.firstChapter = listChapters.chapters[0].chapter_num;
          this.lastChapter = listChapters.total_number_of_chapters;
          this.isAllNotLoaded = flag;

          this.loader.dismiss();

          // console.log(listChapters, this.firstChapter, this.lastChapter);
        })
        .catch(err => {

          this.loader.dismiss();
          alert.present();

          // console.log("Error thrown in ngOnInit() of SingleContentComponent");
          // console.log(err);
        });
    });
  }

  ngOnDestroy() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  ngOnInit() {
    // this.contentService.toggleTab(false);
    // api call to book preview endpoint with book id
    // if paid book, another API call for chapters otherwise only preview with buy book msg
    // second api call for chapter list
    // chapter list will correspond to chapters links
    this.content = this.contentService.currentContent;

    if (this.content.history) {
      this.content.blurb_desc = this.content.short_description;
    }

    // console.log("Current book: ", this.content);
  }

  ngAfterViewInit() {
    this.contentService
      .sendPost(LOGVIEW_ENDPOINT, this.content.id)
      .then(response => {
        // console.log("Post request successful ", response);
      })
      .catch(err => {
        // console.log(err);
        // console.log("Error thrown at ngOnInit() of single-content-component");
      });

    this.fetchChapters('false', true);
  }

  onClickBuy() {
    this.content.firstChapter = this.firstChapter;
    this.content.lastChapter = this.lastChapter;
    this.content.chapter_num = this.firstChapter;
    this.contentService.detailContent = this.content;
    this.router.navigate(['/cova-tumblr/content-details']);
  }

  onClickChapter(currChapter) {
    // console.log("Current chapter clicked: ", currChapter);
    this.content.firstChapter = this.firstChapter;
    this.content.lastChapter = this.lastChapter;
    this.content.chapter_num = currChapter.chapter_num;
    this.contentService.detailContent = this.content;
    this.router.navigate(['/cova-tumblr/content-details']);
  }

  onClickBack() {
    if (this.content.history) {
      this.router.navigate(['/cova-tumblr/history']);
    } else {
      this.router.navigate(['/cova-tumblr/home']);
    }
  }

  onClickRadio() {
    this.router.navigate(['/apps/home']);
  }

  showAllChapters() {
    this.fetchChapters('true', false);
  }
}
