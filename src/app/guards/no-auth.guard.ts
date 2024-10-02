import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.firebaseSvc.getAuthState().pipe(
      map(auth => {

        //======No Existe usuario autenticado======
        if (!auth) {
          return true; // Si no está autenticado, permite el acceso
        } else {
          
          //======Existe usuario autenticado======
          this.utilsSvc.routerLink('/tabs/home'); // Redirigir a la página de inicio
          return false; // No permite el acceso
        }
      })
    );
  }
}
