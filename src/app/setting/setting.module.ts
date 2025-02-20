import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SettingRoutingModule } from './setting-routing.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserPolicyComponent } from './user-policy/user-policy.component';
import { UserPolicyMasterComponent } from './user-policy-master/user-policy-master.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MaterialModule } from '../material-module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
// // Import QuillModule
// import { QuillModule } from 'ngx-quill';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [MyProfileComponent, ChangePasswordComponent, UserPolicyComponent, UserPolicyMasterComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    AngularEditorModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // // Import QuillModule with default configuration
    // QuillModule.forRoot(),
    PickerModule,
    CKEditorModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SettingModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if (environment.production) {
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else {
    return new TranslateHttpLoader(http);
  }
}