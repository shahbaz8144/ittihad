import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_helpers/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { UserPolicyMasterComponent } from './user-policy-master/user-policy-master.component';
import { UserPolicyComponent } from './user-policy/user-policy.component';

const routes: Routes = [{
  path: 'MyProfile',
  component:MyProfileComponent,
  canActivate: [AuthGuard]
},
{
  path: 'ChangePassword',
  component:ChangePasswordComponent,
  canActivate: [AuthGuard]
} ,
{
  path: 'UserPolicy',
  component:UserPolicyComponent,
  canActivate: [AuthGuard]
} ,
{
  path: 'UserPolicyMaster',
  component:UserPolicyMasterComponent,
  canActivate: [AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
