import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterFormsRoutingModule } from './master-forms-routing.module';
import { CategoryComponent } from './category/category.component';
import { ConfirmDialogComponent } from './confirmdialog/confirmdialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DistributorManufactureComponent } from './distributor-manufacture/distributor-manufacture.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
// import { DocumentviewComponent } from './documentview/documentview.component';
import { MapCategoriesCompanyComponent } from './map-categories-company/map-categories-company.component';
import { MapDocumentTypeToSourceComponent } from './map-document-type-to-source/map-document-type-to-source.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { GacfileuploadComponent } from './gacfileupload/gacfileupload.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchDocumentComponent } from './search-document/search-document.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ShelvesComponent } from './shelves/shelves.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { BlocksComponent } from './blocks/blocks.component';
import { RacksComponent } from './racks/racks.component';
import { CompanyComponent } from './company/company.component';
import { DepartmentComponent } from './department/department.component';
import { RoleComponent } from './role/role.component';
import { AssignMenusComponent } from './assign-menus/assign-menus.component';
import { DesignationComponent } from './designation/designation.component';
import { UserlistComponent } from './userlist/userlist.component';
import { UserregistrationComponent } from './userregistration/userregistration.component';
import { MemotypeComponent } from './memotype/memotype.component';
import { DataTablesModule } from 'angular-datatables';
import { ShelvesCapacityComponent } from './shelves-capacity/shelves-capacity.component';
import { DocumentwarehouseComponent } from './documentwarehouse/documentwarehouse.component';
import { ShuffeldocumentsComponent } from './shuffeldocuments/shuffeldocuments.component';
import { SpecializationComponent } from './specialization/specialization.component';
import { SourceComponent } from './source/source.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { SharedocumentsComponent } from './sharedocuments/sharedocuments.component';
import { sharingDocumentsApprovalComponent } from './sharingdocuments-approval/sharingdocuments-approval.component';
import { SharedwithmeComponent } from './sharedwithme/sharedwithme.component';
import { SharedbymeComponent } from './sharedbyme/sharedbyme.component';
import { ShareDocumentComponent } from './share-document/share-document.component';
import { GacDocumentsApprovalComponent } from './gac-documents-approval/gac-documents-approval.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { ArchiveTrashComponent } from './archive-trash/archive-trash.component';
import { ProductsComponent } from './products/products.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkTreeModule } from '@angular/cdk/tree';
@NgModule({
  declarations: [
    CategoryComponent,
    ConfirmDialogComponent,
    DistributorManufactureComponent,
    DocumentTypeComponent,
    // DocumentviewComponent,
    MapCategoriesCompanyComponent,
    MapDocumentTypeToSourceComponent,
    SubCategoryComponent,
    GacfileuploadComponent,
    SearchDocumentComponent,
    ShelvesComponent,
    WarehouseComponent,
    BlocksComponent,
    RacksComponent,
    CompanyComponent,
    DepartmentComponent,
    RoleComponent,
    AssignMenusComponent,
    DesignationComponent,
    UserlistComponent,
    UserregistrationComponent,
    MemotypeComponent,
    ShelvesCapacityComponent,
    DocumentwarehouseComponent,
    ShuffeldocumentsComponent,
    SpecializationComponent,
    SourceComponent,
    SharedocumentsComponent,
    sharingDocumentsApprovalComponent,
    SharedwithmeComponent,
    SharedbymeComponent,
    ShareDocumentComponent,
    GacDocumentsApprovalComponent,
    ArchiveTrashComponent,
    ProductsComponent,
    WorkflowComponent,
  ],
  imports: [
    Ng2TelInputModule,
    DataTablesModule,
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
  ,
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class MasterFormsModule { }
export function HttpLoaderFactory(http: HttpClient) {
  if(environment.production){
    return new TranslateHttpLoader(http, environment.Language_file_url, '.json');
  }
  else{
    return new TranslateHttpLoader(http);
  }

}