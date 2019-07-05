import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.page.html',
  styleUrls: ['./slots.page.scss'],
})
export class SlotsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // this.router.navigate(['/slots/history']);
  }

}
