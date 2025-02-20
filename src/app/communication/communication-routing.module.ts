import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { ToMemosComponent } from './to-memos/to-memos.component';
import { CCMemosComponent } from './ccmemos/ccmemos.component';
import { FavoriteMemosComponent } from './favorite-memos/favorite-memos.component';
import { NewMemoComponent } from './new-memo/new-memo.component';
import { SentMemosComponent } from './sent-memos/sent-memos.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { DeleteMemosComponent } from './delete-memos/delete-memos.component';
import { LabelMemosComponent } from './label-memos/label-memos.component';
import { ExecutionPlannerComponent } from './execution-planner/execution-planner.component';
import { PendingFromReceiverComponent } from './pending-from-receiver/pending-from-receiver.component';
import { DraftComponent } from './draft/draft.component';
import { HandoverComponent } from './handover/handover.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { DMSRequestComponent } from './dmsrequest/dmsrequest.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
    canActivate: [AuthGuard]
    , children: [
      {
        path: 'Memos',
        component: ToMemosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'PendingFromReceiver',
        component: PendingFromReceiverComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Bookmarks',
        component: BookmarksComponent,
        canActivate: [AuthGuard]
      }
      , {
        path: 'CCMemos',
        component: CCMemosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'FavoriteMemoList',
        component: FavoriteMemosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'NewMemo',
        component: NewMemoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'SentMemos',
        component: SentMemosComponent,
        canActivate: [AuthGuard]
      }
      ,
      {
        path: 'DeleteMemos',
        component: DeleteMemosComponent,
        canActivate: [AuthGuard]
      }
      ,
      {
        path: 'LabelMemos/:labelid',
        component: LabelMemosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ExecutionPlanner/:ProjectCode',
        component: ExecutionPlannerComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'NewMemo',
        component: NewMemoComponent,
        canActivate: [AuthGuard]
      }
      ,
      {
        path: 'Draft',
        component: DraftComponent,
        canActivate: [AuthGuard]
      }
      ,
      {
        path: 'Handover',
        component: HandoverComponent,
        canActivate: [AuthGuard]
      }
      ,
      {
        path: 'Announcement',
        component: AnnouncementComponent,
        canActivate: [AuthGuard]
      }
      ,
      {
        path: 'Suggestions',
        component: SuggestionsComponent,
        canActivate: [AuthGuard]
      }
      ,
      {
        path: 'MemoRequest',
        component: DMSRequestComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Meetings',
        component: MeetingsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
