import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { BehaviorSubject, Observable, Subscription, Subject, interval } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { Dataservicedto } from 'src/app/_models/dataservicedto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import { DataServiceService } from 'src/app/_service/data-service.service';
import { SpinnerService } from 'src/app/_helpers/spinner.service';
import Localbase from 'localbase'
import { MatSnackBar } from '@angular/material/snack-bar';

//import { filter } from 'rxjs/operators';

let db = new Localbase('pwa-database')

declare var $: any;

@Component({
  selector: 'app-handover',
  templateUrl: './handover.component.html',
  styleUrls: ['./handover.component.css']
})
export class HandoverComponent implements OnInit {
  searchText: string;
  SelectLabel: any[];
  MailIds: any;
  objArray: any = []
  spinnerStyle = Spinkit;
  _obj: InboxDTO;
  _objds: Dataservicedto;
  check: boolean = false;
  MemoIdsArray: any[];
  public _LstFilters: any;
  _LstToMemos: InboxDTO[];
  _dummy: InboxDTO[];
  _LstNewMemos: InboxDTO[];
  _LstUsers: any;
  _LstMemoStatus: any;
  _LstTotalRecords: any;
  public _LstRead: any;
  public _LstUnRead: any;
  TotalRecords: number;
  FiltersSelected: boolean;
  activePage: number;
  companyid: number
  fromuserid: number;
  _pageSize: number;
  _all: boolean;
  _Filters: string;
  _OrderType: string;
  _filtervalues: string;
  _Search: string;
  _CurrentpageRecords: number;
  _MemoDetailsJson: any
  _ToUserMemo: any;
  _CCUserMemo: any;
  _MemoDocuments: any;
  _ReplyList: any;
  _Isfilters: boolean
  _MemoIds: any;
  // UnRead: boolean = true;
  MemoView: boolean = false;
  //@Output() bindCompany = new EventEmitter<any>();
  _LstCompaniesTO: any;
  showSpinner: boolean;
  txtSearch: string;
  //exampleChild: string = "Hello Angular Boy...!";
  InboxType: string;
  _filtersMessage: string;
  _filtersMessage2: string;
  _OrderBy: string;
  LastPage: number;
  lastPagerecords: number;
  PageSize: number;
  LabelSelect: []
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  returnUrl: string;
  subscription: Subscription;
  CheckLabel: any;
  // pageOfItems: Array<any>;
  items = [];
  intervalId: number;
  checkeduserIDs: any;
  checkedcompanyIDs = [];
  checkedStatus = [];
  _checkedMailIds = [];
  checked: any;


  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    return this.currentUserSubject.value[0];

  }
  _checkedLabelIds: any = [];
  constructor(
    // private route: ActivatedRoute,
    // private router: Router,
    private inboxService: InboxService,
    private cd: ChangeDetectorRef
    //, private dbService: NgxIndexedDBService
    , private ds: DataServiceService
    , private spinnerService: SpinnerService
    , private _snackBar: MatSnackBar
  ) {


    this._obj = new InboxDTO();
    this._objds = new Dataservicedto();
    this._pageSize = 30;
    this._Search = "";
    this._Isfilters = true;
    this._filtervalues = "";

    this.subscription = this.ds.getData().subscribe(x => {
      this._objds = x as Dataservicedto;

      // if (this._objds.labelsdrp != 0) {
      //   this.onChangeCompany(this._objds.CompanyId)
      // }
      // if (this._objds.FromUserId != 0) {
      //   this.onChangeUser(this._objds.FromUserId)
      // }
      this.cd.detectChanges();
    });

  }

  ngOnInit(): void {
    this.MemoView = false;
    $(".LabelsClass").removeClass("active");
    this.activePage = 1;
    this.companyid = 65000;
    this.fromuserid = 0;
    this._all = true;
    const Dashboard_FilterValue = localStorage.getItem('Dashboard_FilterValue');
    localStorage.removeItem('Dashboard_FilterValue');
    this._OrderBy = "DESC";
    this.InboxType = "All";

    if (Dashboard_FilterValue != null) {
      this._OrderType = 'DESC';

      this.FilterMemos(Dashboard_FilterValue)
    }
    else {
      this.ToMemos(this.activePage, this._Search, this._OrderBy);
    }
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    $('.btn-act').on('click', function () {
      $('.btn-act').removeClass('btn-active');
      $(this).addClass('btn-active');
    });
    $(document).on("click", function (e) {
      if ($(e.target).is(".btn-act") === false) {
        $(".btn-act").removeClass("btn-active");
      }
    });
  }

  ngOnDestroy() {
    //this.subscription && this.subscription.unsubscribe();
  }

  keyword = 'name';
  data: any;
  labelid: number;
  MailId: number

  selectEvent(item) {
    this.labelid = item.id;
    // do something with selected item
  }
  GetMailId(id: number) {       //single select label
    $("#div_filters2").addClass("show");
    $("#btngroup_label").addClass("show");
    this.MailId = id;
    this._LstToMemos.forEach(elementI => {
      if (elementI.MailId == id) {
        elementI["checked"] = true;
        this._checkedMailIds.push(elementI);
        // alert(elementI.IsTag)
        const _val = elementI.SelectedLabels.split(',');
        if (elementI.IsTag) {
          this.data.forEach(_label => {
            _val.forEach(_sel => {
              if (_label.id == _sel) {
                $('#lbl_' + _sel).prop('checked', true);
                _label.checked = true;
              }
            });
          });
        }
        // return true;

      }
    });

  }

  AddMemostoLabels() {       //Multiselect  Select label
    if (this._checkedLabelIds.length == 0) {
      alert('Please select label');
      return false;
    }

    if (this._checkedMailIds.length == 0) {
      alert('Please select memo');
      return false;
    }

    const MemoIdsArray = [];
    this._checkedMailIds.forEach(element => {
      MemoIdsArray.push(element.MailId);
    });

    this.inboxService.AddMemoToLabel(MemoIdsArray.toString(), this._checkedLabelIds.toString(), this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (this._obj.message == "1") {
          this.ToMemos(this.activePage, this._Search, this._OrderBy);
          // (<HTMLInputElement>document.getElementById("i_" + this.MailId)).classList.remove("d-none");

          this._snackBar.open('Memo Tagged Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          window.close();
          $("#div_filters2").removeClass("show");
          this.SelectLabel = [];
        }
        else if (this._obj.message == "2") {
          //(<HTMLInputElement>document.getElementById("i_"+this.MailId)).classList.remove("d-none");
          this._snackBar.open('Memo Already Tagged', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['red-snackbar']
          });
          $("#div_filters2").removeClass("show");
          this.SelectLabel = [];
          this.check = false;
          // window.close();
          // (<HTMLInputElement>document.getElementById("div_filters2")).classList.remove("show");
        }
      }
    )
  }

  labelchange(id) {
    let _value = $("#lbl_" + id).prop('checked');
    // alert(_value);
    if (_value) this._checkedLabelIds.push(id);
    else {
      this._checkedLabelIds = jQuery.grep(this._checkedLabelIds, function (value) {
        return value != id;
      });
    }
    this.SelectLabel = [];
    this._checkedLabelIds.forEach(element => {
      this.data.forEach(elementI => {
        if (element == elementI.id) {
          this.SelectLabel.push(elementI.name);
        }
      });
    });
    console.log(this._checkedLabelIds.toString(), "labelcheck");
  }
  onFocused(e) {
    // do something when input is focused
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

        if (this._obj.message == "1") {
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
  UnReadSelect(MailIds) {
    const MemoIdsArray = [];
    this._checkedMailIds.forEach(element => {
      MemoIdsArray.push(element.MailId);
    });
    this.MemoIdsArray = MailIds
    console.log(MemoIdsArray, "deleteid");
  }
  ToMemosFetch() {
    var ud = this.currentUserValue.createdby;
    db.collection('NewMemosList_' + ud).orderBy('MailId', 'desc').get().then((memos: InboxDTO[]) => {
      this._dummy = memos;
      this._LstNewMemos = this._dummy.filter(x => x.NotificationStatus == false && x.IsDeleted == false);
    })
  }

  ToMemos(pageNumber: number, Search: string, OrderBy: string) {
    this._obj.UserId = this.currentUserValue.createdby;
    // this._obj.Read_F = false;
    // this._obj.Conversation_F = false;
    // this._obj.All = this._all;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    // this._obj.FlagId = CompanyId;
    // this._obj.Description = "DESC";
    this._obj.Search = Search;
    //this._obj.FromUserId = FromUserId;
    this._obj.ByFilters = false;
    // this._obj.FilterValues = "";
    this._obj.PStatusJson = '[]';
    this._obj.PCompanyJson = '[]';
    this._obj.PUserJson = '[]';
    this._obj.OrderBy = OrderBy;
    this._obj.InboxMemosType = this.InboxType;
    this._OrderBy = OrderBy;

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {

        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;
        this.FiltersSelected = _totalRecords[0].FiltersSelected;
        this._CurrentpageRecords = this._LstToMemos.length;
        this._OrderType = this._obj.Description;
        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _statusJson = JSON.parse(this._obj.StatusJSON);
        this._LstMemoStatus = _statusJson;

        var _LabelsJson = JSON.parse(this._obj.LablesJson);
        this.data = _LabelsJson;

        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompaniesTO = _CompaniesJson;

        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.InboxType = "All";

        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;
        //this._objds.CCMemosCount = _totalRecords[0].CCTotalMemos;

        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);

        // var _FiltersJson = JSON.parse(this._obj.FiltersJSON);
        // this._LstFilters = _FiltersJson;

        this.activePage = pageNumber;
        this.cd.detectChanges();

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

  InboxTypeFn(_inboxtype: string) {


    this.InboxType = _inboxtype;
    (<HTMLInputElement>document.getElementById("btnAll")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("btnTO")).classList.remove("active");
    (<HTMLInputElement>document.getElementById("btnCC")).classList.remove("active");

    (<HTMLInputElement>document.getElementById("btn" + _inboxtype)).classList.add("active");


  }


  gotoMemoDetailsV2(name, id) {

    // alert("The URL of this page is: " + window.location.href);
    // window['base-href'] = window.location.pathname;
    // alert(window.location.pathname);
    var url = document.baseURI + name;
    var myurl = `${url}/${id}`;
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

  storeFilterValue(value: string) {
    if (value == "All") {
      //for ALL Filters
      $('ul li a span.FiltersIcons').removeClass('d-block');
      $('ul li a span.FiltersIcons').removeClass('d-none');

      $('ul li a span.FiltersIcon').removeClass('d-block');
      $('ul li a span.FiltersIcon').removeClass('d-none');
      $('ul li a span.FiltersIcon').addClass('d-none');
      $('#spn_' + value).addClass('d-block');
      $('#hdnFilterText').val(value);
      this._filtervalues = value;
    }
    else {
      $('ul li a span.FiltersIcons').removeClass('d-block');
      $('ul li a span.FiltersIcons').removeClass('d-none');
      $('ul li a span.FiltersIcons').addClass('d-none');

      $('#spn_' + value).addClass('d-block');

      if (this._filtervalues == "All") {
        this._filtervalues = value;
      }
      else {
        this._filtervalues = this._filtervalues + "," + value;
      }
    }
  }
  storeOrderTypeValue(value: string) {
    $('ul li a span.FiltersIconSort').removeClass('d-block');
    $('ul li a span.FiltersIconSort').removeClass('d-none');
    $('ul li a span.FiltersIconSort').addClass('d-none');
    $('#spn_' + value).addClass('d-block');

    $('#hdnFilterOrderType').val(value);
    this._OrderType = value;
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
    console.log(this.LastPage);
    if (pageNumber == this.LastPage) {
      this.activePage = this.LastPage;
      this.lastPagerecords = 30;
    }
    else {
      this.activePage = pageNumber;
    }
    this.ToMemos(pageNumber, this._Search, this._OrderBy);
    //this.GetFilters(this.activePage, this.companyid, this.fromuserid, this._all, this._Search);

    // db.collection('TOMemos_'+229).get().then(users => {
    //   this._LstToMemos= users.slice((pageNumber - 1) * 30, pageNumber * 30);
    // })
  }
  onChangeCompany(newValue) {
    if (newValue == undefined) newValue = 65000;
    this.companyid = newValue;
    this.fromuserid = this.fromuserid;
    this._all = true;
    this._Isfilters = true; //previous false
    this._filtervalues = "All"; //previous ""
    this.storeFilterValue(this._filtervalues)
    this.GetFilters(this.activePage, this.companyid, this.fromuserid, this._all, this._Search);
  }

  onChangeUser(newValue) {
    this.fromuserid = newValue;
    this.companyid = this.companyid;//previous 65000
    this._all = true;
    this._Isfilters = true; //previous false
    this._filtervalues = "All"; //previous ""
    this.storeFilterValue(this._filtervalues);
    this.GetFilters(this.activePage, this.companyid, this.fromuserid, this._all, this._Search);
  }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtSearch")).value;
    this._Search = newValue;
    this.ToMemos(this.activePage, this._Search, this._OrderBy);
  }

  GetFilters(pageNumber: number, CompanyId: number, FromUserId: number, all: boolean, search: string) {
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.Read_F = false;
    this._obj.Conversation_F = false;
    this._obj.All = this._all;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = pageNumber;
    this._obj.FlagId = CompanyId;
    this._obj.Description = this._OrderType;
    this._obj.Search = search;
    this._obj.FromUserId = FromUserId;
    this._obj.ByFilters = this._Isfilters;
    this._obj.FilterValues = this._filtervalues;
    //alert('All :'+this._all + "----  Filters : "+this._Isfilters);

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });
        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;
        this.FiltersSelected = _totalRecords[0].FiltersSelected;

        this.activePage = pageNumber;

        // if (this._pageSize >= this.TotalRecords) {
        //   this._CurrentpageRecords = this.TotalRecords
        // }
        // else {
        //   this._CurrentpageRecords = this._pageSize
        // }

        this._CurrentpageRecords = this._LstToMemos.length;

        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompaniesTO = _CompaniesJson;

        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;
        //this._objds.CCMemosCount = _totalRecords[0].CCTotalMemos;

        // send message to subscribers via observable subject
        this.ds.sendData(this._objds);

        // this.dbService.add('ToMemos',
        //   {
        //     name: 'PageNumber_' + this.activePage,
        //     ToJSON: JSON.stringify(_TOMemosJson)
        //   }).then(
        //     () => {
        //       //alert(`Page ${this.activePage} added successfully`)
        //       // Do something after the value was added
        //     },
        //     error => {
        //       console.log(error);
        //     }
        //   );

        this.activePage = pageNumber;
        //this.cd.detectChanges();
        //alert('ok')
      });
  }

  FilterUpdate() {
    // var newValue = (<HTMLInputElement>document.getElementById("hdnFilterText")).value;
    // this._filtervalues = newValue;
    this._all = true;
    this._Isfilters = true;
    this.companyid = this.companyid;//previous 65000
    this.fromuserid = this.fromuserid; //previous 0
    this.FilterMemos(this._filtervalues);
    //div_filters
    (<HTMLInputElement>document.getElementById("div_filters")).classList.remove("show");

    //event.startPropagation();
  }
  FilterMemos(filtervalus: string) {

    this.checkeduserIDs = [];
    this.checkedcompanyIDs = [];
    this.checkedStatus = [];

    var authorsList = filtervalus.split(",");
    authorsList.forEach(element => {

      var JSONObj = {};
      JSONObj["Status"] = element;
      this.checkedStatus.push(JSONObj);
    });

    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.Search = '';
    this._obj.ByFilters = true;
    this._obj.PStatusJson = JSON.stringify(this.checkedStatus);
    this._obj.PCompanyJson = JSON.stringify(this.checkedcompanyIDs);
    this._obj.PUserJson = JSON.stringify(this.checkeduserIDs);
    this._obj.InboxMemosType = this.InboxType;
    this._obj.OrderBy = this._OrderBy;

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        //alert(this._LstToMemos[0].MemoSource);

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;
        this.FiltersSelected = _totalRecords[0].FiltersSelected;
        this._CurrentpageRecords = this._LstToMemos.length;

        //this._Filters = _totalRecords[0].Filters.toString();
        this._OrderType = this._obj.Description;
        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _statusJson = JSON.parse(this._obj.StatusJSON);
        this._LstMemoStatus = _statusJson;

        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompaniesTO = _CompaniesJson;

        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.InboxType = "All";

        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;

        this.activePage = 1;
        this.cd.detectChanges();

        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        $("#div_filters").removeClass("show");
      });

  }

  deletememo(MailId: number) {   // Delete Memos functionality 
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
    this.inboxService.deleteMemo(MemoIdsArray.toString(), this.currentUserValue.createdby).subscribe(
      data => {
        this._obj = data as InboxDTO;
        if (this._obj.message == "1") {
          this._checkedMailIds.forEach(element => {
            this._LstToMemos.forEach(elementI => {
              if (elementI.MailId == element.MailId) {
                elementI["checked"] = false;
                return true;
              }
            });
          });
          this.ToMemos(this.activePage, this._Search, this._OrderBy);
          this._snackBar.open('Updated Successfully', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
          this._checkedMailIds = [];
          this.check = false;
        }
        // if (this._obj.message == "1") {
        //   this.ToMemos(this.activePage, this._Search, this._OrderBy);
        //   this._snackBar.open('Updated Successfully', 'End now', {
        //     duration: 5000,
        //     horizontalPosition: "right",
        //     verticalPosition: "bottom",
        //   });
        // }
      }
    )
  }

  ClearFilters() {

    this.checkeduserIDs = [];
    this.checkedcompanyIDs = [];
    this.checkedStatus = [];
    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.Search = '';
    this._obj.ByFilters = true;
    this._obj.PStatusJson = JSON.stringify(this.checkedStatus);
    this._obj.PCompanyJson = JSON.stringify(this.checkedcompanyIDs);
    this._obj.PUserJson = JSON.stringify(this.checkeduserIDs);
    this._obj.InboxMemosType = this.InboxType;
    this._obj.OrderBy = this._OrderBy;

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        //alert(this._LstToMemos[0].MemoSource);

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;
        this.FiltersSelected = _totalRecords[0].FiltersSelected;
        this._CurrentpageRecords = this._LstToMemos.length;

        //this._Filters = _totalRecords[0].Filters.toString();
        this._OrderType = this._obj.Description;
        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _statusJson = JSON.parse(this._obj.StatusJSON);
        this._LstMemoStatus = _statusJson;

        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompaniesTO = _CompaniesJson;

        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.InboxType = "All";

        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;

        this.activePage = 1;
        this.cd.detectChanges();

        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        $("#div_filters").removeClass("show");
        $("#txtSearch").val('');
      });

  }


  onuserchange(event) {

    let a = event.target.value;
    this._LstUsers.forEach(element => {
      if (element.FromUserId == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });
  }
  oncompanychange(event) {
    let a = event.target.value;
    this._LstCompaniesTO.forEach(element => {
      if (element.CompanyId == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });
  }
  onstatuschange(event) {
    let a = event.target.value;
    this._LstMemoStatus.forEach(element => {
      if (element.Status == a) {
        let chk = element.isChecked;
        if (chk == true) {
          element.isChecked = false;
        }
        else if (chk == false) {
          element.isChecked = true;
        }
      }
    });
  }
  FiltersData() {

    this.checkeduserIDs = [];
    this.checkedcompanyIDs = [];
    this.checkedStatus = [];

    this._LstUsers.forEach((value, index) => {
      if (value.isChecked) {

        var JSONObj = {};
        JSONObj["UserId"] = value.FromUserId;

        this.checkeduserIDs.push(JSONObj);
      }
    });
    this._LstCompaniesTO.forEach((value, index) => {
      if (value.isChecked) {
        var JSONObj = {};
        JSONObj["CompanyId"] = value.CompanyId;
        this.checkedcompanyIDs.push(JSONObj);
      }
    });

    this._LstMemoStatus.forEach((value, index) => {
      if (value.isChecked) {
        var JSONObj = {};
        JSONObj["Status"] = value.Status;
        this.checkedStatus.push(JSONObj);
      }
    });

    this._obj.UserId = this.currentUserValue.createdby;
    this._obj.PageSize = this._pageSize;
    this._obj.PageNumber = 1;
    this._obj.Search = '';
    this._obj.ByFilters = true;
    this._obj.PStatusJson = JSON.stringify(this.checkedStatus);
    this._obj.PCompanyJson = JSON.stringify(this.checkedcompanyIDs);
    this._obj.PUserJson = JSON.stringify(this.checkeduserIDs);
    this._obj.InboxMemosType = this.InboxType;
    this._obj.OrderBy = this._OrderBy;

    this.inboxService.MemosBindingWithFilters(this._obj)
      .subscribe(data => {
        this._obj = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj.MemosJSON);
        this._LstToMemos = _TOMemosJson;

        //alert(this._LstToMemos[0].MemoSource);

        this._MemoIds = [];
        this._LstToMemos.forEach(element => {
          this._MemoIds.push(element.MailId);
        });

        this._LstToMemos.forEach(element => {
          localStorage.setItem('MemoIds_' + element.MailId, JSON.stringify(this._MemoIds));
        });

        var _totalRecords = JSON.parse(this._obj.TotalRecordsJSON);
        this.TotalRecords = _totalRecords[0].TotalRecords;
        this.FiltersSelected = _totalRecords[0].FiltersSelected;
        this._CurrentpageRecords = this._LstToMemos.length;

        //this._Filters = _totalRecords[0].Filters.toString();
        this._OrderType = this._obj.Description;
        var _UsersJson = JSON.parse(this._obj.UserListJSON);
        this._LstUsers = _UsersJson;

        var _statusJson = JSON.parse(this._obj.StatusJSON);
        this._LstMemoStatus = _statusJson;

        var _CompaniesJson = JSON.parse(this._obj.CompanyListJSON);
        this._LstCompaniesTO = _CompaniesJson;

        this._objds.Companiesdrp = _CompaniesJson;
        this._objds.Usersdrp = _UsersJson;
        this._objds.CompanyId = 0;
        this._objds.FromUserId = 0;
        this._objds.FilterRequired = true;
        this.InboxType = "All";

        this._objds.ToMemosCount = _totalRecords[0].TotalRecords;

        this.activePage = 1;
        this.cd.detectChanges();

        if (this._LstToMemos.length == 0) {
          this._filtersMessage = "No more memos matched your search";
          this._filtersMessage2 = " Clear the filters & try again";
        }
        else if (this._LstToMemos.length > 0) {
          this._filtersMessage = "";
          this._filtersMessage2 = "";
        }
        $("#div_filters").removeClass("show");
      });
  }
  closedataloadSettings() {

    $("#div_filters").removeClass("show");
    $("#div_filters1").removeClass("show");
    $("#div_filters2").removeClass("show");

    // $('input:input[name="labelckh"]').removeAttr('checked');
    $('input[name="labelckh"]').each(function () {
      this.checked = false;
    });
    this.SelectLabel = [];
    this._checkedLabelIds = [];
    // $("#checkbox").prop("checked", false);


    // this.checked =""
    // this._checkedMailIds=[];
    // this._LstToMemos.forEach(elementI => {
    //   elementI["checked"] = false;
    // });
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
  // DeleteMultiselect(MailIds) {
  //   const MemoIdsArray = [];
  //   this._checkedMailIds.forEach(element => {
  //     MemoIdsArray.push(element.MailId);
  //   });
  //   this.MemoIdsArray = MailIds
  //   console.log(MemoIdsArray, "deleteid");
  // }


}

