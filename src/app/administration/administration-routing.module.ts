import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_helpers/auth.guard';
import { BannerComponent } from './banner/banner.component';
import { CompanyHierarchyComponent } from './company-hierarchy/company-hierarchy.component';
import { QuotesComponent } from './quotes/quotes.component';

const routes: Routes = [
  { path: 'companyhierarchy', component: CompanyHierarchyComponent, canActivate: [AuthGuard] },
  { path: 'quotes', component: QuotesComponent, canActivate: [AuthGuard] },
  { path: 'banner', component: BannerComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { 
  
}
