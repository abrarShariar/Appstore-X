import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cryptogram-home',
  templateUrl: './cryptogram-home.component.html',
  styleUrls: ['./cryptogram-home.component.scss']
})
export class CryptogramHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  goToSend (type) {
    this.router.navigate(['/cryptogram/send'], { queryParams: {type: type }});
  }

  goToInbox () {
    this.router.navigate(['/cryptogram/receive']);
  }

  onClickRadio() {
    this.router.navigate(['/today']);
  }
}
