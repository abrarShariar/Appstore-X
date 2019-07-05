import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from './content.service';
import { environment } from 'src/environments/environment';
import { IonContent, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-cova-tumblr',
  templateUrl: './cova-tumblr.page.html',
  styleUrls: ['./cova-tumblr.page.scss']
})
export class CovaTumblrPage implements OnInit {

  @ViewChild(IonContent) ionContent: IonContent;

  isShowTab: boolean;
  isShowBar: boolean;
  isShowHeader: boolean;
  isShowCategories: boolean;
  isShowParams: boolean;
  queryText = '';
  books: any;
  giveNextBlock: number;
  apiResponse;
  offset: number;
  size: number;
  categoryList: any;
  category: any = null;
  sortParam = 'popularity';
  orderParam = 'desc';
  isSelected: boolean[] = [];
  tabButtonColors: boolean[] = [];

  constructor(
    private router: Router,
    private contentService: ContentService,
    private storage: Storage,
    public plt: Platform,
  ) {
    this.checkVerified();
    for (let i = 0; i < environment.NUMBER_OF_CATEGORIES; i++) {
      this.isSelected.push(false);
    }
  }

  ngOnInit() {
    this.contentService.currentShowTab.subscribe(data => this.isShowTab = data);
    this.contentService.currentShowBar.subscribe(data => this.isShowBar = data);
    this.contentService.currentShowHeader.subscribe(data => this.isShowHeader = data);
    this.contentService.currentShowCategories.subscribe(data => this.isShowCategories = data);
    this.contentService.currentShowParams.subscribe(data => this.isShowParams = data);
    this.contentService.currentShowButtons.subscribe(data => this.isSelected = data);

    this.contentService.currentShowButtonColors.subscribe(data => {
      this.tabButtonColors = data;
      // console.log("tab button colors: ", this.tabButtonColors);
      this.contentService.placeTabButtonColors(this.tabButtonColors);
    });

    this.router.navigate(['cova-tumblr/home']);

    this.contentService
      .getContentCategories(environment.CONTENT_CATEGORY_ENDPOINT)
      .then(data => {
        this.categoryList = data;
        this.categoryList.unshift({id: 0, name: '成人'});
        // console.log('category list: ', this.categoryList);
      })
      .catch(err => {
        // console.log("Error thrown in ngInit of cova-tumblr.page.ts");
        console.log(err);
      });
  }

  toggleButtonColors(buttonId) {
    this.isSelected[buttonId] = true;
    for (let i = 0; i < environment.NUMBER_OF_CATEGORIES; i++) {
      if (buttonId !== i) {
        this.isSelected[i] = false;
      }
    }
    // console.log(this.isSelected[buttonId]);
    // console.log(this.isSelected);
  }

  sendObject() {
    // if(!this.plt.is('ios')) {
      // this.ionContent.scrollToTop();
    // }
    const parameters = {
      queryText: this.queryText,
      category: this.category,
      sortParam: this.sortParam,
      orderParam: this.orderParam
    };
    // console.log("Inside send object: ", parameters);
    this.contentService.pingForData(parameters);
  }

  sendKeyword() {
    this.category = null;
    this.sendObject();
  }

  sendButtonKeyword(category) {
    this.toggleButtonColors(category.id);
    this.queryText = '';
    this.category = category;
    this.sendObject();
  }

  sendSortParam(event) {
    console.log(event.target.value);
    this.sortParam = event.target.value;
    this.sendObject();
  }

  sendOrderParam(event) {
    console.log(event.target.value);
    this.orderParam = event.target.value;
    this.sendKeyword();
  }

  onClickRadio() {
    this.router.navigate(['/apps/home']);
  }

  async checkVerified () {
    const token = await this.storage.get('jwt-token');
    if (!token) {
      this.router.navigate(['/home']);
    }
  }

}
