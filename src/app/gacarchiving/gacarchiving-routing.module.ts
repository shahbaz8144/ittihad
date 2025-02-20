import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentInboxComponent } from './document-inbox/document-inbox.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { DocumentsComponent } from './documents/documents.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { TrashComponent } from './trash/trash.component';
import { LabelsComponent } from './labels/labels.component';
import { SharedbymeComponent } from './sharedbyme/sharedbyme.component';
import { SharedwithmeComponent } from './sharedwithme/sharedwithme.component';
import { SharedexpiredComponent } from './sharedexpired/sharedexpired.component';
import { GacarchivinglistComponent } from './gacarchivinglist/gacarchivinglist.component';
const routes: Routes = [
  {
    path: '',
    component: DocumentInboxComponent,
    canActivate: [AuthGuard]
    , children: [
      {
        path: 'Documents',
        component: DocumentsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Favorite',
        component: FavoriteComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Trash',
        component: TrashComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Label/:labelid',
        component: LabelsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Sharedwithme',
        component: SharedwithmeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Sharedbyme',
        component: SharedbymeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Sharedexpired',
        component: SharedexpiredComponent,
        canActivate: [AuthGuard]
      },
     
    ]
    
  },
  {
    path: 'gacarchivinglist',
    component: GacarchivinglistComponent,
    canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GACArchivingRoutingModule { }
