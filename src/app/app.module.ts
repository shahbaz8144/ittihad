import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MaterialModule } from '../app/material-module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { HttpErrorInterceptor } from './_helpers/http-error.interceptor';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SharedModule } from './shared/shared.module';
import { DefaultLayoutComponent } from './Layout/default-layout/default-layout.component';
import { BackendLayoutComponent } from './Layout/backend-layout/backend-layout.component';
import { PushNotificationService } from './_service/push-notification.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LOADING_BAR_CONFIG } from '@ngx-loading-bar/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TrimSpacesDirective } from './_service/trim-spaces.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { DataTablesModule } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { LoaderInterceptor } from './_service/loader.interceptor';
// import { MapToIterablePipe } from './_service/map-to-iterable.pipe';
// import { AngMusicPlayerModule } from  'ang-music-player';
// import { NgPlyrModule } from 'ng-plyr';
// import { ServiceWorkerModule } from '@angular/service-worker';



@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    BackendLayoutComponent,
    TrimSpacesDirective,
    // MapToIterablePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    // ServiceWorkerModule,
    NgHttpLoaderModule.forRoot()
    , PickerModule
    , BrowserAnimationsModule
    , MaterialModule
    , NgxPaginationModule
    , LoadingBarRouterModule
    , LoadingBarHttpClientModule
    , ToastrModule.forRoot({
    })
    , TooltipModule
    , NgbModule
    , ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger',
    }),
    MatIconModule,
    MatChipsModule,
    MatSortModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule
    // DataTablesModule
    // AngMusicPlayerModule
    // NgPlyrModule
    , ServiceWorkerModule.register('sw.js', { enabled: environment.production })
   
    // , ServiceWorkerModule.register('sw.js')
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true
    // },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 100 } },
    PushNotificationService
  ],
  exports: [
    RouterModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() {
    if ('serviceWorker' in navigator && environment.production) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          console.log('Service Worker is registered', registration);
        } else {
          console.log('Service Worker is not registered');
        }
      }).catch(error => {
        console.error('Error during Service Worker registration:', error);
      });
    }
    navigator.serviceWorker.ready
    .then(function(swreg){
      return swreg.pushManager.getSubscription();
    })
    .then(function(sub){
      if(sub === null){

      }
      else{
        console.log("subscription",sub);
      }
    })
  }
 }
