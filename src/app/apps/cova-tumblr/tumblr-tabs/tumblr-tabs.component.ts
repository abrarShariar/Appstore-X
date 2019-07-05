import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-tumblr-tabs',
  templateUrl: './tumblr-tabs.component.html',
  styleUrls: ['./tumblr-tabs.component.scss']
})
export class TumblrTabsComponent implements OnInit {
  isHome: boolean;
  isHistory: boolean;
  isMe: boolean;

  constructor(private router: Router, private contentService: ContentService) {
    this.isHome = true;
    this.isHistory = false;
    this.isMe = false;
    this.contentService.currentPassedTabButtonColors.subscribe(data => {
      // console.log("Tab button colors inside tab component: ", data);
      [this.isHome, this.isHistory, this.isMe] = data;
    });
  }

  ngOnInit() {
    this.isHome = true;
    this.isHistory = false;
    this.isMe = false;
  }

  onClickHome() {
    this.isHome = true;
    this.isHistory = false;
    this.isMe = false;
    this.router.navigate(['/cova-tumblr/home']);
  }

  onClickHistory() {
    this.isHome = false;
    this.isHistory = true;
    this.isMe = false;
    this.router.navigate(['/cova-tumblr/history']);
  }

  onClickMe() {
    this.isHome = false;
    this.isHistory = false;
    this.isMe = true;
    this.router.navigate(['/me/home']);
  }
}
