import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cryptogram',
  templateUrl: './cryptogram.page.html',
  styleUrls: ['./cryptogram.page.scss'],
})
export class CryptogramPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/cryptogram/home']);
  }

}
