import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetComponent } from './cabinet/cabinet.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { BarcodeComponent } from './barcode/barcode.component';

const routes: Routes = [
  { path: 'cabinet', component: CabinetComponent, canActivate: [AuthGuard]},
  { path: 'barcode', component: BarcodeComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivesettingsRoutingModule { }
