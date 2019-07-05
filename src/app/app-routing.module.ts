import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  { path: 'me',
    loadChildren: './me/me.module#MePageModule'
  },
  { path: 'apps',
    loadChildren: './apps/apps.module#AppsPageModule'
  },
  { path: 'cryptogram',
    loadChildren: './apps/cryptogram/cryptogram.module#CryptogramPageModule'
  },
  { path: 'today',
    loadChildren: './today/today.module#TodayPageModule'
  },
  { path: 'cova-tumblr',
    loadChildren: './apps/cova-tumblr/cova-tumblr.module#CovaTumblrPageModule'
  },
  { path: 'wallet',
    loadChildren: './wallet/wallet.module#WalletPageModule'
  },
  { path: 'referral',
    loadChildren: './me/referral/referral.module#ReferralPageModule'
  },
  { path: 'slots',
    loadChildren: './apps/slots/slots.module#SlotsPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
