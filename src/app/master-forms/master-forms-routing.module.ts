import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { DistributorManufactureComponent } from './distributor-manufacture/distributor-manufacture.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { MapCategoriesCompanyComponent } from './map-categories-company/map-categories-company.component';
import { MapDocumentTypeToSourceComponent } from './map-document-type-to-source/map-document-type-to-source.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { GacfileuploadComponent } from './gacfileupload/gacfileupload.component';
import { SearchDocumentComponent } from './search-document/search-document.component';
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
import { DocumentwarehouseComponent } from './documentwarehouse/documentwarehouse.component';
import { ShuffeldocumentsComponent } from './shuffeldocuments/shuffeldocuments.component';
import { ShelvesCapacityComponent } from './shelves-capacity/shelves-capacity.component';
import { SourceComponent } from './source/source.component';
import { SpecializationComponent } from './specialization/specialization.component';
import { SharedocumentsComponent } from './sharedocuments/sharedocuments.component';
import { SharedwithmeComponent } from './sharedwithme/sharedwithme.component';
import { SharedbymeComponent } from './sharedbyme/sharedbyme.component';
import { sharingDocumentsApprovalComponent } from './sharingdocuments-approval/sharingdocuments-approval.component';
import { ShareDocumentComponent } from './share-document/share-document.component';
import { GacDocumentsApprovalComponent } from './gac-documents-approval/gac-documents-approval.component';
import { ArchiveTrashComponent } from './archive-trash/archive-trash.component';
// import { UserInfoComponent } from '../user-details/user-info/user-info.component';
import { ProductsComponent } from './products/products.component';
import { WorkflowComponent } from './workflow/workflow.component';
const routes: Routes = [
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'DistributorAndManufacture', component: DistributorManufactureComponent, canActivate: [AuthGuard] },
  { path: 'DocumentType', component: DocumentTypeComponent, canActivate: [AuthGuard] },
  { path: 'MapCategoryToCompany', component: MapCategoriesCompanyComponent, canActivate: [AuthGuard] },
  { path: 'MapDocumentTypeToSource', component: MapDocumentTypeToSourceComponent, canActivate: [AuthGuard] },
  { path: 'SubCategory', component: SubCategoryComponent, canActivate: [AuthGuard] },
  { path: 'GacFileUpload', component: GacfileuploadComponent, canActivate: [AuthGuard] },
  { path: 'SearchDocument', component: SearchDocumentComponent, canActivate: [AuthGuard] },
  { path: 'Shelves', component: ShelvesComponent, canActivate: [AuthGuard] },
  { path: 'Warehouse', component: WarehouseComponent, canActivate: [AuthGuard] },
  { path: 'Blocks', component: BlocksComponent, canActivate: [AuthGuard] },
  { path: 'Racks', component: RacksComponent, canActivate: [AuthGuard] },
  { path: 'Company', component: CompanyComponent, canActivate: [AuthGuard] },
  { path: 'Department', component: DepartmentComponent, canActivate: [AuthGuard] },
  { path: 'Role', component: RoleComponent, canActivate: [AuthGuard] },
  { path: 'AssignMenus', component: AssignMenusComponent, canActivate: [AuthGuard] },
  { path: 'Designation', component: DesignationComponent, canActivate: [AuthGuard] },
  { path: 'UserList', component: UserlistComponent, canActivate: [AuthGuard] },
  { path: 'UserRegistration', component: UserregistrationComponent, canActivate: [AuthGuard] },
  { path: 'MemoType', component: MemotypeComponent, canActivate: [AuthGuard] },
  { path: 'Shelves-capacity', component: ShelvesCapacityComponent, canActivate: [AuthGuard] },
  { path: 'Documenttowarehouse', component: DocumentwarehouseComponent, canActivate: [AuthGuard] },
  { path: 'shuffeldocuments', component: ShuffeldocumentsComponent, canActivate: [AuthGuard] },
  { path: 'source', component: SourceComponent, canActivate: [AuthGuard] },
  { path: 'specialization', component: SpecializationComponent, canActivate: [AuthGuard] },
  { path: 'share-document', component: ShareDocumentComponent, canActivate: [AuthGuard] },
  { path: 'sharedwithme', component: SharedwithmeComponent, canActivate: [AuthGuard] },
  { path: 'sharedbyme', component: SharedbymeComponent, canActivate: [AuthGuard] },
  {path: 'Documents-Approval',component:GacDocumentsApprovalComponent,canActivate: [AuthGuard]},
  {path: 'sharingdocuments-approval',component:sharingDocumentsApprovalComponent,canActivate: [AuthGuard]},
  {path: 'archivetrash',component:ArchiveTrashComponent,canActivate: [AuthGuard]},
  {path: 'products',component:ProductsComponent,canActivate: [AuthGuard]},
  {path: 'workflow',component:WorkflowComponent,canActivate: [AuthGuard]},
  // {
  //   path: 'UserList',
  //   component: UserlistComponent,
  //   canActivate: [AuthGuard]
  //   , children: [
  //     // { path: '', component: UserlistComponent, canActivate: [AuthGuard] },
  //     { path: 'UserInfo/:UserId', component: UserInfoComponent, canActivate: [AuthGuard] }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MasterFormsRoutingModule {
}
