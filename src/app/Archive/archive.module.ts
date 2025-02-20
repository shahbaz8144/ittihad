import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveComponent } from './archive/archive.component';
import { ArchiveRoutingModule } from './archive-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { DataTablesModule } from 'angular-datatables';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MasterFormsRoutingModule } from '../master-forms/master-forms-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


@NgModule({
  declarations: [
    ArchiveComponent
  ],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
     MaterialModule
        , Ng2SearchPipeModule ,
            MatDatepickerModule,
            CommonModule,
            MasterFormsRoutingModule,
            FormsModule,
            ReactiveFormsModule,
            NgxPaginationModule,
            MatTreeModule,
            MatCheckboxModule,
            CdkTreeModule,
            MatIconModule,
            MatButtonModule,
            MatStepperModule,
            MaterialModule
            , Ng2SearchPipeModule
            , NgSelectModule
            , PdfViewerModule
            //,NgxDocViewerModule
            ,Ng2TelInputModule 
            ,NgxDaterangepickerMd.forRoot()
                , TranslateModule.forRoot({
                  loader: {
                      provide: TranslateLoader,
                      useFactory: HttpLoaderFactory,
                      deps: [HttpClient]
                  }
              }),
  ]
})
export class ArchiveModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }

} 