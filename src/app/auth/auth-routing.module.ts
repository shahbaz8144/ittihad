import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './Resetpassword/resetpassword.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
