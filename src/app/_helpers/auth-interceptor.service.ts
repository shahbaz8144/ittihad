// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError, from } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { AuthenticationService } from '../_service/authentication.service';

// @Injectable()
// export class AuthInterceptorService implements HttpInterceptor {
//   private isRefreshing = false;
//   constructor(private authService: AuthenticationService) { }

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const clonedRequest = req.clone({
//       withCredentials: true
//     });

//     return next.handle(clonedRequest).pipe(
//       catchError(error => {
//         if (error instanceof HttpErrorResponse && error.status === 401) {

//           // If already refreshing, logout immediately
//           if (this.isRefreshing) {
//             console.error('Refresh token already attempted, logging out...');
//             this.authService.logoutAPICall();
//             return throwError(() => error);
//           }

//           this.isRefreshing = true; // Start refresh flow

//           // console.warn('401 detected — trying to refresh token...');
//           return this.authService.refreshToken().pipe(
//             switchMap(() => {
//               this.isRefreshing = false; // Reset flag after success

//               const retryRequest = req.clone({
//                 withCredentials: true
//               });
//               return next.handle(retryRequest);
//             }),
//             catchError(refreshError => {
//               this.isRefreshing = false; // Reset flag after failure
//               console.error('Refresh token failed. Logging out...');
//               this.authService.logoutAPICall();
//               return throwError(() => refreshError);
//             })
//           );
//         }
//         return throwError(() => error);
//       })
//     );
//   }
// }
