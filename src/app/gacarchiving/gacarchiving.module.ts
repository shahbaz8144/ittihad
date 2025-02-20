import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GACArchivingRoutingModule } from './gacarchiving-routing.module';
import { DocumentInboxComponent } from './document-inbox/document-inbox.component';
import { DocumentsComponent } from './documents/documents.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { TrashComponent } from './trash/trash.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { MaterialModule } from '../material-module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LabelsComponent } from './labels/labels.component';
import { SharedwithmeComponent } from './sharedwithme/sharedwithme.component';
import { SharedbymeComponent } from './sharedbyme/sharedbyme.component';
import { SharedexpiredComponent } from './sharedexpired/sharedexpired.component';
import { GacarchivinglistComponent } from './gacarchivinglist/gacarchivinglist.component';

@NgModule({
  declarations: [
    DocumentInboxComponent,
    DocumentsComponent,
    FavoriteComponent,
    TrashComponent,
    LabelsComponent,
    SharedwithmeComponent,
    SharedbymeComponent,
    SharedexpiredComponent,
    GacarchivinglistComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    GACArchivingRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  ],
   exports: [
    GacarchivinglistComponent  // Export it so it can be used in other modules
  ]
})
export class GACArchivingModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }

}