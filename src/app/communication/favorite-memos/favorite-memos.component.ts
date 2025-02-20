import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { DataServiceService } from 'src/app/_service/data-service.service';
import { UserDTO } from 'src/app/_models/user-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import tippy from 'tippy.js';

declare var $: any;

@Component({
  selector: 'app-favorite-memos',
  templateUrl: './favorite-memos.component.html',
  styleUrls: ['./favorite-memos.component.css']
})
export class FavoriteMemosComponent implements OnInit {
  _objds: Dataservicedto;
  activePage: number;
  companyid: number;
  fromuserid: number;
  TotalRecords: number;
  _Search: string;
  _CurrentpageRecords: number;
  _obj: InboxDTO;
  _pageSize: number;
  _LstToMemos: InboxDTO[] = [];
  _LstUsers: any;
  _LstCompanies: any;
  subscription: Subscription;
  _MemoIds: any;
  _filtersMessage: string;
  _filtersMessage2: string;
  lastPagerecords: number;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _LstMemoStatus: any;
  FiltersSelected: boolean;
  txtSearch: string;
  check: boolean = false;
  FavoriteSearch: string;
  _checkedMailIds = [];
  MemoView: boolean = false;
  LastPage: number;
  Favorite:string;
  Markasunread:string;
  Markasread:string;
  Delete:string;
  UnRead:string;
  Read:string;
  ReloadClearFilters:string;
  Recordsperpage:string;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  constructor(private inboxService: InboxService
    , private ds: DataServiceService
    , private _snackBar: MatSnackBar
    , private cd: ChangeDetectorRef
    , private translate: TranslateService
    , private renderer: Renderer2
  ) {

    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.FavoriteSearch = lang === 'en' ? "Search....." : "يبحث.....";
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      this.translate.getTranslation(lang).subscribe(translations => {
        this.Favorite = translations.Communication.tomemotitleFavorite
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Markasunread = translations.Communication.tomemotitleMarkasunread
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Markasread = translations.Communication.tomemotitleMarkasread
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Delete = translations.Communication.tomemotitleDelete
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.UnRead = translations.Communication.titleUnRead
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Read = translations.Communication.tomemotitleRead
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.ReloadClearFilters = translations.Communication.tomemotitleReload
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Recordsperpage = translations.Communication.Recordsperpagetitle;
      });
    });
    
    this._pageSize = 30;
    this._Search = "";
    this._obj = new InboxDTO();
    this._objds = new Dataservicedto();
    this.subscription = this.ds.getData().subscribe(x => {
      this._objds = x as Dataservicedto;
      this.cd.detectChanges();
    });

  }

  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.FavoriteSearch = lang === 'en' ? "Search....." : "يبحث.....";
  
    this.translate.getTranslation(lang).subscribe(translations => {
      this.Favorite = translations.Communication.tomemotitleFavorite
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Markasunread = translations.Communication.tomemotitleMarkasunread
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Delete = translations.Communication.tomemotitleDelete
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.UnRead = translations.Communication.titleUnRead
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Read = translations.Communication.tomemotitleRead
    });
    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });
    this.translate.getTranslation(lang).subscribe(translations => {
      this.Recordsperpage = translations.Communication.Recordsperpagetitle
    });
    this.MemoView = false;
    $(".LabelsClass").removeClass("active");
    // this._pageSize = 30;
    this.activePage = 1;
    this.FavMemos(this.activePage, this._Search,);
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

    const hoverElementFD = document.querySelector('#Delete');
    if (hoverElementFD) {
      // Initialize Tippy.js
      tippy(hoverElementFD, {
        content: 'Delete',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementFU = document.querySelector('#UnRead');
    if (hoverElementFU) {
      // Initialize Tippy.js
      tippy(hoverElementFU, {
        content: 'UnRead',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementFR = document.querySelector('#Read');
    if (hoverElementFR) {
      // Initialize Tippy.js
      tippy(hoverElementFR, {
        content: 'Read',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementFRPR = document.querySelector('#Recordsperpage');
    if (hoverElementFRPR) {
      // Initialize Tippy.js
      tippy(hoverElementFRPR, {
        content: 'Records per page',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementIP = document.querySelector('#previous');
    if (hoverElementIP) {
      // Initialize Tippy.js
      tippy(hoverElementIP, {
        content: 'Previous',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }


    const hoverElementIN = document.querySelector('#Next');
    if (hoverElementIN) {
      // Initialize Tippy.js
      tippy(hoverElementIN, {
        content: 'Next',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementsPS = document.querySelectorAll('.tipply_favorite');
    hoverElementsPS.forEach(hoverElementINMPPSS => {
      tippy(hoverElementINMPPSS, {
        content: 'Favorite',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    const hoverElementsFF = document.querySelectorAll('.tippy_Markasunread');
    hoverElementsFF.forEach(hoverElementINMPPFF => {
      tippy(hoverElementINMPPFF, {
        content: 'Unread',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });


    const hoverElementsFR = document.querySelectorAll('.tippy_Markasread');
    hoverElementsFR.forEach(hoverElementINMPPFFR => {
      tippy(hoverElementINMPPFFR, {
        content: 'Read',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

  }

  IconSearch() {
    if (this._Search === "") {
      (<HTMLInputElement>document.getElementById("txtSearch")).focus();
      document.getElementById("search-grp").classList.add("group-active");
    } else {
      this.FavMemos(this.activePage, this._Search);
    }
  }

  onBackspace(event: KeyboardEvent) {
    if (event.key === "Backspace" && this._Search === "") {
      this.FavMemos(this.activePage, this._Search);
    }
  }

  Searchighlight() {
    document.getElementById("search-grp").classList.add("group-active");
  }

  clearshow() {
    document.getElementById("clrr-btn").classList.remove("d-none");
  }

  clearSearch() {
    this._Search = '';
    this.FavMemos(this.activePage, this._Search,);
  }

  FavMemos(pageNumber: number, Search: string) {
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.Search = Search;
    this.inboxService.FavMemosWithFilters(this._obj)
      .subscribe(data => {
        // console.log(data, "fav memo");
        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["MemosJSON"];
        console.log(this._LstToMemos,"Fav Memos")
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });
        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        this.TotalRecords = parseInt(data["Data"]["TotalRecordsJSON"]);
        
        console.log(this.TotalRecords,"Favtotalrecord");
        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = parseInt(this.TotalRecords.toString());
        // }
        // else {
        //   this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
        // }
        // this.lastPagerecords = parseInt(this._LstToMemos.length.toString());
        if (this.TotalRecords < 30) {
          this.LastPage = this.activePage;
        }
        else {
          let _vl = this.TotalRecords / this._pageSize;
          let _vl1 = _vl % 1;
          if (_vl1 > 0.000) {
            this.totalPages = Math.trunc(_vl) + 1;
          }
          else {
            this.totalPages = Math.trunc(_vl);
          }
        }
        this._objds.FilterRequired = true;
        this._objds.ToMemosCount = 0;
        this._objds.CCMemosCount = 0;
        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);
      });
  }

  deletememo(MailId: number) {
    // Delete Memos functionality 
    const MemoIdsArray = [];

    if (MailId != 0) {
      MemoIdsArray.push(MailId);
    } else {
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
          MemoIdsArray.push(element.MailId);
        });
        this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
          data => {
            if (data['Message'] == "1") {
              this._checkedMailIds.forEach(element => {
                this._LstToMemos.forEach(elementI => {
                  if (elementI.MailId == element.MailId) {
                    elementI["checked"] = false;
                  }
                });
              });
              this.FavMemos(this.activePage, this._Search);
              this._checkedMailIds = [];
              this.check = false; // Set check to false here
            }
          }
        )
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


  gotoMemoDetailsV2(name, id, replyid) {

    // alert("The URL of this page is: " + window.location.href);
    // window['base-href'] = window.location.pathname;
    // alert(window.location.pathname);
    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${replyid}`;
    //var myurl = `${url}`;
    //this.router.navigate([myurl]);
    var myWindow = window.open(myurl, id);
    //var myWindow = window.open(myurl);
    myWindow.focus();

    localStorage.setItem('MailId', id);
    // this.router.navigateByUrl(myurl).then(e => {
    //   if (e) {
    //     window.open(myurl, '_blank').focus()
    //     console.log("Navigation is successful!");
    //   } else {
    //     console.log("Navigation has failed!");
    //   }
    // });
  }

  onClickPage(pageNumber: number) {
    this.check = false;
    // this.activePage = pageNumber;
    let _vl = this.TotalRecords / this._pageSize;
    let _vl1 = _vl % 1;
    if (_vl1 > 0.000) {
      this.LastPage = Math.trunc(_vl) + 1;
    }
    else {
      this.LastPage = Math.trunc(_vl);
    }
    if (pageNumber == this.LastPage) {
      this.activePage = this.LastPage;
      this.lastPagerecords = 30;
    }
    else {
      this.activePage = pageNumber;
    }

    this.FavMemos(this.activePage, this._Search);
  }

  totalPages: number;
  isLastPage(): boolean {
    return this.activePage >= this.totalPages;
  }

  nextPage(): void {
    if (this.activePage < this.totalPages) {
      this.activePage++;
      this.check = false;
      this.FavMemos(this.activePage, this._Search);
    }
  }

  previousPage(): void {
    if (this.activePage > 1) {
      this.activePage--;
      this.check = false
      this.FavMemos(this.activePage, this._Search);
    }
  }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtSearch")).value;
    this._Search = newValue;
    this.FavMemos(this.activePage, this._Search,);
  }
  selectAllcheckbox() { // Select All Checkbox functionality 
    for (let value of Object.values(this._LstToMemos)) {
      value['checked'] = this.check;
    }
    this._checkedMailIds = this._LstToMemos.filter((value, index) => {
      return value['checked'] == true;
    });
  }
  Singleselectcheckbox(mailid, value) { // Select single Checkbox functionality 

    if (value == false) this.check = false;
    this._LstToMemos.forEach(element => {
      if (element.MailId == mailid) {
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
  UpdateMailView(MailId: number, _status: boolean) {  // Read/Unread functionality 
    const MemoIdsArray = [];
    if (MailId != 0) {
      MemoIdsArray.push(MailId);
    }
    else {
      this._checkedMailIds.forEach(element => {
        MemoIdsArray.push(element.MailId);
      });
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }
    // if (this._checkedMailIds.length == 0) {
    //   alert('Please select memo');
    //   return false;
    // }
    this.inboxService.UnReadMemo(MemoIdsArray.toString(), _status, this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;

        if (data['Message'] == "1") {
          if (MailId != 0) {

            this._LstToMemos.forEach(elementI => {
              if (elementI.MailId == MailId) {
                elementI["checked"] = false;
                elementI["MailView"] = _status == true ? true : false;
                return true;
              }
            });
          }
          else {
            this._checkedMailIds.forEach(element => {
              // this._LstToMemos.find(value => value.MailId = element.MailId).checked = false;
              this._LstToMemos.forEach(elementI => {
                if (elementI.MailId == element.MailId) {
                  elementI["checked"] = false;
                  elementI["MailView"] = element.MailView == true ? false : true;
                  return true;
                }
              });
            });
          }

          const language = localStorage.getItem('language');
          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم التحديث بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          } else {
            this._snackBar.open('Updated Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
            this._checkedMailIds = [];
            this.check = false;
          }
        }
      }
    )
  }
  ClearFilters() {
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.Search = "";
    this.inboxService.FavMemosWithFilters(this._obj)
      .subscribe(data => {
        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["MemosJSON"];
        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        this.TotalRecords = parseInt(data["Data"]["TotalRecordsJSON"]);
        if (this.TotalRecords < 30) {
          this.LastPage = this.activePage;
        }
        else {
          let _vl = this.TotalRecords / this._pageSize;
          let _vl1 = _vl % 1;
          if (_vl1 > 0.000) {
            this.totalPages = Math.trunc(_vl) + 1;
          }
          else {
            this.totalPages = Math.trunc(_vl);
          }
        }
        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = parseInt(this.TotalRecords.toString());
        // }
        // else {
        //   this._CurrentpageRecords = parseInt(this._LstToMemos.length.toString());
        // }
        // this.lastPagerecords = parseInt(this._LstToMemos.length.toString());
        this.activePage = 1;

        this._objds.FilterRequired = true;
        this._objds.ToMemosCount = 0;
        this._objds.CCMemosCount = 0;
        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);
        // console.log(this._LstToMemos.length,"FavMemos");
        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        this.check = false;
        this._checkedMailIds = [];
        $("#div_filters").removeClass("show");
        $("#txtSearch").val('');
      });
    this._Search = "";
  }

  ChangeFavoriteValue(val: boolean, _mailId: number) {
    this.inboxService.FavStatus(_mailId, val, this.currentUserValue.createdby)
      .subscribe(data => {
        if (data['Message'] != "1") {
          alert('Please try again')
        }
        else {
          this.FavMemos(this.activePage, this._Search);
        }
      });
  }
}
