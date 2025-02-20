import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { PendingFromReceiverComponent } from '../communication/pending-from-receiver/pending-from-receiver.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard]},
  
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
export class DashboardRoutingModule { }
