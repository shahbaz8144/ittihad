import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StreamboxComponent } from './streambox/streambox.component';
import { AuthGuard } from '../_helpers/auth.guard';
 

const routes: Routes = [
  {
    path: '',
    component: StreamboxComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class streamboxrouting { }