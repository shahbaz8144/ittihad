import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InboxService } from 'src/app/_service/inbox.service';
import { DataServiceService } from 'src/app/_service/data-service.service';
import { SpinnerService } from 'src/app/_helpers/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import tippy from 'tippy.js';
declare var $: any;

@Component({
  selector: 'app-delete-memos',
  templateUrl: './delete-memos.component.html',
  styleUrls: ['./delete-memos.component.css']
})
export class DeleteMemosComponent implements OnInit {
  searchText: string;
  currentUserSubject: any;
  currentUser: any;
  _obj: InboxDTO;
  _objds: Dataservicedto;
  _pageSize: number;
  _Search: string;
  _Isfilters: boolean;
  _filtervalues: string;
  subscription: any;
  _LstToMemos: InboxDTO[] = [];;
  _OrderBy: string;
  txtSearch: string;
  TotalRecords: number;
  
  _CurrentpageRecords: number;
  activePage: number;
  MemoView: boolean = false;
  check: boolean = false;
  _checkedMailIds = [];
  LastPage: any;
  lastPagerecords: any;
  _filtersMessage: string;
  _filtersMessage2: string;
  DeleteSearch: any;
  DeleteRestore: string;
  ReloadClearFilters: string;
  Recordsperpage:string;
  onChangeCompany(CompanyId: any) {
    throw new Error("Method not implemented.");
  }
  onChangeUser(FromUserId: any) {
    throw new Error("Method not implemented.");
  }
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor(
    private inboxService: InboxService,
    private cd: ChangeDetectorRef
    , private ds: DataServiceService
    , private _snackBar: MatSnackBar
    , private translate:TranslateService
    ,private renderer: Renderer2
  ) {

  HeaderComponent.languageChanged.subscribe(lang => {
    localStorage.setItem('language',lang);
    this.translate.use(lang);
    this.DeleteSearch = lang === 'en' ? 'Search....' : 'يبحث....';
    this.translate.getTranslation(lang).subscribe(translations => {
      this.DeleteRestore = translations.Communication.tomemotitleRestore
    });
    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });
    this.translate.getTranslation(lang).subscribe(translations => {
      this.Recordsperpage = translations.Communication.Recordsperpagetitle;
    });
  })
    this._obj = new InboxDTO();
    this._objds = new Dataservicedto();
    this._pageSize = 30;
    this._Search = "";
    this._Isfilters = true;
    this._filtervalues = "";

    this.subscription = this.ds.getData().subscribe(x => {
      this._objds = x as Dataservicedto;

      if (this._objds.CompanyId != 0) {
        this.onChangeCompany(this._objds.CompanyId)
      }
      if (this._objds.FromUserId != 0) {
        this.onChangeUser(this._objds.FromUserId)
      }
      this.cd.detectChanges();
    });
  }

  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.DeleteSearch = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.translate.getTranslation(lang).subscribe(translations => {
      this.DeleteRestore = translations.Communication.tomemotitleRestore
    });
    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });
    this.translate.getTranslation(lang).subscribe(translations => {
      this.Recordsperpage = translations.Communication.Recordsperpagetitle;
    });
    this.activePage = 1;
    this.MemoView = false;
    $(".LabelsClass").removeClass("active");
    this._OrderBy = "DESC";
    this.DeletedMemos(this._OrderBy, this.activePage);
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

    const hoverElementDP = document.querySelector('#previous');
    if (hoverElementDP) {
      // Initialize Tippy.js
      tippy(hoverElementDP, {
        content: 'Previous',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementDN = document.querySelector('#next');
    if (hoverElementDN) {
      // Initialize Tippy.js
      tippy(hoverElementDN, {
        content: 'Next',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementDRR = document.querySelector('#Recordsperpage');
    if (hoverElementDRR) {
      // Initialize Tippy.js
      tippy(hoverElementDRR, {
        content: 'Records per page',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementDR = document.querySelector('#DeleteRestore');
    if (hoverElementDR) {
      // Initialize Tippy.js
      tippy(hoverElementDR, {
        content: 'DeleteRestore',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }
  }


  Searchighlight() {
    document.getElementById("search-grp").classList.add("group-active");
  }
  clearshow() {
    document.getElementById("clrr-btn").classList.remove("d-none");
  }
  clearSearch() {
    this.searchText = '';
    this.DeletedMemos(this._OrderBy, this.activePage);
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
    this.DeletedMemos(this._OrderBy, this.activePage);
  }

  totalPages: number;
  isLastPage(): boolean {
    return this.activePage >= this.totalPages;
  }

  nextPage(): void {
    if (this.activePage < this.totalPages) {
      this.activePage++;
      this.check = false;
      this.DeletedMemos(this._OrderBy, this.activePage);

    }

  }

  previousPage(): void {
    if (this.activePage > 1) {
      this.activePage--;
      this.check = false
      this.DeletedMemos(this._OrderBy, this.activePage);
    }

  }

  DeletedMemos(OrderBy: string, activePage: number) {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.pageSize = this._pageSize;
    this._obj.pageNumber = activePage;
    this._obj.OrderBy = OrderBy;
    this._OrderBy = OrderBy;
    // this._obj.lastCreatedDate = "";
    if (this._LstToMemos.length > 0 && activePage != 1) {
      // Sort the array in ascending order based on someProperty
      const sortedArray = this._LstToMemos.slice().sort((a, b) => new Date(a.MemoDateTime).getTime() - new Date(b.MemoDateTime).getTime());
      // Get the top 1 item (the first item after sorting)
      const topItem = sortedArray[0].MemoDateTime;
      this._obj.lastCreatedDate = activePage == 1 ? null : topItem;
    }
    this.inboxService.DeletedMemos(this._obj)
      .subscribe(data => {
        this._LstToMemos = data["Data"]["MemosJSON"];
        console.log( this._LstToMemos,"Trash List Data");
        console.log(this._LstToMemos, "Deletememos");
        this.TotalRecords = data["Data"]["TotalRecords"];

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
        //   this._CurrentpageRecords = this.TotalRecords
        // }
        // else {
        //   this._CurrentpageRecords = this._LstToMemos.length;
        // }

        // if (30 >= this.TotalRecords) {
        //   this._CurrentpageRecords = this.TotalRecords;
        // }
        // else {
        //   this._CurrentpageRecords = this.TotalRecords;
        // }
        // this.activePage = 1;
        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        this.cd.detectChanges();
      });
  }
  
  // deletememo(MailId: number,MemoSource: number) {
  //   this.inboxService.deleteMemo(MailId.toString(),this.currentUserValue.createdby).subscribe(
  //     data => {
  //       this._obj = data as InboxDTO;

  //       if (this._obj.message == "1") {
  //         (<HTMLInputElement>document.getElementById("mailid_" + MailId)).style.display = "none";
  //         var ud = this.currentUserValue.createdby;

  //         this._snackBar.open('Updated Successfully', 'End now', {
  //           duration: 5000,
  //           horizontalPosition: "right",
  //           verticalPosition: "bottom",
  //         });
  //       }
  //     }
  //   )
  // }

  // deletememo(MailId: number) { 
  //     // Delete Memos functionality 
  //   const MemoIdsArray = [];

  //   if (MailId != 0) { MemoIdsArray.push(MailId); }
  //   else {
  //     if (this._checkedMailIds.length == 0) {
  //       alert('Please select memo');
  //       return false;
  //     }
  //   }
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: " Do you want to proceed with Restored this memo",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //   this._checkedMailIds.forEach(element => {
  //     MemoIdsArray.push(element.MailId);
  //   });
  //   this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
  //     data => {
  //       if (data['Message'] == "1") {
  //         this._checkedMailIds.forEach(element => {
  //           this._LstToMemos.forEach(elementI => {
  //             if (elementI.MailId == element.MailId) {
  //               elementI["checked"] = false;
  //               return true;
  //             }
  //           });
  //         });
  //         this.DeletedMemos(this._OrderBy, this.activePage);
  //         this._checkedMailIds = [];
  //         this.check = false;
  //       }
  //     }
  //   )
  //     }
  //   });
  // }



  deletememo(MailId: number) {
    // Delete Memos functionality 
    const MemoIdsArray = [];

    if (MailId != 0) {
      MemoIdsArray.push(MailId);
    }
    else {
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }

      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to proceed with Restored this memo",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Restored it!"
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
                this.DeletedMemos(this._OrderBy, this.activePage);
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
      })
     
    }



    deletememo1(MailId: number) {   // Delete Memos functionality
      const MemoIdsArray = [];


      if (MailId != 0) 
      { MemoIdsArray.push(MailId)
       }
      else {
        if (this._checkedMailIds.length == 0) {
          alert('Please select memo');
          return false;
        }
      }
    // this._checkedMailIds.forEach(element => {
    //   MemoIdsArray.push(element.MailId);
    // });

    this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
      data => {
        if (data['Message'] == "1") {
          this._checkedMailIds.forEach(element => {
            this._LstToMemos.forEach(elementI => {
              if (elementI.MailId == element.MailId) {
                elementI["checked"] = false;
                return true;
              }
            });
          });
          this.DeletedMemos(this._OrderBy, this.activePage);
          this._snackBar.open('Updated Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          this._checkedMailIds = [];
          this.check = false;
        }
      }
    )
  }
  gotoMemoDetailsV2(name, id, LastReplyId) {
    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${LastReplyId}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
    localStorage.setItem('MailId', id);
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
  ClearFilters() {
    // this._obj.UserId = this.currentUserValue.createdby;
    // this._obj.pageSize = this._pageSize;
    // this._obj.pageNumber = 1;
    // this._obj.OrderBy = "DESC";
    // // this._OrderBy = OrderBy;
    // this._obj.lastCreatedDate = null;
    // // if (this._LstToMemos.length > 0 && activePage != 1) {
    // //   // Sort the array in ascending order based on someProperty
    // //   const sortedArray = this._LstToMemos.slice().sort((a, b) => new Date(a.MemoDateTime).getTime() - new Date(b.MemoDateTime).getTime());
    // //   // Get the top 1 item (the first item after sorting)
    // //   const topItem = sortedArray[0].MemoDateTime;
    // //   this._obj.lastCreatedDate = activePage == 1 ? null : topItem;
    // // }
    // this.inboxService.DeletedMemos(this._obj)
    //   .subscribe(data => {
    //     this._LstToMemos = data["Data"]["MemosJSON"];

    //     console.log(this._LstToMemos, "Deletememos");
    //     this.TotalRecords = data["Data"]["TotalRecords"];

    //     if (this.TotalRecords < 30) {
    //       this.LastPage = this.activePage;
    //     }
    //     else {
    //       let _vl = this.TotalRecords / this._pageSize;
    //       let _vl1 = _vl % 1;
    //       if (_vl1 > 0.000) {
    //         this.totalPages = Math.trunc(_vl) + 1;
    //       }
    //       else {
    //         this.totalPages = Math.trunc(_vl);
    //       }
    //     }
    //     // if (this._pageSize >= this.TotalRecords) {
    //     //   this._CurrentpageRecords = this.TotalRecords
    //     // }
    //     // else {
    //     //   this._CurrentpageRecords = this._LstToMemos.length;
    //     // }

    //     // if (30 >= this.TotalRecords) {
    //     //   this._CurrentpageRecords = this.TotalRecords;
    //     // }
    //     // else {
    //     //   this._CurrentpageRecords = this.TotalRecords;
    //     // }
    //     // this.activePage = 1;
    //     if (this._LstToMemos.length == 0) {
    //       this._filtersMessage = "No more memos matched your search";
    //       this._filtersMessage2 = " Clear the filters & try again";
    //     }
    //     else if (this._LstToMemos.length > 0) {
    //       this._filtersMessage = "";
    //       this._filtersMessage2 = "";
    //     }
    //     this.cd.detectChanges();
    //   });
    this.activePage = 1;
    this.searchText = "";
    this.DeletedMemos(this._OrderBy, this.activePage);
    this.searchText = '';
    this.check = false;
    this._checkedMailIds = [];
  }

}
