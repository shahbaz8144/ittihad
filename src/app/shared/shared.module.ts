import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './header/header.component';
import { LeftSectionComponent } from './left-section/left-section.component';
import { FooterComponent } from './footer/footer.component';
import { RenderBodyComponent } from './render-body/render-body.component';
import { EmptyLayoutComponent } from './empty-layout/empty-layout.component';
//import { PolicyComponent } from '../shared/policy/policy.component';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    // PolicyComponent,
     HeaderComponent,
    LeftSectionComponent,
    FooterComponent,
    RenderBodyComponent,
    EmptyLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
    ,GuidedTourModule
    , TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  ],
  exports:[
    //PolicyComponent,
    HeaderComponent,
    LeftSectionComponent,
    FooterComponent,
    RenderBodyComponent,
    EmptyLayoutComponent
  ],
  providers:[GuidedTourService]
})
export class SharedModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }
}