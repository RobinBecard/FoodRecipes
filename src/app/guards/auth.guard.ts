import { state } from '@angular/animations';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
/*
@Injectable({
  providedIn: 'root'
})

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.checkLogin().pipe(
    map(() => true),
    catchError(() => {
      return router.createUrlTree(['route-to-fallback-page']);
    })
  );
};*/
