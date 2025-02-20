import { Component, OnInit } from '@angular/core';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import tippy from 'tippy.js';
@Component({
  selector: 'app-label-memos',
  templateUrl: './label-memos.component.html',
  styleUrls: ['./label-memos.component.css']
})
export class LabelMemosComponent implements OnInit {
  _obj: InboxDTO;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _LstToMemos: InboxDTO[];
  _filtersMessage: string;
  _filtersMessage2: string;
  txtSearch: string;
  labelId: number;
  TotalRecords: number;
  _CurrentpageRecords: number;
  activePage: number;
  check: boolean = false;
  _checkedMailIds = [];
  MemoView: boolean = false;
  _Search: string;
  LastPage: any;
  Search: string;
  Delete:string;
  AllLabelRemove:string;
  ReloadClearFilters:string;
  Favorite:string;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  constructor(private inboxService: InboxService,
    private activatedRoute: ActivatedRoute
    , private _snackBar: MatSnackBar
    ,  private translate: TranslateService
  ) {
    this._obj = new InboxDTO();
    this._Search = "";
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language', lang);
      this.translate.use(lang); 
      this.Search = lang === 'en' ? 'Search' : 'يبحث';
      this.translate.getTranslation(lang).subscribe(translations => {
        this.AllLabelRemove = translations.Communication.tomemotitleAllLabelRemove
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.Delete = translations.Communication.tomemotitleDelete
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        this.ReloadClearFilters = translations.Communication.tomemotitleReload
      });

  });
  
  }

  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.Search = lang === 'en' ? 'Search' : 'يبحث'; 

    this.translate.getTranslation(lang).subscribe(translations => {
      this.AllLabelRemove = translations.Communication.tomemotitleAllLabelRemove
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.Delete = translations.Communication.tomemotitleDelete
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      this.ReloadClearFilters = translations.Communication.tomemotitleReload
    });


    this.MemoView = false;
    this.activatedRoute.params.subscribe(val => {
      // put the code from `ngOnInit` here
      this.labelId = this.activatedRoute.snapshot.params.labelid;
      this.labelMemos(this.labelId);
    });
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

    const hoverElementLR = document.querySelector('#AllLabelRemove');
    if (hoverElementLR) {
      // Initialize Tippy.js
      tippy(hoverElementLR, {
        content: 'All Label Remove',
        placement : 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    }

    const hoverElementLD  = document.querySelector('#Delete');
    if (hoverElementLD) {
      // Initialize Tippy.js
      tippy(hoverElementLD, {
        content: 'Delete',
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
  clearSearch(){
    this.txtSearch = '';
    this.labelMemos(this.labelId);
  }
  labelMemos(LabelId: number) {
    
    this._obj = new InboxDTO();
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.LabelId = LabelId;
    
    this.inboxService.MemosLabelBinding(this._obj)
      .subscribe(data => {
        this._LstToMemos = data["Data"]["LabelMemosJson"];
        console.log(this._LstToMemos,"Label List Data");
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
      });
  }
  gotoMemoDetailsV2(name, id,LastReplyId) {

    // alert("The URL of this page is: " + window.location.href);
    // window['base-href'] = window.location.pathname;
    // alert(window.location.pathname);
    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${LastReplyId}`;
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

  removetag(MailId: number) {
    const MemoIdsArray = [];

    if (MailId != 0) { MemoIdsArray.push(MailId); }
    else {
      if (this._checkedMailIds.length == 0) {
        alert('Please select memo');
        return false;
      }
    }
    this._checkedMailIds.forEach(element => {
      MemoIdsArray.push(element.MailId);
    });
    
    this.inboxService.RemoveMemoFromLabel(MemoIdsArray.toString(), this.labelId, this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        MemoIdsArray.forEach(element => {
          (<HTMLInputElement>document.getElementById("mailid_" + element)).style.display = "none";
        });

        this._snackBar.open('Memo Tagged Successfully', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
        this._checkedMailIds = [];
        this.check = false
        // }
        this.labelMemos(this.labelId);
      }
    )
  }

  // removetag1(memoid:number){
  //   const MemoIdsArray = [];

  //   if (memoid != 0) { MemoIdsArray.push(memoid); }
  //   else {
  //     if (this._checkedMailIds.length == 0) {
  //       alert('Please select memo');
  //       return false;
  //     }
  //   }
  //   this._checkedMailIds.forEach(element => {
  //     MemoIdsArray.push(element.MailId);
  //   });
  //   // alert(MemoIdsArray);
  //   this.inboxService.RemoveMemoFromLabel(memoid,this.labelId,this.currentUserValue.createdby).subscribe(
  //     data=>{
  //       this._obj = data as InboxDTO;
  //         (<HTMLInputElement>document.getElementById("mailid_" + memoid)).style.display = "none";
  //         this._snackBar.open('Memo Tagged Successfully', 'End now', {
  //           duration: 5000,
  //           horizontalPosition: "right",
  //           verticalPosition: "bottom",
  //         });
  //         window.close();
  //       // }
  //     }
  //   )
  // }
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
              // this.FavMemos(this.activePage,this._Search);
              this.labelMemos(this.labelId);
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


  // deletememo(MailId: number) {   // Delete Memos functionality 
  //   const MemoIdsArray = [];

  //   if (MailId != 0) { MemoIdsArray.push(MailId); }
  //   else {
  //     if (this._checkedMailIds.length == 0) {
  //       alert('Please select memo');
  //       return false;
  //     }
  //   }
  //   this._checkedMailIds.forEach(element => {
  //     MemoIdsArray.push(element.MailId);
  //   });
  //   this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
  //     data => {
  //       // this._obj = data as InboxDTO;
  //       if (data['Message'] == "1") {
  //         this._checkedMailIds.forEach(element => {
  //           this._LstToMemos.forEach(elementI => {
  //             if (elementI.MailId == element.MailId) {
  //               elementI["checked"] = false;
  //               return true;
  //             }
  //           });
  //         });
  //         this.labelMemos(this.labelId);
  //         // this.ToMemos(this.activePage, this._Search, this._OrderBy);
  //         this._snackBar.open('Updated Successfully', 'End now', {
  //           duration: 5000,
  //           horizontalPosition: "right",
  //           verticalPosition: "bottom",
  //         });
  //         this._checkedMailIds = [];
  //         this.check = false;
  //       }
  //       // if (this._obj.message == "1") {
  //       //   this.ToMemos(this.activePage, this._Search, this._OrderBy);
  //       //   this._snackBar.open('Updated Successfully', 'End now', {
  //       //     duration: 5000,
  //       //     horizontalPosition: "right",
  //       //     verticalPosition: "bottom",
  //       //   });
  //       // }
  //     }
  //   )
  // }

  ClearFilters(LabelId: number) {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.LabelId = this.labelId;

    this.inboxService.MemosLabelBinding(this._obj)
      .subscribe(data => {
        this._LstToMemos = data["Data"]["LabelMemosJson"];
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
        this.txtSearch = '';
        this._checkedMailIds = [];
      });
      this.check = false;
  }

}
