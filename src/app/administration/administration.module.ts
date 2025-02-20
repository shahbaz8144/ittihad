import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdministrationRoutingModule } from './administration-routing.module';
import { CompanyHierarchyComponent } from './company-hierarchy/company-hierarchy.component';
import { QuotesComponent } from './quotes/quotes.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BannerComponent } from './banner/banner.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from '../material-module';
import { DatePipe } from '@angular/common'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    CompanyHierarchyComponent,
    QuotesComponent,
    BannerComponent 
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    NgSelectModule,
    FormsModule,
    Ng2SearchPipeModule,
    MatDatepickerModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),

  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AdministrationModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }
}