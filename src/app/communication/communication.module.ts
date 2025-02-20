import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommunicationRoutingModule } from './communication-routing.module';
import { InboxComponent } from './inbox/inbox.component';
// import { MemoDetailsComponent } from './memo-details/memo-details.component';
import {  ToMemosComponent } from './to-memos/to-memos.component';
import { CCMemosComponent } from './ccmemos/ccmemos.component';
import { FavoriteMemosComponent } from './favorite-memos/favorite-memos.component';
import { NewMemoComponent } from './new-memo/new-memo.component';
import { SentMemosComponent } from './sent-memos/sent-memos.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DeleteMemosComponent } from './delete-memos/delete-memos.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { LabelMemosComponent } from './label-memos/label-memos.component';
import { ExecutionPlannerComponent } from './execution-planner/execution-planner.component';
import { PendingFromReceiverComponent } from './pending-from-receiver/pending-from-receiver.component';
import { DraftComponent } from './draft/draft.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FocusOnClickDirective } from './to-memos/focus-on-click.directive';
import { HandoverComponent } from './handover/handover.component';
import { BasicsnackbarComponent } from './basicsnackbar/basicsnackbar.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { DMSRequestComponent } from './dmsrequest/dmsrequest.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { MeetingsComponent } from './meetings/meetings.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaterialModule } from '../material-module';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
//import { MapToIterablePipe } from '../_service/map-to-iterable.pipe';
import { PluginsModule } from '../plugins/plugins.module'; 
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { GACArchivingModule } from '../gacarchiving/gacarchiving.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }
}
@NgModule({
  declarations: [
    InboxComponent,
    // MemoDetailsComponent,
    ToMemosComponent,
    CCMemosComponent,
    FavoriteMemosComponent,
    NewMemoComponent,
    SentMemosComponent,
    FavoriteComponent,
    DeleteMemosComponent,
    LabelMemosComponent,
    ExecutionPlannerComponent,
    PendingFromReceiverComponent,
    DraftComponent,
    FocusOnClickDirective,
    HandoverComponent
    , BasicsnackbarComponent, AnnouncementComponent, SuggestionsComponent, DMSRequestComponent, MeetingsComponent, BookmarksComponent
    // ,MapToIterablePipe
  ],
  imports: [
    CommonModule,
    GACArchivingModule
   , MatDatepickerModule
    ,CommunicationRoutingModule
    ,FormsModule
    ,ReactiveFormsModule
    ,NgSelectModule
    ,AngularEditorModule
    ,Ng2SearchPipeModule
    ,AutocompleteLibModule
    ,HttpClientModule
    ,NgxDaterangepickerMd.forRoot()
    ,MatAutocompleteModule
    ,MaterialModule
    ,MatChipsModule
    ,MatIconModule
    ,MatCheckboxModule
    ,MatInputModule
    ,CKEditorModule
    ,PickerModule
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
    NewMemoComponent, // Export if needed
  ],
  providers: [DatePipe],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class CommunicationModule { }
