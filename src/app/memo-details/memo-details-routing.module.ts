import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { EmptyLayoutComponent } from '../shared/empty-layout/empty-layout.component';
import { MemoDetailsComponent } from './memo-details/memo-details.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { GacDocumentDetailsComponent } from './gac-document-details/gac-document-details.component';
import { FileviewComponent } from './fileview/fileview.component';
import { AnnouncementDetailsComponent } from './announcement-details/announcement-details.component';
import { MemoDetailsV2Component } from './memo-details-v2/memo-details-v2.component';
import { PdfComponent } from './pdf/pdf.component';
import { PdfEditorComponent } from './pdf-editor/pdf-editor.component';

const routes: Routes = [  
  {
    path: 'DetailsV2/:id/:replyid',
    component: MemoDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Details/:id/:replyid',
    component: MemoDetailsV2Component,
    canActivate: [AuthGuard]
  },
  //below path is used for gac document info
  {
    path: 'DocumentDetails/:documentid/:referenceid/:shareid',
    component: GacDocumentDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ArchiveView/:url',
    component: FileviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'AnnouncementDetails/:id',
    component: AnnouncementDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'View/:url',
    component: FileviewComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'pdf',
    component: PdfComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pdfedit',
    component: PdfEditorComponent,
    canActivate: [AuthGuard]
  }
  // {
  //   path: 'ArchiveView/:contenttype/:url',
  //   component: FileviewComponent,
  //   canActivate: [AuthGuard]
  // }
  // ,
  // {
  //   path: '',
  //   component: EmptyLayoutComponent,
  //   children: [
  //     {
  //       path: 'Details/:id',
  //       component: MemoDetailsComponent,
  //       canActivate: [AuthGuard]
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemoDetailsRoutingModule { }
