import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ContentService } from '../content.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CombineLatestOperator } from 'rxjs/internal/observable/combineLatest';
import { IonContent, Platform } from '@ionic/angular';
const DEFAULT_HOMEPAGE_ENDPOINT = environment.DEFAULT_HOMEPAGE_ENDPOINT;
const SEARCH_ENDPOINT = environment.SEARCH_ENDPOINT;
const CATEGORY_SEARCH_ENDPOINT = environment.CATEGORY_SEARCH_ENDPOINT;
const HOMEPAGE_TAG = environment.HOMEPAGE_TAG;

@Component({
  selector: 'app-cova-tumblr-home',
  templateUrl: './cova-tumblr-home.component.html',
  styleUrls: ['./cova-tumblr-home.component.scss'],
})
export class CovaTumblrHomeComponent implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) ionContent: IonContent;

  loader: any;
  content: any;
  queryString: string;
  offset: number;
  size: number;
  chunk: any;
  sortParams: string[] = ['popularity', 'total_clicks', 'total_view', 'total_read'];
  orderParams: string[] = ['asc', 'desc'];
  currentSortParam: string;
  currentOrderParam: string;
  currentCategory: any = null;
  isSlectedCategoryButtons: boolean[] = [];
  tabButtonColors: boolean[] = [true, false, false];
  homeSubscription: any;

  constructor(
    private contentService: ContentService,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
    public plt: Platform
  ) {
    this.checkVerified();
    this.contentService.toggleTab(true);
    this.contentService.toggleBar(true);
    this.contentService.toggleCategories(true);
    this.contentService.toggleParams(true);
    this.contentService.resetTabButtonColors(this.tabButtonColors);

    for (let i = 0; i < environment.NUMBER_OF_CATEGORIES; i++) {
      this.isSlectedCategoryButtons.push(false);
    }

    this.contentService.resetButtonColors(this.isSlectedCategoryButtons);

    this.currentSortParam = this.sortParams[0];
    this.currentOrderParam = this.orderParams[1];
    this.offset = 0;
    this.size = environment.blockSize;

    this.homeSubscription = this.contentService.currentSearchParam.subscribe(data => {
        // console.log("Object caught on constructor of cova-home: ", data);

        this.offset = 0;

        if (!(Object.entries(data).length === 0)) {

          // console.log("Intiating");

          this.currentSortParam = data.sortParam;
          this.currentOrderParam = data.orderParam;

          // console.log("At first ", this.currentOrderParam);

          this.queryString = data.queryText;

          if (this.queryString !== '') {
            this.currentCategory = null;
          } else if (data.category !== null) {
            this.currentCategory = data.category;
          }
          if (this.offset === 0) {
            this.createLoader()
              .then(() => {
                this.loader.present();
                this.initiateSearch();
              });
          } else {
            this.initiateSearch();
          }
        } else {
          this.createLoader().then(() => {
            this.loader.present();
            this.doDefaultHomepageSearch();
          });
        }
      });
  }

  ngOnDestroy() {
    // console.log("ngOnDestroy called");
    if (this.loader) {
      this.loader.dismiss();
    }
    this.homeSubscription.unsubscribe();
    this.offset = 0;
  }

  doDefaultHomepageSearch() {
    // console.log("doing default home page search from offset ", this.offset);
    // console.log("Order param: ", this.currentOrderParam);
    this.contentService
      .getContent(`${DEFAULT_HOMEPAGE_ENDPOINT}offset=${this.offset}&size=${this.size}&order=${this.currentOrderParam}`)
      .then(data => {
        // console.log("Found data in ngOnInit() of cova-tumblr-home:  ", data);
        this.content = data;
        // console.log(this.content);
        this.loader.dismiss();
        this.infiniteScroll.disabled = false;
      })
      .catch(err => {
        // console.log("Error thrown in ngOnInit() of cova-tumblr-home.component.ts!");
        // console.log(err);
        this.loader.dismiss();
      });
  }

  ngOnInit() {
    this.offset = 0;
    this.size = environment.blockSize;
    this.queryString = HOMEPAGE_TAG;
    this.currentSortParam = this.sortParams[0];
    this.currentOrderParam = this.orderParams[1];
    // console.log("On init query string: -----------------------------------------------", this.queryString);
    // console.log("=============", this.content);

    // this.createLoader().then(() => {
    //   this.loader.present();
    //   this.doDefaultHomepageSearch();
    // });
  }

  async createLoader() {
    this.loader = await this.loadingController.create({
      spinner: 'crescent',
      message: '载入中...'
    });
    return this.loader;
  }

  doKeywordSearch(keyword: string, off: number, size: number, sortParameter: string, orderParameter: string) {
    // console.log("Inside keyword search from", off);
    return this.contentService
          .getContent(`${SEARCH_ENDPOINT}query=${keyword}&offset=${off}&size=${size}&sort_by=${sortParameter}&order=${orderParameter}`);
  }

  doCategorySearch(keyword: string, off: number, size: number, sortParameter: string, orderParameter: string) {
    // console.log("Inside category search from", off);
    return this.contentService
          .getContent(`${CATEGORY_SEARCH_ENDPOINT}category_id=${keyword}&offset=${off}&size=${size}&sort_by=${sortParameter}&order=${orderParameter}`);
  }

  scrollToTop() {
    if (!this.plt.is('ios')) {
      this.ionContent.scrollToTop();
    }
  }

  initiateSearch() {
    // console.log("initiating search", off, sz);
    // console.log("queryString: ", this.queryString);
    // console.log("category: ", this.currentCategory);
    if (this.currentCategory !== null) {
      // console.log("calling api -->");
      this.doCategorySearch(this.currentCategory.name, this.offset, this.size, this.currentSortParam, this.currentOrderParam)
        .then(data => {
          // console.log("Found category data: ", data);
          this.content = data;
          this.infiniteScroll.disabled = false;
          if (this.content.length < this.size) {
            // console.log("category search content length is less than block size");
            this.infiniteScroll.disabled = true;
            this.queryString = '';
            // this.currentCategory = null;
          }
          this.loader.dismiss();
          this.scrollToTop();
        })
        .catch(err => {
          // console.log("Error thrown in intiateSearch() content category in CovaTumblrHome while searching with Category");
          // console.log(err);
          this.loader.dismiss();
        });
    } else if (this.queryString !== '' && this.queryString !== HOMEPAGE_TAG) {
      // console.log("keywod search");
      this.doKeywordSearch(this.queryString, this.offset, this.size, this.currentSortParam, this.currentOrderParam)
      .then(data => {
        this.content = data;
        // console.log("initial search result: ", this.content);
        this.infiniteScroll.disabled = false;
        if (this.content.length < this.size) {
          // console.log("content length is less than block size");
          this.infiniteScroll.disabled = true;
          this.queryString = '';
        }
        this.loader.dismiss();
        this.scrollToTop();
      })
      .catch(err => {
        // console.log("Error thrown in initiateSearch() query string of cova-tumblr-home.component.ts");
        // console.log(err);
        this.loader.dismiss();
      });
    } else {
      // console.log("queryString and category are nulls");
      this.queryString = HOMEPAGE_TAG;
      this.doDefaultHomepageSearch();
      this.scrollToTop();
    }
  }

  loadNextChunk(event, data) {
    this.chunk = data;

    // console.log(this.chunk);
    // console.log(this.chunk.length);

    this.chunk.map(piece => this.content.push(piece));
    event.target.complete();

    if (this.chunk.length < this.size) {
      this.infiniteScroll.disabled = true;
      this.queryString = '';
      // this.currentCategory = null;
    }
  }

  loadMoreHomepage(event) {
    // console.log('loading more homepage');
    this.contentService
      .getContent(`${DEFAULT_HOMEPAGE_ENDPOINT}offset=${this.offset}&size=${this.size}&order=${this.currentOrderParam}`)
      .then(data => {
        this.loadNextChunk(event, data);
        // console.log(this.content);
      })
      .catch(err => {
        // console.log("Error thrown in loadMoreHomepage() of cova-tumblr-home.component.ts");
        // console.log(err);
      });
  }

  loadMoreCategoryResult(event, catString) {
    // console.log('loading more category result');

    this.doCategorySearch(catString, this.offset, this.size, this.currentSortParam, this.currentOrderParam)
        .then(data => {
          // console.log("Found next chunk of category search", data);
          this.loadNextChunk(event, data);
        })
        .catch(err => {
          // console.log("Error thrown at loadMoreCategoryResult at CovaTumblrHome");
          // console.log(err);
        });
  }

  loadMore(event) {
    // console.log(event);

    this.offset += this.size;

    if (this.currentCategory !== null) {
      this.loadMoreCategoryResult(event, this.currentCategory.name);
    } else if (this.queryString === HOMEPAGE_TAG || this.queryString === '') {
      this.loadMoreHomepage(event);
    } else {
      // console.log("inside loadMore()", this.queryString);
      // console.log("searching from offset ", this.offset);

      this.doKeywordSearch(this.queryString, this.offset, this.size, this.currentSortParam, this.currentOrderParam)
        .then(data => {
          this.loadNextChunk(event, data);
        })
        .catch(err => {
          // console.log("Error thrown in loadMore() of cova-tumblr-home.component.ts");
          // console.log(err);
        });
      // console.log("fetched");
    }
  }

  onClickContent(singleContent) {
    singleContent.history = false;
    this.contentService.currentContent = singleContent;
    this.router.navigate(['/cova-tumblr/single-content']);
  }

  onClickHistory() {
    this.router.navigate(['/cova-tumblr/history']);
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }
}
