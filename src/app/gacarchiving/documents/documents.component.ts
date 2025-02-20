import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { InboxService } from 'src/app/_service/inbox.service';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  _Search: string = '';
  status: string = '';
  activePage: number;
  GACDocumentList: any = [];
  GACDocumentPinList: any = [];
  _DocumentId: number;
  TotalrecordsList: any;
  TotalRecords: number;
  _CurrentpageRecords: number
  GacSearch: string;
  txtMainSearch: string;
  _UnRead_Parameter: boolean = false;
  LabelSearch: string;
  _obj1: InboxDTO;
  _obj: GACFiledto;
  _objFilters: GACFiledto;
  _Lstlabels: any = [];
  LabelCount: number;
  _checkedLabelIds: any = [];
  SelectLabel: any[];
  _DeleteDocumentsIds: number[] = [];
  _CheckedDocumentsIds: number[] = [];
  IsRead: boolean = false;
  PageSize: number;
  PageNumber: number;
  LastPage: number;
  lastPagerecords: number;
  toggle: Boolean = false;
  Select: Boolean = false;
  Expired: Boolean = false
  Pending: Boolean = false;
  Approval: Boolean = false;
  Reject: Boolean = false;
  _FavoriteDocumentsIds = [] = [];
  _PinDocumentsIds = [] = [];
  catsearchtxt: string;
  CompanyList: any;
  DepartmentList: any;
  DocumentTypeList: any;
  DistributorList: any;
  ManufactureList: any;
  CategoryList: any;
  SubCategoryList: any;
  SourceList: any;
  selected: any;
  checkedCategoryIDs: any;
  checkedSourceIDs = [];
  checkedDocumentTypeIds = [];
  checkedDistributorIDs = [];
  checkedManufactureIds = [];
  submenusource: string;
  submenuDocument: string;
  subManufacture: string;
  pipe = new DatePipe('en-US');
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  _StartDate: string = '';
  _EndDate: string = '';
  LoginUserId: number;
  ApprovalFilterSelected: boolean = false;
  tooltipContentNextPage: string;
  tooltipContentPreviosepage: string;
  txt11: any;
  txt00: any;
  txt22: any;
  tooltipContentFilters: any;
  tooltipContent: any;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  constructor(public service: GACFileService,
    public serviceInbox: InboxService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private renderer: Renderer2,
    private _snackBar: MatSnackBar
  ) {
    this.initializeLanguageSettings();
    this._obj = new GACFiledto();
    this._objFilters = new GACFiledto();
    this._obj1 = new InboxDTO();
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  ngOnInit(): void {
    this.subscribeToLanguageChanges();
    this.activePage = 1;
    this.GetLables();
    this.AllDocuments();
    this.LoginUserId = this.currentUserValue.createdby;
    this.CategoryList = this.CategoryList || [];
    this.SourceList = this.SourceList || [];
    this.DocumentTypeList = this.DocumentTypeList || [];
    this.ManufactureList = this.ManufactureList || [];
  }

  initializeLanguageSettings(): void {
    const lang = localStorage.getItem('language') || 'en';
    this.setLanguageSettings(lang);
  }

  subscribeToLanguageChanges(): void {
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.setLanguageSettings(lang);
    });
  }

  setLanguageSettings(lang: string): void {
    this.translate.use(lang);
    this.GacSearch = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang === 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang === 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  }

  IconSearch() {
    if (this._Search === "") {
      (<HTMLInputElement>document.getElementById("txtMainSearch")).focus();
      (<HTMLInputElement>document.getElementById("search-grp")).classList.add("group-active");
    } else {
      // this.GACDocuments('', '', '', '', '', '', '', '', this.status);
      this.GACDocumentsArchive('', '', '', '', '', '', this.status, true);
    }
  }

  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtMainSearch")).value;
    this._Search = newValue;
    // this.GACDocuments('', '', '', '', '', '', '', '', this.status);
    this.GACDocumentsArchive('', '', '', '', '', '', this.status, true);
  }

  RebindingSeachDocument() {
    this.txtMainSearch = "";
    this.OnClear();
  }

  Searchighlight() {
    (<HTMLInputElement>document.getElementById("search-grp")).classList.add("group-active");
  }


  onBackspace(event: KeyboardEvent) {
    if (event.key === "Backspace" && this._Search === "") {
      this.OnClear();
    }
  }
  clearshow() {
    (<HTMLInputElement>document.getElementById("clrr-btn")).classList.remove("d-none");
  }
  GacDocumentFilters() {
    this._objFilters.OrganizationId = this.currentUserValue.organizationid;
    this._objFilters.CreatedBy = this.currentUserValue.createdby;
    this.service.GetDropdownList(this._objFilters)
      .subscribe(data => {
        console.log(data, "Filters in documents");
        this._obj = data as GACFiledto;
        this.CompanyList = this._obj.Data["CompanyJson"];
        this.DepartmentList = this._obj.Data["DepartmentJson"];
        this.DocumentTypeList = this._obj.Data["DocumentTypeJson"];
        this.ManufactureList = this._obj.Data["DistributorAndManufactureJson"];
        this.CategoryList = this._obj.Data["CategoryJson"];
        this.SourceList = this._obj.Data["SourceJson"];
      });
    (<HTMLInputElement>document.getElementById("filter-doc")).classList.add("show-filter");
    (<HTMLInputElement>document.getElementById("filter-doc-btn")).classList.add("active");
  }
  // contentType: string | null = null;
  // getContentType(fileUrl): void {
  //   this.service.getFileContentType(fileUrl).subscribe({
  //     next: (type) => {
  //       this.contentType = type;
  //       console.log('Content-Type:', this.contentType);
  //     },
  //     error: (err) => {
  //       console.error('Failed to get content-type:', err);
  //     },
  //   });
  // }
  
  getImageSource(item: any): string {
     
    if (!item || !item.ThumbnailUrl) {
      return 'assets/media/Img/filethumb.png'; // Default thumbnail if no filename is present
    }
  
    const fileExtension = item.ThumbnailUrl.split('.').pop()?.toLowerCase(); // Get file extension
  
    if (fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg') {
      return item.Url; // Return actual image URL for PNG and JPEG
    } else {
      return 'assets/media/Img/filethumb.png'; // Default thumbnail for other file types
    }
  }
  
  
  
  GACDocumentsArchive(subcatid, SourceIds, DocumentTypeIds, DistributorIds, StartDate, EndDate, DocumentStatus, IsAll) {
    this._obj.subcatid = subcatid;
    this._obj.DocumentTypeIds = DocumentTypeIds;
    this._obj.DocumentSearchText = this._Search;
    this._obj.SourceIds = SourceIds;
    this._obj.DMIds = DistributorIds;
    this._obj.StartDate = StartDate;
    this._obj.EndDate = EndDate;
    this._obj.PageSize = 20;
    this._obj.PageNumber = this.activePage == 0 ? 1 : this.activePage;
    this._obj.DocumentStatus = DocumentStatus;
    this._obj.IsAll = IsAll;
    this.service.GACDocumentsSearch(this._obj)
      .subscribe(data => {
        // this.getContentType("https://yrglobaldocuments.blob.core.windows.net/documents/Archive/2/1737994985611Ramesh Neelapala Medical Certificate 4-12-2024.pdf");
        // console.log(this.contentType,"this.contentType")
        console.log(data, "All List Data");
        this._obj = data as GACFiledto;
        this.GACDocumentList = this._obj.Data["ArchiveJson"];
        this.GACDocumentPinList = this._obj.Data["PinJson"];
        console.log(this.GACDocumentPinList , "Pin List");
        console.log(this.GACDocumentList, "ArchiveJson");
        this.TotalrecordsList = this._obj.Data["TotalRecordsJSON"];
        // if (this.GACDocumentList.length > 0)
        // this._DocumentId = this.GACDocumentList[0].DocumentId;

        // this.TotalRecords = this.TotalrecordsList[0].TotalRecords;
        if (this.GACDocumentList.length == 0) {
          this._CurrentpageRecords = 0;
          this.activePage = 0;
        } else {
          this._CurrentpageRecords = this.GACDocumentList.length;
        }
      });
  }
  GACDocuments(CategoryIds, SourceIds, DocumentTypeIds, DistributorIds, ManufactureIds, DocumentSearchText, StartDate, EndDate, DocumentStatus) {
    this._obj.CategoryIds = CategoryIds;
    this._obj.DocumentTypeIds = DocumentTypeIds;
    this._obj.DocumentSearchText = this._Search;
    this._obj.SourceIds = SourceIds;
    this._obj.DistributorIds = DistributorIds;
    this._obj.ManufactureIds = ManufactureIds;
    this._obj.StartDate = StartDate;
    this._obj.EndDate = EndDate;
    this._obj.PageSize = 20;
    this._obj.PageNumber = this.activePage;
    this._obj.DocumentStatus = DocumentStatus;
    this.service.GACDocumentsSearch(this._obj)
      .subscribe(data => {
        console.log(data, "All List Data");
        this._obj = data as GACFiledto;
        this.GACDocumentList = this._obj.Data["GACDocumentList"];
        this.GACDocumentPinList = this._obj.Data["GACPinDocumentList"];
        console.log(this.GACDocumentList, "SearchDocument");
        if (this.GACDocumentList.length > 0)
          this._DocumentId = this.GACDocumentList[0].DocumentId;
        this.TotalrecordsList = this._obj.Data["TotalRecords"];
        this.TotalRecords = this.TotalrecordsList[0].TotalRecords;
        if (this.GACDocumentList.length == 0) {
          this._CurrentpageRecords = 0;
          this.activePage = 0;
        } else {
          this._CurrentpageRecords = this.GACDocumentList.length;
        }
      });
  }

  onClickPage(pageNumber: number) {
    let _vl = this.TotalRecords / this.PageSize;
    let _vl1 = _vl % 1;
    if (_vl1 > 0.000) {
      this.LastPage = Math.trunc(_vl) + 1;
    }
    else {
      this.LastPage = Math.trunc(_vl);
    }
    console.log(this.LastPage);
    if (pageNumber == this.LastPage) {
      this.activePage = this.LastPage;
      this.lastPagerecords = 20;
    }
    else {
      this.activePage = pageNumber;
    }
    // this.GACDocuments('', '', '', '', '', '', '', '', '');
    this.GACDocumentsArchive('', '', '', '', '', '', '', true);
  }


  OnClear() {
    this.activePage = 1;
    this.txtMainSearch = "";
    this._Search = "";
    this.CategoryList.forEach(item => item.isChecked = false);
    this.SourceList.forEach(item => item.isChecked = false);
    this.DocumentTypeList.forEach(item => item.isChecked = false);
    this.ManufactureList.forEach(item => item.isChecked = false);

    this.Approval = false;
    this.Pending = false;
    this.Reject = false;
    this._StartDate = "";
    this._EndDate = "";
    this._obj = new GACFiledto();

    // this.GacDocumentFilters();
    // this.SelectedOptionText = "All";
    // this.SelectedOption = 1;
    // this.GACDocuments('', '', '', '', '', '', '', '', '');
    this.GACDocumentsArchive('', '', '', '', '', '', '', true);
    // this.selected = false;
    // this.toggle = false;
    // this.Select = false;
    // this.Expired = false;
    // this.Pending = false;
    // this.Approval = false;
    // this.Reject = false;
  }

  anyChecked(list: { isChecked: boolean }[] | undefined): boolean {
    return list ? list.some(item => item.isChecked) : false;
  }




  OnClearFilters() {
    this.CategoryList.forEach(element => {
      element.isChecked = false;
    });

    this.SourceList.forEach(element => {
      element.isChecked = false
    });

    this.DocumentTypeList.forEach(element => {
      element.isChecked = false
    });

    this.ManufactureList.forEach(element => {
      element.isChecked = false
    });
  }

  InitialLoadFilters(_val: boolean) {
    this._UnRead_Parameter = _val;

  }

  GetLables() {
    this._obj1.UserId = this.currentUserValue.createdby;
    this.serviceInbox.UserLabels(this._obj1)
      .subscribe(data => {
        this._Lstlabels = data["Data"].LablesJson;
        this.LabelCount = this._Lstlabels.length;
        this.cd.detectChanges();
      });
  }


  labelchange(LabelId) {
    let _value = $("#lbl_" + LabelId).prop('checked');
    if (_value) this._checkedLabelIds.push(LabelId);
    else {
      this._checkedLabelIds = jQuery.grep(this._checkedLabelIds, function (value) {
        return value != LabelId;
      });
    }
    this.SelectLabel = [];
    this._checkedLabelIds.forEach(element => {
      this._Lstlabels.forEach(elementI => {
        if (element == elementI.LabelId) {
          this.SelectLabel.push(elementI.LabelName);
        }
      });
    });
  }





  DeleteDocuments(_status: boolean) {
    this._DeleteDocumentsIds = this.GACDocumentList
      .filter(item => item.IsChecked)
      .map(item => ({
        ShareId: item.ShareId,
        DocumentId: item.DocumentId,
        IsTrash: _status
      }));

    if (this._DeleteDocumentsIds.length === 0) {
      alert('Please select Documents');
      return false;
    }
    Swal.fire({
      title: this.translate.instant('Communication.title'),
      text: this.translate.instant('Communication.deleteTextdocs'),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant('Communication.confirmButtonText'),
      cancelButtonText: this.translate.instant('Communication.cancelButtonText')
    }).then((result) => {
      if (result.isConfirmed) {
        this._obj.trashjson = JSON.stringify(this._DeleteDocumentsIds);
        console.log(JSON.stringify(this._DeleteDocumentsIds), "Delete record ");

        // Uncomment to make the actual delete request
        this.service.DocumentsDelete(this._obj).subscribe(
          data => {
            console.log(data, "Deleted");
            // this.GACDocuments('', '', '', '', '', '', '', '', '');
            this.GACDocumentsArchive('', '', '', '', '', '', '', true);
          }
        );
      } else {
        this.GACDocumentList.forEach(elementI => {
          elementI["IsChecked"] = false;
        });
      }
    });
  }

  UpdateDocumentView(_status: boolean) {
    this._CheckedDocumentsIds = this.GACDocumentList
      .filter(item => item.IsChecked)
      .map(item => ({
        ShareId: item.ShareId,
        DocumentId: item.DocumentId,
        IsRead: _status
      }));

    if (this._CheckedDocumentsIds.length == 0) {
      alert('Please select Documents');
      return false;
    }
    // this.IsRead = this._CheckedDocumentsIds.length > 0 ? this._CheckedDocumentsIds[0].IsRead : false;

    this._obj.ReadUnreadjson = JSON.stringify(this._CheckedDocumentsIds);
    console.log(this._CheckedDocumentsIds, "Selected Value Read and Unread");

    this.service.UnReadDocument(this._obj).subscribe(
      data => {
        // console.log(data, "Unread")
        // this.GACDocuments('', '', '', '', '', '', '', '', '');
        this.GACDocumentsArchive('', '', '', '', '', '', '', true);
      }
    )
  }



  Singleselectcheckbox(DocumentId: number, ShareId: number, value: boolean) {
    // Update the IsChecked property for the specified document
    this.GACDocumentList.forEach(element => {
      if (element.DocumentId === DocumentId && ShareId == element.ShareId) {
        element.IsChecked = value;
        this.IsRead = element.IsRead;
      }
    });
  }

  AddLabelInDocuments() {

    const MemoIdsArray = [];
    this.GACDocumentList.forEach(element => {
      if (element.IsChecked) {
        MemoIdsArray.push(element.DocumentId);
      }
    });

    // Check if no documents are selected
    if (MemoIdsArray.length === 0) {
      alert('Please select Document');
      return; // Stop further execution
    }

    // Check if no labels are selected
    if (this._checkedLabelIds.length === 0) {
      alert('Please select label');
      return; // Stop further execution
    }


    this.serviceInbox.AddLabelToArchive(this._checkedLabelIds.toString(), MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
      data => {
        if (data["Message"] == "1") {
          // this.GACDocuments('', '', '', '', '', '', '', '', '');
          this.GACDocumentsArchive('', '', '', '', '', '', '', true);
          const language = localStorage.getItem('language');
          if (language === 'ar') {
            this._snackBar.open('تم وضع علامة على المذكرة بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          } else {
            this._snackBar.open('Document Tagged Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
            });
          }

        }
        else if (data["Message"] == "2") {
          const language = localStorage.getItem('language');

          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('مذكرة تم وضع علامة عليها بالفعل', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['red-snackbar']
            });
          } else {
            this._snackBar.open('Document Already Tagged', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['red-snackbar']
            });
          }

        }
        this.closeLabel();
      }
    )
  }

  closeLabel() {
    this.SelectLabel = [];
    this._checkedLabelIds = [];
    this.GACDocumentList.forEach(element => {
      element["IsChecked"] = false;
    });
    this._Lstlabels.forEach(elementI => {
      elementI["checked"] = false;
    });
    $("#div_filters").removeClass("show");
  }
  PinFavoriteDocuments(DocumentId: number, ShareId: number, isFavorite: boolean) {
    // this._FavoriteDocumentsIds = this.GACDocumentPinList
    //   .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    //   .map(document => ({
    //     ShareId: document.ShareId,
    //     DocumentId: document.DocumentId,
    //     IsFavorite: isFavorite ? false : true
    //   }));

    // this.GACDocumentPinList.forEach(document => {
    //   if (document.DocumentId === DocumentId && ShareId == document.ShareId) {
    //     document.IsFavorite = isFavorite ? false : true; // Toggle the favorite status
    //   }
    // });
    // this._obj.favoritejson = JSON.stringify(this._FavoriteDocumentsIds);
    // console.log('Favorite Documents:', JSON.stringify(this._FavoriteDocumentsIds));

    this.service.DocumentsArchiveFavorite(DocumentId,ShareId,isFavorite).subscribe(
      data => {
        this.GACDocumentPinList = [];
        // this.GACDocuments('', '', '', '', '', '', '', '', '');
        this.GACDocumentsArchive('', '', '', '', '', '', '', true);
      }
    );
  }

  FavoriteDocuments(DocumentId: number, ShareId: number, IsFavorite: boolean) {
    // this._FavoriteDocumentsIds = this.GACDocumentList
    //   .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    //   .map(document => ({
    //     ShareId: document.ShareId,
    //     DocumentId: document.DocumentId,
    //     IsFavorite: isFavorite ? false : true
    //   }));

    // this.GACDocumentList.forEach(document => {
    //   if (document.DocumentId === DocumentId && ShareId == document.ShareId) {
    //     document.IsFavorite = isFavorite ? false : true; // Toggle the favorite status
    //   }
    // });
    // this._obj.favoritejson = JSON.stringify(this._FavoriteDocumentsIds);
    // console.log('Favorite Documents:', JSON.stringify(this._FavoriteDocumentsIds));
    this.service.DocumentsArchiveFavorite(DocumentId,ShareId,IsFavorite).subscribe(
      data => {
        // this.GACDocuments('', '', '', '', '', '', '', '', '');
        this.GACDocumentsArchive('', '', '', '', '', '', '', true);
      }
    );
  }

  DocumentPin(DocumentId: number, ShareId: number, IsPin: boolean) {
    // this._PinDocumentsIds = this.GACDocumentList
    //   .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    //   .map(document => ({
    //     ShareId: document.ShareId,
    //     DocumentId: document.DocumentId,
    //     IsPin: IsPin
    //   }));

    // this.GACDocumentList.forEach(document => {
    //   if (document.DocumentId === DocumentId && ShareId == document.ShareId) {
    //     document.IsPin = IsPin; // Toggle the favorite status
    //   }
    // });
    // this._obj.Ispinjson = JSON.stringify(this._PinDocumentsIds);
    // console.log(JSON.stringify(this._PinDocumentsIds), "Pin value");
    this.service.PinArchiveDocuments(DocumentId,ShareId,IsPin).subscribe(
      data => {
        // this.GACDocuments('', '', '', '', '', '', '', '', '');
        this.GACDocumentsArchive('', '', '', '', '', '', '', true);
      }
    );
  }

  DocumentPins(DocumentId: number, ShareId: number, IsPin: boolean) {
    // this._PinDocumentsIds = this.GACDocumentPinList
    //   .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    //   .map(document => ({
    //     ShareId: document.ShareId,
    //     DocumentId: document.DocumentId,
    //     IsPin: IsPin
    //   }));

    // this.GACDocumentPinList.forEach(document => {
    //   if (document.DocumentId === DocumentId && ShareId == document.ShareId) {
    //     document.IsPin = IsPin; // Toggle the favorite status
    //   }
    // });
    // this._obj.Ispinjson = JSON.stringify(this._PinDocumentsIds);
    // console.log(JSON.stringify(this._PinDocumentsIds), "Pin value");
    this.service.PinArchiveDocuments(DocumentId,ShareId,IsPin).subscribe(
      data => {
        this.GACDocumentPinList = [];
        // this.GACDocuments('', '', '', '', '', '', '', '', '');
        this.GACDocumentsArchive('', '', '', '', '', '', '', true);
      }
    );
  }

  sideviw(name, documentid: string, referenceid: string, shareid: string) {
    var id = documentid + "," + referenceid + "," + shareid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}/${shareid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }

  loadAllCat() {
    (<HTMLInputElement>document.getElementById("ctrdv1")).style.display = "none";
    (<HTMLInputElement>document.getElementById("ctrdv2")).style.display = "none";
    var x = $(".showq").offset();
    window.scroll({
      top: x.top - 100,
      left: 0,
      behavior: 'smooth'
    });
  }

  // oncategorychange11(event) {
  //   let a = event.target.value;
  //   this.CategoryList.forEach(element => {
  //     if (element.CategoryId == a) {
  //       let chk = element.isChecked;
  //       if (chk == true) {
  //         element.isChecked = false;
  //       }
  //       else if (chk == false) {
  //         element.isChecked = true;
  //       }
  //     }
  //   });
  //   this.activePage = 1;
  //   // this.Pending = false;
  //   // this.Approval = false;
  //   // this.Reject = false;
  //   // this.toggle = false;
  //   // this.Select = false;
  //   // this.Expired = false;
  //   // this.selected = false;
  // }

  // removeCategory(CategoryId, event) {
  //   this.CategoryList.forEach(element => {
  //     if (element.CategoryId == CategoryId) {
  //       element.isChecked = false;
  //     }
  //   });
  //   event.target.value = this.CategoryList.filter(x => x.isChecked == true);
  //   this.FiltersData();
  // }

  oncategorychange11(event) {
    const a = event.target.value;
    this.CategoryList.forEach(element => {
      if (element.CategoryId == a) {
        element.isChecked = !element.isChecked;
      }
    });
    this.activePage = 1;
  }

  removeCategory(CategoryId, event) {
    this.CategoryList.forEach(element => {
      if (element.CategoryId == CategoryId) {
        element.isChecked = false;
      }
    });
    event.target.value = this.CategoryList.filter(x => x.isChecked == true);
    this.FiltersData();
  }

  FiltersData() {
    this.checkedCategoryIDs = [];
    this.checkedSourceIDs = [];
    this.checkedDocumentTypeIds = [];
    // this.checkedDistributorIDs = [];
    this.checkedManufactureIds = [];

    this.CategoryList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedCategoryIDs.push(value.CategoryId);
      }

      (<HTMLInputElement>document.getElementById("ctrdv1")).style.display = "block";
      (<HTMLInputElement>document.getElementById("ctrdv2")).style.display = "block";
    });

    this.SourceList.forEach((value, index) => {

      if (value.isChecked) {
        this.checkedSourceIDs.push(value.SourceId);
      }
      (<HTMLInputElement>document.getElementById("ctrdv3")).style.display = "block";
      (<HTMLInputElement>document.getElementById("ctrdv4")).style.display = "block";
    });
    this.DocumentTypeList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedDocumentTypeIds.push(value.DocumentTypeId);
      }

      (<HTMLInputElement>document.getElementById("ctrdv5")).style.display = "block";
      (<HTMLInputElement>document.getElementById("ctrdv6")).style.display = "block";
    });

    this.ManufactureList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedManufactureIds.push(value.DMId);
      }
      (<HTMLInputElement>document.getElementById("ctrdv9")).style.display = "block";
      (<HTMLInputElement>document.getElementById("ctrdv10")).style.display = "block";
    });

    // this.GACDocuments(
    //   this.checkedCategoryIDs.toString(),
    //   this.checkedSourceIDs.toString(),
    //   this.checkedDocumentTypeIds.toString(),
    //   this.checkedDistributorIDs.toString(),
    //   this.checkedManufactureIds.toString(), '', '', '', this.status
    // );
    this.GACDocumentsArchive(this.checkedCategoryIDs.toString(),
      this.checkedSourceIDs.toString(),
      this.checkedDocumentTypeIds.toString(),
      this.checkedDistributorIDs.toString(), '', '', this.status, true
    );
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    $(".filtsd").removeClass("show");
  }


  closedataloadSettings1() {
    this.catsearchtxt = "";
    this.submenusource = "";
    this.submenuDocument = "";
    this.subManufacture = "";
    $(".filtsd").removeClass("show");
    (<HTMLInputElement>document.getElementById("ctrdv1")).style.display = "block";
    (<HTMLInputElement>document.getElementById("ctrdv2")).style.display = "block";

    (<HTMLInputElement>document.getElementById("ctrdv3")).style.display = "block";
    (<HTMLInputElement>document.getElementById("ctrdv4")).style.display = "block";

    (<HTMLInputElement>document.getElementById("ctrdv5")).style.display = "block";
    (<HTMLInputElement>document.getElementById("ctrdv6")).style.display = "block";

    (<HTMLInputElement>document.getElementById("ctrdv9")).style.display = "block";
    (<HTMLInputElement>document.getElementById("ctrdv10")).style.display = "block";
  }



  oncategorychange(event) {
    this.activePage = 1;
    let a = event.target.value;
    // alert(event.target.value);

    this.CategoryList.forEach(element => {
      if (element.CategoryId == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });
    this.FiltersData();
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.selected = false;
  }


  loadAllCat11() {
    (<HTMLInputElement>document.getElementById("ctrdv3")).style.display = "none";
    (<HTMLInputElement>document.getElementById("ctrdv4")).style.display = "none";

    var b = $(".showq1").offset();
    window.scroll({
      top: b.top - 100,
      left: 0,
      behavior: 'smooth'
    });
  }
  loadAllCat22() {
    (<HTMLInputElement>document.getElementById("ctrdv5")).style.display = "none";
    (<HTMLInputElement>document.getElementById("ctrdv6")).style.display = "none";
    var c = $(".showq2").offset();
    window.scroll({
      top: c.top - 100,
      left: 0,
      behavior: 'smooth'
    });
  }
  loadAllCat33() {
    // document.getElementById("ctrdv7").style.display = "none";
    // document.getElementById("ctrdv8").style.display = "none";
    var d = $(".showq3").offset();
    window.scroll({
      top: d.top - 100,
      left: 0,
      behavior: 'smooth'
    });
  }
  loadAllCat44() {
    (<HTMLInputElement>document.getElementById("ctrdv9")).style.display = "none";
    (<HTMLInputElement>document.getElementById("ctrdv10")).style.display = "none";
    var e = $(".showq4").offset();
    window.scroll({
      top: e.top - 200,
      left: 0,
      behavior: 'smooth'
    });
  }

  onsourcechange22(event) {
    let a = event.target.value;
    this.SourceList.forEach(element => {
      if (element.SourceId == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });
    this.activePage = 1;
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.selected = false;
  }

  onsourcechange(event) {
    let a = event.target.value;
    this.SourceList.forEach(element => {
      if (element.SourceId == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });
    this.FiltersData();
    this.activePage = 1;
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.selected = false;
  }

  removeSource(SourceId, event) {
    this.SourceList.forEach(element => {
      if (element.SourceId == SourceId) {
        element.isChecked = false;
      }
    });
    event.target.value = this.SourceList.filter(x => x.isChecked == true);
    this.FiltersData();
  }



  ondocumenttypechange(event) {
    let a = event.target.value;
    this.DocumentTypeList.forEach(element => {
      if (element.DocumentTypeId == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });

    this.FiltersData();
    this.activePage = 1;
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.selected = false;
  }

  removeDocumentType(DocumentTypeId, event) {
    this.DocumentTypeList.forEach(element => {
      if (element.DocumentTypeId == DocumentTypeId) {
        element.isChecked = false;
      }
    });
    event.target.value = this.SourceList.filter(x => x.isChecked == true);
    this.FiltersData();
  }

  ondocumenttypechange33(event) {
    let a = event.target.value;
    this.DocumentTypeList.forEach(element => {
      if (element.DocumentTypeId == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });
    this.activePage = 1;
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.selected = false;
  }

  onmanufacturechange(event) {
    let a = event.target.value;
    // alert(event.target.value);
    this.ManufactureList.forEach(element => {
      // console.log(this.ManufactureList,"DM");
      if (element.DMId == a) {
        // alert(element.DMId);
        let chk = element.isChecked;
        if (chk == undefined || chk == true) {
          element.isChecked = false;
        }
        else if (chk == undefined || chk == false) {
          element.isChecked = true;
        }
      }
      // alert(element.isChecked);
    });
    this.FiltersData();
    this.activePage = 1;
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.selected = false;
  }

  removeManufacture(DMId, event) {
    this.ManufactureList.forEach(element => {
      if (element.DMId == DMId) {
        element.isChecked = false;
      }
    });
    event.target.value = this.ManufactureList.filter(x => x.isChecked == true);
    this.FiltersData();
  }
  onmanufacturechange55(event) {
    let a = event.target.value;
    this.ManufactureList.forEach(element => {
      if (element.DMId == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });
    this.activePage = 1;
    // this.Pending = false;
    // this.Approval = false;
    // this.Reject = false;
    // this.toggle = false;
    // this.Select = false;
    // this.Expired = false;
    // this.selected = false;
  }

  datesUpdated($event) {
    if (this.pipe.transform($event.startDate, 'longDate') != null) {
      this._StartDate = this.pipe.transform($event.startDate, 'longDate') + " " + "00:00 AM";
      this._EndDate = this.pipe.transform($event.endDate, 'longDate') + " " + "11:59 PM";
      // this.GACDocuments('', '', '', '', '', '', this._StartDate, this._EndDate, this.status);
      this.GACDocumentsArchive('', '', '', '', this._StartDate, this._EndDate, this.status, true);
      this.Pending = false;
      this.Approval = false;
      this.Reject = false;
      this.toggle = false;
      this.Select = false;
      this.Expired = false;
      this.clse_fltrs();
    }
  }

  clse_fltrs() {
    (<HTMLInputElement>document.getElementById("filter-doc")).classList.remove("show-filter");
    (<HTMLInputElement>document.getElementById("filter-doc-btn")).classList.remove("active");
  }

  scroll1() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  onstatus(_val) {
    if (_val == 'P') {
      this.Pending = true;
      this.Approval = false;
      this.Reject = false;
    }
    if (_val == 'V') {
      this.Pending = false;
      this.Approval = true;
      this.Reject = false;
    }

    if (_val == 'R') {
      this.Pending = false;
      this.Approval = false;
      this.Reject = true;
    }
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.status = _val;
    this.activePage = 1;
    // this.GACDocuments('', '', '', '', '', '', this._StartDate, this._EndDate, this.status);
    this.GACDocumentsArchive('', '', '', '', this._StartDate, this._EndDate, this.status, true);
    this.selected = "";
    this.ApprovalFilterSelected = _val === 'V';
    this.clse_fltrs();
    // alert(this.ApprovalFilterSelected);
  }

  // unreadDocumentsCount: number = 0;
  UnreadList() {
    $("#docunread").addClass("btn-active");
    $("#alldoc").removeClass("btn-active");
    this.GACDocumentsArchive('', '', '', '', '', '', '', false);
    // this.service.ListInUnread().subscribe(data => {
    //   console.log(data, "Unread List Data");
    //   this.GACDocumentList = data["Data"].UnReadJson;
    //   // this.unreadDocumentsCount = this.getUnreadDocumentsCount();
    //   // this.TotalrecordsList = this._obj.Data["TotalRecords"];
    //   this.TotalRecords = this.GACDocumentList.length;//this.TotalrecordsList[0].TotalRecords;
    //   if (this.GACDocumentList.length == 0) {
    //     this._CurrentpageRecords = 0;
    //     this.activePage = 0;
    //   } else {
    //     this._CurrentpageRecords = this.GACDocumentList.length;
    //   }
    // })
  }
  // getUnreadDocumentsCount(): number {
  //   return this.GACDocumentList.filter(doc => !doc.IsRead).length;
  // }

  AllDocuments() {
    $("#alldoc").addClass("btn-active");
    $("#docunread").removeClass("btn-active");
    // this.GACDocuments('', '', '', '', '', '', '', '', '');
    this.GACDocumentsArchive('', '', '', '', '', '', '', true);
  }
}
