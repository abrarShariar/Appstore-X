import { Injectable }     from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthGuard implements CanActivate {
  token: string;
  constructor(
    private router: Router,
    private storage: Storage
  ) {
    this.setToken();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean {
    if (this.token && this.token != '') {
      this.router.navigate(['/today']);
      return false;
    } else {
      return true;
    }
  }

  async setToken () {
    this.token = await this.storage.get('jwt-token');

  }
}
