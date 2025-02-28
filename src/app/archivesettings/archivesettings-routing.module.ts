import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetComponent } from './cabinet/cabinet.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { BarcodeComponent } from './barcode/barcode.component';
import { GeneratedTemplateComponent } from './generated-template/generated-template.component';
import { MaptemplatetocabinetComponent } from './maptemplatetocabinet/maptemplatetocabinet.component';
import { PdfdownloadComponent } from './pdfdownload/pdfdownload.component';
import { CustomTemplateComponent } from './custom-template/custom-template.component';
import { TemplatesComponent } from './templates/templates.component';

const routes: Routes = [
  { path: 'cabinet', component: CabinetComponent, canActivate: [AuthGuard]},
  { path: 'barcode', component: BarcodeComponent, canActivate: [AuthGuard]},

  { path: 'template', component: GeneratedTemplateComponent, canActivate: [AuthGuard]},
  { path: 'Maptemplatetocabinet', component: MaptemplatetocabinetComponent, canActivate: [AuthGuard]},
  { path: 'templatesample', component: GeneratedTemplateComponent, canActivate: [AuthGuard]},
  { path: 'pdf', component: PdfdownloadComponent, canActivate: [AuthGuard]},
  { path: 'template', component: TemplatesComponent, canActivate: [AuthGuard]}

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivesettingsRoutingModule { }
