import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoDetailsRoutingModule } from './memo-details-routing.module';
import { MemoDetailsComponent } from './memo-details/memo-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DailogComponent } from './dailog/dailog.component';
import { MaterialModule } from '../material-module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GacDocumentDetailsComponent } from './gac-document-details/gac-document-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileviewComponent } from './fileview/fileview.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import { AnnouncementDetailsComponent } from './announcement-details/announcement-details.component';
import { DatePipe } from '@angular/common';
import { SanitizeHtmlPipe } from './memo-details/sanitize-html.pipe';
// import { MapToIterablePipe } from '../_service/map-to-iterable.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PluginsModule } from '../plugins/plugins.module'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { MemoDetailsV2Component } from './memo-details-v2/memo-details-v2.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {MatTooltipModule} from '@angular/material/tooltip';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GACArchivingModule } from '../gacarchiving/gacarchiving.module';
import { PdfComponent } from './pdf/pdf.component';
import { PdfEditorComponent } from './pdf-editor/pdf-editor.component';


@NgModule({
  declarations: [MemoDetailsComponent, DailogComponent, GacDocumentDetailsComponent, FileviewComponent, 
    AnnouncementDetailsComponent, SanitizeHtmlPipe, MemoDetailsV2Component, PdfComponent, PdfEditorComponent
    
  ],
  imports: [
    NgbModule,
    MatTooltipModule,
    MatDatepickerModule,
    GACArchivingModule,
    NgCircleProgressModule.forRoot({
      
    }),
    NgxDaterangepickerMd.forRoot(),
    CommonModule,
    PickerModule,
    MemoDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule
    , NgSelectModule
    , AngularEditorModule
    , AutocompleteLibModule
    , Ng2SearchPipeModule
    , MaterialModule
    , PdfViewerModule
    , NgxDocViewerModule
    ,GuidedTourModule  
    ,MatAutocompleteModule 
    , CKEditorModule
    ,DragDropModule
    ,PluginsModule
   , TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  ],
  exports: [
    MemoDetailsComponent  // Export it so it can be used in other modules
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
,GuidedTourService
,DatePipe,
MemoDetailsComponent,

  ]
})
export class MemoDetailsModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }

}