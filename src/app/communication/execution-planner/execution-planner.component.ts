import { Component, OnInit } from '@angular/core';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OutsourceService } from 'src/app/_service/outsource.service';
import { Outsourcedto } from 'src/app/_models/outsourcedto';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-execution-planner',
  templateUrl: './execution-planner.component.html',
  styleUrls: ['./execution-planner.component.css']
})
export class ExecutionPlannerComponent implements OnInit {
  _obj: InboxDTO;
  _outsourceobj: Outsourcedto;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _LstToMemos: InboxDTO[];
  _filtersMessage:string;
  _filtersMessage2:string;
  txtSearch: string;
  ProjectCode:string;
  TotalRecords: number;
  _CurrentpageRecords: number;
  activePage:number;
  _MemoIds:any;
  EPSearch: any;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  constructor(private inboxService: InboxService,
    private activatedRoute: ActivatedRoute
    ,private outsourceService: OutsourceService
, private _snackBar: MatSnackBar  ,
private translate:TranslateService
) { 
  this._obj = new InboxDTO();
  this._outsourceobj=new Outsourcedto();

  HeaderComponent.languageChanged.subscribe(lang => {
    localStorage.setItem('language',lang);
    this.translate.use(lang);
    this.EPSearch = lang === 'en' ? 'Search....' : 'يبحث....'
  })
    activatedRoute.params.subscribe(val => {
      // put the code from `ngOnInit` here
      this.ProjectCode = this.activatedRoute.snapshot.params.ProjectCode;
      this.ProjectMemos(this.ProjectCode);
    });
}

  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.EPSearch = lang === 'en' ? 'Search....' : 'يبحث....'
  }

  ProjectMemos(ProjectCOde:string) {
    this._obj.UserId = this.currentUserValue.createdby;
    this.outsourceService.EP_ProjectMemoList(ProjectCOde)
    .subscribe(data => {
      this._outsourceobj = data as Outsourcedto;
      var _memoIds = JSON.parse(this._outsourceobj[0].JsonData);
      this._outsourceobj.JsonData=JSON.stringify(_memoIds);
      this._outsourceobj.UserId=this.currentUserValue.createdby;
       
      this.outsourceService.MemosByProjectCode(this._outsourceobj)
    .subscribe(data => {
       
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.JsonData);
        this._LstToMemos = _TOMemosJson;
        console.log(this._LstToMemos,"EP");
        this.TotalRecords = this._LstToMemos.length;
        if (30 >= this.TotalRecords) {
          this._CurrentpageRecords = this.TotalRecords;
        }
        else {
          this._CurrentpageRecords = this.TotalRecords;
        }
        this.activePage = 1;
        
        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        // if (this._LstToMemos.length == 0) {
        //   this._filtersMessage = this.translate.instant("Dashboard.NoMoreMemosMatchedSearch");
        //   this._filtersMessage2 = this.translate.instant("Dashboard.ClearFiltersAndTryAgain");
        // } else if (this._LstToMemos.length > 0) {
        //   this._filtersMessage = "";
        //   this._filtersMessage2 = "";
        // }
        
    });
  })    
    
  }


  gotoMemoDetailsV2(name, id, replyid) {
    // alert(name);
    // alert(id);
    // alert(replyid);
    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${replyid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
    localStorage.setItem('MailId', id);
  }

 
}
