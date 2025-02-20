import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolicyComponent } from './policy/policy.component';
import { AuthGuard } from '../_helpers/auth.guard';

const routes: Routes = [
  { path: '', component: PolicyComponent, canActivate: [AuthGuard]}
  // {
  //   path: '',
  //   component: HeaderComponent,
  //   children: [
  //     {
  //       path: '',
  //       component:DashboardComponent,
  //       canActivate: [AuthGuard]
  //     }
  //   ]
  // }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
