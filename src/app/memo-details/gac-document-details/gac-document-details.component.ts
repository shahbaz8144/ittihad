import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { ShareDocumentsService } from 'src/app/_service/share-documents.service';
import { ShareDocumentsDTO } from 'src/app/_models/share-documents-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { GacdocumentapprovalService } from 'src/app/_service/gacdocumentapproval.service';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { ShuffeldocumentsService } from 'src/app/_service/shuffeldocuments.service';
import { ShuffeldocumentsDto } from 'src/app/_models/shuffeldocuments.dto';
import { MovedocumenttowarehouseService } from 'src/app/_service/movedocumenttowarehouse.service';
import { MovedocumentwarehouseDTO } from 'src/app/_models/movedocumentwarehouse-dto';
import { __values } from 'tslib';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { PDFDocumentProxy, PDFProgressData } from 'ng2-pdf-viewer/src/app/pdf-viewer/pdf-viewer.module';
import Swal from 'sweetalert2';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import * as  Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular'
import { AzureUploadService } from 'src/app/_service/azure-upload.service';
// import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
// import * as pdfjsLib from 'pdfjs-dist';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gac-document-details',
  templateUrl: './gac-document-details.component.html',
  styleUrls: ['./gac-document-details.component.css']
})
export class GacDocumentDetailsComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
  @ViewChildren(MatAutocompleteTrigger) autocompletes: QueryList<MatAutocompleteTrigger>;
  // @ViewChild('Approvecommentsfocus', { static: false }) Approvecommentsfocus!: ElementRef;
  // @ViewChild('Rejectcommentsfocus',{ static: false }) Rejectcommentsfocus!: ElementRef;
  @ViewChild('Rejectcommentsfocus') Rejectcommentsfocus?: CKEditorComponent;
  @ViewChild('Approvecommentsfocus') Approvecommentsfocus?: CKEditorComponent;
  @ViewChild('mousepoint', { static: false }) mousepoint!: ElementRef;
  @ViewChild('editors') GacDocumentDetailsComponent: CKEditorComponent;
  private progressConnectionBuilder!: HubConnection;
  readonly signalUrl = this.commonUrl.Signalurl;
  // imageSrc = 'https://yrglobaldocuments.blob.core.windows.net/documents/GAC/512277/download.jfif';
  // pdfSrc = 'https://yrglobaldocuments.blob.core.windows.net/documents/DMS/274235/311073_rptSingle_MonthlyReport%20(6).pdf';
  // pdfSrc = "https://yrglobaldocuments.blob.core.windows.net/documents/GAC/289571/Mateen(400156)-med-09-12-2022.pdf";
  _obj: GACFiledto;
  _objFilters: GACFiledto;
  _LstToUsers: any;
  _obj1: InboxDTO;
  public Editor: any = Editor;
  PhysicalSearch: string;
  ObjUserList: any[] = [];
  disablePreviousDateRD = new Date();
  disablePreviousDateFE = new Date();
  ManufactureRequired: any;
  CategoryRequired: any;
  SubCategory: any;
  Category: any;
  Manufacture: any;
  FoodExpiryDate: any;
  ReturnDate: any;
  AddNewUserValues: any = [];
  Temporaryvalues = false;
  _AdditionalDocument: any;
  _AdditionalDocumentJSON: any;
  _SourceId: any;
  _ManufactureandDistributorId: any;
  _SubCategoryId: any;
  FileuploadRequired:boolean=false;
  selectedSubCategoryNames: string[] = [];
  selectedDMName: string;
  DocumentTypeRequired: boolean = false;
  SourceRequired: boolean = false;
  // Removewarehousenamearray: any = [];
  ExpiryDateRequired: boolean = false;
  Removeblocknamearray: any = [];
  SelectedReportingUserName: any;
  Removeracknamearray: any = [];
  RemoveShelvenamearray: any = [];
  isSelectionAddUser: boolean = false;
  RefDocumentName: string = '';
  isSelectionwarehouse: boolean = false;
  isSelectionblock: boolean = false;
  disablePreviousDate = new Date();
  isSelectionrack: boolean = false;
  ShareSearch: string;
  isSelectionShelve: boolean = false;
  SelectedUserIds: any = [] = [];
  SelectedWarehouseIds: any = [] = [];
  SelectedblockIds: any = [] = [];
  _SharedocumentJSON: any;
  SelectUserErrlog: boolean = false;
  SelectedrackIds: any = [] = [];
  SelectedShelveIds: any = [] = [];
  _UserListSubList: any = [];
  _WarehouseSubList: any = [];
  _BlockSubList: any = [];
  RackSubList: any = [];
  ShelveSubList: any = [];
  isSelection_AddUsers: boolean = false;
  isSelection_warehouse: boolean = false;
  isSelection_Block: boolean = false;
  isSelection_Rack: boolean = false;
  isSelection_Shelve: boolean = false;
  SelectUsersfromhere: string;
  _IsFavorite: boolean;
  _IsPin: boolean;
  _DocumentWithII: any;
  _IsTrash: boolean;
  viewer: string;
  progress: number = 0;
  ShowProgress: boolean = false;
  UserComments: string = "";
  progressData: PDFProgressData;
  isLoaded = false;
  _shareObj: ShareDocumentsDTO;
  DocumentList: any;
  _HeaderDetails: any;
  ReferenceList: any;
  UploadedList: any;
  AddMemostoLabels: any;
  Approvecomments: any;
  Handovercomments: any;
  // SourceList: any;
  selectedReferenceId: number;
  selectedNewActionId: number;
  Rejectcomments: any;
  Receivecomments: any;
  _DateStatus: any;
  DistributorList: any;
  _documentId: string;
  _referenceId: string;
  outline: any[];
  ShareId: string;
  CompanyId: Number;
  startdate: string;
  Enddate: string;
  AccessType: string;
  SharingType: string;
  ToUserId: number;
  ObjgetCompanyList: any;
  ObjgetuserList: any;
  DocumentTypeId: any;
  DocumentTypeName: any;
  selected: string[] = [];
  selected1: string[] = [];
  user: any[] = [];
  _Versiondropdownvalue: string;
  ShareDocumentDetailsList: any = [];
  LoginUserId: number;
  currentUserSubject: BehaviorSubject<UserDTO>;
  currentUser: any;
  myFiles: string[] = [];
  _lstMultipleFiles: any;
  documentid: number
  versionid: number
  referenceid: any;
  file_upload: any;
  attachment: any;
  hideApprove: boolean = false;
  hideReject: boolean = false;
  Read: any;
  Write: any;
  checked: any;
  SelectedUsers: any[] = [];
  Temporaryvalue: any;
  _TExpiryDate: any;
  TemporaryDate: Date;
  formattedTemporaryDate: string;
  isChecked: boolean = false;
  _obj2: ShuffeldocumentsDto;
  ObjBlocksdrp: ShuffeldocumentsDto[];
  Objwarehousedrp: ShareDocumentsDTO[];
  ObjRacksdrp: ShuffeldocumentsDto[];
  Objshelvedrp: ShuffeldocumentsDto[];
  racksdrp: any;
  blockssdrp: any;
  documentTitle: string = "";
  WareHouseId: any;
  BlockId: any;
  RackId: any;
  ShelveDrp: any;
  ShelveId: Number;
  _DocumentName: string = '';
  error: any;
  page = 1;
  rotation = 0;
  zoom = 1;
  zoomScale = 'page-width';
  originalSize = false;
  pdf: any;
  renderText = true;
  _obj3: MovedocumentwarehouseDTO
  WarehouseDrp: any;
  BlockDrp: string;
  RackDrp: any;
  DocumentIds: string[]
  WareHouseStatus: any;
  currentLang: "ar" | "en" = "ar";
  mainCatalogUrl: string;
  ImgUrl: string;
  _MainCatelogUrl: any;
  _ImageUrl: any;
  src: string;
  // ShelveErrorlog: boolean = false;
  isMainDocumentActive: boolean = false;
  IsRefrenceDocumentActive:boolean = false;
  IsActionUserActive:boolean = false
  _LabelCount: number;
  _Lstlabels: any = [];
  labelid: number;
  LabelCount: number;
  AddLabelList: any = [];
  LabelUserErrorLog: boolean = false;
  SubLabelList: any = [];
  isSelectionAddLabel: boolean = false;
  SelectedLabelIds: any = [] = [];
  Addlabel: string = "";
  IsArchiveDownload: boolean = false;
  _ReportingUserId: number;
  _SelectLabel: number // Assuming _SelectLabel is an array of numbers
  SelectLabelArray = []; // Initialize the array to store selected label objects
  isSelection_AddLabel: boolean = false;
  DocumentTypeList: any;
  CategoryList: any;
  ManufactureList: any;
  _CategoryId: any;
  SubCategoryList: any;
  _DocumentTypeId: any;
  SourceList: any;
  AddDM: any;
  AddSource: any;
  DocumentType: any;
  Source: any;
  subCategory: number[] = [];
  _roleid: number;
  Note: any;
  Length: any;
  Breadth: any;
  Height: any;
  // _DocumentWith:any;
  _DocumentWith: string = '';
  selectedOption: string = '';
  _DocumentLocation: string;
  _WarehouseName: any;
  _BlockName: any;
  _RackName: any;
  _ShelveName: any;
  selectedWarehouseValue: number;
  selectedBlockValue: number;
  selectedRackValue: number;
  selectedShelveValue: any;
  RelatedWarehouses: any[] = [];
  _CompanyId: number;
  lastVersionName: string;
  _LoginUserId: number;
  pdfSrc: string | null = null;
  pageNumber: number = 1;  // Set the page number

  constructor(private route: ActivatedRoute, public service: GACFileService,
    private inboxService: InboxService,
    public Shareservice: ShareDocumentsService,
    public services: ShuffeldocumentsService,
    private _snackBar: MatSnackBar, public moveservice: MovedocumenttowarehouseService,
    public _Aprvlservice: GacdocumentapprovalService,
    public newmemoService: NewMemoService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private commonUrl: ApiurlService,
    private router: Router,
    private azureUploadService: AzureUploadService,
    // private http: HttpClient
  ) {
     // Set workerSrc using pdf.worker.entry
    //  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;
    //  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '../assets/pdf.worker.min.js';
    // pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    // Set the worker source (from CDN or local file)
    //(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.LoginUserId = this.currentUserValue.createdby;
    this._roleid = this.currentUserValue.RoleId;
    this._obj = new GACFiledto();
    this._objFilters = new GACFiledto();
    this._obj1 = new InboxDTO();
    this._obj2 = new ShuffeldocumentsDto();
    this._obj3 = new MovedocumentwarehouseDTO();
    this._shareObj = new ShareDocumentsDTO();
    this._documentId = this.route.snapshot.params['documentid'];
    this._referenceId = this.route.snapshot.params['referenceid'];
    this.ShareId = this.route.snapshot.params['shareid'];
    this._ReportingUserId = this.currentUserValue.ReportingUserId;
    this._LoginUserId = this.currentUserValue.createdby;
    // this.documentInfo(this._documentId, this._referenceId);
    this.ArchiveDetailsInfo(this._documentId, this.ShareId);
    this.incrementVersion();
    this.ObjgetCompanyList = [];
    this.ObjgetuserList = [];
    this._lstMultipleFiles = [];
    this.myFiles = [];
    this.blockssdrp = []
    this.racksdrp = []
    // this.loadPdf();
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  // loadPdf() {
  //   const pdfUrl = 'https://yrglobaldocuments.blob.core.windows.net/documents/Archive/111/1738741135330_MMAH%20DMS%20-%20BRD.pdf';
  //   this.http.get(pdfUrl, { responseType: 'blob' }).subscribe(blob => {
  //     this.pdfSrc = URL.createObjectURL(blob);
  //   }, error => {
  //     console.error('Error fetching PDF:', error);
  //   });
  // }

  async SignalRMethods() {

    //Creation Connection of Progress bar for file upload
    //start here
    this.progressConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'progressHub?userId=' + this.currentUserValue.createdby)
      .build();
    //End here
  }
  ngOnInit(): void {
    this.LoginUserId = this.currentUserValue.createdby;
    this.IsArchiveDownload = this.currentUserValue.IsArchiveDownload;
    if (this.currentUserValue.RoleId == 502) {
      this.IsArchiveDownload = true;
    }
    this.languageValuesAssign();
    this.isMainDocumentActive = true;
    this.SubCategoryAPI();
    const datepicker = document.getElementById('txtstartdate');
    const today = new Date();
    let date = today.getDate() > 9 ? today.getDate() :
      `0${today.getDate()}`;
    let month = today.getMonth() > 9 ? today.getMonth() + 1 :
      `0${today.getMonth() + 1}`;
    let year = today.getFullYear();

    datepicker.setAttribute('min', `${year}-${month}-${date}`);
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-none");
  }
  Favorites(DocumentId: number, ShareId: number, IsFavorite: boolean) {

    this.service.DocumentsArchiveFavorite(DocumentId, ShareId, IsFavorite).subscribe(
      data => {
        this._IsFavorite = !IsFavorite;
        //this.documentInfo(this._documentId, this._referenceId);
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
        }
      }
    );
  }



  VersionDropdown(name, version: string, documentId: string, _shareId: string) {
    this._Versiondropdownvalue = version;
    const versionNumber = parseFloat(this._Versiondropdownvalue);
    // if (status !== 'In Active') {
    //   // Handle the click event only if status is not 'InActive'
    //   console.log('Selected Version:', version);

    // Update the values
    this._documentId = documentId;
    this._referenceId = '0'; // Set according to your logic
    this.ShareId = _shareId; // Set according to your logic

    var id = documentId + "," + 0 + "," + _shareId;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentId}/${0}/${_shareId}`;
    // const url = `${document.baseURI}${name}/${documentId}/${0}/${_shareId}`;
    window.location.href = myurl;
    // var myWindow = window.open(myurl, id);
    // myWindow.focus();

    // }
  }


  incrementVersion() {
    if (!this.DocumentList || !Array.isArray(this.DocumentList)) {
      // console.error('DocumentList is not initialized or not an array');
      return;
    }

    this.DocumentList.forEach((element) => {
      if (element.VersionJsonSorted && Array.isArray(element.VersionJsonSorted)) {
        let lastVersion = element.VersionJsonSorted[element.VersionJsonSorted.length - 1];
        if (lastVersion && lastVersion.VersionName) {
          let lastVersionName = lastVersion.VersionName;
          let newVersionNumber = parseFloat(lastVersion.VersionName) + 1.0;
          let newVersionString = newVersionNumber.toFixed(1);

          this._Versiondropdownvalue = newVersionString;
          this.lastVersionName = lastVersionName;

          // console.log('Last Version Name:', this.lastVersionName);
          // console.log('New Version String:', this._Versiondropdownvalue);

          // Optional: Uncomment alerts for debugging
          // alert(this.lastVersionName);
          // alert(newVersionString);

          this.router.navigate(['/backend/NewArchive'], {
            queryParams: {
              docname: this._DocumentName,
              docid: this._documentId,
              Versionid: this._Versiondropdownvalue,
              ReferenceId: this._referenceId,
              ShareId: this.ShareId
            }
          });
        } else {
          // console.warn('Last version or VersionName is missing');
        }
      } else {
        // console.warn('VersionJsonResault is missing or not an array');
      }
    });
  }





  DeleteDocuments(_status: boolean) {
    const lang: any = localStorage.getItem('language');
    // Check if memo is already deleted
    if (this._IsTrash == true) {
      Swal.fire({
        title: lang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?",
        text: lang === 'ar' ? "هل تريد المتابعة في استعادة هذا المذكرة؟" : "Do you want to proceed with Restored this document",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: lang === 'ar' ? "نعم، استعدها!" : "Yes, Restored it!",
        cancelButtonText: lang === 'ar' ? "إلغاء" : "Cancel" // Set cancel button text based on language
      }).then((result) => {
        if (result.isConfirmed) {
          // User confirmed restore action
          this._IsTrash = false; // Assuming this is what you need to do
          // Call restoreMemo API
          this.restoreMemo(_status);
        }
      });
    } else if (this._IsTrash == false) { // Corrected condition
      // Memo is not deleted, confirm deletion
      Swal.fire({
        title: lang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?",
        text: lang === 'ar' ? "هل تريد المتابعة في حذف هذه المذكرة؟" : "Do you want to proceed with deleting this document",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: lang === 'ar' ? "نعم، احذفها!" : "Yes, delete it!",
        cancelButtonText: lang === 'ar' ? "إلغاء" : "Cancel" // Set cancel button text based on language
      }).then((result) => {
        if (result.isConfirmed) {
          // User confirmed delete action
          this._IsTrash = true; // Assuming this is what you need to do
          // Call deleteMemo API
          this.deleteMemo1(_status);
        }
      });
    }
  }


  LoadDocument(path: string, filename: string) {
    let name = "Memo/ArchiveView";
    var rurl = document.baseURI + name;
    var encoder = new TextEncoder();
    let _uu = "https://yrglobaldocuments.blob.core.windows.net/documents/" + path;
    let url = encoder.encode(_uu);
    let encodeduserid = encoder.encode(this.currentUserValue.createdby.toString());
    var myurl = rurl + "/url?url=" + url + "&" + "uid=" + encodeduserid + "&" + "filename=" + filename + "&" + "IsConfidential=" + 0 + "&type=2";;
    var myWindow = window.open(myurl, url.toString());
    myWindow.focus();
  }


  // LoadDocument(url1: string, filename: string, MailDocId: number) {

  //   let name = "Memo/ArchiveView";
  //   var rurl = document.baseURI + name;
  //   var encoder = new TextEncoder();
  //   let url = encoder.encode(url1);

  //   let encodeduserid = encoder.encode(this.currentUserValue.createdby.toString());
  //   filename = filename.replace(/%/g, "%25");
  //   filename = filename.replace(/#/g, "%23");
  //   filename = filename.replace(/&/g, "%26");


  //   // var myurl = `${rurl}/url?url=${url}&uid=${encodeduserid}&filename=${filename}&type=1&MailDocId=${MailDocId}&MailId=${this._MemoId}&ReplyId=${this._ReplyId}&LoginUserId=${this._LoginUserId}&IsConfidential=${this._IsConfidential}&AnnouncementDocId=0`;


  //   var myurl = rurl + "/url?url=" + url + "&" + "uid=" + encodeduserid + "&" + "filename=" + encoder.encode(filename) + "&type=1" + "&" + "MailDocId=" + MailDocId + "&" + "MailId=" + this._MemoId + "&" + "ReplyId=" + this._ReplyId + "&" + "LoginUserId=" + this._LoginUserId + "&" + "IsConfidential=" + this.IsConfidential + "&" + "AnnouncementDocId=" + 0;
  //   var myWindow = window.open(myurl, url.toString());
  //   myWindow.focus();

  // }
  restoreMemo(_status: boolean) {
    const TrashDocument = [{
      ShareId: this.ShareId,
      DocumentId: this._documentId,
      IsTrash: _status
    }];
    this._obj.trashjson = JSON.stringify(TrashDocument);
    this.service.DocumentsDelete(this._obj).subscribe(
      data => {
        this._IsTrash = _status;
      }
    );
  }
  deleteMemo1(_status: boolean) {
    const TrashDocument = [{
      ShareId: this.ShareId,
      DocumentId: this._documentId,
      IsTrash: _status
    }];
    this._obj.trashjson = JSON.stringify(TrashDocument);
    this.service.DocumentsDelete(this._obj).subscribe(
      data => {
        this._IsTrash = _status;
      }
    );
  }

  DocumentPin(DocumentId: number, ShareId: number, IsPin: boolean) {
    // const PinDocument = [{
    //   ShareId: this.ShareId,
    //   DocumentId: this._documentId,
    //   IsPin: IsPin
    // }];
    // this._obj.Ispinjson = JSON.stringify(PinDocument);
    // console.log(JSON.stringify(PinDocument), "Pin value");
    this.service.PinArchiveDocuments(DocumentId, ShareId, IsPin).subscribe(
      data => {
        this._IsPin = IsPin;
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
        }
      }
    );
  }

  languageValuesAssign() {
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    localStorage.setItem('language', lang);
    if (this.currentLang === 'ar') {
      // alert(lang);
      const cssFilePath = 'assets/i18n/arabic.css';

      // Create a link element for the CSS file
      const link = this.renderer.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssFilePath;

      // Set an id attribute to identify the link element
      link.id = 'arabicCssLink';

      // Append the link element to the document head
      this.renderer.appendChild(document.head, link);
    } else if (this.currentLang === 'en') {
      // alert(lang);
      const linkElement = document.getElementById('arabicCssLink');
      if (linkElement && linkElement.parentNode) {
        // console.log('Removing Arabic styles');
        this.renderer.removeChild(document.head, linkElement);
      } else {
        // console.log('Link element not found or already removed');
      }
    }
  }
  _DocumentStatus: any;
  _AccessType: any;
  documentInfo(documentid, referenceid) {
    this._obj.DocumentId = parseInt(documentid);
    this._obj.ReferenceId = parseInt(referenceid);
    this._obj.ShareId = parseInt(this.ShareId);
    this._obj.CreatedBy = this.LoginUserId;
    this.service.GACDocumentDetails(this._obj)
      .subscribe(data => {
        console.log(data, "Document details API Data");
        this._obj = data as GACFiledto;
        this.DocumentList = this._obj.Data["DocumentList"];

        this.DocumentList.forEach((element, index) => {
          // Check if VersionJsonResault exists and is an array
          if (element.VersionJsonResault && Array.isArray(element.VersionJsonResault)) {
            // Find the version that matches the current element's DocumentId
            const matchedVersion = element.VersionJsonResault.find(version => version.DocumentId === element.DocumentId);

            if (matchedVersion) {
              this._Versiondropdownvalue = matchedVersion.VersionName;
              console.log(this._Versiondropdownvalue, "VersionName for DocumentId:", element.DocumentId);
            } else {
              console.log("No matching VersionName found for DocumentId:", element.DocumentId);
            }
          } else {
            console.error("VersionJsonResault is undefined or not an array for DocumentId:", element.DocumentId, "at index:", index);
          }
        });

        this.DocumentList.forEach((element) => {
          if (element.VersionJsonResault && Array.isArray(element.VersionJsonResault)) {
            let lastVersion = element.VersionJsonResault[element.VersionJsonResault.length - 1];
            if (lastVersion && lastVersion.VersionName) {
              let lastVersionName = lastVersion.VersionName;
              let newVersionNumber = parseFloat(lastVersion.VersionName) + 1.0;
              let newVersionString = newVersionNumber.toFixed(1);

              this.lastVersionName = newVersionString;

              console.log('Last Version Name:', this.lastVersionName);


            }
          }
        });

        // this._ReportingUserId = this.DocumentList[0].ReportingUserId;
        // console.log(this.DocumentList, "Document List");
        // this._DocumentStatus = this.DocumentList[0].DocumentStatus;
        // this._AccessType = this.DocumentList[0].AccessType;
        // this._HeaderDetails = this._obj.Data["HeaderDetails"];
        // if (this._HeaderDetails && this._HeaderDetails.length > 0) {
        //   this._IsFavorite = this._HeaderDetails[0].IsFavorite;
        //   console.log(this._IsFavorite, "Favorite");
        // }
        // if (this._HeaderDetails && this._HeaderDetails.length > 0) {
        //   this._IsPin = this._HeaderDetails[0].IsPin;
        // }
        // if (this._HeaderDetails && this._HeaderDetails.length > 0) {
        //   this._IsTrash = this._HeaderDetails[0].IsTrash;
        // }
        // if (this._HeaderDetails && this._HeaderDetails.length > 0) {
        //   this._LabelCount = this._HeaderDetails[0].LabelCount;
        //   this.SelectLabelArray = this._HeaderDetails[0].LabelIds.split(',');
        //   console.log(this.SelectLabelArray, "SelectLabelArray List");
        // }
        if (this.DocumentList && this.DocumentList.length > 0) {
          this._DocumentName = this.DocumentList[0].DocumentName;
        }
        if (this.DocumentList && this.DocumentList.length > 0) {
          this._MainCatelogUrl = this.DocumentList[0].MainCatelogUrl;
        }
        // this._DocumentName = this.DocumentList[0].DocumentName;
        // this._MainCatelogUrl = this.DocumentList[0].MainCatelogUrl;
        this.mainCatalogUrl = "https://yrglobaldocuments.blob.core.windows.net/documents/" + this._MainCatelogUrl;
        let scontenttype = '';
        // console.log(this.mainCatalogUrl,"Sending Data");
        this.inboxService.PathExtention(this.mainCatalogUrl).subscribe(
          da => {
            // console.log(da,"Pdf Data")
            scontenttype = da["contentType"];
            let contenttype = scontenttype;//decoder.decode(new Uint8Array(arrct));

            let officetext = ".ppt, .pptx, .doc, .docx, .xls, .xlsx";
            let office = officetext.includes(contenttype.toLowerCase());

            let googletext = ".txt,.css, .html, .php, .c, .cpp, .h, .hpp, .js, .pages, .ai, .psd, .tiff, .dxf, .svg, .eps, .ps, .ttf, .xps, .zip, .rar";
            let google = googletext.includes(contenttype.toLowerCase());

            let pdftext = ".pdf, .application/pdf"
            let pdf = pdftext.includes(contenttype.toLocaleLowerCase());

            let Imagetext = ".jpg, .jpeg, .webp, .avif, .jfif, .svg, .ico, .gif .image/jpg, .image/png, .png"
            let Image = Imagetext.includes(contenttype.toLocaleLowerCase());

            // let Audiotext = ".mp3, .wav, .ogg"
            // let Audio = Audiotext.includes(contenttype.toLocaleLowerCase());

            // let Videotext = ".mp4, .mov, .wmv, .avi, .webm"
            // let Video = Videotext.includes(contenttype.toLocaleLowerCase());

            if (office) {
              this.viewer = "office";
            }
            else if (google) {
              this.viewer = "google";
            }
            else if (pdf) {
              this.viewer = "pdf";
              this.ShowProgress = true;
              // this.progress=75;
            }
            else if (Image) {
              this.viewer = "image";
            }
            // else if (Audio) {
            //   this.viewer = "Audio";
            // }
            // else if (Video) {
            //   this.viewer = "Video";
            // }
            else {
              this.viewer = "";
            }
          });
        // this.ReferenceList = this._obj.Data["ReferenceList"];
        // console.log(this.ReferenceList, "ReferenceList");
        // this.UploadedList = this._obj.Data["UploadedList"];
        // console.log(this.UploadedList, "Admin List");
        // this.ShareDocumentDetailsList = this._obj.Data["ShareDocumentDetails"];
        // console.log(this.ShareDocumentDetailsList, "User List Data");
        // console.log(this.ShareDocumentDetailsList, "ShareDocumentUsers");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-none");
      });
  }
  subCategoryNames: any[] = [];
  _VersionJsonResault: any;
  UserActionJson: any;
  SenderName: any;
  SenderNamedesgin: any;
  _WorkFlowId: any;
  _WorkFlowName: any;
  _IsFullAccess: boolean = false;
  selected_ActionIds: number;
  selected_WorkFlowIds: number;
  selected_SortIds: number[] = [];
  ArchiveDetailsInfo(documentid, ShareId) {
    this._obj.DocumentId = parseInt(documentid);
    this._obj.ShareId = parseInt(ShareId);
    this._obj.CreatedBy = this.LoginUserId;
    this.service.ArchiveDocumentDetails(this._obj)
      .subscribe(data => {
        console.log(data, "Document details API Data");
        this._obj = data as GACFiledto;
        this.DocumentList = this._obj.Data["ArchiveJson"];

        console.log(this.DocumentList, "DocumentList")
        this.ReferenceList = this.DocumentList[0]['ReferenceJson'];
        console.log(this.ReferenceList, "ReferenceList");
        this._DocumentName = this.DocumentList[0].DocumentName;
        this._LabelCount = this.DocumentList[0].LabelCount;
        this.SelectLabelArray = this.DocumentList[0].LabelIds.split(',');
        console.log(this.SelectLabelArray, "SelectLabelArray");
        this._IsFavorite = this.DocumentList[0].IsFavorite;
        this._IsTrash = this.DocumentList[0].IsDeleted;
        this._IsPin = this.DocumentList[0].IsPin;
        this.UserActionJson = this.DocumentList[0].UserActions;
        this.SenderName = this.DocumentList[0].DisplayName;
        this.SenderNamedesgin = this.DocumentList[0].DesignationName;
        this._WorkFlowId = this.DocumentList[0].WorkFlowId;
        this._WorkFlowName = this.DocumentList[0].WorkFlowName;
        this._IsFullAccess = this.DocumentList[0].IsFullAccess;
        this.ShareDocumentDetailsList = this.DocumentList[0]["UserListJsonSorted"];
        console.log(this.ShareDocumentDetailsList, "ShareDocumentDetailsList");
        this.subCategoryNames = this.DocumentList.flatMap(doc =>
          doc.SubCategoryJson?.map(item => item.SubCategoryName) || []
        );
        console.log(this.subCategoryNames, "SubCategory Names");
        this._VersionJsonResault = this.DocumentList[0].VersionJsonSorted;
        console.log(this._VersionJsonResault, "VersionJsonSorted");
        this.DocumentList.forEach((element) => {
          if (element.VersionJsonSorted && Array.isArray(element.VersionJsonSorted)) {
            let lastVersion = element.VersionJsonSorted[element.VersionJsonSorted.length - 1];

            if (lastVersion && lastVersion.VersionName) {
              let newVersionNumber = parseFloat(lastVersion.VersionName) + 1.0;
              let newVersionString = newVersionNumber.toFixed(1);

              this.lastVersionName = newVersionString;

              console.log('Last Version Name:', this.lastVersionName);
            }
          }
        });
        if (this.DocumentList && this.DocumentList.length > 0) {
          this.mainCatalogUrl = this.DocumentList[0].Url;
        }
        let scontenttype = '';
        
        this.inboxService.PathExtention(this.mainCatalogUrl).subscribe(
          da => {
            // console.log(da,"Pdf Data")
            scontenttype = da["contentType"];
            let contenttype = scontenttype;//decoder.decode(new Uint8Array(arrct));

            let officetext = ".ppt, .pptx, .doc, .docx, .xls, .xlsx";
            let office = officetext.includes(contenttype.toLowerCase());

            let googletext = ".txt,.css, .html, .php, .c, .cpp, .h, .hpp, .js, .pages, .ai, .psd, .tiff, .dxf, .svg, .eps, .ps, .ttf, .xps, .zip, .rar";
            let google = googletext.includes(contenttype.toLowerCase());

            let pdftext = ".pdf, .application/pdf"
            let pdf = pdftext.includes(contenttype.toLocaleLowerCase());

            let Imagetext = ".jpg, .jpeg, .webp, .avif, .jfif, .svg, .ico, .gif .image/jpg, .image/png, .png"
            let Image = Imagetext.includes(contenttype.toLocaleLowerCase());

            // let Audiotext = ".mp3, .wav, .ogg"
            // let Audio = Audiotext.includes(contenttype.toLocaleLowerCase());

            // let Videotext = ".mp4, .mov, .wmv, .avi, .webm"
            // let Video = Videotext.includes(contenttype.toLocaleLowerCase());

            if (office) {
              this.viewer = "office";
            }
            else if (google) {
              this.viewer = "google";
            }
            else if (pdf) {
              this.viewer = "pdf";
              this.ShowProgress = true;
              // this.progress=75;
            }
            else if (Image) {
              this.viewer = "image";
            }
            // else if (Audio) {
            //   this.viewer = "Audio";
            // }
            // else if (Video) {
            //   this.viewer = "Video";
            // }
            else {
              this.viewer = "";
            }
          });


        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-none");
      });
  }


  ReferenceView(ImageUrl, DocumentName, index: number) {
    this.selectedReferenceId = index;
    this.RefDocumentName = DocumentName;
    this._ImageUrl = ImageUrl;
    this.mainCatalogUrl = ImageUrl;
    let scontenttype = '';
    this.inboxService.PathExtention(ImageUrl).subscribe(
      da => {
        // console.log(da,"Pdf Data")
        scontenttype = da["contentType"];
        let contenttype = scontenttype;//decoder.decode(new Uint8Array(arrct));

        let officetext = ".ppt, .pptx, .doc, .docx, .xls, .xlsx";
        let office = officetext.includes(contenttype.toLowerCase());

        let googletext = ".txt,.css, .html, .php, .c, .cpp, .h, .hpp, .js, .pages, .ai, .psd, .tiff, .dxf, .svg, .eps, .ps, .ttf, .xps, .zip, .rar";
        let google = googletext.includes(contenttype.toLowerCase());

        let pdftext = ".pdf, .application/pdf"
        let pdf = pdftext.includes(contenttype.toLocaleLowerCase());

        let Imagetext = ".jpg, .jpeg, .webp, .avif, .jfif, .svg, .ico, .gif .image/jpg, .image/png, .png"
        let Image = Imagetext.includes(contenttype.toLocaleLowerCase());

        if (office) {
          this.viewer = "office";
        }
        else if (google) {
          this.viewer = "google";
        }
        else if (pdf) {
          this.viewer = "pdf";
          this.ShowProgress = true;
        }
        else if (Image) {
          this.viewer = "image";
        }
        else {
          this.viewer = "";
        }
        // $(".kt-doc-detail").removeClass("active");  

        this.IsRefrenceDocumentActive = true;
        this.isMainDocumentActive = false;
        this.IsActionUserActive = false;
        this.selectedNewActionId = null;
      });

  }

  MainDocumentView(Url) {

    this._MainCatelogUrl = Url;
    this.mainCatalogUrl = Url;
    console.log(this.mainCatalogUrl, "URL");
    let scontenttype = '';
    this.inboxService.PathExtention(Url).subscribe(
      da => {
        // console.log(da,"Pdf Data")
        scontenttype = da["contentType"];
        let contenttype = scontenttype;//decoder.decode(new Uint8Array(arrct));

        let officetext = ".ppt, .pptx, .doc, .docx, .xls, .xlsx";
        let office = officetext.includes(contenttype.toLowerCase());

        let googletext = ".txt,.css, .html, .php, .c, .cpp, .h, .hpp, .js, .pages, .ai, .psd, .tiff, .dxf, .svg, .eps, .ps, .ttf, .xps, .zip, .rar";
        let google = googletext.includes(contenttype.toLowerCase());

        let pdftext = ".pdf, .application/pdf"
        let pdf = pdftext.includes(contenttype.toLocaleLowerCase());

        let Imagetext = ".jpg, .jpeg, .webp, .avif, .jfif, .svg, .ico, .gif .image/jpg, .image/png, .png"
        let Image = Imagetext.includes(contenttype.toLocaleLowerCase());

        if (office) {
          this.viewer = "office";
        }
        else if (google) {
          this.viewer = "google";
        }
        else if (pdf) {
          this.viewer = "pdf";
          this.ShowProgress = true;
        }
        else if (Image) {
          this.viewer = "image";
        }
        else {
          this.viewer = "";
        }
      });
    // $(".refer-doc").removeClass("active");
    // $(".kt-doc-detail").addClass("active");
    this.selectedReferenceId = null; // Deactivate all reference views
    this.isMainDocumentActive = true;
    this.selectedNewActionId = null;
    this.IsActionUserActive = false;
    this.IsRefrenceDocumentActive = false;
        
  }

  _UserActionsDetails:any = [];
  ViewNewActionUsers(_documentId: string, index:number,ShareId:number) {
    this.selectedNewActionId = index;
    this._obj1.OrganizationId = this.currentUserValue.organizationid;
    this._obj1.DocumentId = parseInt(this._documentId);
    this._obj1.ShareId = ShareId;
    this.inboxService.UserActionListArchiveDetailsAPI(this._obj1)
      .subscribe(data => {
        console.log(data, "NewActionUser Details");
        this._UserActionsDetails = JSON.parse(data['userActionDetails']);
        console.log(this._UserActionsDetails , "UserActions details List");
        this.isMainDocumentActive = false;
        this.IsActionUserActive = true;
        this.selectedReferenceId = null;
        this.IsRefrenceDocumentActive = false;
      })
  }

  

  DownloadFile() {
    if (this.isMainDocumentActive) {
      this.download(this.DocumentList[0].MainCatelogUrl, this._DocumentName);
    }
    else if (this.selectedReferenceId) {
      const selecteddoc: any = this.ReferenceList.find((item: any) => item.ReferenceId == this.selectedReferenceId);
      this.download(selecteddoc.ImageUrl, selecteddoc.DocumentName);
    }

  }
  download(url, filename) {
    this.ImgUrl = "https://yrglobaldocuments.blob.core.windows.net/documents/" + url;
    this._obj.MailId = 0;
    this._obj.MailDocId = parseInt(this._documentId);
    this._obj.CreatedBy = this.LoginUserId;
    this._obj.AnnouncementDocId = 0;
    this.newmemoService.DownloadAttachment(this._obj1).subscribe(
      data => {
        this._obj = data as GACFiledto;
        console.log(this._obj, "Download Data");
        fetch(this.ImgUrl).then(function (t) {
          return t.blob().then((b) => {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", filename);
            a.click();
          }
          );
        });
      })
  }

  async UpdateArchivrStatusWithComments(ActionId: number, ApprovalStatus: string) {
    try {
      for (const element of this.UserActionJson) {
        if (element.ActionId === ActionId) {
          // Use await if UpdateArchiveStatus is asynchronous
          await this.UpdateArchiveStatus(element.SortId, ActionId, element.WorkFlowId, ApprovalStatus);
          break; // Break out of the loop once the matching ActionId is found
        }
      }
    } catch (error) {
      console.error('Error updating archive status:', error);
    }
  }



  async UpdateArchiveStatus(SortId: number, ActionId: number, WorkFlowId: number, ApprovalStatus: string) {
    this._obj.SortId = SortId;
    this._obj.ActionId = ActionId;
    this._obj.WorkFlowId = WorkFlowId;
    this._obj.DocumentStatus = ApprovalStatus;
    this.Approvecomments = this.Approvecomments || "";
    this.Rejectcomments = this.Rejectcomments || "";
    if (this.Approvecomments.trim() === "" && this.Rejectcomments.trim() === "") {
      this._obj.comments = "";
    } else if (ApprovalStatus == 'Approved') {
      this._obj.comments = this.Approvecomments;
    } else if (ApprovalStatus == 'Reject') {
      this._obj.comments = this.Rejectcomments;
    }
    this._obj.DocumentId = parseInt(this._documentId);
    const response = await this.service.ArchiveStatusAPI(this._obj);

    try {
      debugger
      const extractedValues = this._lstMultipleFilesAprandrej.map((file) => ({
        FileName: file.FileName,
        CloudName: file.CloudName,
        IsMain: false,
        Url: file.Url 
      }));
      const destinationContainer = "documents"; // Set destination container value
      const jsonResult = {
        sourcePaths: extractedValues.map((file) => file.Url), // Extract URLs
        destinationContainer: destinationContainer,
        destinationFolder: 'Archive/', //mention gac folder path
      };
      console.log(JSON.stringify(jsonResult), "CopyFiles");

      const DeletedJson = extractedValues.map(file => ({
        fullPath: file.Url,
      }));

      // Convert the resulting array to a JSON string
      const jsonString = JSON.stringify(DeletedJson);
      console.log(jsonString, "DeletedJson");
      const extractedValuesJson = JSON.stringify(extractedValues);
      console.log(extractedValuesJson, "extractedValuesJson");

      this._obj.createdBy = this.currentUserValue.createdby;
      this._obj.DocumentId = parseInt(this._documentId);
      this._obj.ActionId = this.ActionId;

      this._obj.copyFiles = JSON.stringify(jsonResult);
      this._obj.deletedJson = jsonString;
      this._obj.extractedValuesJson = extractedValuesJson;

      const data = await this.service.NewReferenceDocument(this._obj);
      console.log(data, "Add Reference Document API Data");

      if (data["message"] === '1') {
        this._snackBar.open('Document Uploaded Successfully', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ['blue-snackbar']
        });
        document.getElementById("approvecommentsModal").style.display = "none";
        document.getElementById("approvecommentsModal").classList.remove("show");
        document.getElementById("approvecommentsModalBackdrop").style.display = "none";
        document.getElementById("approvecommentsModalBackdrop").classList.remove("show");

        document.getElementById("rejectcommentsModal").style.display = "none";
        document.getElementById("rejectcommentsModal").classList.remove("show");
        document.getElementById("rejectcommentsModalBackdrop").style.display = "none";
        document.getElementById("rejectcommentsModalBackdrop").classList.remove("show");

        this.ArchiveDetailsInfo(this._documentId, this.ShareId);
      }

      // Reset the list of files after the upload
      this._lstMultipleFilesAprandrej = [];
    } catch (error) {
      console.error('Error uploading reference document:', error);
      // Optionally, show an error snackbar or handle the error further
      this._snackBar.open('Document upload failed. Please try again.', 'End now', {
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
        panelClass: ['red-snackbar']
      });
    }
  }

  

  closeInfo() {
    this.SelectedNewActionsList = [];
    this.NewActionUser.forEach(element => {
      element.Check = false;
    });
    document.getElementById("shareview").classList.remove("kt-quick-panel--on");
    document.getElementById("addref").classList.remove("kt-quick-panel--on");
    document.getElementById("useraction").classList.remove("kt-quick-panel--on");
    document.getElementById("doc-activity").classList.remove("kt-quick-panel--on");
    document.getElementById("doc-shared").classList.remove("kt-quick-panel--on");
    document.getElementById("edit-document").classList.remove("kt-quick-panel--on");
    document.getElementById("moredet").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

    this.CompanyId = null;
    this.ToUserId = null;
    // this.ShelveErrorlog = false;
    this.AddNewUserValues = [];
    // this.Removewarehousenamearray = [];
    // this.SelectedWarehouseIds = [];
    // this.Removeblocknamearray = [];
    // this.SelectedblockIds = [];
    // this.Removeracknamearray = [];
    // this.SelectedrackIds = [];
    // this.RemoveShelvenamearray = [];
    // this.SelectedShelveIds = [];
    this.startdate = null;
    this.Enddate = null;
    // this.WarehouseDrp = null;
    // this.BlockDrp = null;
    // this.RackDrp = null;
    // this.ShelveDrp = null;
    // var radio1 = document.getElementById('r1') as HTMLInputElement | null;
    // radio1.checked = true;

    // var radio2 = document.getElementById('r2') as HTMLInputElement | null;
    // radio2.checked = false;

    // var radio3 = document.getElementById('r3') as HTMLInputElement | null;
    // radio3.checked = false;
  }



  DocumentStatusChange(status, docid) {
    if (status === 'V') {
      this._obj.comments = this.Approvecomments || "";
    } else if (status === 'R') {
      this._obj.comments = this.Rejectcomments || "";
    } else {
      this._obj.comments = "";
    }

    this._obj.DocumentStatus = status;
    this._obj.DocumentId = docid;
    this._Aprvlservice.GACDocumentStatusChange(this._obj).subscribe(data => {
      this._obj = data as GACFiledto;
      if (this._obj.message == "1") {
        this._snackBar.open('Status Updated Successfully', 'End now', {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
        this.documentInfo(this._documentId, this._referenceId);
      }
    })
    // document.getElementById("docview").classList.remove("kt-quick-panel--on");
    // document.getElementById("scrd").classList.remove("position-fixed");
    // document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    //this.GetDocumentsByStatus('p');
  }
  NewUpdateDocumentName() {
    this._obj.DocumentId = parseInt(this._documentId);
    this._obj.DocumentName = (<HTMLInputElement>document.getElementById("txtSubject")).value;
    if (this._obj.DocumentName == "") {
      alert('Enter document name');
      return false;
    }
    this._Aprvlservice.GACUpdateDocumentName(this._obj).subscribe(data => {
      this._snackBar.open('Updated Successfully', 'End now', {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
      });
      this.documentInfo(this._documentId, this._referenceId);
    })
  }

  addrefer() {
    this._lstMultipleFiles = [];
    document.getElementById("addref").classList.add("kt-quick-panel--on");
    document.getElementById("moredet").classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }

  NewActionUser: any[] = [];
  NewUsersDropdownAPI() {

  }




  useraction() {
    this._obj1.CreatedBy = this.currentUserValue.createdby;
    this._obj1.organizationid = this.currentUserValue.organizationid;
    this._obj1.DocumentId = parseInt(this._documentId);
    this.inboxService.ShareUserList(this._obj1)
      .subscribe(data => {
        console.log(data, "add Users");
        var _UsersLst = data["Data"].UserJson;
        this._LstToUsers = _UsersLst;
        this._LstToUsers.forEach(element => {
          this.NewActionUser.push({
            UserId: element.UserId,
            ContactName: element.ContactName,
            disabled: false
          })
        });
      });
    this.NewActionUser = [];
    this.NewActionUser.forEach(element => {
      element.Check = false;
    });
    document.getElementById("useraction").classList.add("kt-quick-panel--on");
    document.getElementById("moredet").classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  sharesideviw() {
    document.getElementById("share_physical_div").classList.remove("d-block");
    this._shareObj.DocumentId = parseInt(this._documentId);
    this.Shareservice.NewGetCheckAvailibility(this._shareObj).subscribe(data => {
      this._shareObj = data as ShareDocumentsDTO;
      if (this._shareObj.Message == "I") {
        document.getElementById("share_physical_div").classList.add("d-block");
      }
      else {
        document.getElementById("share_physical_div").classList.add("d-none");
      }
      this.SharingType = "Electronic";
      this.AccessType = "1";
      document.getElementById("shareview").classList.add("kt-quick-panel--on");
      document.getElementById("moredet").classList.add("position-fixed");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
      // this.GetDropdown();
    });
  }

  OnWarehouse() {
    this.services.GetwarehouseData().subscribe(data => {
      this.Objwarehousedrp = data as [];
      console.log(this.Objwarehousedrp, "warehouse data");
    })
  }


  AddCategorys() {
    document.getElementById("fileupload-event-modal-backdrop category").style.display = "block";
    document.getElementById("AddCategory").style.display = "block";
  }

  _SubCategoryJson: any[];
  SubCategoryLists: any[] = []
  SubCategoryAPI() {
    this.service.GetSubCategory(this.currentUserValue.organizationid).subscribe(data => {
      console.log(data, "GetSubCategory API Data");
      this._SubCategoryJson = data["Data"].SubCategoryJson;
      this._SubCategoryJson.forEach(element => {
        this.SubCategoryLists.push({
          SubCategoryId: element.SubCategoryId,
          SubCategoryName: element.SubCategoryName,
          FullPath: element.FullPath,
          Check: false,
        });

      });
      console.log(this.SubCategoryLists, "Sub category List");
    });
  }

  SelectedCategory: any[] = [];
  updateSelectedCategoryValues(SubCategoryId: number, event: any) {


    const isChecked = event.checked;
    this.SubCategoryLists.forEach(element => {
      if (element.SubCategoryId === SubCategoryId) {
        element.Check = isChecked;
      }
    });
    this.SelectedCategory = [];
    this.SubCategoryLists.forEach(element => {
      if (element.Check) {
        this.SelectedCategory.push(element);
      }
    });
  }
  CategorySearch:string;
  AddSelectCategory() {
    this.CategorySearch = "";
    document.getElementById("fileupload-event-modal-backdrop category").style.display = "none";
    document.getElementById("AddCategory").style.display = "none";
  }

  close_category() {
    // this.SelectedRequiredapprovalUsers = [];
    // this.ObjRequiredApprovalList.forEach(element => {
    //   element.isChecked = false;
    // });
    document.getElementById("fileupload-event-modal-backdrop category").style.display = "none";
    document.getElementById("AddCategory").style.display = "none";
  }

  RemoveCategory(SubCategoryId: number): void {
    this.SelectedCategory = this.SelectedCategory.filter(user => user.SubCategoryId !== SubCategoryId);
    this.SubCategoryLists.forEach(element => {
      if (element.SubCategoryId === SubCategoryId) {
        element.Check = false; // Set disabled to false
      }
    });
  }
  edit_doc_details() {
    this._objFilters.OrganizationId = this.currentUserValue.organizationid;
    this._objFilters.CreatedBy = this.currentUserValue.createdby;
    this.service.GetDropdownList(this._objFilters)
      .subscribe(data => {
        console.log(data, "CJ and DJ and DTJ and DMJ and CJ");
        this._obj = data as GACFiledto;
        this.DocumentTypeList = this._obj.Data["DocumentTypeJson"];
        this.ManufactureList = this._obj.Data["DistributorAndManufactureJson"];
        this.CategoryList = this._obj.Data["CategoryJson"];
      });
    this._DocumentName = this.DocumentList[0].DocumentName;
    this.Note = this.DocumentList[0].Description;
    // this.Length = this.DocumentList[0].Length;
    // this.Breadth = this.DocumentList[0].Breadth;
    // this.Height = this.DocumentList[0].Height;
    // this._DocumentWith = this.DocumentList[0].DocumentWith;
    // this._DocumentWithII = this.DocumentList[0].DocumentWith;
    // this.FoodExpiryDate = this.DocumentList[0].Expiry;
    console.log(this.DocumentList ,"DocumentList");
    // this.DocumentList.forEach(element => {
    //   element.DocumentLocationJson.forEach(element1 => {
    //     this._WarehouseName = element1.WareHouseName;
    //   });
    // });
    // this.DocumentList.forEach(element => {
    //   element.DocumentLocationJson.forEach(element1 => {
    //     this._BlockName = element1.BlockName;
    //   });
    // });
    // this.DocumentList.forEach(element => {
    //   element.DocumentLocationJson.forEach(element1 => {
    //     this._RackName = element1.RackName;
    //   });
    // });
    // this.DocumentList.forEach(element => {
    //   element.DocumentLocationJson.forEach(element1 => {
    //     this._ShelveName = element1.ShelveName;
    //   });
    // });


    this.DocumentType = this.DocumentList[0].DocumentTypeName ? this.DocumentList[0].DocumentTypeName : null;
    this.DocumentTypeId = this.DocumentList[0].DocumentTypeId;
    this._SourceId = this.DocumentList[0].SourceId;
    this.Source = this.DocumentList[0].SourceName;
    this._ManufactureandDistributorId = this.DocumentList[0].DMId;
    this.Manufacture = this.DocumentList[0].DMName;

    this.SelectedCategory = [...this.DocumentList[0].SubCategoryJson];
   

  
   

  

    
    // this.DocumentList.forEach(element => {
    //   element.ManufactureJson.forEach(element1 => {
    //     this.Manufacture = element1.ManufactureName;
    //   });
    // });
   
    // this.DocumentList.forEach(element => {
    //   element.SourceJson.forEach(element1 => {
    //     this.Source = element1.SourceName;
    //   });
    // });

    // var ids = this.DocumentList[0].CategoryIds;
    // this.selected = ids.split(",");
    // let _ary = [];
    // for (let index = 0; index < this.selected.length; index++) {
    //   const element = this.selected[index];
    //   _ary.push(parseInt(element))
    // }
    // this._CategoryId = _ary;
    // console.log(this._CategoryId, "Category");

    // this._obj.StrCategoryId = this._CategoryId;
    // this.service.GetSubCategoryDropdownList(this._obj)
    //   .subscribe(data => {
    //     this._obj = data as GACFiledto;
    //     this.SubCategoryList = JSON.parse(this._obj.SubCategoryJson);
    //   });

    // var ids1 = this.DocumentList[0].SubCategoryIds;
    // this.selected1 = ids1.split(",");
    // let _ary1 = [];
    // for (let index = 0; index < this.selected1.length; index++) {
    //   const element = this.selected1[index];
    //   _ary1.push(parseInt(element))
    // }
    // this._SubCategoryId = _ary1;
    // console.log(this._SubCategoryId, "subCategory");
    // this.toggleDocumentLocation(this._DocumentWith);
    // this.GetDropdowns();
    // this.OnWarehouse();
    document.getElementById("edit-document").classList.add("kt-quick-panel--on");
    document.getElementById("moredet").classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }


  GetDropdowns() {
    const lang: any = localStorage.getItem('language');
    this._obj1.CreatedBy = this.currentUserValue.createdby;
    this._obj1.organizationid = this.currentUserValue.organizationid;
    this._obj1.DocumentId = 0; // passing 0 because same api is used in details page,there we have pass documentid
    this.inboxService.ShareUserList(this._obj1)
      .subscribe(data => {
        debugger
        // this._obj1 = data as InboxDTO;
        var _UsersLst = data["Data"].UserJson;
        this._LstToUsers = _UsersLst;
        _UsersLst.forEach(element => {
          this.ObjUserList.push({
            UserId: element.UserId,
            ContactName: element.ContactName,
            disabled: false,
            Check: false,
            isTemporary: false,
            startDate: new Date(),
            shareDocAccess: true,
            IsPhysical: false
          });
        });
      });
  }
  selectedUser: any[] = [];
  Physicaluser: any[] = [];
  selectedPhysicalUser: string;
  _SelectedPhysicalUserId: any;
  _HandoverUserRequired: boolean = false;
  selectUser(user: any, event: any) {
    const selectedUser = this.ObjUserList.find(user => user.isChecked);
    if (selectedUser != undefined) {
      this.ObjgetCompanyList.forEach(element => {
        if (element.UserId == selectedUser.UserId) {
          element.disabled = false;
          element.isChecked = false;
        }
      });
      this.SelectedUsers = this.SelectedUsers.filter(user => user.UserId !== selectedUser.UserId);
    }
    this.selectedUser = [];
    if (event.checked) {
      this.selectedUser.push(user);
    }
    // console.log(user, "Selected user phy");
    this.ObjUserList.forEach(element => {
      if (element.UserId == user.UserId) {
        element.isChecked = event.checked;
      }
      else {
        element.isChecked = false;
      }
    });

    this.ObjgetCompanyList.forEach(element => {
      if (element.UserId == user.UserId) {
        element.disabled = true;
        element.isChecked = false;
      }
    });
    this.SelectedUsers = this.SelectedUsers.filter(u => u.UserId !== user.UserId);
  }


  AddPhysicalSelectUser() {
    this.Physicaluser = [];
    this.Physicaluser = this.selectedUser;
    // console.log(this.selectedUser, "Physical User 2");
    this._SelectedPhysicalUserId = this.Physicaluser[0].UserId;
    const selectedPhysical = this.Physicaluser.find(item => item.UserId === this._SelectedPhysicalUserId);
    if (selectedPhysical) {
      this.selectedPhysicalUser = selectedPhysical.ContactName;
    }
    this._HandoverUserRequired = false;
    document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
    document.getElementById("projectmodalphysicaladd").style.display = "none";
  }


  close_Physicalmodal() {
    this.selectedUser = [];
    this.ObjUserList.forEach(element => {
      element.isChecked = false;
    });
    document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
    document.getElementById("projectmodalphysicaladd").style.display = "none";
  }

  RemoverPhysical(user) {
    this.selectedUser = [];
    this.ObjUserList.forEach(element => {
      if (element.UserId == user.UserId) {
        element.isChecked = false;
      }
    });
    this.ObjgetCompanyList.forEach(element => {
      if (element.UserId == user.UserId) {
        element.isChecked = false;
        element.disabled = false;
      }
    });
    this._SelectedPhysicalUserId = 0;
  }

  UpdateDocumentInfo() {

    const subCategoryIds = this.SelectedCategory?.length
      ? this.SelectedCategory.map((category) => category.SubCategoryId).toString()
      : '0';
    this._AdditionalDocument = {
      "DocumentName": this._DocumentName,
      "Description": this.Note,
      "DocumentTypeId": this.DocumentTypeId || 0,
      "SourceId": this._SourceId || 0,
      "ManufactureandDistributorId": this._ManufactureandDistributorId || 0,
      "SubCategoryId": subCategoryIds,
      // "CategoryId": this._CategoryId !== undefined ? this._CategoryId.toString() : '',
      // "SubCategoryId": this._SubCategoryId !== undefined ? this._SubCategoryId.toString() : ''
    }

    // Convert to JSON
    if (this._AdditionalDocument) {
      this._AdditionalDocumentJSON = JSON.stringify(this._AdditionalDocument, null, 2);
      console.log(this._AdditionalDocumentJSON, "Additional DocumentJSON Json");
    } else {
      console.log("Additional Document is not defined.");
    }
    this._obj.DocumentInfoJson = this._AdditionalDocumentJSON;
    this._obj.DocumentId = parseInt(this._documentId);
    this.service.UpdateDocument(this._obj).subscribe(
      data => {
        console.log(data, "Update Documents")
        if (data["Message"] == "1") {
          this._snackBar.open('Update Document Successfully', 'End now', {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
        }
        this.ArchiveDetailsInfo(this._documentId, this.ShareId);
        // this.documentInfo(this._documentId, this._referenceId);
      }
    );
    this.closeInfo();
  }

  GetManufactureId(event) {
    this._obj.ManufactureId = event;
    this._ManufactureandDistributorId = event;

    const selectedManufactureandDistributor = this.ManufactureList.find(item => item.DMId === this._ManufactureandDistributorId);
    if (selectedManufactureandDistributor) {
      this.selectedDMName = selectedManufactureandDistributor.Name;
    }
    // alert(this._ManufactureandDistributorId);
  }

  GetSubCategoryId(event) {
    this._obj.StrSubCategoryId = event.value;
    this._SubCategoryId = event.value;
    this.selectedSubCategoryNames = this.SubCategoryList
      .filter(item => this._SubCategoryId.includes(item.SubCategoryId))
      .map(item => item.SubCategoryName);
  }


  toggleDocumentLocation(option: string): void {
    this._DocumentWith = option;
  }

  openwarehousemodal() {
    this.selectedWarehouseValue = this._WarehouseName;
    this.selectedBlockValue = this._BlockName;
    this.selectedRackValue = this._RackName;
    this.selectedShelveValue = this._ShelveName;
    $('#warehousemodal').css('display', 'block');
    $('#warehousemodal-modal-backdrop').css('display', 'block');
  }


  OnBlocks(WareHouseId) {
    this.selectedWarehouseValue = WareHouseId;
    this._obj2.WareHouseId = WareHouseId;
    this.services.GetBlocks(this._obj2)
      .subscribe(data => {
        // console.log(data, "blocks")
        this.ObjBlocksdrp = data as [];
        this._obj2 = data as ShuffeldocumentsDto
        this.blockssdrp = this._obj2
        this.ObjBlocksdrp = this.blockssdrp.filter(word => word.IsActive == true);
        // console.log(this.ObjBlocksdrp, "Block List");
      });

  }

  OnRacks(BlockId) {
    this.selectedBlockValue = BlockId;
    this._obj2.BlockId = BlockId;
    this.services.GetRacks(this._obj2)
      .subscribe(data => {
        this.ObjRacksdrp = data as [];
        this._obj2 = data as ShuffeldocumentsDto
        this.racksdrp = this._obj2
        this.ObjRacksdrp = this.racksdrp.filter(word => word.IsActive == true);
      });
  }

  Onshelves(RackId) {
    this.selectedRackValue = RackId;
    this._obj2.RackId = RackId;
    this.services.Getshelves(this._obj2)
      .subscribe(data => {
        this.Objshelvedrp = data as [];

      });
    // if (JSON.stringify(this._JsonArray).length == 0) {
    //   this.jsondatatoarray(RackId);
    // }
  }

  OnshelveChangeEvent(shelveid) {
    this.selectedShelveValue = shelveid;
  }

  WarehouseLoction() {
    if (!this.selectedWarehouseValue) {
      alert("Please select a warehouse");
      return;
    }
    const result = this.Objwarehousedrp.find(x => x.WareHouseId == this.selectedWarehouseValue);
    this._WarehouseName = result.WareHouseName;
    if (!this.selectedBlockValue) {
      alert("Please select a Block");
      return;
    }
    const resultBlock = this.ObjBlocksdrp.find(x => x.BlockId == this.selectedBlockValue);
    this._BlockName = resultBlock.BlockName;
    if (!this.selectedRackValue) {
      alert("Please select a Rack");
      return;
    }

    const resultRack = this.ObjRacksdrp.find(x => x.RackId == this.selectedRackValue);
    this._RackName = resultRack.RackName;

    if (!this.selectedShelveValue) {
      alert("Please select a Shelve");
      return;
    }

    const resultShelve = this.Objshelvedrp.find(x => x.ShelveId == this.selectedShelveValue);
    this._ShelveName = resultShelve.ShelveName;
    $('#warehousemodal').css('display', 'none');
    $('#warehousemodal-modal-backdrop').css('display', 'none');
    // Remove the class from the div
    // const selfDiv = document.getElementById('self-div');
    // if (selfDiv) {
    //   selfDiv.classList.remove('warehouse-popup');
    // }

    // // Get all radio buttons with the name "documentLocationOption"
    // const radioButtons = document.querySelectorAll('input[name="documentLocationOption"]');

    // // Loop through the radio buttons and uncheck them
    // radioButtons.forEach((radioButton) => {
    //   (radioButton as HTMLInputElement).checked = false;
    // });
    // this.selectedOption != 'option3';
    // alert(this.selectedOption);
  }

  close_warehousemodal() {
    $('#warehousemodal').css('display', 'none');
    $('#warehousemodal-modal-backdrop').css('display', 'none');
  }



  clearDropdownRack() {
    this.ObjRacksdrp = [];
    this.selectedRackValue = null;
  }
  GetSubCategory(event) {
    this._obj.StrCategoryId = event.value;
    this._CategoryId = event.value;
    this.service.GetSubCategoryDropdownList(this._obj)
      .subscribe(data => {
        this._obj = data as GACFiledto;
        this.SubCategoryList = JSON.parse(this._obj.SubCategoryJson);
      });
  }
  selectedSourceName: string;
  GetSourceId(event) {
    this._obj.SourceId = event;
    this._SourceId = event;
    // alert(this._SourceId);

    const selectedSource = this.SourceList.find(item => item.SourceId === this._SourceId);
    if (selectedSource) {
      this.selectedSourceName = selectedSource.SourceName;
    }
  }

  GetSource(event) {
    if (event == undefined) {
      document.getElementById("Src_div").style.display = "none";
    }
    else {
      document.getElementById("Src_div").style.display = "block";
    }
    // Convert event to a number if it isn't undefined
    const eventId = event !== undefined ? Number(event) : event;
    this._obj.DocumentTypeId = event;
    this.DocumentTypeId = eventId;


    this.service.GetSourceDropdownList(this._obj)
      .subscribe(data => {
        this.SourceList = data as GACFiledto;
        if (this.SourceList.length == 0)
          this._obj.SourceId = 0;
      });
  }
  AddSourceText() {
    // this._obj.SourceName = this.AddSource
    this.service.GetAddsource(this.AddSource).subscribe(data => {
      //console.log(data, "source")
      this._objFilters = data as GACFiledto;
      this._snackBar.open('Added Successfully', 'End now', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['blue-snackbar']
      });
      // this.SourceList = data;
      this.soc_cl();
      this.GetSource(this.DocumentType);
    });
  }
  soc_cl() {
    $('#socdiv').addClass('d-none');
    $('#solist').show();
  }
  solist() {
    $('#socdiv').removeClass('d-none');
    $('#solist').hide();
  }
  adlist() {
    $('#distdiv').removeClass('d-none');
    $('#adlist').hide();
  }
  manu_cl() {
    $('#distdiv').addClass('d-none');
    $('#adlist').show();
  }

  AddDMText() {
    //this._obj.Name = this.AddDM
    this.service.GetAddDM(this.AddDM).subscribe(data => {
      this._objFilters = data as GACFiledto;
      this.manu_cl();
      this.ManufactureList = this._objFilters.Data["DistributorAndManufactureJson"];
      this._snackBar.open('Added Successfully', 'End now', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['blue-snackbar']
      });
    });
  }
  GetSelectedUserId(UserId) {
    this.ToUserId = UserId;
  }

  GetUserList(CompanyId) {
    this.ObjgetuserList = [];
    this.CompanyId = CompanyId;
    this._shareObj.CompanyId = CompanyId;
    this.Shareservice.Getuser(this._shareObj).subscribe(data => {
      this._shareObj = new ShareDocumentsDTO();
      this.user = data as []
      this.ObjgetuserList = this.user['Data']["UserList"];
    });
  }
  SharingTypeEevnt(val) {
    if (val.checked == false) {
      this.SharingType = "Electronic";
    }
    else if (val.checked == true) {
      this.SharingType = "Physical";
    }
  }
  rdPermissionChange(val) {
    this.AccessType = val;
  }
  onenddate() {
    const enddatepicker = document.getElementById('txtEndDate');
    let _a = this.startdate.split("-");

    let _day = parseInt(_a[2]);
    let _month = parseInt(_a[1]);
    let _year = parseInt(_a[0]);

    let date = _day > 9 ? _day :
      `0${_day}`;
    let month = _month > 9 ? _month + 1 :
      `0${_month}`;

    enddatepicker.setAttribute('min', `${_year}-${month}-${date}`);

  }
  clearenddate() {

    this.startdate = (<HTMLInputElement>document.getElementById("txtstartdate")).value;

    (<HTMLInputElement>document.getElementById("txtEndDate")).value = "";
    this.Enddate = "";
  }
  SendShareRequest() {
    this._shareObj.CompanyId = 0;
    this._shareObj.SharingType = this.SharingType;
    this._shareObj.StartDate = (<HTMLInputElement>document.getElementById("txtstartdate")).value;
    this._shareObj.EndDate = (<HTMLInputElement>document.getElementById("txtEndDate")).value;
    this._shareObj.DocumentId = parseInt(this._documentId);
    this._shareObj.SharingStatus = "Approved";
    this._shareObj.AccessType = this.AccessType;
    this._shareObj.ToUserId = this.ToUserId;
    this.Shareservice.AddSharingDocumentsAng(this._shareObj).subscribe(data => {
      this._shareObj = data as ShareDocumentsDTO;
      if (this._shareObj.Message == "1") {
        this._snackBar.open('Request Sent Successfully', 'End now', {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
        this.documentInfo(this._documentId, this._referenceId);
      }
      this.closeInfo();
      this.shareReset();


    })
  }

  ReceivePhysicalDoc(documentid, _val) {

    this._shareObj.DocumentId = documentid;
    this._shareObj.FlagId = _val;
    this._shareObj.Description = (<HTMLInputElement>document.getElementById("txtoptionalnote")).value;
    this.Shareservice.ReceivePhysicalDocument(this._shareObj).subscribe(data => {
      this._shareObj = data as ShareDocumentsDTO;
      if (this._shareObj.Message == "1") {
        this._snackBar.open('Updated Successfully', 'End now', {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
        this.documentInfo(this._documentId, this._referenceId);
      }
      this.closeInfo();
    })
  }
  ShareStatusUpdate(id, val) {
    this._shareObj.SharingStatus = val;
    this._shareObj.ShareId = id;
    this.Shareservice.ShareStatusUpdate(this._shareObj).subscribe(data => {
      this._shareObj = data as ShareDocumentsDTO;
      if (this._shareObj.Message == "1") {
        this._snackBar.open('Updated Successfully', 'End now', {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
        this.documentInfo(this._documentId, this._referenceId);
      }
      this.closeInfo();
    })
  }

  // onFileChange(event: any): void {
  //   const files = Array.from(event.target.files) as File[]; // Type assertion to File[]
  //   if (files.length > 0) {
  //     for (let index = 0; index < files.length; index++) {
  //       const file = files[index]; // Now TypeScript knows 'file' is of type 'File'
  //       const contentType = this.getFileExtension(file.type);
  //       const fileSizeInKB = Math.round(file.size / 1024);

  //       // Check if the file is already in the array to avoid duplicates
  //       const existingFile = this._lstMultipleFiles.find(
  //         (item) => item.FileName === file.name && item.Size === file.size
  //       );

  //       if (!existingFile) {
  //         const uniqueId = new Date().valueOf() + index; // Ensure unique ID
  //         this._lstMultipleFiles.push({
  //           UniqueId: uniqueId,
  //           FileName: file.name,
  //           Size: file.size,
  //           Files: file,
  //         });
  //       }
  //     }

  //     console.log(this._lstMultipleFiles, "Files");
  //     $('#File_pop').removeClass('show');
  //     // Clear the input to allow re-uploading of the same file
  //     event.target.value = '';
  //   }
  // }

  // getFileExtension(mimeType: string): string {
  //   switch (mimeType) {
  //     case 'application/pdf':
  //       return '.pdf';
  //     case 'image/png':
  //       return '.png';
  //     case 'image/jpeg':
  //       return '.jpeg';
  //     case 'image/jpg':
  //       return '.jpg';
  //     default:
  //       return mimeType;
  //   }
  // }

  // RemoveSelectedFile(_id: number): void {
  //   const removeIndex = this._lstMultipleFiles.findIndex(
  //     (item) => item.UniqueId === _id
  //   );
  //   if (removeIndex !== -1) {
  //     this._lstMultipleFiles.splice(removeIndex, 1);
  //   }
  // }

  FileUploadErrorlogs: boolean = false;
  UploadingFiles: boolean = false;
  async onFileChange(event): Promise<void> {
    
    let folderPath = "Draft/" + this.currentUserValue.createdby;
    if (event.target.files.length > 0) {
      var length = event.target.files.length;
      for (let index = 0; index < length; index++) {
        const file = event.target.files[index];
        // Check if the file size is 0 KB
        if (file.size === 0) {
          this.FileUploadErrorlogs = true; // Show error message
          console.error('The uploaded file is 0 KB. Please upload a larger file.');
          continue; // Skip this file
        }
        // Check if the file already exists (to avoid duplicate uploads)
        const existingFile = this._lstMultipleFiles.find(
          (item) => item.FileName === file.name && item.Size === file.size
        );
        if (!existingFile) {
          const uniqueId = new Date().valueOf() + index;

          // Add the file details to the array with initial states
          const fileRecord = {
            UniqueId: uniqueId,
            FileName: file.name,
            Size: file.size,
            Files: file,
            IsMain: false, // Default main file flag
            Thumbnail: '', // Initialize with an empty string
            Progress: 0, // Track upload progress
            Uploading: true, // File is uploading
            Url: null, // URL to store the uploaded file's location
            CloudName: ''
          };

          this._lstMultipleFiles.push(fileRecord);
          this._lstMultipleFiles.forEach(element => {
            this.UploadingFiles = element.Uploading;
            console.log(this.UploadingFiles, "Uploading Files Test");
          });
          const progressSubject = new BehaviorSubject<number>(0);
          try {
            const _displayname = this.currentUserValue.FirstName + " " + this.currentUserValue.LastName;
            const uploadUrl = await this.azureUploadService.uploadFile(file, progressSubject, folderPath, uniqueId,_displayname); // Upload file
            const uploadedFile = this._lstMultipleFiles.find(
              (item) => item.UniqueId === uniqueId
            );
            if (uploadedFile) {
              uploadedFile.Url = "https://yrglobaldocuments.blob.core.windows.net/documents/" + uploadUrl; // Save the uploaded URL
              uploadedFile.CloudName = uniqueId + file.name;
            }
          } catch (error) {
            console.error(`Error uploading file: ${file.name}`, error);
          } finally {
            // Mark the file as no longer uploading
            const uploadedFile = this._lstMultipleFiles.find(
              (item) => item.UniqueId === uniqueId
            );
            if (uploadedFile) {
              uploadedFile.Uploading = false;
            }
          }
        }
        this._lstMultipleFiles.forEach(element => {
          this.UploadingFiles = element.Uploading;
          console.log(this.UploadingFiles, "Uploading Files Test");
        });
        // var contentType = file.type;
        // if (contentType === "application/pdf") {
        //   contentType = ".pdf";
        // }
        // else if (contentType === "image/png") {
        //   contentType = ".png";
        // }
        // else if (contentType === "image/jpeg") {
        //   contentType = ".jpeg";
        // }
        // else if (contentType === "image/jpg") {
        //   contentType = ".jpg";
        // }

        // this.myFiles.push(event.target.files[index].name);

        // var d = new Date().valueOf();
        // this._lstMultipleFiles = [...this._lstMultipleFiles, {
        //   UniqueId: d,
        //   FileName: event.target.files[index].name,
        //   Size: event.target.files[index].size,
        //   Files: event.target.files[index],
        //   Ismain: false,
        //   Thumbnail: ''
        //   // FileName: "1",
        // }];
      }
    }
    (<HTMLInputElement>document.getElementById("customFile")).value = "";
  }
  RemoveSelectedFile(_id) {
    var removeIndex = this._lstMultipleFiles.map(function (item) { return item.UniqueId; }).indexOf(_id);
    this._lstMultipleFiles.splice(removeIndex, 1);
  }

  ClosefileErrorlog() {
    this.FileUploadErrorlogs = false;
  }
  _lstMultipleFilesAprandrej: any;
  async onFileChangeApproveandreject(event): Promise<void> {
    let folderPath = "Draft/" + this.currentUserValue.createdby;

    // ✅ Ensure the array is initialized before use
    if (!this._lstMultipleFilesAprandrej) {
      this._lstMultipleFilesAprandrej = [];
    }
    if (event.target.files.length > 0) {
      var length = event.target.files.length;
      for (let index = 0; index < length; index++) {
        const file = event.target.files[index];
        // Check if the file size is 0 KB
        if (file.size === 0) {
          this.FileUploadErrorlogs = true; // Show error message
          console.error('The uploaded file is 0 KB. Please upload a larger file.');
          continue; // Skip this file
        }
        // Check if the file already exists (to avoid duplicate uploads)
        const existingFile = this._lstMultipleFilesAprandrej.find(
          (item) => item.FileName === file.name && item.Size === file.size
        );
        if (!existingFile) {
          const uniqueId = new Date().valueOf() + index;

          // Add the file details to the array with initial states
          const fileRecord = {
            UniqueId: uniqueId,
            FileName: file.name,
            Size: file.size,
            Files: file,
            IsMain: false, // Default main file flag
            Thumbnail: '', // Initialize with an empty string
            Progress: 0, // Track upload progress
            Uploading: true, // File is uploading
            Url: null, // URL to store the uploaded file's location
            CloudName: ''
          };

          this._lstMultipleFilesAprandrej.push(fileRecord);
          console.log(this._lstMultipleFilesAprandrej, "approve file");
          this._lstMultipleFilesAprandrej.forEach(element => {
            this.UploadingFiles = element.Uploading;
            console.log(this.UploadingFiles, "Uploading Files Test");
          });
          const progressSubject = new BehaviorSubject<number>(0);


          try {
            const _displayname = this.currentUserValue.FirstName + " " + this.currentUserValue.LastName;
            const uploadUrl = await this.azureUploadService.uploadFile(file, progressSubject, folderPath, uniqueId,_displayname); // Upload file
            const uploadedFile = this._lstMultipleFilesAprandrej.find(
              (item) => item.UniqueId === uniqueId
            );
            if (uploadedFile) {
              uploadedFile.Url = "https://yrglobaldocuments.blob.core.windows.net/documents/" + uploadUrl; // Save the uploaded URL
              uploadedFile.CloudName = uniqueId + file.name;
            }
          } catch (error) {
            console.error(`Error uploading file: ${file.name}`, error);
          } finally {
            // Mark the file as no longer uploading
            const uploadedFile = this._lstMultipleFilesAprandrej.find(
              (item) => item.UniqueId === uniqueId
            );
            if (uploadedFile) {
              uploadedFile.Uploading = false;
            }
          }
        }

        this._lstMultipleFilesAprandrej.forEach(element => {
          this.UploadingFiles = element.Uploading;
          console.log(this.UploadingFiles, "Uploading Files Test");
        });
        // var contentType = file.type;
        // if (contentType === "application/pdf") {
        //   contentType = ".pdf";
        // }
        // else if (contentType === "image/png") {
        //   contentType = ".png";
        // }
        // else if (contentType === "image/jpeg") {
        //   contentType = ".jpeg";
        // }
        // else if (contentType === "image/jpg") {
        //   contentType = ".jpg";
        // }

        // this.myFiles.push(event.target.files[index].name);

        // var d = new Date().valueOf();
        // this._lstMultipleFiles = [...this._lstMultipleFiles, {
        //   UniqueId: d,
        //   FileName: event.target.files[index].name,
        //   Size: event.target.files[index].size,
        //   Files: event.target.files[index],
        //   Ismain: false,
        //   Thumbnail: ''
        //   // FileName: "1",
        // }];
      }
    }
    (<HTMLInputElement>document.getElementById("customFile")).value = "";
  }

  formatSize(size: number): string {
    return formatFileSize(size);
  }
  AddRefDoc() {
    this.AddReferenceDocument(parseInt(this._documentId), 0);
    // document.getElementById("addref").classList.remove("kt-quick-panel--on");
    // document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  async AddReferenceDocument(DocumentId: number, VersionId: number) {
    try {
      const extractedValues = this._lstMultipleFiles.map((file) => ({
        FileName: file.FileName,
        CloudName: file.CloudName,
        IsMain: false,
        Url: file.Url
      }));
      const destinationContainer = "documents"; // Set destination container value
      const jsonResult = {
        sourcePaths: extractedValues.map((file) => file.Url), // Extract URLs
        destinationContainer: destinationContainer,
        destinationFolder: 'Archive/', //mention gac folder path
      };
      console.log(JSON.stringify(jsonResult), "CopyFiles");

      const DeletedJson = extractedValues.map(file => ({
        fullPath: file.Url,
      }));

      // Convert the resulting array to a JSON string
      const jsonString = JSON.stringify(DeletedJson);
      console.log(jsonString, "DeletedJson");
      const extractedValuesJson = JSON.stringify(extractedValues);
      console.log(extractedValuesJson, "extractedValuesJson");

      this._obj.createdBy = this.currentUserValue.createdby;
      this._obj.DocumentId = parseInt(this._documentId);
      this._obj.ActionId = 0;

      this._obj.copyFiles = JSON.stringify(jsonResult);
      this._obj.deletedJson = jsonString;
      this._obj.extractedValuesJson = extractedValuesJson;

      const data = await this.service.NewReferenceDocument(this._obj);
      console.log(data, "Add Reference Document API Data");

      if (data["message"] === '1') {
        this._snackBar.open('Document Uploaded Successfully', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ['blue-snackbar']
        });

      }
      this.ArchiveDetailsInfo(this._documentId, this.ShareId);
      document.getElementById("addref").classList.remove("kt-quick-panel--on");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
      // Reset the list of files after the upload

    } catch (error) {
      console.error('Error uploading reference document:', error);
      // Optionally, show an error snackbar or handle the error further
      this._snackBar.open('Document upload failed. Please try again.', 'End now', {
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
        panelClass: ['red-snackbar']
      });
    }
  }

  closeOverlay() {
    this._lstMultipleFiles = [];
    document.getElementById("addref").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  shareReset() {
    this.CompanyId = null;
    this.ToUserId = null;
    this.AddNewUserValues = [];
    this.startdate = null;
    this.Enddate = null;

    var radio1 = document.getElementById('r1') as HTMLInputElement | null;
    radio1.checked = true;

    var radio2 = document.getElementById('r2') as HTMLInputElement | null;
    radio2.checked = false;

    var radio3 = document.getElementById('r3') as HTMLInputElement | null;
    radio3.checked = false;

  }
  doc_activity() {
    document.getElementById("doc-activity").classList.add("kt-quick-panel--on");
    //document.getElementById("moredet").classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  doc_shared() {
    document.getElementById("doc-shared").classList.add("kt-quick-panel--on");
    document.getElementById("moredet").classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  viwcmnts() {
    // setTimeout(() => {
    //   if (this.Approvecommentsfocus) {
    //     this.Approvecommentsfocus.nativeElement.focus();
    //   }
    // }, 0);
    document.getElementById("appr-cmts").classList.toggle("d-none");
    document.getElementById("main-section").classList.toggle("d-none");
  }

  rjtcmnts() {
    // setTimeout(() => {
    //   if (this.Rejectcommentsfocus) {
    //     this.Rejectcommentsfocus.nativeElement.focus();
    //   }
    // }, 0);
    document.getElementById("rjct-cmts").classList.toggle("d-none");
    document.getElementById("rjct-section").classList.toggle("d-none");
  }
  rcvcmnts() {
    document.getElementById("rcv-cmts").classList.toggle("d-none");
    document.getElementById("rcv-section").classList.toggle("d-none");
  }
  handcmnts() {
    document.getElementById("hand-cmts").classList.toggle("d-none");
    document.getElementById("hand-section").classList.toggle("d-none");
  }

  edit_title(_DocumentName: string) {
    this._obj.DocumentId = parseInt(this._documentId);
    this.documentTitle = _DocumentName || '';
    document.getElementById("edit-title-drop").classList.add("active");
    document.getElementById("edit-icon").classList.add("active");
  }
  edit_close() {
    document.getElementById("edit-title-drop").classList.remove("active");
    document.getElementById("edit-icon").classList.remove("active");
  }

  SubjectUpdate() {
    this._obj.DocumentId = parseInt(this._documentId);
    this._obj.DocumentName = this.documentTitle;
    this._Aprvlservice.GACUpdateDocumentName(this._obj).subscribe(data => {
      this._snackBar.open('Updated Successfully', 'End now', {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
      });
      this.documentInfo(this._documentId, this._referenceId);
    })
    document.getElementById("edit-title-drop").classList.remove("active");
    document.getElementById("edit-icon").classList.remove("active");
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
  }
  incrementPage(amount: number) {
    this.page += amount;
  }

  /**
  * Get pdf information after it's loaded
  * @param pdf pdf document proxy
  */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;

    this.loadOutline();
    // $("body").removeClass("progressattachment");
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  rotate(angle: number) {
    this.rotation += angle;
  }
  /**
  * Pdf loading progress callback
  * @param progressData pdf progress data
  */
  onProgress(progressData: PDFProgressData) {
    
    this.progressData = progressData;

    this.isLoaded = progressData.loaded >= progressData.total;
    this.error = null; // clear error
    this.progress = Math.round(progressData.loaded / progressData.total * 100);
    if (this.progress == 100) this.ShowProgress = false;
    // console.log(`Uploaded! ${this.progress}%`);
  }
  /**
  * Page rendered callback, which is called when a page is rendered (called multiple times)
  *
  * @param e custom event
  */
  pageRendered(e: CustomEvent) {
     
    // console.log('(page-rendered)', e);
  }

  /**
   * Page initialized callback.
   *
   * @param {CustomEvent} e
   */
  pageInitialized(e: CustomEvent) {
    // console.log('(page-initialized)', e);
  }
  expandView() {
    // document.getElementById("expand").classList.toggle("d-none");
    (<HTMLInputElement>document.getElementById("expand")).classList.toggle("d-none");
    (<HTMLInputElement>document.getElementById("compress")).classList.toggle("d-block");
    (<HTMLInputElement>document.getElementById("main-doc-details-card")).classList.toggle("expand-view");
  }



  // //Warehouese mat dropdown
  // Removewarehousename(Warehouese) {
  //   const index = this.Removewarehousenamearray.findIndex((wh) => wh.WareHouseId === Warehouese.WareHouseId);
  //   this.isSelectionwarehouse = false;
  //   if (index !== -1) {
  //     this.Removewarehousenamearray.splice(index, 1);
  //     this.SelectedWarehouseIds.splice(index, 1);
  //   }
  //   Warehouese.checked = false;
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  // }

  // filterWarehouse(input: string): void {
  //   this.isSelectionwarehouse = true;
  //   this._WarehouseSubList = this.Objwarehousedrp.filter((Warehouese) =>
  //     Warehouese.WareHouseName.toLowerCase().includes(input.toLowerCase())
  //   );
  // }

  // Openwarehouse() {
  //   this.isSelection_warehouse = true;
  //   (<HTMLInputElement>document.getElementById("txtsearchwarehouse")).focus()
  // }

  // closePanelwarehouse() {
  //   this.isSelectionwarehouse = false;
  //   this.isSelection_warehouse = false;
  //   (<HTMLInputElement>document.getElementById("txtsearchwarehouse")).value = "";
  //   (<HTMLInputElement>document.getElementById("txtsearchwarehouse")).blur();
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  // }

  // openAutocompleteDrpDwnWarehouse(Openwarehosue: string) {
  //   const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === Openwarehosue);
  //   requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  // }

  // closeAutocompleteDrpDwnWarehouse(CloseOpenwarehouse: string) {
  //   const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenwarehouse);
  //   requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  // }

  // _AddWarehouse(event: MatAutocompleteSelectedEvent): void {

  //   const selectedEmployee = this.Objwarehousedrp.find((user) => user.WareHouseId === event.option.value);
  //   if (selectedEmployee) {
  //     const index = this.Removewarehousenamearray.findIndex((_user) => _user.WareHouseId === selectedEmployee.WareHouseId);
  //     if (index === -1) {
  //       // User not found in the selected array, add it
  //       this.Removewarehousenamearray.push(selectedEmployee);
  //       this.SelectedWarehouseIds.push(selectedEmployee.WareHouseId);
  //       const warehouseids = this.SelectedWarehouseIds.join(',');
  //       // this.OnBlocks(warehouseids);

  //     } else {
  //       // User found in the selected array, remove it
  //       this.Removewarehousenamearray.splice(index, 1);
  //       this.SelectedWarehouseIds.splice(index, 1);
  //     }
  //   }
  //   this._WarehouseSubList = this.Objwarehousedrp;
  //   this.isSelection_warehouse = false;
  // }

  // isSelectedWarehouse(Warehouese: any): boolean {
  //   return this.Removewarehousenamearray.some((Wh) => Wh.WareHouseId === Warehouese.WareHouseId);
  // }

  // //Block Mat dropdwon
  // Removeblockname(Block) {
  //   const index = this.Removeblocknamearray.findIndex((BD) => BD.WareHouseId === Block.WareHouseId);
  //   this.isSelectionblock = false;
  //   if (index !== -1) {
  //     this.Removeblocknamearray.splice(index, 1);
  //     this.SelectedblockIds.splice(index, 1);
  //   }
  //   Block.checked = false;
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  // }

  // filterBlock(input: string): void {
  //   this.isSelectionblock = true;
  //   this._BlockSubList = this.ObjBlocksdrp.filter((Block) =>
  //     Block.BlockName.toLowerCase().includes(input.toLowerCase())
  //   );
  // }

  // OpenBlock() {
  //   this.isSelection_Block = true;
  //   (<HTMLInputElement>document.getElementById("txtsearchBlock")).focus()
  // }

  // closePanelBlock() {
  //   this.isSelectionblock = false;
  //   this.isSelection_Block = false;
  //   (<HTMLInputElement>document.getElementById("txtsearchBlock")).value = "";
  //   (<HTMLInputElement>document.getElementById("txtsearchBlock")).blur();
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  // }

  // openAutocompleteDrpDwnBlock(OpenBlock: string) {
  //   const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenBlock);
  //   requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  // }

  // closeAutocompleteDrpDwnBlock(CloseOpenBlock: string) {
  //   const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenBlock);
  //   requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  // }

  // _AddBlock(event: MatAutocompleteSelectedEvent): void {

  //   const selectedEmployee = this.ObjBlocksdrp.find((BD) => BD.BlockId === event.option.value);
  //   if (selectedEmployee) {
  //     const index = this.Removeblocknamearray.findIndex((_user) => _user.BlockId === selectedEmployee.BlockId);
  //     if (index === -1) {
  //       // User not found in the selected array, add it
  //       this.Removeblocknamearray.push(selectedEmployee);
  //       this.SelectedblockIds.push(selectedEmployee.BlockId);
  //       const Blockids = this.SelectedblockIds.join(',');
  //       this.OnRacks(Blockids);

  //     } else {
  //       // User found in the selected array, remove it
  //       this.Removeblocknamearray.splice(index, 1);
  //       this.SelectedblockIds.splice(index, 1);
  //     }
  //   }
  //   this._BlockSubList = this.ObjBlocksdrp;
  //   this.isSelection_Block = false;
  // }

  // isSelectedBlock(Block: any): boolean {
  //   return this.Removeblocknamearray.some((bd) => bd.BlockId === Block.BlockId);
  // }

  // // Rack Mat Dropdowm

  // RemoveRackkname(Rack) {
  //   const index = this.Removeracknamearray.findIndex((RD) => RD.RackId === Rack.RackId);
  //   this.isSelectionrack = false;
  //   if (index !== -1) {
  //     this.Removeracknamearray.splice(index, 1);
  //     this.SelectedrackIds.splice(index, 1);
  //   }
  //   Rack.checked = false;
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  // }

  // filterRack(input: string): void {
  //   this.isSelectionrack = true;
  //   this.RackSubList = this.ObjRacksdrp.filter((Rack) =>
  //     Rack.RackName.toLowerCase().includes(input.toLowerCase())
  //   );
  // }

  // OpenRack() {
  //   this.isSelection_Rack = true;
  //   (<HTMLInputElement>document.getElementById("txtsearchRack")).focus()
  // }

  // closePanelRack() {
  //   this.isSelectionrack = false;
  //   this.isSelection_Rack = false;
  //   (<HTMLInputElement>document.getElementById("txtsearchRack")).value = "";
  //   (<HTMLInputElement>document.getElementById("txtsearchRack")).blur();
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  // }

  // openAutocompleteDrpDwnRack(OpenRack: string) {
  //   const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenRack);
  //   requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  // }

  // closeAutocompleteDrpDwnRack(CloseOpenRack: string) {
  //   const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenRack);
  //   requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  // }

  // _AddRack(event: MatAutocompleteSelectedEvent): void {

  //   const selectedEmployee = this.ObjRacksdrp.find((RD) => RD.RackId === event.option.value);
  //   if (selectedEmployee) {
  //     const index = this.Removeracknamearray.findIndex((_rd) => _rd.RackId === selectedEmployee.RackId);
  //     if (index === -1) {
  //       // User not found in the selected array, add it
  //       this.Removeracknamearray.push(selectedEmployee);
  //       this.SelectedrackIds.push(selectedEmployee.RackId);
  //       const Rackids = this.SelectedrackIds.join(',');
  //       this.Onshelves(Rackids);
  //     } else {
  //       // User found in the selected array, remove it
  //       this.Removeracknamearray.splice(index, 1);
  //       this.SelectedrackIds.splice(index, 1);
  //     }
  //   }
  //   this.RackSubList = this.ObjRacksdrp;
  //   this.isSelection_Rack = false;
  // }

  // isSelectedRack(Rack: any): boolean {
  //   return this.Removeracknamearray.some((bd) => bd.RackId === Rack.RackId);
  // }

  // Shelve Mat Dropdown
  // RemoveShelvename(Shelve) {
  //   const index = this.RemoveShelvenamearray.findIndex((SD) => SD.ShelveId === Shelve.ShelveId);
  //   this.isSelectionShelve = false;
  //   if (index !== -1) {
  //     this.RemoveShelvenamearray.splice(index, 1);
  //     this.SelectedShelveIds.splice(index, 1);
  //   }
  //   Shelve.checked = false;
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  // }

  // filterShelve(input: string): void {
  //   this.isSelectionShelve = true;
  //   this.ShelveSubList = this.Objshelvedrp.filter((Rack) =>
  //     Rack.ShelveName.toLowerCase().includes(input.toLowerCase())
  //   );
  // }

  // OpenShelve() {
  //   this.isSelection_Shelve = true;
  //   (<HTMLInputElement>document.getElementById("txtsearchShelve")).focus()
  // }

  // closePanelShelve() {
  //   this.isSelectionShelve = false;
  //   this.isSelection_Shelve = false;
  //   (<HTMLInputElement>document.getElementById("txtsearchShelve")).value = "";
  //   (<HTMLInputElement>document.getElementById("txtsearchShelve")).blur();
  //   requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  // }

  // openAutocompleteDrpDwnShelve(OpenShelve: string) {
  //   const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenShelve);
  //   requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  // }

  // closeAutocompleteDrpDwnShelve(CloseOpenShelve: string) {
  //   const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenShelve);
  //   requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  // }

  // _AddShelve(event: MatAutocompleteSelectedEvent): void {

  //   const selectedEmployee = this.Objshelvedrp.find((SD) => SD.ShelveId === event.option.value);
  //   if (selectedEmployee) {
  //     const index = this.RemoveShelvenamearray.findIndex((_sd) => _sd.ShelveId === selectedEmployee.ShelveId);
  //     if (index === -1) {
  //       // User not found in the selected array, add it
  //       this.RemoveShelvenamearray.push(selectedEmployee);
  //       this.SelectedShelveIds.push(selectedEmployee.ShelveId);
  //     } else {
  //       // User found in the selected array, remove it
  //       this.RemoveShelvenamearray.splice(index, 1);
  //       this.SelectedShelveIds.splice(index, 1);
  //     }
  //   }
  //   this.ShelveSubList = this.Objshelvedrp;
  //   this.isSelection_Shelve = false;
  // }

  // isSelectedShelve(Shelve: any): boolean {
  //   return this.RemoveShelvenamearray.some((bd) => bd.ShelveId === Shelve.ShelveId);
  // }
  view_share_doc_div() {
    document.getElementById("share-doc-div").classList.add("active");
    document.getElementById("share-details-div").classList.add("d-none");
    document.getElementById("doc-shared").classList.add("share-doc-div-height");
    document.getElementById("kt-back-sidebar").classList.add("d-flex");
    document.getElementById("kt-share-sidebar").classList.add("d-none");
  }
  close_share_doc_div() {
    document.getElementById("share-doc-div").classList.remove("active");
    document.getElementById("share-details-div").classList.remove("d-none");
    document.getElementById("doc-shared").classList.remove("share-doc-div-height");
    document.getElementById("kt-back-sidebar").classList.remove("d-flex");
    document.getElementById("kt-share-sidebar").classList.remove("d-none");
  }

  showEmojiPickerReject = false;  // Control visibility of emoji picker
  addEmojiReject(event: any) {
    const emoji = event.emoji.native; // Get the selected emoji
    const editorInstance = this.Rejectcommentsfocus?.editorInstance;

    if (editorInstance) {
      editorInstance.model.change((writer: any) => {
        // Get the current cursor position
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        // Insert the emoji at the cursor position
        writer.insertText(emoji, insertPosition);
      });
    } else {
      console.error('CKEditor instance is not available.');
    }

    this.showEmojiPickerReject = false; // Hide the emoji picker after selection
  }

  toggleEmojiPickerReject() {
    // Toggle the visibility of the emoji picker
    this.showEmojiPickerReject = !this.showEmojiPickerReject;
  }


  showEmojiPickerApprove = false;  // Control visibility of emoji picker
  addEmojiAprrove(event: any) {
    const emoji = event.emoji.native; // Get the selected emoji
    const editorInstance = this.Approvecommentsfocus?.editorInstance;

    if (editorInstance) {
      editorInstance.model.change((writer: any) => {
        // Get the current cursor position
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        // Insert the emoji at the cursor position
        writer.insertText(emoji, insertPosition);
      });
    } else {
      console.error('CKEditor instance is not available.');
    }

    this.showEmojiPickerApprove = false; // Hide the emoji picker after selection
  }

  toggleEmojiPickerAprrove() {
    // Toggle the visibility of the emoji picker
    this.showEmojiPickerApprove = !this.showEmojiPickerApprove;
  }
  ActionId: number = 0;
  approvecommentsModal(ActionId: number) {
    this.ActionId = ActionId;
    document.getElementById("approvecommentsModal").style.display = "block";
    document.getElementById("approvecommentsModal").classList.add("show");
    document.getElementById("approvecommentsModalBackdrop").style.display = "block";
    document.getElementById("approvecommentsModalBackdrop").classList.add("show");
  }

  approvecommentsModal_dismiss() {

    this.ActionId = 0;
    this._lstMultipleFilesAprandrej = [];
    document.getElementById("approvecommentsModal").style.display = "none";
    document.getElementById("approvecommentsModal").classList.remove("show");
    document.getElementById("approvecommentsModalBackdrop").style.display = "none";
    document.getElementById("approvecommentsModalBackdrop").classList.remove("show");
  }
  rejectcommentsModal(ActionId) {
    this.ActionId = ActionId;
    document.getElementById("rejectcommentsModal").style.display = "block";
    document.getElementById("rejectcommentsModal").classList.add("show");
    document.getElementById("rejectcommentsModalBackdrop").style.display = "block";
    document.getElementById("rejectcommentsModalBackdrop").classList.add("show");
  }

  rejectcommentsModal_dismiss() {
    this._lstMultipleFilesAprandrej = [];
    document.getElementById("rejectcommentsModal").style.display = "none";
    document.getElementById("rejectcommentsModal").classList.remove("show");
    document.getElementById("rejectcommentsModalBackdrop").style.display = "none";
    document.getElementById("rejectcommentsModalBackdrop").classList.remove("show");
  }



  CloseUserReplys() {

  }

  Openlabels() {
    this._obj1.UserId = this.currentUserValue.createdby;
    this.inboxService.UserLabels(this._obj1)
      .subscribe(data => {
        console.log(data, "getlabel");
        this._Lstlabels = data["Data"].LablesJson;
        console.log(this._Lstlabels, "Label");
        this.LabelCount = this._Lstlabels.length;
        this.SubLabelList = this._Lstlabels
        this.cd.detectChanges();
      });
    this.LabelUserErrorLog = false;
    $('#Kt_labels').addClass('kt-quick-panel--on');
    // document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
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
    this.inboxService.AddLabels(this._obj1)
      .subscribe(data => {
        console.log(data, "Insert Label")
        if (data['Message'] == true) {
          this._Lstlabels = data['Data'].LablesJson;
          console.log(this._Lstlabels, "Label List");
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
          (<HTMLInputElement>document.getElementById("txtlabels")).value = "";
          this.cd.detectChanges();
          this.Openlabels();
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
  getLabelName(labelId: string): string {
    const label = this._Lstlabels.find(l => l.LabelId === parseInt(labelId));
    return label ? label.LabelName : 'Label Not Found'; // Return label name or handle if not found
  }



  AddLabelInDocuments() {
    if (this.SelectedLabelIds == undefined || this.SelectedLabelIds == "") {
      this.LabelUserErrorLog = true;
      return
    }
    this.LabelUserErrorLog = false;
    this.inboxService.AddLabelToArchive(this.SelectedLabelIds.toString(), this._documentId.toString(), this.currentUserValue.createdby).subscribe(
      data => {
        console.log(data, "Add Label Data");
        this._LabelCount = data["Data"].labelcount;
        this.SelectLabelArray = data["Data"].SelectedLabels.split(',');
        if (data["Message"] == "1") {
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
        this.Closelabels();
      }
    )
  }


  Closelabels() {
    this.SelectedLabelIds = [];
    this.AddLabelList = [];
    this.LabelUserErrorLog = false;
    $('#Kt_labels').removeClass('kt-quick-panel--on');
    // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  RemoveSelectedLabels(labelId: number) {
    this.inboxService.RemoveLabelToArchive(this._documentId, labelId, this.currentUserValue.createdby).subscribe(
      data => {
        this._snackBar.open('Document Remove Tagged Successfully', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
        $('#Kt_labels').removeClass('kt-quick-panel--on');
        // document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
        // this.documentInfo(this._documentId, this._referenceId);
        this.ArchiveDetailsInfo(this._documentId, this.ShareId);
      }
    )
  }



  // Label Mat Dropdown start
  RemoveAddLabel(Label) {
    const index = this.AddLabelList.findIndex((lbl) => lbl.LabelName === Label.LabelName);
    this.isSelectionAddLabel = false;
    if (index !== -1) {
      this.AddLabelList.splice(index, 1);
      this.SelectedLabelIds.splice(index, 1);
    }
    Label.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }
  filterAddLabel(input: string): void {
    this.isSelectionAddLabel = true;
    this.SubLabelList = this._Lstlabels.filter((label) =>
      label.LabelName.toLowerCase().includes(input.toLowerCase())
    );
  }
  OpenAddLabel() {
    this.SubLabelList = this._Lstlabels;
    this.isSelection_AddLabel = true;
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).focus()
  }
  openAutocompleteDrpDwnAddLabel(OpenAddLabel: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAddLabel);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnAddLabel(CloseOpenAddLabel: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAddLabel);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }
  closePanelAddLabel() {
    this.isSelectionAddLabel = false;
    this.isSelection_AddLabel = false;
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchAddLabel")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }


  isLabelDisabled(labelId: string): boolean {
    return this.SelectLabelArray.includes(labelId.toString());
  }

  _AddLabel(event: MatAutocompleteSelectedEvent): void {
    const selectedLabel = this._Lstlabels.find((label) => label.LabelId === event.option.value);
    if (selectedLabel) {
      const index = this.AddLabelList.findIndex((_label) => _label.LabelId === selectedLabel.LabelId);
      if (index === -1) {
        // Label not found in the selected array, add it
        this.AddLabelList.push(selectedLabel);
        this.SelectedLabelIds.push(selectedLabel.LabelId);
      } else {
        // Label found in the selected array, remove it
        this.AddLabelList.splice(index, 1);
        this.SelectedLabelIds.splice(index, 1);
      }
    }
    this.SubLabelList = this._Lstlabels;
    this.isSelection_AddLabel = false;
    this.LabelUserErrorLog = false;
  }


  isSelectedAddLabel(_label: any): boolean {
    return this.AddLabelList.some((lbl) => lbl.LabelId === _label.LabelId);
  }


  // Label Mat dropdown end

  // Add User Mat dropdown start
  RemoveAddUser(Users) {
    const index = this.AddNewUserValues.findIndex((usr) => usr.UserId === Users.UserId);
    this.isSelectionAddUser = false;
    if (index !== -1) {
      this.AddNewUserValues.splice(index, 1);
      this.SelectedUserIds.splice(index, 1);
    }
    Users.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }

  filterAddUsers(input: string): void {
    this.isSelectionAddUser = true;
    this._UserListSubList = this.ObjgetCompanyList.filter((User) =>
      User.ContactName.toLowerCase().includes(input.toLowerCase())
    );
  }

  OpenAddUsers() {
    // this._ExistingUser = this._IsActiveExistinguser;
    this.isSelection_AddUsers = true;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).focus()
  }

  closePanelAddusers() {
    this.isSelectionAddUser = false;
    this.isSelection_AddUsers = false;
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchAddUsers")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }

  openAutocompleteDrpDwnAddUser(OpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }

  closeAutocompleteDrpDwnAddUser(CloseOpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }

  _AddNewUsers(event: MatAutocompleteSelectedEvent): void {

    const selectedEmployee = this.ObjgetCompanyList.find((user) => user.UserId === event.option.value);
    if (selectedEmployee) {
      const index = this.AddNewUserValues.findIndex((_user) => _user.UserId === selectedEmployee.UserId);
      if (index === -1) {
        // User not found in the selected array, add it
        this.AddNewUserValues.push(selectedEmployee);
        this.SelectedUserIds.push(selectedEmployee.UserId);
      } else {
        // User found in the selected array, remove it
        this.AddNewUserValues.splice(index, 1);
        this.SelectedUserIds.splice(index, 1);
      }
    }
    this._UserListSubList = this.ObjgetCompanyList;
    this.isSelection_AddUsers = false;
  }

  isSelectedAddusers(_User: any): boolean {
    return this.AddNewUserValues.some((usr) => usr.UserId === _User.UserId);
  }



  SharedocumentModel() {

    setTimeout(() => {
      if (this.mousepoint) {
        this.mousepoint.nativeElement.focus();
      }
    },);
    document.getElementById("fileupload-event-modal-backdrop").style.display = "block";
    document.getElementById("SharedocumentModel").style.display = "block";
  }

  NewActionModel() {
    document.getElementById("fileupload-event-modal-backdrop NewActionModel").style.display = "block";
    document.getElementById("NewActionModel").style.display = "block";
  }


  updateSelectedValues(UserId: number, event: any) {
    const isChecked = event.checked;

    // Update Check status for all instances of the same UserId
    this.ObjgetCompanyList.forEach(element => {
      if (element.UserId === UserId) {
        element.Check = isChecked;
      }
    });


  }

  SelectedNewActionsList: any[] = [];
  SelectedNewActionuserValues(UserId: number, event: any) {

    const isChecked = event.checked;
    this.NewActionUser.forEach(element => {
      if (element.UserId === UserId) {
        element.Check = isChecked;
      }
    });
    this.SelectedNewActionsList = [];
    this.NewActionUser.forEach(element => {
      if (element.Check) {
        this.SelectedNewActionsList.push(element);
      }
    });
  }

  AddNewActionUser() {

    const approvalUsers = this.SelectedNewActionsList.map((user) => {
      return {
        ShareType: "Approval User",
        UserId: user.UserId // Extract only UserId
      };
    });
    // If you need it as a JSON string
    const approvalUsersJson = JSON.stringify(approvalUsers);
    console.log('New Actions Users JSON:', approvalUsersJson);
    this._obj.DocumentId = parseInt(this._documentId);
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ApprovalUserJson = approvalUsersJson;
    this._obj.ShareUserJson = "[]";
    this._obj.ReportingUserID = this.currentUserValue.ReportingUserId;
    this._obj.IsArchiveApproval = this.currentUserValue.IsArchiveApproval;
    this.inboxService.ShareUserListArchive(this._obj).subscribe(data => {
      // this.documentInfo(this._documentId, this._referenceId);
      this.ArchiveDetailsInfo(this._documentId, this.ShareId);
      this.closeInfo();
    });


  }

  AddSelectUser() {

    // Filter out duplicates based on UserId
    const uniqueUserIds = new Set();
    this.SelectedUsers = this.ObjgetCompanyList.filter(element => {
      if (element.Check && !uniqueUserIds.has(element.UserId)) {
        uniqueUserIds.add(element.UserId);
        element.shareDocAccess = element.shareDocAccess !== undefined ? element.shareDocAccess : true;

        return true;
      }
      return false;
    });
    this.SelectUserErrlog = false;
    console.log(this.SelectedUsers, "Selected User");
    document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
    document.getElementById("SharedocumentModel").style.display = "none";
  }


  AddNewActionSelectUser() {

    document.getElementById("fileupload-event-modal-backdrop NewActionModel").style.display = "none";
    document.getElementById("NewActionModel").style.display = "none";
  }
  close_projectmodal() {
    this.ShareSearch = "";
    document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
    document.getElementById("SharedocumentModel").style.display = "none";
  }

  close_newactionuserprojectmodal() {
    this.ShareSearch = "";
    document.getElementById("fileupload-event-modal-backdrop NewActionModel").style.display = "none";
    document.getElementById("NewActionModel").style.display = "none";
  }


  togglesharedocRadio(event: Event, user) {
    const inputElement = event.target as HTMLInputElement;
    user.isTemporary = inputElement.value === 'no';
    if (user.isTemporary) {
      user.expiryDate = this.formattedTemporaryDate ? new Date(this.formattedTemporaryDate) : null;
    } else {
      user.expiryDate = null; // Clear expiry date if Permanent
    }
    this.Temporaryvalue = user.isTemporary;
    this.checkTemporaryValue();
  }

  checkTemporaryValue() {
    this.Temporaryvalues = this.SelectedUsers.some(user => user.isTemporary);
  }

  onDateTemporaryDate(expiryDate, event: any) {
    this.TemporaryDate = expiryDate;
    this.TemporaryDate = new Date(event.value);
    this.TemporaryDate.setHours(6);
    this.TemporaryDate.setMinutes(45);
    this.TemporaryDate.setSeconds(0);

    // Format the date as "DD-MM-YYYY hh:mm:ss A"
    this.formattedTemporaryDate = moment(this.TemporaryDate).format('MM/DD/YYYY hh:mm:ss A');
    console.log('Formatted Return Date:', this.formattedTemporaryDate);

    this.ExpiryDateRequired = false;
  }

  toggleShareDocAccess(user) {
    // Toggle shareDocAccess checkbox value for each user
    user.shareDocAccess = !user.shareDocAccess;
  }

  ClearShareUser() {
    this.ShareSearch = "";
  }
  close_project_filter() {
    document.getElementById("project-filter").classList.remove("show");
    document.getElementById("filter-icon").classList.remove("active");
  }

  AddUsers() {
    this.ObjgetCompanyList = [];
    this._obj1.CreatedBy = this.currentUserValue.createdby;
    this._obj1.organizationid = this.currentUserValue.organizationid;
    this._obj1.DocumentId = parseInt(this._documentId);
    this.inboxService.ShareUserList(this._obj1)
      .subscribe(data => {
        console.log(data, "add Users");
        var _UsersLst = data["Data"].UserJson;
        this._LstToUsers = _UsersLst;
        this._LstToUsers.forEach(element => {
          this.ObjgetCompanyList.push({
            UserId: element.UserId,
            ContactName: element.ContactName,
            disabled: false
          })
        });
      });
    this.ObjgetCompanyList.forEach(element => {
      element.Check = false;
    });
    this.ExpiryDateRequired = false;
    this.SelectUserErrlog = false;
    this.SelectedUsers = [];
    this.Temporaryvalues = false;
    this.formattedTemporaryDate = null;
    (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.add("kt-quick-panel--on");
    // document.getElementById("moredet")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  CloseUsers() {

    this.SelectedUsers.forEach(user => {
      user.isTemporary = false; // Set to Permanent
      user.expiryDate = null; // Clear expiry date
    });
    this.ObjgetCompanyList.forEach(element => {
      element.Check = false;
    });
    this.Temporaryvalues = false;
    this.ExpiryDateRequired = false;
    this.SelectUserErrlog = false;
    this.formattedTemporaryDate = null;
    this.UserComments = "";
    $('#useradd-tab').removeClass('active');
    $('#userlist-tab').addClass('active');
    $('#useradd').removeClass('active');
    $('#useradd').removeClass('show');
    $('#userlist').addClass('active');
    $('#userlist').addClass('show');
    (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.remove("kt-quick-panel--on");
    // document.getElementById("moredet")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  AddUsersInDocument() {
    this.ExpiryDateRequired = false;
    this.SelectUserErrlog = false;
    // Ensure SelectedUsers is defined and not empty
    if (!this.SelectedUsers || this.SelectedUsers.length === 0) {
      this.SelectUserErrlog = true;
      return;
    }

    // If Temporaryvalue is true, ensure the formatted expiry date is set
    if (this.Temporaryvalue) {
      if (!this.formattedTemporaryDate) {
        this.ExpiryDateRequired = true;
        return;
      }
    }

    // Create the JSON object
    let _Sharedocument = {
      Users: this.SelectedUsers.map(user => ({
        UserId: user.UserId,
        isTemporary: user.isTemporary ? "T" : "P",
        expiryDate: user.expiryDate ? moment(user.expiryDate).format('MM-DD-YYYY hh:mm:ss A') : "", // Formatted expiry date
        shareDocAccess: user.shareDocAccess,
        Isphysical: false,
        ShareType: "Share User"

      }))
    };

    // Validate if the JSON object has users
    if (_Sharedocument.Users.length === 0) {
      this.SelectUserErrlog = true;
      return;
    }

    // Convert JSON object to string
    this._SharedocumentJSON = JSON.stringify(_Sharedocument, null, 2);
    console.log(this._SharedocumentJSON, "Share Document");



    this._obj.DocumentId = parseInt(this._documentId);
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this._obj.ApprovalUserJson = "[]";
    this._obj.ShareUserJson = this._SharedocumentJSON;
    this._obj.ReportingUserID = this.currentUserValue.ReportingUserId;
    this._obj.IsArchiveApproval = this.currentUserValue.IsArchiveApproval;
    this.inboxService.ShareUserListArchive(this._obj).subscribe(data => {
      // this.documentInfo(this._documentId, this._referenceId);
      this.ArchiveDetailsInfo(this._documentId, this.ShareId);
      this.CloseUsers();
      $('#useradd-tab').removeClass('active');
      $('#userlist-tab').addClass('active');
      $('#useradd').removeClass('active');
      $('#useradd').removeClass('show');
      $('#userlist').addClass('active');
      $('#userlist').addClass('show');
      (<HTMLInputElement>document.getElementById("kt_replay_add_users")).classList.remove("kt-quick-panel--on");
      // document.getElementById("moredet")[0].classList.remove("position-fixed");
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    })

  }

  selectedIndex: number | null = null;

  Approvepopup(index: number) {
    this.selectedIndex = index;
    $('.notification fileupload-notification').removeClass('custom-style');
    $('#notification_li_' + index).addClass('custom-style');
  }


  Projectmodalphysicaladd() {

    (<HTMLInputElement>document.getElementById("fileupload-event-modal-backdrop")).style.display = "block";
    (<HTMLInputElement>document.getElementById("projectmodalphysicaladd")).style.display = "block";
  }
  Workflowdetails: any;
  WorkFlowName: string = '';
  workflowmodal_open() {
    this._obj1.WorkFlowId = this._WorkFlowId;
    this._obj1.DocumentId = parseInt(this._documentId);
    this.inboxService.WorkFlowDetailsOfArchiveAPI(this._obj1)
      .subscribe(data => {
        console.log(data, "get workflow details");
        this.Workflowdetails = data["Data"]["WorkFlowDetails"];
        this.Workflowdetails = this.Workflowdetails.sort((a, b) => a.SortId - b.SortId);
        this.WorkFlowName = this.Workflowdetails[0].WorkFlowName;
        // this._ActionType = this.Workflowdetails[0].ActionType;
        // this._CreatedDate = this.Workflowdetails[0].CreatedDate;
        console.log(this.Workflowdetails, "Selected workflow data");
      })
    document.getElementById("workflowmodal-modal-backdrop").style.display = "block";
    document.getElementById("workflowmodal").style.display = "block";
  }

  // Check if both Approved and Rejected exist with 'Next step'
  hasApprovedAndRejectedNextStep(actions: any[]): boolean {
    const hasApproved = actions.some(a => a.UserAction === 'Approved' && a.SystemAction === 'Next step');
    const hasRejected = actions.some(a => a.UserAction === 'Rejected' && a.SystemAction === 'Next step');
    return hasApproved && hasRejected;
  }

  workflowmodal_close() {
    document.getElementById("workflowmodal-modal-backdrop").style.display = "none";
    document.getElementById("workflowmodal").style.display = "none";
  }

  _Handovertextbox: any;
  sharedocRadioOption: string = "P";
  isuserlocradio: boolean = false;
  toggleuserlocRadio(event: Event) {
    alert(this.sharedocRadioOption);
    const inputElement = event.target as HTMLInputElement;
    this.isuserlocradio = inputElement.value === 'T';
    this.ReturnDate = null;
  }

  onDateSelectRD(event) {

  }
  toggleFood(event) {

  }

  onDateSelectFE(event) {

  }

  _BindUserSection: any = [];
  BindUserSection() {
    this._obj1.OrganizationId = this.currentUserValue.organizationid;
    this._obj1.DocumentId = parseInt(this._documentId);
    this.inboxService.UserActionListArchive(this._obj1)
      .subscribe(data => {
        console.log(data["userActionJson"], "get user action details");
        this._BindUserSection = JSON.parse(data["userActionJson"]);
        console.log(this._BindUserSection, "BindUserSection");
      })
  }
 
}
export function formatFileSize(sizeInKB: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (sizeInKB >= GB) {
    return (sizeInKB / GB).toFixed(2) + ' GB';
  } else if (sizeInKB >= MB) {
    return (sizeInKB / MB).toFixed(2) + ' MB';
  } else {
    return (sizeInKB / KB).toFixed(2) + ' KB';
  }

}