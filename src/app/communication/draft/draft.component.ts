import { Component, EventEmitter, Inject, Injectable, OnInit, Renderer2 } from '@angular/core';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { InboxComponent } from 'src/app/communication/inbox/inbox.component'
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
import tippy from 'tippy.js';
@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class DraftComponent implements OnInit {
  public static DraftDeleted:EventEmitter<any>=new EventEmitter();
  searchText: string;
  _obj: InboxDTO;
  _LstToMemos: any;
  userid: number
  check: boolean = false;
  _checkedMailIds = [];
  MemoView: boolean = false;
  _Search: string;
  _filtersMessage: string;
  _filtersMessage2: string;
  Draftsearch:string;
  Delete:string
  continue:string;
  parentValue = '';
  currentLang: "ar" | "en" = "ar";
  ReloadClearFilters:string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor(private inboxService: InboxService,
    private route:ActivatedRoute,
    private _inbox: InboxComponent,
    private translate :TranslateService
    ,private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    ) {
    this._obj = new InboxDTO();
    this._Search = "";
    DraftComponent.DraftDeleted.subscribe(()=>{
        this.bindDraftMemos();
    });
    HeaderComponent.languageChanged.subscribe(lang => {
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.Draftsearch = lang === 'en' ? 'Search....' : 'يبحث....';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      this.translate.getTranslation(lang).subscribe(translations => {
        this.ReloadClearFilters = translations.Communication.tomemotitleReload
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Delete = translations.Communication.tomemotitleDelete
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.continue = translations.Communication.tomemotitlecontinue
      });

     
    })
  }

  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    // this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.Draftsearch = lang === 'en' ? 'Search....' : 'يبحث....';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Delete = translations.Communication.tomemotitleDelete
    });


    this.translate.getTranslation(lang).subscribe(translations => {
      this.continue = translations.Communication.tomemotitlecontinue
    });
    this.MemoView = false;
    this.bindDraftMemos();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeTippy()
    }, 2000);
  }

  initializeTippy(){
    const hoverElementIC = document.querySelector('#ReloadClearFilters');
    if (hoverElementIC) {
      // Initialize Tippy.js
      tippy(hoverElementIC, {
        content: 'Clear Filters',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementDD = document.querySelector('#Delete');
    if (hoverElementDD) {
      // Initialize Tippy.js
      tippy(hoverElementDD, {
        content: 'Delete',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementsPP = document.querySelectorAll('.tippy_Delete');
    hoverElementsPP.forEach(hoverElementINMPP => {
      tippy(hoverElementINMPP, {
        content: 'Delete',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });


    const hoverElementsPS = document.querySelectorAll('.tippy_Share');
    hoverElementsPS.forEach(hoverElementINMPPSS => {
      tippy(hoverElementINMPPSS, {
        content: 'Share',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

  }
 
  Searchighlight() {
    document.getElementById("search-grp").classList.add("group-active");
  }

  clearshow() {
    document.getElementById("clrr-btn").classList.remove("d-none");
  }

  clearSearch() {
    this.searchText = '';
    this.bindDraftMemos();
  }

  bindDraftMemos() {
    console.log('successfully executed.');
    this.userid = this.currentUserValue.createdby;
    this.inboxService.GetDraftMemos(this.userid)
      .subscribe(data => {
        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["DraftJson"];
        console.log(this._LstToMemos, "DraftJson");
      });
  }

  redirectnewmemo(draftcontent, draftid, subject, MailId, ReplyId, name) {
    const id = MailId;
    if (MailId == 0 && ReplyId == 0) {
      const lang: any = localStorage.getItem('language');
    this.parentValue = lang == 'en' ? "New Memo" : "مذكرة جديدة";
    this.currentLang = lang ? lang : 'en';
      this._inbox.ViewNewMemoDiv(draftcontent, draftid, subject);
    } else if (MailId != 0 || ReplyId != 0) {
      var url = document.baseURI + name;
      var myurl = `${url}/${id}/${ReplyId}`;
      var myWindow = window.open(myurl, id);
      myWindow.focus();
      localStorage.setItem('MailId', id);
    }
  }

  DeletedMemosFromDraft1(DraftId: number) {
    const MemoIdsArray = [];

    if (DraftId != 0) { MemoIdsArray.push(DraftId); }
    else {
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }
    Swal.fire({
      title: this.translate.instant('Communication.title'),
      text: this.translate.instant('Communication.deleteText'),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant('Communication.confirmButtonText'),
      cancelButtonText: this.translate.instant('Communication.cancelButtonText')
    }).then((result) => {
      if (result.isConfirmed) {
    // this._checkedMailIds.forEach(element => {
    //   MemoIdsArray.push(element.DraftId);
    // });
    //  alert(this._checkedMailIds.length)
    this.inboxService.DeletedMemosFromDraft(DraftId.toString(), this.currentUserValue.createdby).subscribe(data => {
      this._obj = data as InboxDTO;
      if (data['Message'] == "1") {
        this.bindDraftMemos();
        // this._checkedMailIds = [];
      }
    })
  }
});
  }

  DeletedMemosFromDraft(DraftId: number) {
    const MemoIdsArray = [];
    if (DraftId != 0) { MemoIdsArray.push(DraftId); }
    else {
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }
    Swal.fire({
      title: this.translate.instant('Communication.title'),
      text: this.translate.instant('Communication.deleteText'),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant('Communication.confirmButtonText'),
      cancelButtonText: this.translate.instant('Communication.cancelButtonText')
    }).then((result) => {
      if (result.isConfirmed) {
    this._checkedMailIds.forEach(element => {
      MemoIdsArray.push(element.DraftId);
    });
    //  alert(this._checkedMailIds.length)
    this.inboxService.DeletedMemosFromDraft(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(data => {
      // this._obj = data as InboxDTO;
      if (data['Message'] == "1") {
        this.bindDraftMemos();
        this._checkedMailIds = [];
      }
    })
  } else {
    this._checkedMailIds.forEach(element => {
      this._LstToMemos.forEach(elementI => {
        if (elementI.MailId == element.MailId) {
          elementI["checked"] = false;
        }
      });
    });
    this.check = false;
  
  }
});
  }

 

  selectAllcheckbox() { // Select All Checkbox functionality 

    for (let value of Object.values(this._LstToMemos)) {
      value['checked'] = this.check;
    }
    this._checkedMailIds = this._LstToMemos.filter((value, index) => {
      return value['checked'] == true;
    });
  }
  Singleselectcheckbox(DraftId, value) { // Select single Checkbox functionality 

    if (value == false) this.check = false;
    this._LstToMemos.forEach(element => {
      if (element.DraftId == DraftId) {
        element["checked"] = value;
        return true;
      }
    });
    this._checkedMailIds = this._LstToMemos.filter((value, index) => {
      return value['checked'] == true;
    });
    let _truecount = 0;
    let _falsecount = 0;
    this._checkedMailIds.forEach(element => {
      if (element.MailView) {
        //click on read memo
        //unread purpose
        _truecount = _truecount + 1;
      }
      else {
        //click on un read memo
        //read purpose
        _falsecount = _falsecount + 1;
      }
    });
    if (_falsecount > 0) {
      this.MemoView = true;
    }
    else {
      this.MemoView = false;
    }
  }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtSearch")).value;
    this._Search = newValue;
    this.bindDraftMemos();
  }
  ClearFilters() {
    this.userid = this.currentUserValue.createdby;
    this.inboxService.GetDraftMemos(this.userid)
      .subscribe(data => {
        // console.log(data, "Draft");
        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["DraftJson"];
      });
    this.searchText = '';
    this.check = false;
    this._checkedMailIds = [];
  }
}
