import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AmChartsModule } from "@amcharts/amcharts3-angular";

// import { RoundProgressModule } from 'angular-svg-round-progressbar';
// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';

// import { HeaderComponent } from '../Layout/header/header.component';
// import { LeftSectionComponent } from '../Layout/left-section/left-section.component';
// import { FooterComponent } from '../Layout/footer/footer.component';
// import { RenderBodyComponent } from '../Layout/render-body/render-body.component';
import { IvyCarouselModule } from "angular-responsive-carousel";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    DashboardComponent
    // HeaderComponent,
    // LeftSectionComponent,
    // FooterComponent,
    // RenderBodyComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
    , AmChartsModule
    , Ng2SearchPipeModule
    , FormsModule
   , IvyCarouselModule
    // , RoundProgressModule
    , // Specify ng-circle-progress as an import
     NgCircleProgressModule.forRoot({
     
    }),
    NgbModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  ]
})
export class DashboardModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }
}