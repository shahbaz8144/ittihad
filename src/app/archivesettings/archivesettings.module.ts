import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivesettingsRoutingModule } from './archivesettings-routing.module';
import { CabinetComponent } from './cabinet/cabinet.component';
import { BarcodeComponent } from './barcode/barcode.component';
import { AssignusersComponent } from './assignusers/assignusers.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {  HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
@NgModule({
  declarations: [
    CabinetComponent,
    BarcodeComponent,
    AssignusersComponent
  ],
  imports: [
    CommonModule,
    ArchivesettingsRoutingModule,
    NgSelectModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    Ng2SearchPipeModule,
     TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  ]
})
export class ArchivesettingsModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }

} 