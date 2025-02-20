import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';
import tippy from 'tippy.js';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LabelDTO } from '../../_models/label-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { InboxDTO } from 'src/app/_models/inboxdto';

@Component({
  selector: 'app-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.css'],

})
export class SearchDocumentComponent implements OnInit {
  _obj: GACFiledto;
  _obj1: InboxDTO;

  GACDocumentList: any = [];
  SharedwithmeList: any;
  SharedbymeList: any;
  TotalrecordsList: any;
  DocumentList: any;
  ReferenceList: any;
  UploadedList: any;
  _Lstlabels: any = [];
  _Search: string;
  labelid: number;
  LabelCount: number;
  ApprovalFilterSelected: boolean = false;
  PhysicalShareToList: any;
  PhysicalShareFromList: any;
  ShareWithMeList: any;
  _CurrentpageRecords: number
  ElectronicDocumentShare: any;
  activePage: number;
  CompanyList: any;
  DepartmentList: any;
  LabelsJsondata: any[] = [];
  DocumentTypeList: any;
  DistributorList: any;
  ManufactureList: any;
  CategoryList: any;
  SubCategoryList: any;
  SourceList: any;
  txtSearch: string;
  catsearchtxt: string;
  source: string;
  txtMainSearch: string;
  Document: string;
  Distributor: string;
  Manufacture: string;
  subManufacture: string;
  submenuDistributor: string;
  submenuDocument: string;
  submenusource: string;
  status: string = '';
  _FavoriteDocumentsIds = [] = [];
  _DeleteDocumentsIds: number[] = [];
  _PinDocumentsIds = [] = [];
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  CategoryName: any;
  isChecked: any;
  _cat: any;
  checkboxes: any;
  occupations: string;
  CategoryIds: any;
  SourceIds: any;
  DocumentTypeIds: any;
  DistributorIds: any;
  ManufactureIds: any;
  DocumentSearchText: any;
  TotalRecords: number;
  pickerDirective: any;
  LastPage: number;
  lastPagerecords: number;
  toggle: Boolean = false;
  Select: Boolean = false;
  Expired: Boolean = false
  Pending: Boolean = false;
  Approval: Boolean = false;
  Reject: Boolean = false;
  txt00: string;
  txt11: string;
  txt22: string;
  PageSize: number;
  PageNumber: number;
  LabelText:string;
  _SelectAllCheckBox: boolean = false;
  _TrashList:any = [];
  _CheckedDocumentsIds: number[] = [];
  IsRead: boolean = false; // or false based on your condition
  _UnRead_Parameter: boolean = false;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  SelectedOption: number;
  SelectedOptionText: string;
  checkedCategoryIDs: any;
  checkedSourceIDs = [];
  checkedDocumentTypeIds = [];
  checkedDistributorIDs = [];
  checkedManufactureIds = [];
  selected: any;
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  _StartDate: string = '';
  _EndDate: string = '';
  LoginUserId: number;
  GacSearch: string;
  _DocumentId: number;
  tooltipContent: string;
  tooltipContentNextPage: string;
  tooltipContentPreviosepage: string;
  tooltipContentFilters: string;
  //selected: { startDate: Moment, endDate: Moment };
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  pipe = new DatePipe('en-US');
  ImageUrl: string;
  Recordsperpage: string;
  constructor(public service: GACFileService,
    public serviceL: InboxService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {
    this._obj = new GACFiledto();
    this._obj1 = new InboxDTO();
    this.catsearchtxt = "";
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._Search = "";
    this.alwaysShowCalendars = true;
    this.PageSize = 20;
    this.ImageUrl = environment.ImageUrl;

    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.GacSearch = lang === 'en' ? 'Search....' : 'يبحث....';
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      if (lang === 'en') {
        this.tooltipContent = 'Clear Filters';
      } else if (lang === 'ar') {
        this.tooltipContent = 'مسح الفلاتر';
      } else {
        // Default tooltip content if language is not specified
        this.tooltipContent = 'Clear Filters';
      }

      const tooltipInstances = tippy('.tips');
      tooltipInstances.forEach(instance => {
        instance.setContent(this.tooltipContent);
      });

      if (lang === 'en') {
        this.tooltipContentNextPage = 'Next Page';
      } else if (lang === 'ar') {
        this.tooltipContentNextPage = 'الصفحة التالية';
      } else {
        this.tooltipContentNextPage = 'Next Page';
      }

      // Update the tooltip content dynamically
      const tooltipInstancesNextpage = tippy('.tipsNextpage');
      tooltipInstancesNextpage.forEach(instance => {
        instance.setContent(this.tooltipContentNextPage);
      });

      if (lang === 'en') {
        this.tooltipContentPreviosepage = 'Previose page';
      } else if (lang === 'ar') {
        this.tooltipContentPreviosepage = 'الصفحة السابقة';
      } else {
        this.tooltipContentPreviosepage = 'Previose page';
      }

      const tooltipInstancesPreviosepage = tippy('.tipsPreviosepage');
      tooltipInstancesPreviosepage.forEach(instance => {
        instance.setContent(this.tooltipContentPreviosepage);
      });

      if (lang === 'en') {
        this.tooltipContentFilters = 'Filters';
      } else if (lang === 'ar') {
        this.tooltipContentFilters = 'المرشحات';
      } else {
        this.tooltipContentFilters = 'Filters';
      }

      const tooltipInstancesFilters = tippy('.tipsFilters');
      tooltipInstancesFilters.forEach(instance => {
        instance.setContent(this.tooltipContentFilters);
      });

      this.translate.getTranslation(lang).subscribe(translations => {
        // Access translated title content
        this.Recordsperpage = translations.Masterform.Recordsperpagetitle;
      });
    })
  }
  datesUpdated($event) {
    if (this.pipe.transform($event.startDate, 'longDate') != null) {
      this._StartDate = this.pipe.transform($event.startDate, 'longDate') + " " + "00:00 AM";
      this._EndDate = this.pipe.transform($event.endDate, 'longDate') + " " + "11:59 PM";
      this.GACDocuments('', '', '', '', '', '', this._StartDate, this._EndDate, this.status);
      this.Pending = false;
      this.Approval = false;
      this.Reject = false;
      this.toggle = false;
      this.Select = false;
      this.Expired = false;
      this.clse_fltrs();
    }

  }
  // startDateClicked($event) {
  //   //alert(moment($event.startDate._d).add(1, 'month'));
  //   this._StartDate=moment($event.startDate._d).add(1, 'month').toString();
  // }
  // endDateClicked($event) {
  //   //alert(moment($event.endDate._d).subtract(1, 'month'));
  //   this._EndDate=moment($event.endDate._d).subtract(1, 'month').toString();
  // }
  // rangeClicked($event){

  // this._StartDate=this.pipe.transform($event.dates[0], 'shortDate');
  // this._EndDate=this.pipe.transform($event.dates[1], 'shortDate');
  // }
  ViewText() {
    if (this.SelectedOption == 1) {
      $('#search-dropdown').addClass('d-block');
      $('.menu-tt').removeClass('show');
    }

  }
  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.GacSearch = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.activePage = 1;
    this.PageNumber = 1;
    this.SelectedOptionText = "All";
    this.SelectedOption = 1;
    this.LoginUserId = this.currentUserValue.createdby;
    this.GACDocuments('', '', '', '', '', '', '', '', '');
    this.GetLables();
    this.GacDocumentFilters();
    $(document).on('click', 'body', function (e) {
      // hiding search bar
      if ($(e.target).closest('#top-search').length !== 1) {
        $('#search-dropdown').removeClass('d-block');
      }
    });
    this.catsearchtxt = "";

    // hide search on opening other dropdown
    $('.dropdown-toggle').on('click', function () {
      $('#search-dropdown').removeClass('d-block');
    });

    window.addEventListener("load", function (event) {

      var filist = 6;
      $('.item-c').children(":nth-child(n+" + (filist + 1) + ")").not(".showq").hide();

      // if ($("div.item-c").children().not(".show").length > threshold) {
      //   $(".show.more").css("display", "flex");
      // }


      var threshold = 2;

      $('.item-b').children(":nth-child(n+" + (threshold + 1) + ")").not(".show").hide();

      if ($("div.item-b").children().not(".show").length > threshold) {
        $(".show.more").css("display", "flex");
      }


      $(".show.more").on("click", function () {
        $(this).parent().children().not(".show").css("display", "flex");
        $(this).parent().find(".show.less").css("display", "flex");
        $(this).hide();
      });

      $(".show.less").on("click", function () {
        $('.item-b').children(":nth-child(n+" + (threshold + 1) + ")").not(".show").hide();
        $(this).parent().find(".show.more").css("display", "flex");
        $(this).hide();
      });

    });

    // $(document).on('click', function (e) {
    //   if (!$(e.target).closest('.filtsd').length) {
    //     document.getElementById("ctrdv1").style.display = "block";
    //     document.getElementById("ctrdv2").style.display = "block";

    //     document.getElementById("ctrdv3").style.display = "block";
    //     document.getElementById("ctrdv4").style.display = "block";

    //     document.getElementById("ctrdv5").style.display = "block";
    //     document.getElementById("ctrdv6").style.display = "block";

    //     //  document.getElementById("ctrdv7").style.display = "block";
    //     // document.getElementById("ctrdv8").style.display = "block";

    //     document.getElementById("ctrdv9").style.display = "block";
    //     document.getElementById("ctrdv10").style.display = "block";

    //   }

    // });

    $(window).on('scroll', function () {
      if ($(this).scrollTop() > 100) {
        $('.btn-nav').fadeIn();
      } else {
        $('.btn-nav').fadeOut();
      }
    });

    if (lang === 'en') {
      this.tooltipContent = 'Clear Filters';
    } else if (lang === 'ar') {
      this.tooltipContent = 'مسح الفلاتر';
    } else {
      // Default tooltip content if language is not specified
      this.tooltipContent = 'Clear Filters';
    }


    const tooltipInstances = tippy('.tips');
    tooltipInstances.forEach(instance => {
      instance.setContent(this.tooltipContent);
    });

    if (lang === 'en') {
      this.tooltipContentNextPage = 'Next Page';
    } else if (lang === 'ar') {
      this.tooltipContentNextPage = 'الصفحة التالية';
    } else {
      this.tooltipContentNextPage = 'Next Page';
    }

    // Update the tooltip content dynamically
    const tooltipInstancesNextpage = tippy('.tipsNextpage');
    tooltipInstancesNextpage.forEach(instance => {
      instance.setContent(this.tooltipContentNextPage);
    });

    if (lang === 'en') {
      this.tooltipContentPreviosepage = 'Previose page';
    } else if (lang === 'ar') {
      this.tooltipContentPreviosepage = 'الصفحة السابقة';
    } else {
      this.tooltipContentPreviosepage = 'Previose page';
    }

    const tooltipInstancesPreviosepage = tippy('.tipsPreviosepage');
    tooltipInstancesPreviosepage.forEach(instance => {
      instance.setContent(this.tooltipContentPreviosepage);
    });

    if (lang === 'en') {
      this.tooltipContentFilters = 'Filters';
    } else if (lang === 'ar') {
      this.tooltipContentFilters = 'المرشحات';
    } else {
      this.tooltipContentFilters = 'Filters';
    }

    const tooltipInstancesFilters = tippy('.tipsFilters');
    tooltipInstancesFilters.forEach(instance => {
      instance.setContent(this.tooltipContentFilters);
    });
    tippy('.tips', {
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      animateFill: true,
      inertia: true,
      content: this.tooltipContent // Set initial tooltip content
    });

    tippy('.tipsNextpage', {
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true,
      content: this.tooltipContentNextPage // Set initial tooltip content
    });

    tippy('.tipsPreviosepage', {
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true,
      content: this.tooltipContentPreviosepage // Set initial tooltip content
    });


    tippy('.tipsFilters', {
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true,
      content: this.tooltipContentFilters // Set initial tooltip content
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      // Access translated title content
      this.Recordsperpage = translations.Masterform.Recordsperpagetitle;
    });
  }
  selectedfilter(selectedvalue) {
    if (selectedvalue == 1)
      this.SelectedOptionText = 'All';
    else if (selectedvalue == 2)
      this.SelectedOptionText = 'Category';
    else if (selectedvalue == 3)
      this.SelectedOptionText = 'Document Type';
    else if (selectedvalue == 4)
      this.SelectedOptionText = 'Source';
    else if (selectedvalue == 5)
      this.SelectedOptionText = 'Distributor';
    else if (selectedvalue == 6)
      this.SelectedOptionText = 'Manufacture';

    this.SelectedOption = selectedvalue;
  }
  NoDocumentdata: boolean = false;
  _IsRead: boolean = false;
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
        // console.log(data,"searchdata")
        this._obj = data as GACFiledto;
        this.GACDocumentList = this._obj.Data["GACDocumentList"];
        // this._IsRead = this.GACDocumentList.map(doc => doc.IsRead);
        // console.log(this._IsRead, "Unread List");
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
    // console.log(this.PageNumber);
    this.GACDocuments('', '', '', '', '', '', '', '', '');

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
    this.GACDocuments('', '', '', '', '', '', this._StartDate, this._EndDate, this.status);
    this.selected = "";
    this.ApprovalFilterSelected = _val === 'V';
    this.clse_fltrs();
    // alert(this.ApprovalFilterSelected);
  }


  oncolor() {
    $('#myelement').addClass('.fil-selected');
    $('#myelement').removeClass('.fil-selected');
    // $('#MainMenu div.fil-selected').removeClass('fil-selected');
    // $(this).addClass('fil-selected');
    // $("div").addClass("fil-selected");
    // $("div").removeClass("fil-selected");

    // $( ".fil-selected" ).removeClass( ".fil-selected" ).addClass( ".fil-selected" );
    // $(this).addClass('fil-selected').siblings('.fil-selected').removeClass('fil-selected');
    // $(this).addClass('fil-selected');
    // $(this).removeClass('fil-selected');
  }

  GetLables() {
    this._obj1.UserId = this.currentUserValue.createdby;
    this.serviceL.UserLabels(this._obj1)
      .subscribe(data => {
        this._Lstlabels = data["Data"].LablesJson;
        this.LabelCount = this._Lstlabels.length;
        this.cd.detectChanges();
      });
  }
  _checkedLabelIds: any = [];
  SelectLabel: any[];
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
  AddLabels() {
    var __labelname = (<HTMLInputElement>document.getElementById("txtlabels")).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelName = __labelname;
    this._obj1.LabelId = 0;
    this._obj1.FlagId = 1;
    this._obj1.IsActive = true;
    this.serviceL.AddLabels(this._obj1)
      .subscribe(data => {
        console.log(data, "Insert Label")
        if (data['Message'] == true) {
          this._Lstlabels = data['Data'].LablesJson;
          console.log(this.LabelsJsondata, "Label List");
          const language = localStorage.getItem('language');
          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم إنشاء التصنيف بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          } else {
            this._snackBar.open('Label Create Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          }
          this.cd.detectChanges();
          this.GetLables();
          (<HTMLInputElement>document.getElementById("txtlabels")).value = "";
        }
        else if (data['Message'] == false) {
          const language = localStorage.getItem('language');
          if (language === 'ar') {
            this._snackBar.open('هناك خطأ ما', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          } else {
            this._snackBar.open('Something went wrong', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          }
        }
      });
  }
  UpdateLabel(labelid: number) {

    var __labelname = (<HTMLInputElement>document.getElementById("txteditlabels_" + labelid)).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelName = __labelname;
    this._obj1.LabelId = labelid;
    this._obj1.FlagId = 2;

    this.serviceL.AddLabels(this._obj1)
      .subscribe(data => {
        // this._obj = data as InboxDTO;
        // var _labelsJson = JSON.parse(this._obj.LablesJson);
        2//this._objds.labelsdrp = _labelsJson;
        this._Lstlabels = data["Data"]["LablesJson"]
        // send message to subscribers via observable subject
        1//this.ds.sendData(this._objds);
        this.cd.detectChanges();
      });
  }

  fordelete(lblid) {
    this.labelid = lblid;
  }
  LabelsRemove() {
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelId = this.labelid;
    this.serviceL.DeleteUserLabels(this._obj1)
      .subscribe(data => {
        this._Lstlabels = data["Data"]["LablesJson"];
        console.log(this._Lstlabels, "Remove Label");
        this.LabelCount = this._Lstlabels.length;
        this.cd.detectChanges();
      });
  }
  CreateNewLabel() {
    var __labelname = (<HTMLInputElement>document.getElementById("txtcreateNewLabel")).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelName = __labelname;
    this._obj1.LabelId = 0;
    this._obj1.FlagId = 1;
    this.serviceL.AddLabels(this._obj1)
      .subscribe(data => {
        this._Lstlabels = data["Data"].LablesJson;
        this.cd.detectChanges();
        (<HTMLInputElement>document.getElementById("txtcreateNewLabel")).value = "";
        this.GetLables();
      });
  }
  More() {
    $('.kt-nav__item').removeClass('d-none');
    $('.kt-db-vm').addClass('d-none');
  }
  LabelActivaleclass() {
    $('.kt-cnt-v').addClass('d-none');
    $('.label-height').addClass('active');
  }
  onsharedme() {
    this.activePage = 1;
    this.toggle = true;
    this.Select = false;
    this.Expired = false;
    this.service.GetSharedwithMeDocumentsList()
      .subscribe(data => {
        // console.log(data, "hello");
        this._obj = data as GACFiledto;
        this.GACDocumentList = this._obj.Data['SharedWithMeList']

      });
    this.selected = "";
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.clse_fltrs();
  }

  onsharedby() {
    this.activePage = 1;
    this.Select = true;
    this.Expired = false;
    this.toggle = false;
    this.service.GetSharebymeList().subscribe(data => {
      this._obj = data as GACFiledto;
      this.GACDocumentList = this._obj.Data['SharedByMeList'];
      //  alert(this.NoSharedByMe.length);
    });
    this.selected = "";
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.clse_fltrs();
  }
  OnSharedExpired() {
    this.activePage = 1;
    this.Expired = true
    this.Select = false;
    this.toggle = false;
    this.selected = "";
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.service.GetSharebymeExpiredDocumentList().subscribe(data => {
      this._obj = data as GACFiledto;
      this.GACDocumentList = this._obj.Data['SharedByMeExpiredList'];
    });
    this.clse_fltrs();
  }
  // SerchGacDocument() {
  //   this.GACDocuments('', '', '', '', '', '', '', '', '');
  // }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtMainSearch")).value;
    this._Search = newValue;
    this.GACDocuments('', '', '', '', '', '', '', '', this.status);
  }
  RebindingSeachDocument() {
    this.txtMainSearch = "";
    this.OnClear();
  }
  Searchighlight() {
    (<HTMLInputElement>document.getElementById("search-grp")).classList.add("group-active");
  }

  IconSearch() {
    if (this._Search === "") {
      (<HTMLInputElement>document.getElementById("txtMainSearch")).focus();
      (<HTMLInputElement>document.getElementById("search-grp")).classList.add("group-active");
    } else {
      this.GACDocuments('', '', '', '', '', '', '', '', this.status);
    }
  }

  onBackspace(event: KeyboardEvent) {
    if (event.key === "Backspace" && this._Search === "") {
      this.OnClear();
    }
  }
  clearshow() {
    (<HTMLInputElement>document.getElementById("clrr-btn")).classList.remove("d-none");
  }
  clearhide() {
    (<HTMLInputElement>document.getElementById("clrr-btn")).classList.add("d-none");
  }
  open_fltrs() {
    (<HTMLInputElement>document.getElementById("filter-doc")).classList.add("show-filter");
    (<HTMLInputElement>document.getElementById("filter-doc-btn")).classList.add("active");
  }
  clse_fltrs() {
    alert(1);
    (<HTMLInputElement>document.getElementById("filter-doc")).classList.remove("show-filter");
    (<HTMLInputElement>document.getElementById("filter-doc-btn")).classList.remove("active");
  }
  list_view() {
    (<HTMLInputElement>document.getElementById("grid-btn")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("doc-view")).classList.add("doc-list");
    (<HTMLInputElement>document.getElementById("doc-view")).classList.remove("doc-grid");
    (<HTMLInputElement>document.getElementById("list-btn")).classList.add("active");
  }
  grid_view() {
    (<HTMLInputElement>document.getElementById("list-btn")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("grid-btn")).classList.add("active");
    (<HTMLInputElement>document.getElementById("doc-view")).classList.remove("doc-list");
    (<HTMLInputElement>document.getElementById("doc-view")).classList.add("doc-grid");
  }
  view_doc() {
    (<HTMLInputElement>document.getElementById("document-view")).classList.add("show");
  }
  view_doc_close() {
    (<HTMLInputElement>document.getElementById("document-view")).classList.remove("show");
  }
  GacDocumentFilters() {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this.service.GetDropdownList(this._obj)
      .subscribe(data => {
        this._obj = data as GACFiledto;
        this.CompanyList = this._obj.Data["CompanyJson"];
        this.DepartmentList = this._obj.Data["DepartmentJson"];
        this.DocumentTypeList = this._obj.Data["DocumentTypeJson"];
        // this.DistributorList = this._obj.Data["DistributorJson"];
        this.ManufactureList = this._obj.Data["DistributorAndManufactureJson"];
        this.CategoryList = this._obj.Data["CategoryJson"];
        this.SourceList = this._obj.Data["SourceJson"];
      });

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
  removeCategory(CategoryId, event) {
    this.CategoryList.forEach(element => {
      if (element.CategoryId == CategoryId) {
        element.isChecked = false;
      }
    });
    event.target.value = this.CategoryList.filter(x => x.isChecked == true);
    this.FiltersData();
  }
  oncategorychange11(event) {
    let a = event.target.value;
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
      // this.FiltersData(); 
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
  // ondistributorchange(event) {
  //   let a = event.target.value;
  //   this.DistributorList.forEach(element => {
  //     if (element.DMId == a) {
  //       let chk = element.isChecked;
  //       if (chk == true) {
  //         element.isChecked = false;
  //       }
  //       else if (chk == false) {
  //         element.isChecked = true;
  //       }
  //     }
  //   });
  //   this.FiltersData();
  //   this.activePage = 1;
  //   this.Pending = false;
  //   this.Approval = false;
  //   this.Reject = false;
  //   this.toggle = false;
  //   this.Select = false;
  //   this.Expired = false;
  //   this.selected = false;
  // }
  // ondistributorchange44(event) {
  //   let a = event.target.value;
  //   this.DistributorList.forEach(element => {
  //     if (element.DMId == a) {
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
  //   this.Pending = false;
  //   this.Approval = false;
  //   this.Reject = false;
  //   this.toggle = false;
  //   this.Select = false;
  //   this.Expired = false;
  //   this.selected = false;
  // }
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
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.selected = false;
  }
  clearfilterData() {
    this.GACDocuments('', '', '', '', '', '', '', '', '');
    // this.GacDocumentFilters();
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

    // this.DistributorList.forEach((value, index) => {
    //   if (value.isChecked) {
    //     this.checkedDistributorIDs.push(value.DMId);
    //   }
    //   document.getElementById("ctrdv7").style.display = "block";
    //   document.getElementById("ctrdv8").style.display = "block";
    // });

    this.ManufactureList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedManufactureIds.push(value.DMId);
      }
      (<HTMLInputElement>document.getElementById("ctrdv9")).style.display = "block";
      (<HTMLInputElement>document.getElementById("ctrdv10")).style.display = "block";
    });

    this.GACDocuments(
      this.checkedCategoryIDs.toString(),
      this.checkedSourceIDs.toString(),
      this.checkedDocumentTypeIds.toString(),
      this.checkedDistributorIDs.toString(),
      this.checkedManufactureIds.toString(), '', '', '', this.status
    );
    // document.getElementById("ctrdv1").classList.add("d-block");
    // document.getElementById("ctrdv2").classList.add("d-block");
    // $("#div_filters").removeClass("show");
    // document.getElementById("ctrdv1").style.display = "none";
    // this. closedataloadSettings1()
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    $(".filtsd").removeClass("show");

  }
  // closeInfo() {
  //   // document.getElementById("kt-pdf").classList.remove("kt-quick-panel--on");
  //   //document.getElementById("scrd").classList.remove("position-fixed");
  //   document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block", "opacity-1");
  // }

  sideviw(name, documentid: string, referenceid: string, shareid: string) {
    var id = documentid + "," + referenceid + "," + shareid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}/${shareid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();

    // this._obj.DocumentId = parseInt(documentid);
    // this._obj.ReferenceId = parseInt(referenceid);

    // this.service.GACDocumentDetails(this._obj)
    //   .subscribe(data => {
    //     this._obj = data as GACFiledto;
    //     
    //     this.DocumentList = this._obj.Data["DocumentList"];

    //     // this.SourceList=this.DocumentList[0].SourceJson;
    //     // this.ManufactureList=this.DocumentList[0].ManufactureJson;
    //     // this.DistributorList=this.DocumentList[0].DistributorJson;

    //     this.ReferenceList = this._obj.Data["ReferenceList"];
    //     this.UploadedList = this._obj.Data["UploadedList"];
    //     this.PhysicalShareToList = this._obj.Data["PhysicalShareToList"];
    //     this.PhysicalShareFromList = this._obj.Data["PhysicalShareFromList"];
    //     this.ShareWithMeList = this._obj.Data["ShareWithMeList"];
    //     this.ElectronicDocumentShare = this._obj.Data["ElectronicDocumentShare"];
    //     document.getElementById("kt-pdf").classList.add("kt-quick-panel--on");
    //     document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block", "opacity-1");
    //     //document.getElementById("scrd").classList.add("position-fixed");
    //   });
  }
  closedataloadSettings() {
    $("#div_filters").removeClass("show");
  }

  OnClear() {
    alert(1);
    this.activePage = 1;
    this.txtMainSearch = "";
    this._Search = "";
    this._obj = new GACFiledto();
    this.SelectedOptionText = "All";
    this.SelectedOption = 1;
    this.GACDocuments('', '', '', '', '', '', '', '', '');
    this.GacDocumentFilters();
    this.selected = false;
    this.toggle = false;
    this.Select = false;
    this.Expired = false;
    this.Pending = false;
    this.Approval = false;
    this.Reject = false;

  }

  closedataloadSettings1() {
    $(".filtsd").removeClass("show");
    // document.getElementById("ctrdv1").classList.add("d-block");
    // document.getElementById("ctrdv2").classList.add("d-block");
    (<HTMLInputElement>document.getElementById("ctrdv1")).style.display = "block";
    (<HTMLInputElement>document.getElementById("ctrdv2")).style.display = "block";

    (<HTMLInputElement>document.getElementById("ctrdv3")).style.display = "block";
    (<HTMLInputElement>document.getElementById("ctrdv4")).style.display = "block";

    (<HTMLInputElement>document.getElementById("ctrdv5")).style.display = "block";
    (<HTMLInputElement>document.getElementById("ctrdv6")).style.display = "block";

    // document.getElementById("ctrdv7").style.display = "block";
    // document.getElementById("ctrdv8").style.display = "block";

    (<HTMLInputElement>document.getElementById("ctrdv9")).style.display = "block";
    (<HTMLInputElement>document.getElementById("ctrdv10")).style.display = "block";
  }
  loadAllCat() {
    // document.getElementById("ctrdv1").classList.add("d-none");
    // document.getElementById("ctrdv2").classList.add("d-none");
    //document.getElementById("ctra").classList.add("d-none");
    (<HTMLInputElement>document.getElementById("ctrdv1")).style.display = "none";
    (<HTMLInputElement>document.getElementById("ctrdv2")).style.display = "none";
    var x = $(".showq").offset();

    window.scroll({
      top: x.top - 100,
      left: 0,
      behavior: 'smooth'
    });

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

  scroll1() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


  // selectAllcheckbox() {

  //   for (let document of this.GACDocumentList) {
  //     document.IsChecked = this._SelectAllCheckBox;
  //   }

  // }


  Singleselectcheckbox(DocumentId: number,ShareId:number, value: boolean) {
    // Update the IsChecked property for the specified document
    this.GACDocumentList.forEach(element => {
      if (element.DocumentId === DocumentId && ShareId == element.ShareId) {
        element.IsChecked = value;
        this.IsRead = element.IsRead;
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
        this.GACDocuments('', '', '', '', '', '', '', '', '');
      }
    )
    this._SelectAllCheckBox = false;
  }

 
  DocumentPin(DocumentId: number,ShareId:number, IsPin: boolean) {
    this._PinDocumentsIds = this.GACDocumentList
    .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    .map(document => ({
      ShareId: document.ShareId,
      DocumentId: document.DocumentId,
      IsPin: IsPin
    }));

    this.GACDocumentList.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId ) {
        document.IsPin = IsPin; // Toggle the favorite status
      }
    });
    this._obj.Ispinjson = JSON.stringify(this._PinDocumentsIds);
    console.log(JSON.stringify(this._PinDocumentsIds), "Pin value");
    this.service.PinDocuments(this._obj).subscribe(
      data => {
        this.GACDocuments('', '', '', '', '', '', '', '', '');
      }
    );
  }

  FavoriteDocuments(DocumentId: number,   ShareId:number,  isFavorite: boolean) {
    this._FavoriteDocumentsIds = this.GACDocumentList
    .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    .map(document => ({
      ShareId: document.ShareId,
      DocumentId: document.DocumentId,
      IsFavorite: isFavorite ? false : true
    }));

    this.GACDocumentList.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId ) {
        document.IsFavorite = isFavorite ? false : true; // Toggle the favorite status
      }
    });
    this._obj.favoritejson = JSON.stringify(this._FavoriteDocumentsIds);
    console.log('Favorite Documents:', JSON.stringify(this._FavoriteDocumentsIds));
    this.service.DocumentsFavorite(this._obj).subscribe(
      data => {
        this.GACDocuments('', '', '', '', '', '', '', '', '');
      }
    );
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
    this._obj.trashjson = JSON.stringify(this._DeleteDocumentsIds);
    console.log(JSON.stringify(this._DeleteDocumentsIds), "Delete record ");
  
    // Uncomment to make the actual delete request
    this.service.DocumentsDelete(this._obj).subscribe(
      data => {
        console.log(data, "Deleted");
        this.GACDocuments('', '', '', '', '', '', '', '', '');
      }
    );
  }

  TrashList(){
    this.service.ListInTrash().subscribe(
      data => {
      this._TrashList = data["Data"].TrashJson;
      console.log(this._TrashList, "Trash List");
      }
    );
  }



  InitialLoadFilters(_val: boolean) {
    this._UnRead_Parameter = _val;
    this._SelectAllCheckBox = false;

  }






  // selectAllcheckbox() { // Select All Checkbox functionality 
  //   for (let value of Object.values(this.GACDocumentList)) {
  //     value['IsChecked'] = this._SelectAllCheckBox;
  //   }
  //   this._CheckedDocumentsIds = this.GACDocumentList.filter((value, index) => {
  //     return value['IsChecked'] == true;
  //   });
  //   console.log(this._CheckedDocumentsIds ,"All Checkbox value");
  // }





  // Singleselectcheckbox(DocumentId, value) { // Select single Checkbox functionality 

  //   if (value == false) this._SelectAllCheckBox = false;
  //   this.GACDocumentList.forEach(element => {
  //     if (element.DocumentId == DocumentId) {
  //       element["IsChecked"] = value;
  //       return true;
  //     }
  //   });
  //   this._CheckedDocumentsIds = this.GACDocumentList.filter((value, index) => {
  //     return value['IsChecked'] == true;
  //   });

  //  console.log(this._CheckedDocumentsIds ,"Single check value");
  //  let _truecount = 0;
  //  let _falsecount = 0;
  //  this._CheckedDocumentsIds.forEach(element => {
  //    if (element.MailView) {
  //      //click on read memo
  //      //unread purpose
  //      _truecount = _truecount + 1;
  //    }
  //    else {
  //      //click on un read memo
  //      //read purpose
  //      _falsecount = _falsecount + 1;
  //    }
  //  });
  //  if (_falsecount > 0) {
  //    this.MemoView = true;
  //  }
  //  else {
  //    this.MemoView = false;
  //  }
  // }


  AddMemostoLabels() {

  }
}
