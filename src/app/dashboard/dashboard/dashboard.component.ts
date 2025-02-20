import { Component, OnInit, EventEmitter, Renderer2 } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular'; // Import AmChartsService and AmChart
// import { Subscription, } from 'rxjs';
//declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardDto } from 'src/app/_models/dashboard-dto';
import { DashboardService } from 'src/app/_service/dashboard.service';
import * as introJs from 'intro.js/intro.js';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import * as Legend from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
// import { tns } from "tiny-slider/src/tiny-slider";
import { environment } from '../../../environments/environment'
import { InboxService } from 'src/app/_service/inbox.service';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { SwPush } from '@angular/service-worker';
import { PushNotificationService } from 'src/app/_service/push-notification-service.service';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';

am4core.useTheme(am4themes_animated);
let chart;
let chart1;
let xAxis;
let yAxis;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../../assets/css/tourguide.css'],
  // imports: [RoundProgressModule]
})


export class DashboardComponent implements OnInit {

  // image="https://yrglobaldocuments.blob.core.windows.net/documents/Banner{{src.FileUrl}}"

  // Test1 = [
  //   {
  //     Filtertype: "F",
  //     FilterId: "0",
  //   }, 
  // ];
  // Test2 = [
  //   {
  //     Filtertype: "P",
  //     FilterId: "0",
  //   }, 
  // ];
  // Test3 = [
  //   {
  //     Filtertype: "L",
  //     FilterId: "10",
  //   }, 
  // ];
  //readonly VAPID_PUBLIC_KEY = "BJapMS78IwkXEUwfTF7svvikW6ZnrCndS1swtevRQ_RmN_LZSGTlDxMPlgOBilUDmEsQFF159qfNGJNmsY8lEfQ";
  DailyActivity: any = [];
  current = 27;
  max = 50;
  images: any = [];
  // textDirection: Direction | 'auto' = 'auto'; // Default to 'auto'
  textDirection: string = 'ltr';
  bntStyle: string = '';
  lang: string = "en"; // Default language
  arabicButton: any;
  englishButton: any;
  // letters = '0123456789ABCDEF';
  //private chart: AmChart;
  _obj: DashboardDto;
  _LstCounts: DashboardDto[];
  _lstBarJson: [];
  ExpiredMemos: number;
  Pendingformothercount: number;
  NewMemos: number
  ReplyRequiredMemos: number
  ApprovalMemos: number
  TotalApprovalMemos: number
  ActionTaken: number
  Pending: number
  ActionMemoPercentage: number
  TotalGeneralMemos: number
  ActionTakenGeneral: number
  PendingGeneral: number
  GeneralMemoPercentage: number
  TotalPercentage: number
  FullName: string
  toastRef;
  introJS = introJs();
  IsPolicy: boolean
  chart: any;
  chart1: AmChart; // Assuming chart1 is defined in the component

  chartpie: any;
  widthPer: any;
  color: any = "green";
  loadAPI: Promise<any>;
  _obj1: InboxDTO;
  _LstToMemos: any = [];
  _MemoIds: any;
  _pageSize: number;
  activePage: number;
  _obj2: GACFiledto;
  GACDocumentList: any = [];
  status: string = '';
  _StartDate: string = '';
  _EndDate: string = '';
  _val: any;
  label: any;
  searchText: string;
  Favoriteandpending: boolean = true;
  LabelMemos: boolean = false;
  returnUrl: string;
  public _Lstlabels: any;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  NameSeletecForFilter: string;
  LabelName: string;
  CurrentRoleId: number;
  SearchLabels: string;
  public static ArabicSide: EventEmitter<any> = new EventEmitter();
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dashboardService: DashboardService
    , private router: Router
    , private toastr: ToastrService
    , private route: ActivatedRoute
    // , private cd: ChangeDetectorRef
    , private inboxService: InboxService
    , public service: GACFileService
    , private _PushNotificationService: PushNotificationService
    , private translate: TranslateService
    , private AmCharts: AmChartsService,

    // ,private swPush: SwPush
  ) {
    // var letters = "0123456789ABCDEF";
    // let color = "#";
    // this.data = [
    //   { Label: "Administration", Value: 2 },
    //   { Label: "Sales", Value: 8 },
    //   { Label: "IT", Value: 3 },
    //   { Label: "Marketing", Value: 8 },
    //   { Label: "Development", Value: 4 },
    //   { Label: "Customer Support", Value: 6 }
    // ];
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.useLanguage(lang);
      this.SearchLabels = lang === 'en' ? "Search Label...." : "عنوان البحث....";
    });

    translate.setDefaultLang('en');
    this.englishButton = true;
    this._pageSize = 30;
    this._obj1 = new InboxDTO();
    var datauser = localStorage.getItem('currentUser');
    if (datauser != null) {
      let cart = JSON.parse(datauser);
      if (cart[0].IsPolicy) {
        const returnUrlsa = this.route.snapshot.queryParams['returnUrl'] || '/userpolicy';
        this.router.navigateByUrl(returnUrlsa);
      }
    }
    this.loadAPI = new Promise((resolve) => {
      this.loadScript1();
      resolve(true);
    });
  }
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  subscribeToNotifications() {
    this._PushNotificationService.subscribeToNotifications(this.currentUserValue.createdby);
    // try {
    //   if (this.swPush.isEnabled) {
    //     alert(this.swPush.isEnabled);
    //     this.swPush.requestSubscription({
    //       serverPublicKey: 'BLjeIROpFfDncP668XH2l7wV4mTID3thxHeV7eSmc7ceji-l6v-BXgsLV0SEXWMsjrMPRACBW4GHWSqGy9j3b1I'
    //     })
    //     .then(subscription => {
    //       debugger
    //       // You now have the subscription object
    //       const subscriptionJson = JSON.stringify(subscription);
    //       console.log(subscriptionJson);
    //       // Here, you would typically send this JSON to your server
    //     })
    //     .catch(err => console.error('Could not subscribe to notifications', err));
    //   }
    //   else{
    //     alert(this.swPush.isEnabled);
    //   }
    // } catch (error) {
    //   console.log(error,"error");
    // }

  }

  _LstToSuggestion = [];
  _LstToBanner = [];
  Counts() {
    this.dashboardService.DashboardCount()
      .subscribe((data) => {
        console.log(data, "Dashboard count");
        this._obj = data as DashboardDto;
        var _dashboardJson = JSON.parse(this._obj.DashboardJson);
        this.DailyActivity = _dashboardJson[0].DailyActivityJson;
        this._LstCounts = _dashboardJson;
        this.ExpiredMemos = this._LstCounts[0].ExpiredMemos;
        this.Pendingformothercount = this._LstCounts[0].PendingFromOthersCount;
        this.NewMemos = this._LstCounts[0].NewMemos;
        this.ReplyRequiredMemos = this._LstCounts[0].ReplyRequiredMemos;
        this.ApprovalMemos = this._LstCounts[0].ApprovalMemos;
        this.TotalApprovalMemos = this._LstCounts[0].TotalApprovalMemos;
        this.ActionTaken = this._LstCounts[0].ActionTaken;
        this.Pending = this._LstCounts[0].Pending;
        this.ActionMemoPercentage = this._LstCounts[0].ActionMemoPercentage;
        this.TotalGeneralMemos = this._LstCounts[0].TotalGeneralMemos;
        this.ActionTakenGeneral = this._LstCounts[0].ActionTakenGeneral;
        this.PendingGeneral = this._LstCounts[0].PendingGeneral;
        this.GeneralMemoPercentage = this._LstCounts[0].GeneralMemoPercentage;
        this.TotalPercentage = this._LstCounts[0].TotalPercentage;
        this.FullName = this._LstCounts[0].FullName;
        this._LstToSuggestion = JSON.parse(this._LstCounts[0].SuggestionJson);
        // this._LstToSuggestion.forEach(element => {
        //   element.OptionJson = JSON.parse(element.OptionJson);
        // });
        this._LstToBanner = JSON.parse(this._LstCounts[0].BannerJson);
        console.log(this._LstToBanner, "Dashboard banner");
        // var _Obj = {};
        // //../../../
        //   _Obj["path"] = "assets/media/Img/No_Banner.png";
        //   this.images.push(_Obj);

        // alert(this.images.length);
        // alert(this._LstToBanner.length);
        // if (this._LstToBanner.length != 0) {
        //   this.images = [];
        // }
        // this._LstToBanner.forEach(element => {
        //   element.AttachmentJson.forEach(Attch => {
        //     var _Obj = {};
        //     _Obj["path"] = Attch.FileUrl;
        //     _Obj["type"] = 'image';
        //     this.images.push(_Obj);
        //   });
        // });
        if (this._LstToBanner && Array.isArray(this._LstToBanner)) {
          this._LstToBanner.forEach(element => {
            if (element.AttachmentJson && Array.isArray(element.AttachmentJson)) {
              element.AttachmentJson.forEach(Attch => {
                var _Obj = {};
                _Obj["path"] = Attch.FileUrl;
                _Obj["type"] = 'image';
                this.images.push(_Obj);
              });
            }
          });
        }

        // this._LstToBanner.forEach(element => {
        //   alert(element.AttachmentJson.length)
        //   element.AttachmentJson = element.AttachmentJson;
        // });
        chart = am4core.create('chartdiv', am4charts.XYChart)
        xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        chart.language.locale = "ar";
        //chart.colors.step = 2;
        chart.legend = new am4charts.Legend()
        chart.legend.position = 'top'
        chart.legend.paddingBottom = 10
        xAxis.dataFields.category = 'Status'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;
        yAxis.min = 20;
        chart.data = this._LstCounts[0].BarJson;
        //chartpie
        chart1 = am4core.create("chartdiv1", am4charts.PieChart);
        chart1.data = JSON.parse(this._LstCounts[0].GacChartJson);
        chart1.language.locale = "ar"; // Set direction to RTL for Arabic

        chart1.legend = new am4charts.Legend();
        chart1.legend.valueLabels.template.disabled = true;
        chart1.legend.itemContainers.template.togglable = false;
        chart1.legend.itemContainers.template.events.on("hit", function (ev) {
          var slice = ev.target.dataItem.dataContext.slice;
          slice.isActive = !slice.isActive;
        });

        // legend.data.setAll(series.dataItems);

        // chart1.data = [{
        //   "Documents": "Pending",
        //   "Count": 1,
        //   // "color": am4core.color("coral")
        // }, {
        //   "Documents": "Approved",
        //   "Count": 2
        // }, {
        //   "Documents": "Rejected",
        //   "Count": 3
        // }, {
        //   "Documents": "Shared With Me",
        //   "Count": 0
        // }, {
        //   "Documents": "Shared By me",
        //   "Count": 0
        // }];

        var pieSeries = chart1.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "Count";
        pieSeries.dataFields.category = "Documents";
        pieSeries.slices.template.propertyFields.fill = "color";


        //   labels
        pieSeries.ticks.template.disabled = true;
        pieSeries.alignLabels = false;
        pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        pieSeries.labels.template.radius = am4core.percent(-40);
        pieSeries.labels.template.fill = am4core.color("white");

        //   chart.data = [
        //     {
        //       Status: 'Total',
        //       Total: 80,
        //       Done: 55 
        //     },
        //     {
        //       Status: 'General',
        //       Total: 90,
        //       Done: 78 
        //     },
        //     {
        //       Status: 'Approval',
        //       Total: 50,
        //       Done: 40 
        //     } 
        // ]

        // var gradient = new am4core.LinearGradient();
        // gradient.addColor(am4core.color("red"));
        // gradient.addColor(am4core.color("blue"));
        // gradient.rotation = 90;
        //series.columns.template.fill = gradient;
        createSeries('Total', 'Total', "#67b7dc", "#6794dc");
        createSeries('Done', 'Done', "#00cc99", "#1affc6");
        if (this.TotalPercentage < 95) {
          this.toastr.warning('Improve your performance by keep focusing on Pending Status',
            '', {
            timeOut: 6000,
            positionClass: 'toast-bottom-right',
          });
        }
        this.toastr.info('Your overall performance is ' + this.TotalPercentage + '%',
          'Hello  ' + this.FullName, {
          timeOut: 15000,
          positionClass: 'toast-bottom-right',
        });
        // this.DailyActivity.forEach(item => {
        //   let color = "#";
        //   for (var i = 0; i < 6; i++) {
        //     color += this.letters[Math.floor(Math.random() * 16)];
        //   }
        //   item.color = color;
        // });
      });
  }

  useLanguage(lang: any) {
    this.translate.use(lang);
    this.lang = lang;
    // this.document.documentElement.lang = lang; // Set HTML lang attribute
    this.document.dir = lang === 'ar' ? 'rtl' : 'ltr'; // Set document direction
    // this.document.dir = this.textDirection;
    if (lang === 'ar') {
      // alert(lang);
      this.bntStyle = 'example-full-width';
      this.arabicButton = true;
      this.englishButton = false;
      this.textDirection = 'rtl';
      this.NameSeletecForFilter = "المفضلة لدي";
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else {
      this.bntStyle = '';
      this.arabicButton = false;
      this.englishButton = true;
      this.textDirection = 'ltr';
      this.NameSeletecForFilter = "My Favorite";
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // DashboardComponent.ArabicSide.emit(lang);
  }



  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

  ngAfterContentInit() {

    // tns({
    //   container: '.my-slider',
    //   items: 1,
    //   slideBy: 'page',
    //   autoplay: true,
    //   navPosition: 'bottom',
    //   controls: false,
    //   autoplayButtonOutput: false
    // });
  }

  ngOnInit() {

    // this.translate.get('Dashboard.ApprovalPending').subscribe((res: string) => {
    //   console.log(res); // Output: 'Approval Pending' (in English)
    // });
    // alert(this.lang);
    //  $('#langarabic').addClass('.kt-body-arabic');
    // Your logic here
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    if (this.lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }
    this.FavMemos()
    this.activePage = 1;
    this.NameSeletecForFilter = lang === 'en' ? "My Favorite" : "أُفضله";
    this.SearchLabels = lang === 'en' ? "Search Label...." : "عنوان البحث....";
    // alert(this.lang);
    this.onsharedme();
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'backend/Inbox/ToMemos';
    // this.router.navigate([this.returnUrl]);

    var datauser = localStorage.getItem('currentUser');
    if (datauser != null) {
      let cart = JSON.parse(datauser);
      if (cart[0].IsPolicy) {
        const returnUrlsa = this.route.snapshot.queryParams['returnUrl'] || '/userpolicy';
        this.router.navigateByUrl(returnUrlsa);
      }
    }
    // if (this.currentUserValue.IsPolicy == true){
    //   const returnUrlsa = this.route.snapshot.queryParams['returnUrl'] || '/userpolicy';
    //  return this.router.navigateByUrl(returnUrlsa);
    // }
    this.ActionMemoPercentage = 100;
    this.GeneralMemoPercentage = 100;
    this.currentUser.subscribe(data => {
      console.log(data, "Current Value");
      this.CurrentRoleId = data[0].RoleId;
      if (data[0].createdby != null) {

        // new Promise(resolve => {
        //   setTimeout(() => {
        //     this.Counts();
        //   }, 2000);
        // });
        // setTimeout(() => {
        //   this.Counts();
        // }, 2000);

        this.Counts();
      }
    });
    // this.GeneralMemoPercentage=0;
    this.widthPer = 50;
    // this.ActionMemoPercentage=0;
    introJs().start();
    this.IsPolicy = false;
    //this.loadScript("../assets/js/dashboard/jquery.knob.min.js");.

    //Tourguid_comment
    // var tourguide = new Tourguide();
    //  tourguide.start();

    //  //for click event 
    // var tourguide = new Tourguide();
    //   function startTour() {
    //       tourguide.start();
    //   }
    //   // Attach the touruide start evene to the button press
    //   var tourbutton = document.getElementById("tourbutton");
    //   tourbutton.addEventListener("click", startTour);

    //   $(".icon-btn").on("click",function() {
    //     $('.icon-btn').removeClass('icn-active');
    //     $(this).addClass('icn-active');
    // });
    // if ($('#lbl-dpmenu').hasClass('show')) {
    //   $('.lbls-btn').addClass('icn-active');
    // }

    //   $(document).on('click', function(e) {

    //     var container = $("#lbl-dpmenu");
    //     if (!$(e.target).closest(container).length) {
    //       // $('.icon-btn').addClass('icn-active');
    //       $('.lbls-btn').removeClass('icn-active');
    //     }
    // });


  }



  FavMemos() {  // To view My Favorite
    // this.NameSeletecForFilter = "My Favorite";
    if (this.lang === 'ar') {
      this.NameSeletecForFilter = "المفضلة لدي";
    } else {
      this.NameSeletecForFilter = "My Favorite";
    }

    this._obj1.PageSize = this._pageSize;
    this._obj1.PageNumber = 1;
    this._obj1.CreatedBy = this.currentUserValue.createdby;
    this._obj1.Search = "";
    this.inboxService.FavMemosWithFilters(this._obj1)
      .subscribe(data => {
        // this._obj1 = data as InboxDTO;
        // var _TOMemosJson = JSON.parse(this._obj1.MemosJSON);
        // this._LstToMemos = _TOMemosJson;
        this._LstToMemos = data["Data"];
        this._LstToMemos = this._LstToMemos["MemosJSON"];
        $('.icon-btn').removeClass('icn-active');
        $('.fav-btn').addClass('icn-active');
      });
  }

  PendingFromOthersMemos() { // To view Pending From Others
    // this.NameSeletecForFilter = "Pending From Others";
    if (this.lang === 'ar') {
      this.NameSeletecForFilter = "في انتظار الآخرين";
    } else {
      this.NameSeletecForFilter = "Pending From Others";
    }
    this._LstToMemos = [];
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.PageSize = this._pageSize;
    this._obj1.PageNumber = 1;
    this._obj1.Search = "";
    this._obj1.ByFilters = true;
    this._obj1.PStatusJson = '[]';
    this._obj1.PCompanyJson = '[]';
    this._obj1.PUserJson = '[]';
    this.inboxService.PendingFromOthersMemosBindingWithFilters(this._obj1, this.currentUserValue.organizationid)
      .subscribe(data => {
        this._obj1 = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj1.MemosJSON);
        this._LstToMemos = _TOMemosJson;
        // this._LstToMemos = data["Data"]["MemosJSON"];
        $('.icon-btn').removeClass('icn-active');
        $('.pen-btn').addClass('icn-active');
      });
  }

  getLables() {  // To view Lables List
    this._obj.UserId = this.currentUserValue.createdby;
    this.inboxService.UserLabels(this._obj1)
      .subscribe(data => {
        this._obj1 = data as InboxDTO;
        var _labelsJson = JSON.parse(this._obj1.LablesJson);
        2//this._objds.labelsdrp = _labelsJson;
        this._Lstlabels = _labelsJson;
        // send message to subscribers via observable subject
        1//this.ds.sendData(this._objds);

        $('.pen-btn').removeClass('icn-active');
        $('.lbls-btn').addClass('icn-active');
        //$('.ovrly').css('display', 'block');

      });
  }

  labelMemos(LabelId: number) { // To view Click the Label Open the Memos
    this._Lstlabels.forEach(element => {
      if (LabelId == element.LabelId)
        this.NameSeletecForFilter = element.LabelName;
    });
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelId = LabelId;
    this.inboxService.MemosLabelBinding(this._obj1)
      .subscribe(data => {
        this._obj1 = data as InboxDTO;
        var _TOMemosJson = JSON.parse(this._obj1.LabelMemosJson);
        this._LstToMemos = _TOMemosJson;

        $('.icon-btn').removeClass('icn-active');
        $('.lbls-btn').addClass('icn-active');
        // $('.ovrly').css('display', 'none');
      });
  }
  // closelbl(){
  //   $('.lbls-btn').removeClass('icn-active');
  //   $('.ovrly').css('display', 'none');
  // }

  onsharedme() {  //To View OnSharedme
    this.service.GetSharedwithMeDocumentsList()
      .subscribe(data => {
        this._obj2 = data as GACFiledto;
        this.GACDocumentList = this._obj2.Data['SharedWithMeList'].sort((a, b) => (a.rumNumber < b.rumNumber) ? 1 : -1);
      });
  }
  OnSharedExpired() { //To View OnSharedExpired
    this.service.GetSharebymeExpiredDocumentList().subscribe(data => {
      this._obj2 = data as GACFiledto;
      this.GACDocumentList = this._obj2.Data['SharedByMeExpiredList'];
    });
  }

  GACDocuments(CategoryIds, SourceIds, DocumentTypeIds, DistributorIds, ManufactureIds, DocumentSearchText, StartDate, EndDate, DocumentStatus) { //TO view Document List
    this._obj2.CategoryIds = CategoryIds;
    this._obj2.DocumentTypeIds = DocumentTypeIds;
    this._obj2.DocumentSearchText = DocumentSearchText;
    this._obj2.SourceIds = SourceIds;
    this._obj2.DistributorIds = DistributorIds;
    this._obj2.ManufactureIds = ManufactureIds;
    this._obj2.StartDate = StartDate;
    this._obj2.EndDate = EndDate;
    this._obj2.PageSize = 30;
    this._obj2.PageNumber = this.activePage;
    this._obj2.DocumentStatus = DocumentStatus;
    this.service.GACDocumentsSearch(this._obj2)
      .subscribe(data => {
        this._obj2 = data as GACFiledto;
        this.GACDocumentList = this._obj2.Data["GACDocumentList"];
      });
  }

  onstatus(_val) { //To View Under Approval
    if (_val == 'P') {
      this.status = _val;
      this.GACDocuments('', '', '', '', '', '', this._StartDate, this._EndDate, this.status);
    }
  }

  gotoMemoDetailsV2(name, id) { //To View Redirect Memos
    var url = document.baseURI + name;
    var myurl = `${url}/${id}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
    localStorage.setItem('MailId', id);
  }

  sideviw(name, documentid: string, referenceid: string, shareid: string) { //To View Row Click

    var id = documentid + "," + referenceid + "," + shareid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}/${shareid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }

  public loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
        isFound = true;
      }
    }

    if (!isFound) {
      // var dynamicScripts = ["../../../assets/js/dashboard/jquery.knob.min.js", "../../../assets/js/dashboard/jquery.peity.min.js", "../../../assets/js/dashboard/main.js"];
      var dynamicScripts = [
        environment.assetsurl + "assets/js/dashboard/jquery.knob.min.js",
        environment.assetsurl + "assets/js/dashboard/jquery.peity.min.js",
        environment.assetsurl + "assets/js/dashboard/main.js"
      ];

      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }

    }
  }
  //Tourguid_comment
  public loadScript1() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
        isFound = true;
      }
    }

    if (!isFound) {
      //dont comment this below line FROM :Aquib Shahbaz
      // var dynamicScripts = ["../../../assets/js/tour/tourguide.min.js", "../../../assets/js/tour/jquery-3.3.1.slim.min.js"];
      var dynamicScripts = [
        environment.assetsurl + "assets/js/tour/tourguide.min.js",
        environment.assetsurl + "assets/js/tour/jquery-3.3.1.slim.min.js"];

      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }

    }
  }
  // ngOnDestroy() {
  //   if (this.chart) {
  //     this.AmCharts.destroyChart(this.chart);
  //   }
  // }

  //localStorage.setItem('clickCounter', clicks);


  openpoll() {
    document.getElementById("poll-open").classList.add("active");
    document.getElementById("poll-open-btn").style.display = "none";
    document.getElementById("poll-close-btn").style.display = "block";
  }
  closepoll() {
    document.getElementById("poll-open").classList.remove("active");
    document.getElementById("poll-open-btn").style.display = "block";
    document.getElementById("poll-close-btn").style.display = "none";
  }



  UrlRedirect(val: string) {
    //alert(val);
    localStorage.removeItem('Dashboard_FilterValue');
    localStorage.setItem('Dashboard_FilterValue', val);
    this.router.navigateByUrl('backend/Inbox/Memos');
  }
  UrlRedirectPendingfromOthers(val: string) {
    //alert(val);

    this.router.navigateByUrl('backend/Inbox/' + val);
  }
  AddSuggestionOption(suggesid: number, optionid: number) {
    this.inboxService.AddUserSuggestionOption(suggesid, optionid, this.currentUserValue.createdby, 2).subscribe(
      data => {
        this._obj = data as DashboardDto;
        this._LstToSuggestion = JSON.parse(this._obj.SuggestionJson);
      }
    )
  }
  // backgroundSync() {
  //   navigator.serviceWorker.ready
  //     .then(
  //       (SwRegistration) => SwRegistration.sync.register('post-data')
  //     ).catch(console.log);
  //}
}
function createSeries(value, name, color1, color2) {
  let series = chart.series.push(new am4charts.ColumnSeries())
  var gradient = new am4core.LinearGradient();
  gradient.addColor(am4core.color(color1));
  gradient.addColor(am4core.color(color2));
  gradient.rotation = 90;
  series.columns.template.fill = gradient;
  // series.columns.template.fill = am4core.color(color);
  series.stroke = am4core.color(color1);
  series.dataFields.valueY = value
  series.dataFields.categoryX = 'Status'
  series.name = name

  series.events.on("hidden", arrangeColumns);
  series.events.on("shown", arrangeColumns);

  let bullet = series.bullets.push(new am4charts.LabelBullet())
  bullet.interactionsEnabled = false
  bullet.dy = 30;
  bullet.label.text = '{valueY}'
  bullet.label.fill = am4core.color('#ffffff')

  return series;
}
function arrangeColumns() {

  let series = chart.series.getIndex(0);

  let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
  if (series.dataItems.length > 1) {
    let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
    let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
    let delta = ((x1 - x0) / chart.series.length) * w;
    if (am4core.isNumber(delta)) {
      let middle = chart.series.length / 2;

      let newIndex = 0;
      chart.series.each(function (series) {
        if (!series.isHidden && !series.isHiding) {
          series.dummyData = newIndex;
          newIndex++;
        }
        else {
          series.dummyData = chart.series.indexOf(series);
        }
      })
      let visibleCount = newIndex;
      let newMiddle = visibleCount / 2;

      chart.series.each(function (series) {
        let trueIndex = chart.series.indexOf(series);
        let newIndex = series.dummyData;

        let dx = (newIndex - trueIndex + middle - newMiddle) * delta
        // alert(am4core.percent(100))
        // series.columns.template.height = am4core.percent(100);
        series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
        series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
      })
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // alert('loaded');
  //dom is fully loaded, but maybe waiting on images & css files
});


// $(function () {

// });

