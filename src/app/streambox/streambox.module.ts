import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamboxComponent } from './streambox/streambox.component';
import { streamboxrouting } from './streambox-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MaterialModule } from '../material-module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommunicationModule } from '../communication/communication.module'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PluginsModule } from '../plugins/plugins.module'; 
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [
    StreamboxComponent
  ],
  imports: [
    CommonModule,
    streamboxrouting,
    Ng2SearchPipeModule,
    MaterialModule,
    FormsModule,
    NgSelectModule,
    CommunicationModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    AutocompleteLibModule,
    NgxDaterangepickerMd,
    CKEditorModule,
    PluginsModule,
    PickerModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  ],
  exports: [
    StreamboxComponent // Export if needed
  ],
  providers: [DatePipe],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class StreamboxModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }
}