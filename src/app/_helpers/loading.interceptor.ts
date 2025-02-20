// // loading.interceptor.ts
// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { NgxLoadingService } from 'ngx-loading';
// import { finalize } from 'rxjs/operators';

// @Injectable()
// export class LoadingInterceptor implements HttpInterceptor {

//   constructor(private loadingService: NgxLoadingService) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     this.loadingService.start();

//     return next.handle(request).pipe(
//       finalize(() => {
//         this.loadingService.stop();
//       })
//     );
//   }
// }
