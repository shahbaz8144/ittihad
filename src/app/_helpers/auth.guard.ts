import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../_service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
         
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // authorised so return true
            //return true;
            let url: string = state.url;
            return this.checkLogin(url);
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    checkLogin(url: string): boolean {
        if (this.authenticationService.currentUser) { return true; }
    
        // Store the attempted URL for redirecting
        this.authenticationService.redirectUrl = url;
    
        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
      }
}
