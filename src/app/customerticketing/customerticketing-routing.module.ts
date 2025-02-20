import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerticketingComponent } from './customerticketing/customerticketing.component';
import { AuthGuard } from '../_helpers/auth.guard';

const routes: Routes = [
  { path: '', component: CustomerticketingComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerticketingRoutingModule { }
