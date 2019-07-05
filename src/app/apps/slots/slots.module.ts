import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SlotsPage } from './slots.page';
import { SlotsHomeComponent } from './slots-home/slots-home.component';
import { SlotsHistoryComponent } from './slots-history/slots-history.component';
import { SlotModalComponent } from './slot-modal/slot-modal.component';
import { SlotService } from '../../services/slot.service';
import { SlotsRandomHistoryComponent } from './slots-random-history/slots-random-history.component';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: SlotsPage,
    children: [
      {
        path: 'home',
        component: SlotsHomeComponent
      },
      {
        path: 'history',
        component: SlotsHistoryComponent
      },
      {
        path: 'random-history',
        component: SlotsRandomHistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxPaginationModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SlotsPage,
    SlotsHomeComponent,
    SlotsHistoryComponent,
    SlotModalComponent,
    SlotsRandomHistoryComponent
  ],
  exports: [
    SlotsPage,
    SlotModalComponent
  ],
  entryComponents: [
    SlotModalComponent
  ],
  providers: [
    SlotService
  ]
})
export class SlotsPageModule {}
