import { ChangeDetectorRef, Component, SimpleChanges, ElementRef, Inject, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MatSnackBar } from '@angular/material/snack-bar';
import tippy from 'node_modules/tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { InboxService } from 'src/app/_service/inbox.service';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { ShuffeldocumentsService } from 'src/app/_service/shuffeldocuments.service';
import { ShuffeldocumentsDto } from 'src/app/_models/shuffeldocuments.dto';
import { WarehouseDTO } from 'src/app/_models/warehouse-dto';
import { WarehouseService } from 'src/app/_service/warehouse.service';
import { BlocksDTO } from 'src/app/_models/blocks-dto';
import { BlocksService } from 'src/app/_service/blocks.service';
import { RacksDTO } from 'src/app/_models/racks-dto';
import { RacksService } from 'src/app/_service/racks.service';
import { ShelvesDTO } from 'src/app/_models/shelves-dto';
import { ShelvesService } from 'src/app/_service/shelves.service';
import * as moment from 'moment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ApiurlService } from 'src/app/_service/apiurl.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AzureUploadService } from 'src/app/_service/azure-upload.service';

declare var $: any;
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})

export class ArchiveComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
  @ViewChildren(MatAutocompleteTrigger) autocompletes: QueryList<MatAutocompleteTrigger>;
  @ViewChild('physicalCheck') physicalCheck!: ElementRef;
  @ViewChild('optionalCheck') optionalCheck: ElementRef;
  @ViewChild('workflowCheck') workflowCheck: ElementRef;
  @ViewChild('foodCheck') foodCheck: ElementRef;
  @ViewChild('ShareFocus', { static: false }) ShareFocus!: ElementRef;
  @ViewChild('PhysicalFocus', { static: false }) PhysicalFocus!: ElementRef;
  private progressConnectionBuilder!: HubConnection;
  readonly signalUrl = this.commonUrl.Signalurl;
  _obj: GACFiledto;
  _objII: GACFiledto;
  _obj1: InboxDTO;
  _GacAttachmentFileuplod: any = [];
  objBlocksDTO: BlocksDTO;
  objracksDTO: RacksDTO;
  customObj: ShelvesDTO;
  selectedValues: string = '';
  SubmitDocumentDocumentId: number;
  _selectedValues: Array<{
    UserId: number;
    ContactName: string;
    disabled: boolean;
    Check: boolean;
    isTemporary: boolean;
    startDate: Date;
    shareDocAccess: boolean;
    IsPhysical: boolean;
  }> = [];
  SelectedUsers: any[] = [];
  SelectedRequiredapprovalUsers: any[] = [];
  selectedWarehouseValue: number;
  selectedBlockValue: number;
  selectedRackValue: number;
  selectedShelveValue: any;
  _JsonArray: any;
  _PhysicalDocument: any;
  _AdditionalDocument: any;
  _Sharedocument: any;
  _DocumentLocation: string = "";
  sharedocRadioOption: string = '';
  PhysicalSearch: string;
  ReturnDate: Date;
  FoodExpiryDate: Date;
  formattedReturnDate: string;
  TemporaryDate: Date;
  formattedTemporaryDate: string;
  formattedFoodExpiryDate: string;
  _Handovertextbox: string = "";
  _DocumentsLoctionName: string = "";
  _SelectedPhysicalUserId: any;
  _physicalDocumentJSON: any;
  _AdditionalDocumentJSON: any;
  _SharedocumentJSON: any;
  _DocumentTypeId: any;
  selectedDocumentTypeName: string = "";
  _ManufactureandDistributorId: any;
  selectedCategoryNames: string[] = [];
  selectedSubCategoryNames: string[] = [];
  _SourceId: any;
  progress: number = 0;
  _CategoryId: any;
  _SubCategoryId: any;
  objshelvesDTO: ShelvesDTO;
  _CompanyId: number;
  _DepartmentId: number
  CompanyList: any;
  ExpiryDateRequired: boolean = false;
  Temporaryvalue: any;
  _TExpiryDate: any;
  DepartmentList: any;
  DocumentTypeList: any;
  DistributorList: any;
  ManufactureList: any;
  CategoryList: any;
  SubCategoryList: any;
  SourceList: any;
  url: any;
  msg = "";
  IsImage: boolean;
  myFiles: string[] = [];
  _lstMultipleFiles: any;
  _MainFile: any;
  documentid: number
  versionid: number
  file_upload: any
  EnterText: string
  // Access ng-select
  _LstToUsers: any;
  ObjShareUserList: any[] = [];
  ObjUserList: any[] = [];
  ObjRequiredApprovalList: any[] = [];
  _rows: number;
  _columns: number;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  base64File: string = null;
  filename: any
  _roleid: number;
  _ReportingUserId: number;
  _LoginUserId: number;
  disablePreviousDate = new Date();
  disablePreviousDate1 = new Date();
  disablePreviousDate3 = new Date();
  disablePreviousDateRD = new Date();
  disablePreviousDateFE = new Date()
  private currentUserSubject: BehaviorSubject<UserDTO>;
  click: boolean = true;
  public currentUser: Observable<UserDTO>;
  Company: string;
  Department: any;
  DocumentName: string;
  Document: any;
  Source: any;
  Manufacture: any;
  Distributor: any;
  Yes: string;
  No: string;
  objwareDTO: WarehouseDTO
  Length: string = "";
  Breadth: string = "";
  Height: string = "";
  selectedPhysicalUser: string;
  Yesss: string;
  Noooo: string;
  Date: string = "";
  Note: string = "";
  Category: any;
  subCategory: string;
  Image: string;
  file: string;
  AddSource: any;
  AddDM: any;
  DocumentType: any;
  physicalYes: string;
  physicalNO: string;
  FoodYes: string;
  FoodNo: string;
  viewer: string;
  CompanyId: number;
  DepartmentId: number;
  Warehouse: string;
  InfoValidation: boolean = false;
  MainAttachmentValidation: boolean = false;
  CompanyRequired: boolean = false;
  DepartmentRequired: boolean = false;
  DocumentNameRequired: boolean = false;
  FileUploadRequired: boolean = false;
  DocumentTypeRequired: boolean = false;
  SourceRequired: boolean = false;
  CategoryRequired: boolean = false;
  SubCategory: boolean = false;
  UploadFiles: any;
  ManufactureRequired: boolean = false;
  LengthRequired: boolean = false;
  HeightRequired: boolean = false;
  BreadthRequired: boolean = false;
  _DocumentLoctaionRequired: boolean = false;
  _HandoverUserRequired: boolean = false;
  _ReturnDateRequired: boolean = false;
  DateRequired: boolean = false;
  Isphysical: boolean = false;
  Isfood: boolean = false;
  Isoptional: boolean = false;
  Isworkflow: boolean = false;
  Issharedoc: boolean = false;
  IsRequiredApproval: boolean = false;
  Isadduser: boolean = false;
  isuserlocradio: boolean = false;
  issharedocradio: boolean = false;
  allValidationsPassed: boolean = true;
  selectedOption: string = '';
  AddRackName: string;
  SelectCompany: string;
  SelectDepartment: string;
  _Previewshownandhide: boolean = false;
  EnterArchiveName: string;
  SelectDocumentType: string;
  AddBlockName: string;
  Sourcetext: string;
  SelectSource: string;
  LengthinCM: string;
  BreadthinCM: string;
  ToUserId: number;
  SelectManufactureDistributor: string;
  HeightinCM: string;
  Enterdocumnetlocation: string;
  ManufactureandDistributor: string;
  ExpiryDate: string;
  currentLang: "ar" | "en" = "ar";
  ShareSearch: string;
  CategorySearch: string = "";
  ReturnDates: string;
  _obj2: ShuffeldocumentsDto;
  ObjBlocksdrp: ShuffeldocumentsDto[];
  Objwarehousedrp: ShuffeldocumentsDto[];
  ObjRacksdrp: ShuffeldocumentsDto[];
  Objshelvedrp: ShuffeldocumentsDto[];
  racksdrp: any;
  blockssdrp: any;
  _Shelvearray: any;
  thumbnail: boolean = false;
  RelatedWarehouses: any[] = [];
  selectedUser: any[] = [];
  Physicaluser: any[] = [];
  _WarehouseName: string = '';
  _BlockName: string = '';
  _RackName: string = '';
  _ShelveName: string = '';
  selectedIndex: number | null = null;
  thumbnailPreviews: any;
  thumbnailbase64: any;
  SelectedReportingUserName: string = '';
  selectedCompanyName: string;
  selectedDepartmentName: string;
  openedDocname: string;
  _VersionId: number;
  _referenceId: string;
  ShareId: string;
  _DocumentId: string;
  @Input() closeGacUpload: any;
  isArchiveApproval: boolean = false;
  EmployeeId: number;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor(public service: GACFileService,
    private route: ActivatedRoute,
    public services: ShuffeldocumentsService,
    public serviceW: WarehouseService,
    public serviceB: BlocksService,
    public serviceR: RacksService,
    public serviceS: ShelvesService,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    private renderer: Renderer2,
    public inboxService: InboxService,
    private cdr: ChangeDetectorRef,
    private commonUrl: ApiurlService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private azureUploadService: AzureUploadService
  ) {
    this._obj2 = new ShuffeldocumentsDto();
    this._obj = new GACFiledto();
    this._objII = new GACFiledto();
    this._obj1 = new InboxDTO();
    this.objwareDTO = new WarehouseDTO();
    this.objBlocksDTO = new BlocksDTO();
    this.objracksDTO = new RacksDTO();
    this.customObj = new ShelvesDTO();
    // this.selectedWarehouseValue = 0;
    // this.selectedBlockValue = 0;
    // this.selectedRackValue = 0;
    this.EmployeeId = parseInt(this.currentUserValue.EmployeeCode);
    this._GacAttachmentFileuplod = [];
    this._JsonArray = [];
    this.objshelvesDTO = new ShelvesDTO();
    this.SourceList = [];
    this.SubCategoryList = [];
    this._lstMultipleFiles = [];
    this.myFiles = [];
    this._obj.IsPhysical = false;
    this._obj.IsFoodItem = false;
    this._obj.Description = "";
    this._roleid = this.currentUserValue.RoleId;
    this._ReportingUserId = this.currentUserValue.ReportingUserId;
    this._LoginUserId = this.currentUserValue.createdby;
    this.Isphysical = false;
    this.Isfood = false;
    this.thumbnailPreviews = [];
    HeaderComponent.languageChanged.subscribe(lang => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.SelectCompany = lang === 'en' ? 'Company' : 'اختر الشركة';
      this.SelectDepartment = lang === 'en' ? 'Department' : 'اختر القسم';
      this.EnterArchiveName = lang === 'en' ? 'Enter Document Name' : 'أدخل اسم المستند';
      this.SelectDocumentType = lang === 'en' ? 'Document Type' : 'حدد نوع المستند';
      this.Sourcetext = lang === 'en' ? 'Source' : 'مصدر';
      this.SelectSource = lang === 'en' ? 'Source' : 'اختر مصدر';
      this.ManufactureandDistributor = lang === 'en' ? 'Manufacture & Distributor' : 'تصنيع وموزع';
      this.SelectManufactureDistributor = lang === 'en' ? 'Manufacture & Distributor' : 'حدد التصنيع والموزع';
      this.LengthinCM = lang === 'en' ? 'Length in CM' : 'الطول بالسم';
      this.BreadthinCM = lang === 'en' ? 'Breadth in CM' : 'اتساع في سم';
      this.HeightinCM = lang === 'en' ? 'Height in CM' : 'الارتفاع بالسم';
      this.ExpiryDate = lang === 'en' ? 'Expiry Date' : 'تاريخ الانتهاء';
      this.Enterdocumnetlocation = lang === 'en' ? 'Enter documnet location' : 'أدخل موقع المستند';
      this.EnterText = lang === 'en' ? 'Enter Text' : 'أدخل النص';
      this.ReturnDates = lang === 'en' ? 'Return Date' : 'تاريخ العودة';
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    })
  }






  async ngOnInit(): Promise<void> {
    const lang: any = localStorage.getItem('language')
    this.translate.use(lang);
    this.SelectCompany = lang === 'en' ? 'Company' : 'اختر الشركة';
    this.SelectDepartment = lang === 'en' ? 'Department' : 'اختر القسم';
    this.EnterArchiveName = lang === 'en' ? 'Enter Document Name' : 'أدخل اسم المستند';
    this.SelectDocumentType = lang === 'en' ? 'Document Type' : 'حدد نوع المستند';
    this.Sourcetext = lang === 'en' ? 'Source' : 'مصدر';
    this.SelectSource = lang === 'en' ? 'S Source' : 'اختر مصدر';
    this.ManufactureandDistributor = lang === 'en' ? 'Manufacture & Distributor' : 'تصنيع وموزع';
    this.SelectManufactureDistributor = lang === 'en' ? 'Manufacture & Distributor' : 'حدد التصنيع والموزع';
    this.LengthinCM = lang === 'en' ? 'Length in CM' : 'الطول بالسم';
    this.BreadthinCM = lang === 'en' ? 'Breadth in CM' : 'اتساع في سم';
    this.HeightinCM = lang === 'en' ? 'Height in CM' : 'الارتفاع بالسم';
    this.ExpiryDate = lang === 'en' ? 'Expiry Date' : 'تاريخ الانتهاء';
    this.Enterdocumnetlocation = lang === 'en' ? 'Enter documnet location' : 'أدخل موقع المستند';
    this.EnterText = lang === 'en' ? 'Enter Text' : 'أدخل النص';
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.progress = 0;
    this.OnWarehouse();
    this.GetDropdowns();
    this.DropdownList();
    this.WorkflowDropdownlist();
    this.getIsArchiveDownload();
    this.SubCategoryAPI();
    (await this.SignalRMethods());
    this.viewer = "office";
    tippy('.tips', {
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      animateFill: true,
      inertia: true,
    });

    this.route.queryParams.subscribe((params: any) => {
      this._DocumentId = params.docid;
    })
    this.route.queryParams.subscribe((params: any) => {
      this.openedDocname = params.docname;

    })
    console.log(this.openedDocname, "this.openedDocname");
    this.route.queryParams.subscribe((params: any) => {
      this._VersionId = params.Versionid;
    })
    this.route.queryParams.subscribe((params: any) => {
      this._referenceId = params.ReferenceId;
    })
    this.route.queryParams.subscribe((params: any) => {
      this.ShareId = params.ShareId;
    })

  }


  Back() {
    if (this._VersionId === undefined) {
      this.router.navigate(['/backend/Archive/Documents']);
    } else {
      // Check if any of the variables used in navigation are undefined
      if (this._DocumentId === undefined || this._referenceId === undefined || this.ShareId === undefined) {
        console.error('One or more parameters are undefined');
        // Handle the case where parameters are undefined
        return; // Prevent navigation if parameters are invalid
      }

      this.router.navigate(['Gac/DocumentDetails', this._DocumentId, this._referenceId, this.ShareId]);
    }
  }

  async SignalRMethods() {
    //Creation Connection of Progress bar for file upload
    //start here
    this.progressConnectionBuilder = new HubConnectionBuilder()
      .withUrl(this.signalUrl + 'progressHub?userId=' + this.currentUserValue.createdby)
      .build();
    //End here
  }

  getIsArchiveDownload(): void {
    const userData = localStorage.getItem('currentUser');
    // console.log(userData ,"localStorage value");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        // Access IsArchiveDownload value
        this.isArchiveApproval = parsedData[0]?.IsArchiveApproval ?? false;
        console.log('IsArchiveApproval:', this.isArchiveApproval);
      } catch (error) {
        console.error('Error parsing currentUser data from localStorage:', error);
      }
    } else {
      console.warn('No currentUser data found in localStorage');
    }



  }

  updateSelectedValues(UserId: number, event: any) {
    const isChecked = event.checked;
    this.ObjShareUserList.forEach(element => {
      if (element.UserId === UserId) {
        element.isChecked = isChecked;
      }
    });
    this.SelectedUsers = [];
    this.ObjShareUserList.forEach(element => {
      if (element.isChecked) {
        this.SelectedUsers.push(element);
      }
    });

  }

  updateSelectedRequiredapprovalValues(UserId: number, event: any) {


    const isChecked = event.checked;
    this.ObjRequiredApprovalList.forEach(element => {
      if (element.UserId === UserId) {
        element.isChecked = isChecked;
      }
    });
    this.SelectedRequiredapprovalUsers = [];
    this.ObjRequiredApprovalList.forEach(element => {
      if (element.isChecked) {
        this.SelectedRequiredapprovalUsers.push(element);
      }
    });


    console.log(this.SelectedRequiredapprovalUsers, "add share users");
    this.ObjShareUserList.forEach(element => {
      if (element.UserId == UserId) {
        element.disabled = true;
        element.isChecked = false;
      }
    });
    this.SelectedUsers = this.SelectedUsers.filter(u => u.UserId !== UserId);
  }


  RemoveRequiredapprovalUser(userId: number): void {
    this.SelectedRequiredapprovalUsers = this.SelectedRequiredapprovalUsers.filter(user => user.UserId !== userId);

    this.ObjRequiredApprovalList.forEach(element => {
      if (element.UserId === userId) {
        element.isChecked = false; // Set disabled to false
      }
    });

    this.ObjShareUserList.forEach(element => {
      if (element.UserId === userId) {
        element.disabled = false; // Set disabled to false
      }
    });
  }

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

  AddSelectCategory() {
    this.CategorySearch = "";
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

    // this.ObjShareUserList.forEach(element => {
    //   if (element.UserId === userId) {
    //     element.disabled = false; // Set disabled to false
    //   }
    // });
  }

  updateSelectedArray(selectedValues) {
    let namesArray = selectedValues.split(', ').filter(name => name);

    // Map namesArray to create _selectedValues
    this._selectedValues = namesArray.map(name => {
      // Assuming you have some logic to find the corresponding UserId based on ContactName
      let matchingItem = this.ObjShareUserList.find(item => item.ContactName === name);
      if (matchingItem) {
        return {
          UserId: matchingItem.UserId,
          ContactName: matchingItem.ContactName,
          disabled: matchingItem.disabled,
          Check: matchingItem.Check,
          isTemporary: matchingItem.isTemporary,
          startDate: matchingItem.startDate,
          shareDocAccess: matchingItem.shareDocAccess,
          Isphysical: matchingItem.IsPhysical
        };
      } else {
        return {
          UserId: 0, // Default value or handle missing UserId appropriately
          ContactName: name,
          disabled: false, // Default values for other properties
          Check: false,
          isTemporary: false,
          startDate: new Date(),
          shareDocAccess: true,
          IsPhysical: false
        };
      }
    });
  }

  AddSelectUser() {
    this.ShareSearch = "";
    document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
    document.getElementById("projectmodal").style.display = "none";
  }

  AddSelectRequiredapprovalUser() {
    this.ShareSearch = "";
    document.getElementById("fileupload-event-modal-backdrop approval").style.display = "none";
    document.getElementById("Requiredapprovl").style.display = "none";
  }

  adlist() {
    $('#distdiv').removeClass('d-none');
    $('#adlist').hide();
  }
  solist() {
    $('#socdiv').removeClass('d-none');
    $('#solist').hide();
  }
  warelist() {
    $('#warediv').removeClass('d-none');
    $('#warelist').hide();
  }
  ware_cl() {
    $('#warediv').addClass('d-none');
    $('#warelist').show();
    this.Warehouse = "";
  }
  Blocklist() {
    $('#Blockdiv').removeClass('d-none');
    $('#Blocklist').hide();
  }
  Block_cl() {
    $('#Blockdiv').addClass('d-none');
    $('#Blocklist').show();
    this.AddBlockName = "";
  }

  Racklist() {
    $('#Rackdiv').removeClass('d-none');
    $('#Racklist').hide();
  }

  Rack_cl() {
    $('#Rackdiv').addClass('d-none');
    $('#Racklist').show();
    this.AddRackName = "";
  }

  Shelvelist() {
    $('#Shelvediv').removeClass('d-none');
    $('#Shelvelist').hide();
  }

  Shelve_cl() {
    $('#Shelvediv').addClass('d-none');
    $('#Shelvelist').show();
  }


  onDateSelectRD(event: any): void {
    // Parse the selected date and set specific hours, minutes, and seconds
    this.ReturnDate = new Date(event.value);
    this.ReturnDate.setHours(6);
    this.ReturnDate.setMinutes(45);
    this.ReturnDate.setSeconds(0);

    // Format the date as "DD-MM-YYYY hh:mm:ss A"
    this.formattedReturnDate = moment(this.ReturnDate).format('MM/DD/YYYY hh:mm:ss A');
    // console.log('Formatted Return Date:', this.formattedReturnDate);

    if (this.ReturnDate != null) {
      this._ReturnDateRequired = false; // Hide the error message
    }
  }

  onDateTemporaryDate(expiryDate, event: any) {
    this.TemporaryDate = expiryDate;
    this.TemporaryDate = new Date(event.value);
    this.TemporaryDate.setHours(6);
    this.TemporaryDate.setMinutes(45);
    this.TemporaryDate.setSeconds(0);

    // Format the date as "DD-MM-YYYY hh:mm:ss A"
    this.formattedTemporaryDate = moment(this.TemporaryDate).format('MM/DD/YYYY hh:mm:ss A');
    this.ExpiryDateRequired = false;
    // console.log('Formatted Return Date:', this.formattedTemporaryDate);
  }

  onDateSelectFE(event: any): void {
    this.DateRequired = false
    // Parse the selected date and set specific hours, minutes, and seconds
    this.FoodExpiryDate = new Date(event.value);
    this.FoodExpiryDate.setHours(6);
    this.FoodExpiryDate.setMinutes(45);
    this.FoodExpiryDate.setSeconds(0);

    // Format the date as "DD-MM-YYYY hh:mm:ss A"
    this.formattedFoodExpiryDate = moment(this.FoodExpiryDate).format('MM/DD/YYYY hh:mm:ss A');
    // console.log('Formatted Return Date:', this.formattedFoodExpiryDate);
  }
  _SubCategoryName: any;
  DropdownList() {
    this._obj.OrganizationId = this.currentUserValue.organizationid;
    this._obj.CreatedBy = this.currentUserValue.createdby;
    this.service.GetDropdownList(this._obj)
      .subscribe(data => {
        // console.log(data, "CJ and DJ and DTJ and DMJ and CJ")
        this._obj = data as GACFiledto;
        this.CompanyList = this._obj.Data["CompanyJson"];
        // console.log(this.CompanyList, "CompanyList");
        this.CompanuUserSubList = this.CompanyList;
        this.DepartmentList = this._obj.Data["DepartmentJson"];
        this.DocumentTypeList = this._obj.Data["DocumentTypeJson"];
        this.ManufactureList = this._obj.Data["DistributorAndManufactureJson"];
        this.CategoryList = this._obj.Data["CategoryJson"];
      });
  }


  OnSubmit() {
    this.allValidationsPassed = true;

    if (!this._GacAttachmentFileuplod || this._GacAttachmentFileuplod.length === 0) {
      this.FileUploadRequired = true;
      this.allValidationsPassed = false;
    }

    if (this.Temporaryvalue) {
      if (this.formattedTemporaryDate == undefined) {  // Check if expiry date is not set
        this.ExpiryDateRequired = true;
        this.allValidationsPassed = false;
      }
    }

    console.log(this._GacAttachmentFileuplod, "Submit api file upload");
    const extractedValues = this._GacAttachmentFileuplod.map((file) => ({
      FileName: file.FileName,
      CloudName: file.CloudName,
      IsMain: file.Ismain,
      Url: file.Url,
      ThumbnailUrl: file.ThumbnailUrl
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


    const approvalUsers = this.SelectedRequiredapprovalUsers.map((user) => {
      return {
        ShareType: "Approval User",
        UserId: user.UserId // Extract only UserId
      };
    });
    // If you need it as a JSON string
    const approvalUsersJson = JSON.stringify(approvalUsers);
    console.log('Approval Users JSON:', approvalUsersJson);


    const WorkflowJson = (this.Workflowdetails && this.Workflowdetails.length > 0)
      ? this.Workflowdetails.map(item => ({
        SortId: item.SortId,
        UserId: item.UserId,
        ShareType: "Workflow User",
        WorkFlowId: this.Workflow_drpvalue
      }))
      : [];

    console.log('Workflow JSON:', JSON.stringify(WorkflowJson));

    let _Sharedocument = {
      Users: this.SelectedUsers.map(user => ({
        UserId: user.UserId,
        isTemporary: user.isTemporary ? "T" : "P",
        expiryDate: user.expiryDate ? moment(user.expiryDate).format('MM-DD-YYYY hh:mm:ss A') : "", // Formatted expiry date
        shareDocAccess: user.shareDocAccess,
        Isphysical: user.IsPhysical,
        ShareType: "Share User"
      }))
    };

    this._SharedocumentJSON = JSON.stringify(_Sharedocument, null, 2);
    console.log(this._SharedocumentJSON, "Share Document");

    // Stop execution if any validation failed
    if (!this.allValidationsPassed) {
      console.error("Validations failed. API call aborted.");
      return; // Exit early if validation fails
    }


    // const selectedSubCategoryId = this.SelectedCategory.find(
    //   (category) => category.SubCategoryName === 
    // )?.SubCategoryId || 0;


    const subCategoryIds = this.SelectedCategory?.length
      ? this.SelectedCategory.map((category) => category.SubCategoryId).toString()
      : '0';
    // Create the AdditionalDocument object
    this._AdditionalDocument = {
      "DocumentTypeId": this._DocumentTypeId || 0,
      "SourceId": this._SourceId || 0,
      "ManufactureandDistributorId": this._ManufactureandDistributorId || 0,
      "SubCategoryId": subCategoryIds,
      "Length": this.Length || '',
      "Breadth": this.Breadth || '',
      "Height": this.Height || '',
      "DocumentLocation": this._DocumentsLoctionName,
      "IsFoodItem": this.Isfood,
      "FoodExpiryDate": this.formattedFoodExpiryDate || null,
      "Description": this.Note
    }


    this._SubCategoryName = this.SelectedCategory.map((category) => category.SubCategoryName);
    console.log(this._SubCategoryName, "_SubCategoryName ")
    // Convert to JSON  
    if (this._AdditionalDocument) {
      this._AdditionalDocumentJSON = JSON.stringify(this._AdditionalDocument, null, 2);
      console.log(this._AdditionalDocumentJSON, "Additional DocumentJSON Json");
    } else {
      console.log("Additional Document is not defined.");
    }


    this._obj.flagId = 0;
    this._obj.documentId = 0;
    this._obj.documentName = this.FirstFileDocumentName;
    this._obj.createdBy = this.currentUserValue.createdby;
    this._obj.message = "";
    this._obj.copyFiles = JSON.stringify(jsonResult);
    this._obj.deletedJson = jsonString;
    this._obj.extractedValuesJson = extractedValuesJson;
    this._obj.ApprovalUserJson = approvalUsersJson;
    this._obj.ShareUserJson = this._SharedocumentJSON;
    this._obj.ReportingUserID = this._ReportingUserId;
    this._obj.IsArchiveApproval = this.isArchiveApproval;
    this._obj.WorkflowJson = JSON.stringify(WorkflowJson);
    this._obj.DocumentInfoJson = this._AdditionalDocumentJSON;
    if (this._VersionId == undefined) {
      this._obj.VersionName = "1.0";
    } else {
      this._obj.VersionName = this._VersionId.toString();
    }
    if (this._VersionId == undefined) {
      this._obj.ParentId = "0";
    } else {
      this._obj.ParentId = this._DocumentId;
    }
    console.log(WorkflowJson, "Workflow json");
    this.service.NewDocument(this._obj).subscribe(data => {
      console.log(data, "Add Document API Data");
      this.SubmitDocumentDocumentId = data["documentId"];

      if (data["message"] == '1') {
        this._Previewshownandhide = true;
      } else {
        this._Previewshownandhide = false;
      }
    });

    // this.AddDocumentclear();

    // // Reset validation flags
    // this.CompanyRequired = false;
    // this.DepartmentRequired = false;
    // this.DocumentNameRequired = false;
    // this.FileUploadRequired = false;
    // this.LengthRequired = false;
    // this.BreadthRequired = false;
    // this.HeightRequired = false;
    // this._DocumentLoctaionRequired = false;
    // this._HandoverUserRequired = false;
    // this._ReturnDateRequired = false;
    // this.allValidationsPassed = true;
    // this.ExpiryDateRequired = false;

    // // Validate Company and Department based on role
    // if (this._roleid === 502) {
    //   if (!this.Company) {
    //     this.CompanyRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    //   if (!this.Department) {
    //     this.DepartmentRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    // }
    // // Validate DocumentName
    // if (!this.DocumentName) {
    //   this.DocumentNameRequired = true;
    //   this.allValidationsPassed = false;
    // }

    // if (!this._GacAttachmentFileuplod || this._GacAttachmentFileuplod.length === 0) {
    //   this.FileUploadRequired = true;
    //   this.allValidationsPassed = false;
    // }

    // // Validate physical document fields if Isphysical is true
    // if (this.Isphysical) {
    //   if (!this.Length) {
    //     this.LengthRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    //   if (!this.Breadth) {
    //     this.BreadthRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    //   if (!this.Height) {
    //     this.HeightRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    //   if (this._DocumentsLoctionName === 'Self' && !this._DocumentLocation) {
    //     this._DocumentLoctaionRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    //   if (this._DocumentsLoctionName === 'HandoverUser' && !this._SelectedPhysicalUserId) {
    //     this._HandoverUserRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    //   if (this._DocumentsLoctionName === 'HandoverUser' && this.sharedocRadioOption === 'T' && !this.ReturnDate) {
    //     this._ReturnDateRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    // }

    // if (this.Temporaryvalue) {
    //   if (this.formattedTemporaryDate == undefined) {  // Check if expiry date is not set
    //     this.ExpiryDateRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    // }

    // if (this.Isfood) {
    //   if (this.formattedFoodExpiryDate == undefined) {
    //     this.DateRequired = true;
    //     this.allValidationsPassed = false;
    //   }
    // }


    // // Check if InfoValidation is false
    // if (this.allValidationsPassed === false) {
    //   return;
    // }

    // // Proceed if all validations have passed
    // if (this.allValidationsPassed) {
    //   this._Previewshownandhide = true;
    //   // Create the PhysicalDocument object
    //   this._PhysicalDocument = {
    //     "Length": this.Length || '',
    //     "Breadth": this.Breadth || '',
    //     "Height": this.Height || '',
    //     "DocumentLocation": this._DocumentsLoctionName,
    //     "HandoverUserId": this._SelectedPhysicalUserId || 0,
    //     "Description":
    //       this._DocumentsLoctionName === 'Self' ? this._DocumentLocation :
    //         this._DocumentsLoctionName === 'HandoverUser' ? this._Handovertextbox : '',
    //     "Type": this.sharedocRadioOption || '',
    //     "ReturnDate": this.formattedReturnDate,
    //     "ShelveId": this.selectedShelveValue || '',
    //     "FoodExpiryDate": this.formattedFoodExpiryDate || ''
    //   };

    //   // Convert to JSON
    //   this._physicalDocumentJSON = JSON.stringify(this._PhysicalDocument, null, 2);
    //   console.log(this._physicalDocumentJSON, "Physical Document Json");

    //   // Create the AdditionalDocument object
    //   this._AdditionalDocument = {
    //     "DocumentTypeId": this._DocumentTypeId || 0,
    //     "SourceId": this._SourceId || 0,
    //     "ManufactureandDistributorId": this._ManufactureandDistributorId || 0,
    //     "CategoryId": this._CategoryId !== undefined ? this._CategoryId.toString() : '',
    //     "SubCategoryId": this._SubCategoryId !== undefined ? this._SubCategoryId.toString() : ''
    //   }



    //   // Convert to JSON
    //   if (this._AdditionalDocument) {
    //     this._AdditionalDocumentJSON = JSON.stringify(this._AdditionalDocument, null, 2);
    //     console.log(this._AdditionalDocumentJSON, "Additional DocumentJSON Json");
    //   } else {
    //     console.log("Additional Document is not defined.");
    //   }

    //   // this.Issharedoc = !this.Issharedoc;

    //   // Assuming this.SelectedUsers is your array of selected users
    //   if (this.Issharedoc === true) {
    //     // alert(this.Issharedoc);
    //     let _Sharedocument = {
    //       Users: this.SelectedUsers.map(user => ({
    //         UserId: user.UserId,
    //         isTemporary: user.isTemporary ? "T" : "P",
    //         expiryDate: user.expiryDate ? moment(user.expiryDate).format('MM-DD-YYYY hh:mm:ss A') : "", // Formatted expiry date
    //         shareDocAccess: user.shareDocAccess,
    //         Isphysical: user.IsPhysical
    //         // Add other properties as needed
    //       }))
    //     };

    //     this._SharedocumentJSON = JSON.stringify(_Sharedocument, null, 2);
    //     console.log(this._SharedocumentJSON, "Share Document");
    //   } else {
    //     console.log("Share document is not defined.");
    //   }

    //   if (this._roleid == 502) {
    //     this._obj.CompanyId = this._CompanyId;
    //   } else if (this._roleid != 502) {
    //     this._obj.CompanyId = this.currentUserValue.CompanyId;
    //   }
    //   if (this._roleid == 502) {
    //     this._obj.DepartmentId = this._DepartmentId;
    //   } else if (this._roleid != 502) {
    //     this._obj.DepartmentId = this.currentUserValue.DepartmentId;
    //   }
    //   this._obj.DocumentName = this.DocumentName
    //   this._obj.CreatedBy = this.currentUserValue.createdby;
    //   this._obj.Description = this.Note;
    //   this._obj.Isphysical = this.Isphysical;
    //   this._obj.IsFoodItem = this.Isfood;
    //   this._obj.PhysicalJson = this._physicalDocumentJSON;
    //   this._obj.IsAdditionalDetails = this.Isoptional;
    //   this._obj.AdditionalDetailsJson = this._AdditionalDocumentJSON;
    //   this._obj.IsShareDocument = this.Issharedoc;
    //   this._obj.ShareDocumentJson = this._SharedocumentJSON;

    //   if (this._VersionId == undefined) {
    //     this._obj.VersionName = "1.0";
    //   } else {
    //     this._obj.VersionName = this._VersionId.toString();
    //   }
    //   if (this._VersionId == undefined) {
    //     this._obj.ParentId = "0";
    //   } else {
    //     this._obj.ParentId = this._DocumentId;
    //   }
    //   // alert(this._VersionId);


    //   // Make the API call
    //   $(".loader-overlay").addClass("active");
    //   $("body").addClass("position-fixed");
    //   $("body").addClass("w-100");
    //   this.service.DocumentSubmit_V2(this._obj).subscribe(data => {
    //     this.SubmitDocumentDocumentId = data["Data"].DocumentId;
    //     console.log(data, "Submit Document data");
    //     const frmData = new FormData();
    //     for (var i = 0; i < this._GacAttachmentFileuplod.length; i++) {
    //       let _uid = this._GacAttachmentFileuplod[i].UniqueId;
    //       frmData.append("files", this._GacAttachmentFileuplod[i].Files);
    //       // Append Ismain with a unique identifier
    //       frmData.append(`IsMain`, this._GacAttachmentFileuplod[i].Ismain);
    //       // Append thumbnail if IsMain is true
    //       if (this._GacAttachmentFileuplod[i].Ismain && this._GacAttachmentFileuplod[i].Thumbnail != '') {
    //         frmData.append("Thumbnails", this._GacAttachmentFileuplod[i].Thumbnail[0].Files);
    //       } else {
    //         // Append a placeholder or empty file if IsMain is false or no thumbnail
    //         frmData.append("Thumbnails", new Blob(), "");
    //       }
    //     }
    //     // frmData.append("DocumentId", data["Data"].DocumentId.toString());
    //     if (data && data["Data"] && data["Data"].DocumentId) {
    //       frmData.append("DocumentId", data["Data"].DocumentId.toString());
    //     }
    //     frmData.append("Barcode", "");
    //     if (data && data["Data"] && data["Data"].VersionId) {
    //       frmData.append("VersionId", data["Data"].VersionId.toString());
    //     }
    //     this.progressConnectionBuilder.start().then(() => console.log('Connection started.......!'))
    //       .catch(err => console.log('Error while connect with server'));
    //     this.service.UploadArchiveDocuments_V2(frmData)
    //       .subscribe({
    //         next: (event) => {

    //           const language = localStorage.getItem('language');
    //           switch (event.type) {
    //             case HttpEventType.Sent:
    //               // console.log('Request has been made!');
    //               break;
    //             case HttpEventType.ResponseHeader:
    //               // console.log('Response header has been received!');
    //               break;
    //             case HttpEventType.UploadProgress:
    //               this.progress = Math.round(event.loaded / event.total * 100);
    //               if (this.progress == 100) {
    //                 this.progressConnectionBuilder.on("ReceiveProgress", (progressbar) => {
    //                   this.progress = progressbar;
    //                   if (this.progress == 100) {
    //                     if (language === 'ar') {
    //                       this._snackBar.open('تم رفع الملفات..', 'تنتهي الآن', {
    //                         duration: 5000,
    //                         horizontalPosition: "right",
    //                         verticalPosition: "bottom",
    //                       });
    //                     } else {
    //                       this._snackBar.open('Files Uploaded..', 'End now', {
    //                         duration: 5000,
    //                         horizontalPosition: "right",
    //                         verticalPosition: "bottom",
    //                       });
    //                     }

    //                   }
    //                 });
    //                 if (language === 'ar') {
    //                   this._snackBar.open('تم إرسال المذكرة، يرجى الانتظار لتحميل الملف..', 'تنتهي الآن', {
    //                     duration: 5000,
    //                     horizontalPosition: "right",
    //                     verticalPosition: "bottom",
    //                   });
    //                 } else {
    //                   this._snackBar.open('Document Upload, Please Wait to upload the file..', 'End now', {
    //                     duration: 5000,
    //                     horizontalPosition: "right",
    //                     verticalPosition: "bottom",
    //                   });
    //                 }
    //               }
    //               break;
    //             case HttpEventType.Response:
    //               $(".loader-overlay").removeClass("active");
    //               $("body").removeClass("position-fixed");
    //               $("body").removeClass("w-100");
    //               if (language === 'ar') {
    //                 this._snackBar.open('هذه رسالة باللغة العربية', 'إغلاق', {
    //                   duration: 5000,
    //                   horizontalPosition: "right",
    //                   verticalPosition: "bottom",
    //                 });
    //               } else {
    //                 this._snackBar.open('Document Upload Successfully', 'End now', {
    //                   duration: 5000,
    //                   horizontalPosition: "right",
    //                   verticalPosition: "bottom",
    //                   panelClass: ['blue-snackbar']
    //                 });
    //               }

    //               setTimeout(() => {
    //                 this.progress = 0;
    //               }, 1000);
    //           }
    //         },
    //         error: (e) => {
    //           console.error('Error uploading file', e);
    //         },
    //         complete: () => console.info('complete')
    //       }

    //       )
    //   });

    //   // this.DocumentDataClear();
    // }
  }

  AddDocumentclear() {
    this._GacAttachmentFileuplod = [];
    this.FirstFileDocumentName = "";
    this.SelectedRequiredapprovalUsers = [];
    this.SelectedUsers = [];
    this.toggleSharedoc(!this.Issharedoc);
    this.ToggleRequiredApproval(!this.IsRequiredApproval);
    //  this.Workflowdetails = [];
    //  this.toggleWorkflow(!this.Isworkflow);
  }

  DocumentDataClear() {
    this.FirstFileDocumentName = "";
    this.SelectedRequiredapprovalUsers = [];
    this.ToggleRequiredApproval(!this.IsRequiredApproval);
    this.Workflowdetails = [];
    this.toggleWorkflow(!this.Isworkflow);
    this.SelectedUsers = [];
    this.toggleSharedoc(!this.Issharedoc);
    this.Isworkflowdisable = false;
    this.IsRequiredApprovaldisable = false;
    this.IsShareUserdisable = false;
    this.CompanyRequired = false;
    this.DepartmentRequired = false;
    this.DocumentNameRequired = false;
    this.LengthRequired = false;
    this.BreadthRequired = false;
    this.HeightRequired = false;
    this._DocumentLoctaionRequired = false;
    this._HandoverUserRequired = false;
    this._ReturnDateRequired = false;
    this.allValidationsPassed = true;
    this.Company = null;
    this.DocumentName = null;
    this.Department = null;
    this._GacAttachmentFileuplod = [];
    this.selectedIndex = null;
    this.Isphysical = false;
    if (this.physicalCheck) {
      this.physicalCheck.nativeElement.checked = false;
    }
    this.Isfood = false;
    // this.foodCheck.nativeElement.checked = false;
    if (this.foodCheck && this.foodCheck.nativeElement) {
      this.foodCheck.nativeElement.checked = false;
    }
    this.Isoptional = false;
    if (this.optionalCheck) {
      this.optionalCheck.nativeElement.checked = false;
    }
    this.Isworkflow = false;
    if (this.workflowCheck) {
      this.workflowCheck.nativeElement.checked = false;
    }
    this.Issharedoc = false;
    this.Length = "";
    this.Breadth = "";
    this.Height = "";
    this._DocumentLocation = "";
    this.selectedUser = [];
    this.Physicaluser = [];
    this.selectedPhysicalUser = "";
    this.ObjUserList.forEach(element => {
      element.isChecked = false;
    });
    this._SelectedPhysicalUserId = 0;
    this.selectedDocumentTypeName = "";
    this.selectedSourceName = "";
    this.selectedDMName = "";
    this.selectedCategoryNames = [];
    this.selectedSubCategoryNames = [];
    this.FileUploadErrorlogs = false;
    this._Handovertextbox = "";
    this.ReturnDate = null;
    this._DocumentsLoctionName === 'Self';
    this.DocumentType = null;
    this.Source = null;
    this.AddSource = "";
    this.Manufacture = null;
    this.AddDM = "";
    this.Category = null;
    this.subCategory = "";
    this.Note = "";
    this.RemoveShelvelocation();
    this.FoodExpiryDate = null;
    this.formattedReturnDate = null;
    this.formattedFoodExpiryDate = null;
    // this._selectedValues = [];
    this.SelectedUsers = [];
    // this.ObjShareUserList.forEach(_user => {
    //   if (_user.UserId === this._ReportingUserId) {
    //     _user.disabled = true;
    //     _user.isChecked = true;
    //     this.SelectedUsers.push(_user);
    //     this.toggleSharedoc(!this.Issharedoc);
    //   } else {
    //     _user.disabled = false;
    //     _user.isChecked = false;
    //   }
    // });
    this._Previewshownandhide = false;
    this._DocumentId === undefined;     // or undefined
    this.openedDocname === undefined;   // or undefined
    this._VersionId === undefined;      // or undefined
    this._referenceId === undefined;    // or undefined
    this.ShareId === undefined;
    // this.router.navigate(['/backend/materforms/GacFileUpload']);

  }


  GetDropdowns() {
    const lang: any = localStorage.getItem('language');
    this._obj1.CreatedBy = this.currentUserValue.createdby;
    this._obj1.organizationid = this.currentUserValue.organizationid;
    this._obj1.DocumentId = 0; // passing 0 because same api is used in details page,there we have pass documentid
    this.inboxService.ShareUserList(this._obj1)
      .subscribe(data => {
        // this._obj1 = data as InboxDTO;
        var _UsersLst = data["Data"].UserJson;
        this._LstToUsers = _UsersLst;
        _UsersLst.forEach(element => {
          if (this.currentUserValue.createdby != element.UserId) {
            this.ObjShareUserList.push({
              UserId: element.UserId,
              ContactName: element.ContactName,
              disabled: false,
              Check: false,
              isTemporary: false,
              startDate: new Date(),
              shareDocAccess: true,
              IsPhysical: false
            });
          }
        });
        _UsersLst.forEach(element => {
          if (this.currentUserValue.createdby != element.UserId) {
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
          }
        });
        _UsersLst.forEach(element => {
          if (this.currentUserValue.createdby != element.UserId) {
            this.ObjRequiredApprovalList.push({
              UserId: element.UserId,
              ContactName: element.ContactName,
              disabled: false,
              Check: false,
              isTemporary: false,
              startDate: new Date(),
              shareDocAccess: true,
              IsPhysical: false
            });
          }
        });

        //this.ObjUserList = this.ObjShareUserList;
        console.log(this.ObjRequiredApprovalList, "RequiredApproval List");
        //   if(this.isArchiveApproval == true){
        //   if (this._LoginUserId != this._ReportingUserId) {
        //     this.toggleSharedoc(!this.Issharedoc);
        //   }
        //   this.ObjShareUserList.forEach(_user => {
        //     if (_user.UserId === this._ReportingUserId) {
        //       _user.disabled = true;
        //       _user.isChecked = true; this.SelectedUsers.push(_user);
        //       this.SelectedReportingUserName = _user.ContactName;
        //     }
        //   });
        // }
      });
  }



  toggleShareDocAccess(user) {
    // Toggle shareDocAccess checkbox value for each user
    user.shareDocAccess = !user.shareDocAccess;
  }

  toggleIsphysicalDocAccess(event, user) {
    this.SelectedUsers.forEach(user => user.IsPhysical = false);
    if (event.target.checked == true)
      user.IsPhysical = true;
  }




  ClearShareUser() {
    this.ShareSearch = "";
  }

  ClearPhysical() {
    this.PhysicalSearch = "";
  }


  selectUser(user: any, event: any) {
    const selectedUser = this.ObjUserList.find(user => user.isChecked);
    if (selectedUser != undefined) {
      this.ObjShareUserList.forEach(element => {
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

    this.ObjShareUserList.forEach(element => {
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
    this.PhysicalSearch = "";
    document.getElementById("fileupload-event-modal-backdrop physical").style.display = "none";
    document.getElementById("projectmodalphysical").style.display = "none";
  }

  RemoverPhysical(user) {
    this.selectedUser = [];
    this.ObjUserList.forEach(element => {
      if (element.UserId == user.UserId) {
        element.isChecked = false;
      }
    });
    this.ObjShareUserList.forEach(element => {
      if (element.UserId == user.UserId) {
        element.isChecked = false;
        element.disabled = false;
      }
    });
    this._SelectedPhysicalUserId = 0;
  }

  togglesharedocRadio(event: Event, user) {
    const inputElement = event.target as HTMLInputElement;
    user.isTemporary = inputElement.value === 'no';
    user.expiryDate = null;
    this.Temporaryvalue = user.isTemporary;
    this._TExpiryDate = user.expiryDate;
  }
  // Method to add selected users
  GetSelectedUserId(UserId) {
    this.ToUserId = UserId;
  }

  OnWarehouse() {
    this.services.GetwarehouseData().subscribe(data => {
      this.Objwarehousedrp = data as [];
    })

  }


  AddWarehouse() {
    try {
      if (this.currentUserValue && this.currentUserValue.CompanyId !== undefined)
        this.objwareDTO.CompanyIds = this.currentUserValue.CompanyId.toString();
      this.objwareDTO.WareHouseName = this.Warehouse;
      this.objwareDTO.Email = "";
      this.objwareDTO.Phone = 0;
      this.objwareDTO.CountryCode = "";
      this.objwareDTO.Description = "Created from New Document section";
      this.objwareDTO.Address = "";
      this.objwareDTO.CountryId = 0;
      this.objwareDTO.CityId = 0;
      this.objwareDTO.IsActive = true;
      this.objwareDTO.FlagId = 1;
      this.serviceW.insertupdatewarehouse(this.objwareDTO).subscribe(
        data => {
          // console.log(data, "Warehouse Data");
          this.Objwarehousedrp = data as [];
          // console.log(this.Objwarehousedrp,"Warehouse Data");
          if (data["message"] == "1") {
            this._snackBar.open(this.translate.instant('Masterform.AddedSuccessfully'), 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
            });
          }
          $('#warediv').addClass('d-none');
          $('#warelist').show();
          this.OnWarehouse();
          this.selectedWarehouseValue = data["WareHouseId"];
          // console.log(this.selectedWarehouseValue, 'Add Warehouse');
          this.Warehouse = "";
        }
      );

    } catch (error) {
      alert(error)
    }
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

  openwarehousemodal() {
    $('#warehousemodal').css('display', 'block');
    $('#warehousemodal-modal-backdrop').css('display', 'block');
  }

  RemoveShelvelocation() {
    this._WarehouseName = "";
    this._BlockName = "";
    this._RackName = "";
    this._ShelveName = "";
    this.selectedWarehouseValue = null;
    this.selectedBlockValue = null;
    this.selectedRackValue = null;
    this.selectedShelveValue = null;
  }

  OnBlocks(WareHouseId) {
    this.clearDropdown();
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

  clearDropdown() {
    this.ObjBlocksdrp = [];
    this.selectedBlockValue = null;
  }

  AddBlock() {
    try {
      this.objBlocksDTO.WareHouseId = this.selectedWarehouseValue;
      this.objBlocksDTO.BlockName = this.AddBlockName;
      this.objBlocksDTO.Description = "Created from new document section";
      this.objBlocksDTO.IsActive = true;
      this.objBlocksDTO.FlagId = 1;
      this.serviceB.Getinsertupdatbolck(this.objBlocksDTO).subscribe(
        data => {
          this.ObjBlocksdrp = data as [];
          // console.log(this.ObjBlocksdrp, "Add Block");
          if (data["message"] == "1") {
            this._snackBar.open('Added Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
            });
            $('#Blockdiv').addClass('d-none');
            $('#Blocklist').show();
            this.OnBlocks(this.selectedWarehouseValue);
            this.selectedBlockValue = data["BlockId"];
            this.AddBlockName = "";
          }
        }
      );
    } catch (error) {
      alert(error)
    }
  }

  OnRacks(BlockId) {
    this.clearDropdownRack();
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

  AddRack() {
    try {
      this.objracksDTO.BlockId = this.selectedBlockValue;
      this.objracksDTO.RackName = this.AddRackName;
      this.objracksDTO.Rows = 2;
      this.objracksDTO.Columns = 2;
      this.objracksDTO.Description = "Created from new document section";
      this.objracksDTO.IsActive = true;
      this.objracksDTO.flagid = 1;
      this.serviceR.GetinsertupdateRacks(this.objracksDTO).subscribe(
        data => {
          if (data["message"] == "1") {
            this._snackBar.open('Added Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
            });
          }
          $('#Rackdiv').addClass('d-none');
          $('#Racklist').show();
          this.selectedRackValue = data["RackId"];
          this.jsondatatoarray(data["RackId"]);
          this.OnRacks(this.selectedBlockValue);
          this.Onshelves(data["RackId"]);
          this.AddRackName = "";
        }
      );
    } catch (error) {
      alert(error)
    }
  }

  clearDropdownRack() {
    this.ObjRacksdrp = [];
    this.selectedRackValue = null;
  }

  Onshelves(RackId) {
    this.selectedRackValue = RackId;
    this._obj2.RackId = RackId;
    this.services.Getshelves(this._obj2)
      .subscribe(data => {
        this.Objshelvedrp = data as [];

      });
    if (JSON.stringify(this._JsonArray).length == 0) {
      this.jsondatatoarray(RackId);
    }
  }

  OnshelveChangeEvent(shelveid) {
    this.selectedShelveValue = shelveid;
  }

  jsondatatoarray(RackId) {

    this._JsonArray = [];
    let shelvesarray = [];
    let customObj = new ShelvesDTO();

    let _val = 1;
    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 2; j++) {
        let _id = i + "*" + j;
        _val = _val + 1;
        let shelveobj = new ShelvesDTO();
        shelveobj.ShelveId = _id;
        shelveobj.Row = i;
        shelveobj.Col = j;
        shelveobj.IsFull = 0;
        shelveobj.RackId = RackId;
        shelveobj.CreatedBy = this.currentUserValue.createdby;
        shelveobj.ShelveName = "Shelve " + i + j;
        shelvesarray.push(shelveobj);
      }
    }

    customObj.ShelvesJson = shelvesarray;
    this._JsonArray.push(customObj);
    //console.log(JSON.stringify(this._JsonArray));


    this.objshelvesDTO.ShelvesJson = JSON.stringify(this._JsonArray);
    this._Shelvearray = JSON.stringify(this._JsonArray).length;
    this.objshelvesDTO.WareHouseName = this.Warehouse;
    this.objshelvesDTO.BlockName = this.AddBlockName;
    this.objshelvesDTO.RackName = this.AddRackName;

    this.serviceS.onjsondata(this.objshelvesDTO)
      .subscribe(data => {

        // this._obj = data as ShelvesDTO;

        if (data["message"] == "1") {
          this._snackBar.open(this.translate.instant('Masterform.AddedSuccessfully'), 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        }
        else if (data["message"] == "2") {
          this._snackBar.open('Email incorrect', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['red-snackbar']
          });
        }
      });
  }


  ViewUploadDocumentDiv() {
    this.InfoValidation = false;
    this.MainAttachmentValidation = false;
    var count = (<HTMLInputElement>document.getElementById("hdnCount")).value;
    if (this._roleid == 502) {
      if (this.Company == null || this.Company === undefined || this.Company === "") {
        this.InfoValidation = true;
        this.CompanyRequired = true;
      } else {
        this.InfoValidation = false;
        this.CompanyRequired = false;
      }
      if (this.Department == undefined || this.Department === "") {
        this.InfoValidation = true;
        this.DepartmentRequired = true;
      } else {
        this.InfoValidation = false;
        this.DepartmentRequired = false;
      }
    }

    if (this.DocumentName == null) {
      this.InfoValidation = true;
      this.DocumentNameRequired = true;
    }
    if (this.DocumentType == null) {
      this.InfoValidation = true;
      this.DocumentTypeRequired = true;
    }
    if (this.Source == null) {
      this.InfoValidation = true;
      this.SourceRequired = true;
    }

    if (this.Isphysical == true) {
      this._obj.IsPhysical = true;
      if (this.Length == null || this.Length == "") {
        this.InfoValidation = true;
        this.LengthRequired = true;
      }
      if (this.Breadth == null || this.Breadth == "") {
        this.InfoValidation = true;
        this.BreadthRequired = true;
      }
      if (this.Height == null || this.Height == "") {
        this.InfoValidation = true;
        this.HeightRequired = true;
      }
    }
    if (this.Isfood == true) {
      this._obj.IsFoodItem = true;
      if (this.Date == null || this.Date == "") {
        this.InfoValidation = true;
        this.DateRequired = true;
      }
    }
    if (this.InfoValidation) {
      return false;
    }
    else {

      document.getElementById("Info_div").style.display = "none";
      document.getElementById("UploadCatelog_div").style.display = "block";
      document.getElementById("ReferenceDoc_div").style.display = "none";
      document.getElementById("backbutton_div").style.display = "block";
      (<HTMLInputElement>document.getElementById("hdnCount")).value = "2";
      document.getElementById("Info_div_h").classList.remove("current");
      document.getElementById("catelog_div_h").classList.add("current");
      document.getElementById("reference_div_h").classList.remove("current");
      document.getElementById("submitbutton_div").style.display = "none";
      document.getElementById("continuebutton_div").style.display = "block";
    }

    if (count == "1" && this.InfoValidation == false) {
      this._obj.Length = this.Length;
      this._obj.Breadth = this.Breadth;
      this._obj.Height = this.Height;
      this._obj.ExpiryDate = this.Date;
      this._obj.DocumentName = this.DocumentName;

      if (this._obj.DistributorId == undefined)
        this._obj.DistributorId = 0;
      if (this._obj.ManufactureId == undefined)
        this._obj.ManufactureId = 0;
      if (this.currentUserValue.RoleId == 502) {
        if (this._obj.CompanyId == undefined || this._obj.DepartmentId == undefined || this._obj.DocumentTypeId == undefined
          || this._obj.SourceId == undefined || this._obj.DocumentName == ""
        )
          return false;
      }
      else {
        this._obj.CompanyId = this.currentUserValue.CompanyId;
        this._obj.DepartmentId = this.currentUserValue.DepartmentId;
      }
      // if (this._obj.IsPhysical == true) {
      //   this._obj.WarehouseStatus = "Not Yet Moved";
      //   if (this._obj.Length == "0" || this._obj.Breadth == "0" || this._obj.Height == "0")
      //     return false;
      // } else {
      //   this._obj.IsPhysical = false;
      //   this._obj.WarehouseStatus = "No Need";
      // }
      // if (this.Isphysical == "Yes") {
      //   this._obj.IsPhysical = true;
      //   this._obj.WarehouseStatus = "Not Yet Moved";
      //   if (this._obj.Length == "0" || this._obj.Breadth == "0" || this._obj.Height == "0")
      //     return false;
      // } else {
      //   this._obj.IsPhysical = false;
      //   this._obj.WarehouseStatus = "No Need";
      // }
      // if (this._obj.IsFoodItem == true && this._obj.ExpiryDate == "")
      //   return false;

      this._obj.CreatedBy = this.currentUserValue.createdby;
      this._obj.PhysicalType = "L";
      this._obj.Priority = "H";
      this._obj.DocumentStatus = "N";
      this._obj.Trash = "false";
      this._obj.Description = this.Note;//(<HTMLInputElement>document.getElementById("txtnote")).value;

      document.getElementById("Info_div").style.display = "none";
      document.getElementById("UploadCatelog_div").style.display = "block";
      document.getElementById("ReferenceDoc_div").style.display = "none";
      document.getElementById("backbutton_div").style.display = "block";
      (<HTMLInputElement>document.getElementById("hdnCount")).value = "2";
      document.getElementById("Info_div_h").classList.remove("current");
      document.getElementById("catelog_div_h").classList.add("current");
      document.getElementById("reference_div_h").classList.remove("current");
      document.getElementById("submitbutton_div").style.display = "none";
      document.getElementById("continuebutton_div").style.display = "block";

      this._obj.DocumentInfoJson = JSON.stringify(this._obj);
      this.service.AddDocumentInfo(this._obj)
        .subscribe(data => {
          this._obj.DocumentId = data["DocumentId"];
          this._obj.VersionId = data["VersionId"];
          this.documentid = this._obj.DocumentId;
          this.versionid = this._obj.VersionId;

        });
    }
    else if (count == "2" && this.MainAttachmentValidation == false) {


      if (this.Category == null) {
        this.MainAttachmentValidation = true;
        this.CategoryRequired = true;
      }
      if (this.subCategory == null) {
        this.MainAttachmentValidation = true;
        this.SubCategory = true;
      }
      if (this.UploadFiles == null) {
        this.MainAttachmentValidation = true;
        this.FileUploadRequired = true;
      }
      if (this.MainAttachmentValidation) {
        return false;
      }

      document.getElementById("Info_div").style.display = "none";
      document.getElementById("UploadCatelog_div").style.display = "none";
      document.getElementById("ReferenceDoc_div").style.display = "block";
      document.getElementById("backbutton_div").style.display = "block";
      document.getElementById("submitbutton_div").style.display = "block";
      document.getElementById("continuebutton_div").style.display = "none";
      (<HTMLInputElement>document.getElementById("hdnCount")).value = "3";

      document.getElementById("Info_div_h").classList.remove("current");
      document.getElementById("catelog_div_h").classList.remove("current");
      document.getElementById("reference_div_h").classList.add("current");
      // alert(this._obj.CategoryId);
      // alert(this._obj.SubCategoryId);
      this.AddMainDocument(this.documentid, this.versionid);

    }

  }

  onInput() {
    this.DocumentNameRequired = !this.DocumentName || this.DocumentName.trim() === '';
    this.InfoValidation = false;
  }

  onLength() {
    if (this.Length != null) {
      this.InfoValidation = false; // Hide the validation message
      this.LengthRequired = false; // Hide the error message
    }
  }

  onBreadth() {
    if (this.Breadth != null) {
      this.InfoValidation = false; // Hide the validation message
      this.BreadthRequired = false; // Hide the error message
    }
  }

  onHeight() {
    if (this.Height != null) {
      this.InfoValidation = false; // Hide the validation message
      this.HeightRequired = false; // Hide the error message
    }
  }

  DocumentLocationsValidation() {
    if (this._DocumentLocation != null) {
      this._DocumentLoctaionRequired = false; // Hide the error message
    }
  }

  onStartDateSelect() {

  }

  backbutton() {
    var count = (<HTMLInputElement>document.getElementById("hdnCount")).value;
    if (count == "2") {
      document.getElementById("Info_div").style.display = "block";
      document.getElementById("UploadCatelog_div").style.display = "none";
      document.getElementById("ReferenceDoc_div").style.display = "none";
      document.getElementById("backbutton_div").style.display = "none";
      (<HTMLInputElement>document.getElementById("hdnCount")).value = "1";
      document.getElementById("continuebutton_div").style.display = "block";
      document.getElementById("submitbutton_div").style.display = "none";


      document.getElementById("Info_div_h").classList.add("current");
      document.getElementById("catelog_div_h").classList.remove("current");
      document.getElementById("reference_div_h").classList.remove("current");
    }
    if (count == "3") {
      document.getElementById("Info_div").style.display = "none";
      document.getElementById("UploadCatelog_div").style.display = "block";
      document.getElementById("ReferenceDoc_div").style.display = "none";
      document.getElementById("backbutton_div").style.display = "block";
      (<HTMLInputElement>document.getElementById("hdnCount")).value = "2";
      document.getElementById("continuebutton_div").style.display = "block";
      document.getElementById("submitbutton_div").style.display = "none";

      document.getElementById("Info_div_h").classList.remove("current");
      document.getElementById("catelog_div_h").classList.add("current");
      document.getElementById("reference_div_h").classList.remove("current");
    }
  }

  togglePhysical(checked: boolean) {
    this.Length = "";
    this.Breadth = "";
    this.Height = "";
    this.Isphysical = checked;
    this.toggleDocumentLocation('option1');
    this._DocumentsLoctionName = 'Self';
    if (this._roleid == 502) {
      this.RelatedWarehouses = this.Objwarehousedrp.filter(warehouse => warehouse.CompanyId == this._CompanyId);
      // alert(this._CompanyId);
    } else if (this._roleid != 502) {
      this._CompanyId = this.currentUserValue.CompanyId;
      this.RelatedWarehouses = this.Objwarehousedrp;
      // alert(this._CompanyId)
    }
  }

  toggleFood(checked: boolean) {
    this.Isfood = checked;
    this.FoodExpiryDate = null;
    this.DateRequired = false;
  }


  toggleOptional(checked: boolean) {

    this.Isoptional = checked;
    this.DocumentType = null;
    this.Source = null;
    this.AddSource = "";
    this.Manufacture = null;
    this.AddDM = "";
    this.Category = null;
    this.subCategory = "";
  }

  IsRequiredApprovaldisable: boolean = false; // For "Select users who required approval"
  Isworkflowdisable: boolean = false;
  IsShareUserdisable: boolean = false;

  ToggleRequiredApproval(checked: boolean): void {
    this.SelectedRequiredapprovalUsers = [];


    this.ObjRequiredApprovalList.forEach(element => {
      element.isChecked = false;
    });
    this.ObjShareUserList.forEach(element => {
      element.disabled = false;
    });
    this.IsRequiredApproval = checked; // Set the state of Required Approval
    if (checked) {
      this.Isworkflow = false; // Uncheck Workflow checkbox
      this.Isworkflowdisable = true; // Disable Workflow checkbox
      this.IsShareUserdisable = true;
    } else {
      this.Isworkflowdisable = false; // Enable Workflow checkbox
      this.IsShareUserdisable = false;
    }

    this.SelectedRequiredapprovalUsers.forEach(element => {
      element.disabled = false;
    });

  }

  toggleWorkflow(checked: boolean): void {
    this.Workflow_drpvalue = null;
    this.Isworkflow = checked; // Set the state of Workflow
    if (checked) {
      this.IsRequiredApproval = false; // Uncheck Required Approval checkbox
      this.IsShareUserdisable = true;
      this.IsRequiredApprovaldisable = true; // Disable Required Approval checkbox
    } else {
      this.IsRequiredApprovaldisable = false; // Enable Required Approval checkbox
      this.IsShareUserdisable = false;
    }
  }

  toggleSharedoc(checked: boolean) {
    this.Issharedoc = checked;
    if (checked) {
      this.IsRequiredApproval = false;
      this.IsRequiredApprovaldisable = true;
      this.Isworkflowdisable = true; // Uncheck Required Approval checkbox
      // Disable Required Approval checkbox
    } else {
      this.IsRequiredApprovaldisable = false; // Enable Required Approval checkbox
      this.Isworkflowdisable = false;
    }
    if (this.Issharedoc) {  // Check if Issharedoc is true
      if (this.isArchiveApproval) {
        if (this._LoginUserId !== this._ReportingUserId) {
          // Logic for this case (if needed)
        }

        this.ObjShareUserList.forEach(_user => {
          if (_user.UserId === this._ReportingUserId) {
            _user.disabled = true;
            _user.isChecked = true;

            // Check if the user is already in SelectedUsers to prevent duplicates
            const existingUser = this.SelectedUsers.find(user => user.UserId === _user.UserId);
            if (!existingUser) {
              this.SelectedUsers.push(_user);
              this.SelectedReportingUserName = _user.ContactName;
            }
          }
        });
      }
    }
  }


  toggleAdduser(checked: boolean) {
    this.Isadduser = checked;
  }

  toggleDocumentLocation(option: string) {
    this.selectedOption = option;
    this.resetState();
    if (this.selectedOption == 'option1') {
      this._DocumentsLoctionName = 'Self'
      this._DocumentLocation = "";
      this.RemoveShelvelocation();
    } else if (this.selectedOption == 'option2') {
      this._DocumentsLoctionName = 'HandoverUser';
      this.selectedUser = [];
      this.Physicaluser = [];
      this.selectedPhysicalUser = "";
      this.ObjUserList.forEach(element => {
        element.isChecked = false;
      });
      this._SelectedPhysicalUserId = 0;
      this._Handovertextbox = "";
      this.sharedocRadioOption = 'P';
      this.isuserlocradio = false;
      this.ReturnDate = null;
      this.RemoveShelvelocation();
    } else if (this.selectedOption == 'option3') {
      this._DocumentsLoctionName = 'Warehouse';
    }
  }

  resetState() {
    this._DocumentsLoctionName = '';
    this._DocumentLocation = '';
    this._SelectedPhysicalUserId = 0;
    this.selectedPhysicalUser = "";
    this.selectedUser = [];
    this.Physicaluser = [];
    this.ObjUserList.forEach(element => {
      element.isChecked = false;
    });
    this._Handovertextbox = '';
    this.sharedocRadioOption = '';
    this.isuserlocradio = false;
    this.ReturnDate = null;
  }

  toggleuserlocRadio(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.isuserlocradio = inputElement.value === 'T';
    this.ReturnDate = null;
  }


  AddMainDocument(DocumentId: number, VersionId: number) {
    const frmData = new FormData();
    for (var i = 0; i < this._MainFile.length; i++) {
      frmData.append("fileUpload", this._MainFile[i].Files);
    }
    frmData.append("DocumentId", DocumentId.toString());
    frmData.append("Barcode", "");
    frmData.append("VersionId", VersionId.toString());
    frmData.append("CategoryId", this._obj.StrCategoryId.toString());
    frmData.append("SubCategoryId", this._obj.StrSubCategoryId.toString());

    this.service.UploadAttachmenst(frmData)
      .subscribe(data => {
      });
  }

  AddRefDoc() {
    this.AddReferenceDocument(this.documentid, this.versionid);
  }

  AddReferenceDocument(DocumentId: number, VersionId: number) {
    let _names = [];
    const frmData = new FormData();
    for (var i = 0; i < this._lstMultipleFiles.length; i++) {
      let _uid = this._lstMultipleFiles[i].UniqueId;
      _names.push((<HTMLInputElement>document.getElementById("txtRefDoc_" + _uid)).value);
      frmData.append("fileUpload", this._lstMultipleFiles[i].Files);
    }
    frmData.append("NamesArray", _names.toString());
    frmData.append("DocumentId", DocumentId.toString());
    frmData.append("Barcode", "");
    frmData.append("VersionId", VersionId.toString());
    this.service.UploadReferenceAttachmenst(frmData)
      .subscribe(data => {
        this._obj = data as GACFiledto;
        if (this._obj.message == "1") {
          this._snackBar.open('Document Added Successfully', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['blue-snackbar']
          });
          document.getElementById("Info_div").style.display = "block";
          document.getElementById("UploadCatelog_div").style.display = "none";
          document.getElementById("ReferenceDoc_div").style.display = "none";
          document.getElementById("backbutton_div").style.display = "none";
          (<HTMLInputElement>document.getElementById("hdnCount")).value = "1";
          document.getElementById("continuebutton_div").style.display = "block";
          document.getElementById("submitbutton_div").style.display = "none";

          document.getElementById("Info_div_h").classList.add("current");
          document.getElementById("catelog_div_h").classList.remove("current");
          document.getElementById("reference_div_h").classList.remove("current");
          // location.reload();
          this.Reset()
        }
      });
  }
  progressMap: { [fileName: string]: BehaviorSubject<number> } = {};
  FileUploadErrorlogs: boolean = false;
  FirstFileDocumentName: string = "";
  UploadingFiles: boolean = false;
  async selectFile(event: any): Promise<void> {
    debugger
    const files = Array.from(event.target.files) as File[]; // Convert FileList to File[]
    let folderPath = "Draft/" + this.currentUserValue.createdby;
    if (files.length > 0) {

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const fileSizeInKB = Math.round(file.size / 1024);

        // Check if the file size is 0 KB
        if (fileSizeInKB === 0) {
          this.FileUploadErrorlogs = true; // Show error message
          console.error('The uploaded file is 0 KB. Please upload a larger file.');
          continue; // Skip this file
        }

        // Check if the file already exists (to avoid duplicate uploads)
        const existingFile = this._GacAttachmentFileuplod.find(
          (item) => item.FileName === file.name && item.Size === file.size
        );

        if (!existingFile) {
          // Generate a unique ID for the new file
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
            CloudName: '',
            ThumbnailUrl: ''
          };

          this._GacAttachmentFileuplod.push(fileRecord);
          this._GacAttachmentFileuplod.forEach(element => {
            this.UploadingFiles = element.Uploading;
            console.log(this.UploadingFiles, "Uploading Files Test");
          });
          // Create a progress tracker for this file
          const progressSubject = new BehaviorSubject<number>(0);

          // Call the Azure upload service to upload the file
          try {
            const _displayname = this.currentUserValue.FirstName + " " + this.currentUserValue.LastName;
            const { fileUrl, thumbnailUrl } = await this.azureUploadService.uploadFile(file, progressSubject, folderPath, uniqueId,_displayname); // Upload file
            const uploadedFile = this._GacAttachmentFileuplod.find(
              (item) => item.UniqueId === uniqueId
            );
            if (uploadedFile) {
              uploadedFile.Url = "https://yrglobaldocuments.blob.core.windows.net/documents/" + fileUrl; // Save the uploaded URL
              uploadedFile.ThumbnailUrl = thumbnailUrl || '';
              uploadedFile.CloudName = uniqueId + '_' + file.name;
            }
          } catch (error) {
            console.error(`Error uploading file: ${file.name}`, error);
          } finally {
            // Mark the file as no longer uploading
            const uploadedFile = this._GacAttachmentFileuplod.find(
              (item) => item.UniqueId === uniqueId
            );
            if (uploadedFile) {
              uploadedFile.Uploading = false;
            }
          }
        }
      }

      // Automatically select the first file as the main document if none is selected
      if (this._GacAttachmentFileuplod.length > 0 && this.selectedIndex === null) {
        this.MainDocumentCheckBox(0);
      }

      this.FirstFileDocumentName = this._GacAttachmentFileuplod[0].FileName;
      this._GacAttachmentFileuplod.forEach(element => {
        this.UploadingFiles = element.Uploading;
      });
      this.FileUploadRequired = false;
      this.MainDocumentCheckBox(0);
    }
    event.target.value = '';
  }

  // async selectFile(event: any): Promise<void> {
  //   const files = Array.from(event.target.files) as File[]; // Convert FileList to File[]
  //   let folderPath = "Draft/" + this.currentUserValue.createdby;
  //   if (files.length > 0) {

  //     for (let index = 0; index < files.length; index++) {
  //       const file = files[index];
  //       const fileSizeInKB = Math.round(file.size / 1024);

  //       // Check if the file size is 0 KB
  //       if (fileSizeInKB === 0) {
  //         this.FileUploadErrorlogs = true; // Show error message
  //         console.error('The uploaded file is 0 KB. Please upload a larger file.');
  //         continue; // Skip this file
  //       }

  //       // Check if the file already exists (to avoid duplicate uploads)
  //       const existingFile = this._GacAttachmentFileuplod.find(
  //         (item) => item.FileName === file.name && item.Size === file.size
  //       );

  //       if (!existingFile) {
  //         // Generate a unique ID for the new file
  //         const uniqueId = new Date().valueOf() + index;

  //         // Add the file details to the array with initial states
  //         const fileRecord = {
  //           UniqueId: uniqueId,
  //           FileName: file.name,
  //           Size: file.size,
  //           Files: file,
  //           IsMain: false, // Default main file flag
  //           Thumbnail: '', // Initialize with an empty string
  //           Progress: 0, // Track upload progress
  //           Uploading: true, // File is uploading
  //           Url: null, // URL to store the uploaded file's location
  //           CloudName: ''
  //         };

  //         this._GacAttachmentFileuplod.push(fileRecord);
  //         this._GacAttachmentFileuplod.forEach(element => {
  //           this.UploadingFiles = element.Uploading;
  //           console.log(this.UploadingFiles, "Uploading Files Test");
  //         });
  //         // Create a progress tracker for this file
  //         const progressSubject = new BehaviorSubject<number>(0);

  //         // Call the Azure upload service to upload the file
  //         try {
  //           const uploadUrl = await this.azureUploadService.uploadFile(file, progressSubject, folderPath, uniqueId); // Upload file
  //           const uploadedFile = this._GacAttachmentFileuplod.find(
  //             (item) => item.UniqueId === uniqueId
  //           );
  //           if (uploadedFile) {
  //             uploadedFile.Url = "https://yrglobaldocuments.blob.core.windows.net/documents/" + uploadUrl; // Save the uploaded URL
  //             uploadedFile.CloudName = uniqueId + file.name;
  //           }
  //         } catch (error) {
  //           console.error(`Error uploading file: ${file.name}`, error);
  //         } finally {
  //           // Mark the file as no longer uploading
  //           const uploadedFile = this._GacAttachmentFileuplod.find(
  //             (item) => item.UniqueId === uniqueId
  //           );
  //           if (uploadedFile) {
  //             uploadedFile.Uploading = false;
  //           }
  //         }
  //       }
  //     }

  //     // Automatically select the first file as the main document if none is selected
  //     if (this._GacAttachmentFileuplod.length > 0 && this.selectedIndex === null) {
  //       this.MainDocumentCheckBox(0);
  //     }

  //     this.FirstFileDocumentName = this._GacAttachmentFileuplod[0].FileName;
  //     this._GacAttachmentFileuplod.forEach(element => {
  //       this.UploadingFiles = element.Uploading;
  //     });
  //     this.FileUploadRequired = false;
  //     this.MainDocumentCheckBox(0);
  //   }
  //   event.target.value = '';
  // }

  ClosefileErrorlog() {
    this.FileUploadErrorlogs = false;
  }





  MainDocumentCheckBox(index: number,) {
    // Set the selectedIndex to the selected file index
    this.selectedIndex = index;
    // Update Ismain property for all files
    this._GacAttachmentFileuplod.forEach((file, i) => {
      file.Ismain = (i === this.selectedIndex);
    });

    this.FirstFileDocumentName = this._GacAttachmentFileuplod[this.selectedIndex].FileName;

    console.log(this._GacAttachmentFileuplod, "Selected File");
  }

  RemoveGacFiles(uniqueId: string, index: number) {
    // Check if the file to be deleted has Ismain set to true
    if (this._GacAttachmentFileuplod[index].Ismain) {
      // Remove the file from the array
      this._GacAttachmentFileuplod = this._GacAttachmentFileuplod.filter(file => file.UniqueId !== uniqueId);
      // Remove the corresponding thumbnail preview
      this.thumbnailPreviews.splice(index, 1);
      // Update selectedIndex if necessary
      if (this.selectedIndex === index) {
        this.selectedIndex = this._GacAttachmentFileuplod.length > 0 ? 0 : null;
        if (this.selectedIndex !== null) {
          this.MainDocumentCheckBox(this.selectedIndex);
        }
      }
    } else {
      console.log("Only the main document can be deleted.");
    }

    this._GacAttachmentFileuplod = this._GacAttachmentFileuplod.filter(file => file.UniqueId !== uniqueId);
    // Remove the corresponding thumbnail preview
    this.thumbnailPreviews.splice(index, 1);
    // Update selectedIndex if necessary
    if (this.selectedIndex === index) {
      this.selectedIndex = this._GacAttachmentFileuplod.length > 0 ? 0 : null;
      if (this.selectedIndex !== null) {
        this.MainDocumentCheckBox(this.selectedIndex);
      }
    }
  }

  onFileSelected(event: any, index: number, uniqueId: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF).');
      event.target.value = ''; // Clear the file input
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.thumbnailbase64 = base64String;
        this.thumbnailPreviews = [{
          FileName: file.name,
          Size: file.size,
          Files: file,
          ThumbnailIMg: this.thumbnailbase64
        }];
        // Update the corresponding file object with the thumbnail data
        this._GacAttachmentFileuplod[index] = {
          ...this._GacAttachmentFileuplod[index],
          Thumbnail: this.thumbnailPreviews
        };
        console.log(this._GacAttachmentFileuplod, "Updated with Thumbnail");
      };
      reader.readAsDataURL(file);
    }
  }

  AddSourceText() {
    // this._obj.SourceName = this.AddSource
    this.service.GetAddsource(this.AddSource).subscribe(data => {
      //console.log(data, "source")
      this._objII = data as GACFiledto;
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

  AddDMText() {
    //this._obj.Name = this.AddDM
    this.service.GetAddDM(this.AddDM).subscribe(data => {
      this._objII = data as GACFiledto;
      this.manu_cl();
      this.ManufactureList = this._objII.Data["DistributorAndManufactureJson"];
      this._snackBar.open('Added Successfully', 'End now', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['blue-snackbar']
      });
    });
  }


  GetSource(event) {
    // Call to clear
    //this.ngSelectComponent.handleClearClick()["ddlsource"];
    //this.SourceList=null; 
    //Src_div
    // alert(event);
    if (event == undefined) {
      document.getElementById("Src_div").style.display = "none";
    }
    else {
      document.getElementById("Src_div").style.display = "block";
    }
    // Convert event to a number if it isn't undefined
    const eventId = event !== undefined ? Number(event) : event;
    this._obj.DocumentTypeId = event;
    this._DocumentTypeId = eventId;

    const selectedDocumentType = this.DocumentTypeList.find(item => item.DocumentTypeId === this._DocumentTypeId);
    if (selectedDocumentType) {
      this.selectedDocumentTypeName = selectedDocumentType.DocumentTypeName;
    }
    this.service.GetSourceDropdownList(this._obj)
      .subscribe(data => {
        this.SourceList = data as GACFiledto;
        if (this.SourceList.length == 0)
          this._obj.SourceId = 0;
        this.DocumentTypeRequired = false;
      });
  }


  GetSubCategory(event) {
    // alert(event.value);
    this._obj.StrCategoryId = event.value;
    this._CategoryId = event.value;

    this.selectedCategoryNames = this.CategoryList
      .filter(item => this._CategoryId.includes(item.CategoryId))
      .map(item => item.CategoryName);
    this.service.GetSubCategoryDropdownList(this._obj)
      .subscribe(data => {
        this._obj = data as GACFiledto;
        this.SubCategoryList = JSON.parse(this._obj.SubCategoryJson);
        this.CategoryRequired = false;
      });
  }

  GetSubCategoryId(event) {
    this._obj.StrSubCategoryId = event.value;
    this.SubCategory = false;
    this._SubCategoryId = event.value;
    this.selectedSubCategoryNames = this.SubCategoryList
      .filter(item => this._SubCategoryId.includes(item.SubCategoryId))
      .map(item => item.SubCategoryName);
  }


  GetCompanyId(event) {
    this.selectedWarehouseValue = undefined;
    // this._obj.CompanyId = event;
    this.CompanyRequired = false;
    if (this._roleid == 502) {
      this._CompanyId = event;
      this.RelatedWarehouses = this.Objwarehousedrp.filter(warehouse => warehouse.CompanyId == this._CompanyId);
      // alert(this._CompanyId);
    } else if (this._roleid != 502) {
      this._CompanyId = this.currentUserValue.CompanyId;
      this.RelatedWarehouses = this.Objwarehousedrp;
      // alert(this._CompanyId)
    }
    const selectedCompany = this.CompanyList.find(item => item.CompanyId === this._CompanyId);
    if (selectedCompany) {
      this.selectedCompanyName = selectedCompany.CompanyName;
    } else {
      this.selectedCompanyName = undefined; // Or handle it as needed
    }
    // console.log(this.RelatedWarehouses, "Selected Warehouse");
    this._WarehouseName = "";
    this._BlockName = "";
    this._RackName = "";
    this._ShelveName = "";

  }

  GetDepatmentId(event) {
    this._obj.DepartmentId = event;
    this.DepartmentRequired = false;
    this._DepartmentId = event

    const selectedDepartment = this.DepartmentList.find(item => item.DepartmentId === this._DepartmentId);
    if (selectedDepartment) {
      this.selectedDepartmentName = selectedDepartment.DepartmentName;
    } else {
      this.selectedDepartmentName = undefined; // Or handle it as needed
    }
  }

  GetDistributorId(event) {
    this._obj.DistributorId = event;
  }

  selectedDMName: string;
  GetManufactureId(event) {
    this._obj.ManufactureId = event;
    this.ManufactureRequired = false;
    this._ManufactureandDistributorId = event;

    const selectedManufactureandDistributor = this.ManufactureList.find(item => item.DMId === this._ManufactureandDistributorId);
    if (selectedManufactureandDistributor) {
      this.selectedDMName = selectedManufactureandDistributor.Name;
    }
    // alert(this._ManufactureandDistributorId);
  }

  selectedSourceName: string;
  GetSourceId(event) {
    this._obj.SourceId = event;
    this.SourceRequired = false;
    this._SourceId = event;
    // alert(this._SourceId);

    const selectedSource = this.SourceList.find(item => item.SourceId === this._SourceId);
    if (selectedSource) {
      this.selectedSourceName = selectedSource.SourceName;
    }
  }


  onFileChange(event) {

    if (event.target.files.length > 0) {
      var length = event.target.files.length;
      for (let index = 0; index < length; index++) {
        const file = event.target.files[index];
        var contentType = file.type;

        if (contentType === "application/pdf") {
          contentType = ".pdf";
        }
        else if (contentType === "image/png") {
          contentType = ".png";
        }
        else if (contentType === "image/jpeg") {
          contentType = ".jpeg";
        }
        else if (contentType === "image/jpg") {
          contentType = ".jpg";
        }
        this.myFiles.push(event.target.files[index].name);

        var d = new Date().valueOf();
        this._lstMultipleFiles = [...this._lstMultipleFiles, {
          UniqueId: d,
          FileName: event.target.files[index].name,
          Size: event.target.files[index].size,
          Files: event.target.files[index]
          // FileName: "1",
        }];


      }
    }
    (<HTMLInputElement>document.getElementById("fileUpload")).value = "";

  }

  RemoveSelectedFile(_id) {
    var removeIndex = this._lstMultipleFiles.map(function (item) { return item.UniqueId; }).indexOf(_id);
    this._lstMultipleFiles.splice(removeIndex, 1);
  }

  Reset() {
    this.Company = null;
    this.Department = null;
    this.DocumentName = ""
    this.DocumentType = null;
    this.AddSource = "";
    this.Source = null;
    this.Manufacture = null;
    this.AddDM = "";
    this.Distributor = null;
    this.Length = ""
    this.Breadth = ""
    this.Height = ""
    this.Date = ""
    this.Note = ""
    this.filename = [];
    this.Category = null;
    this.subCategory = null;
    this.url = null;
    this.file_upload = [];
    this._lstMultipleFiles = [];
    this.documentid = 0;
    this.versionid = 0;
    this._obj = new GACFiledto();
    // this.SubCategoryList = [];
    // this._lstMultipleFiles = [];
    this.myFiles = [];
    this.Isphysical = false;
    this.Isfood = false;
    this.Isoptional = false;
    this.Issharedoc = false;
    this.Isadduser = false;
    this.Isworkflow = false;
    (<HTMLInputElement>document.getElementById("txtnote")).value = "";
  }
  manu_cl() {
    $('#distdiv').addClass('d-none');
    $('#adlist').show();
  }
  soc_cl() {
    $('#socdiv').addClass('d-none');
    $('#solist').show();
  }
  AccessType: string;
  rdPermissionChange(val) {
    this.AccessType = val;
  }
  SharingType: string;
  SharingTypeEevnt(val) {
    if (val.checked == false) {
      this.SharingType = "Electronic";
    }
    else if (val.checked == true) {
      this.SharingType = "Physical";
    }
  }


  startDate: Date;
  enddate: Date;
  endMinDate: Date = this.disablePreviousDate1;

  onStartDateChange() {
    if (this.startDate) {
      this.endMinDate = this.startDate > this.disablePreviousDate1 ? this.startDate : this.disablePreviousDate1;
      this.clearEndDate();
    }
  }
  clearEndDate() {
    this.enddate = null;
  }

  //Company Mat Dropdown
  Company_Values: any = [];
  isSelection_CompanyUser: boolean = false;
  SelectedCompanyIds: any = [] = [];
  CompanuUserSubList: any = [];
  isSelectionCompanyUser: boolean = false;
  RemoveCompanyUser(Users) {
    const index = this.Company_Values.findIndex((usr) => usr.CompanyId === Users.CompanyId);
    this.isSelection_CompanyUser = false;
    if (index !== -1) {
      this.Company_Values.splice(index, 1);
      this.SelectedCompanyIds.splice(index, 1);
    }
    Users.checked = false;
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel()); // close the panel
  }


  filterCompanyUser(input: string): void {
    this.isSelection_CompanyUser = true;
    this.CompanuUserSubList = this.CompanyList.filter((User) =>
      User.UserName.toLowerCase().includes(input.toLowerCase())
    );
  }


  OpenCompanyUser() {
    this.CompanuUserSubList = this.CompanyList;
    this.isSelectionCompanyUser = true;
    (<HTMLInputElement>document.getElementById("txtsearchCompany")).focus()
  }

  openAutocompleteDrpDwnComapnyUser(OpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === OpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.openPanel());
  }
  closeAutocompleteDrpDwnCompanyUser(CloseOpenAdduser: string) {
    const autoCompleteDrpDwn = this.autocompletes.find((item) => item.autocomplete.ariaLabel === CloseOpenAdduser);
    requestAnimationFrame(() => autoCompleteDrpDwn.closePanel());
  }

  closePanelCompanyuser() {
    this.isSelection_CompanyUser = false;
    this.isSelectionCompanyUser = false;
    (<HTMLInputElement>document.getElementById("txtsearchCompany")).value = "";
    (<HTMLInputElement>document.getElementById("txtsearchCompany")).blur();
    requestAnimationFrame(() => this.autoCompleteTrigger.closePanel());
  }

  _AddCompanyUser(event: MatAutocompleteSelectedEvent): void {
    const selectedEmployee = this.CompanyList.find((user) => user.CompanyId === event.option.value);
    if (selectedEmployee) {
      const index = this.Company_Values.findIndex((_user) => _user.CompanyId === selectedEmployee.CompanyId);
      if (index === -1) {
        // User not found in the selected array, add it
        this.Company_Values.push(selectedEmployee);
        this.SelectedCompanyIds.push(selectedEmployee.CompanyId);
      } else {
        // User found in the selected array, remove it
        this.Company_Values.splice(index, 1);
        this.SelectedCompanyIds.splice(index, 1);
      }
    }
    this.CompanuUserSubList = this.CompanyList;
    this.isSelectionCompanyUser = false;
    // this.AddUserErrorLog = false;
  }

  isSelectedCompanyUser(_User: any): boolean {
    return this.Company_Values.some((usr) => usr.CompanyId === _User.CompanyId);
  }


  projectmodal(user) {


    this.ObjShareUserList.forEach(_user => {
      if (_user.UserId === this._ReportingUserId) {
        _user.isChecked = true;

        // Check if the user is already in SelectedUsers to prevent duplicates
        // const existingUser = this.SelectedUsers.find(user => user.UserId === _user.UserId);
        // if (!existingUser) {
        //     this.SelectedUsers.push(_user);
        //     this.SelectedReportingUserName = _user.ContactName;
        // }
      }
    });
    setTimeout(() => {
      if (this.ShareFocus) {
        this.ShareFocus.nativeElement.focus();
      }
    },);
    document.getElementById("fileupload-event-modal-backdrop").style.display = "block";
    document.getElementById("projectmodal").style.display = "block";
  }
  Requiredapprovl() {

    //   if (this._LoginUserId !== this._ReportingUserId) {
    //     this.ObjRequiredApprovalList.forEach(_user => {
    //       if (_user.UserId === this._ReportingUserId) {
    //           _user.disabled = true;
    //       }
    //   });
    // }

    // if (this._LoginUserId !== this._ReportingUserId) {
    //   if (this.Issharedoc) {
    //     // If Issharedoc is true, disable the user
    //     this.ObjRequiredApprovalList.forEach(_user => {
    //       if (_user.UserId === this._ReportingUserId) {
    //         _user.disabled = true; // Disable the user
    //       }
    //     });
    //   } else {
    //     // If Issharedoc is false, enable the user
    //     this.ObjRequiredApprovalList.forEach(_user => {
    //       if (_user.UserId === this._ReportingUserId) {
    //         _user.disabled = false; // Enable the user
    //       }
    //     });
    //   }
    // }



    document.getElementById("fileupload-event-modal-backdrop approval").style.display = "block";
    document.getElementById("Requiredapprovl").style.display = "block";
  }

  _SubCategoryJson: any[];
  SubCategoryLists: any[] = []
  AddCategorys() {


    document.getElementById("fileupload-event-modal-backdrop category").style.display = "block";
    document.getElementById("AddCategory").style.display = "block";
  }

  projectmodalphysical(user) {
    setTimeout(() => {
      if (this.PhysicalFocus) {
        this.PhysicalFocus.nativeElement.focus();
      }
    },);
    document.getElementById("fileupload-event-modal-backdrop physical").style.display = "block";
    document.getElementById("projectmodalphysical").style.display = "block";
  }
  close_projectmodal() {
    document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
    document.getElementById("projectmodal").style.display = "none";
  }
  close_Requiedapproval() {
    // this.SelectedRequiredapprovalUsers = [];
    // this.ObjRequiredApprovalList.forEach(element => {
    //   element.isChecked = false;
    // });
    document.getElementById("fileupload-event-modal-backdrop approval").style.display = "none";
    document.getElementById("Requiredapprovl").style.display = "none";
  }
  close_category() {
    // this.SelectedRequiredapprovalUsers = [];
    // this.ObjRequiredApprovalList.forEach(element => {
    //   element.isChecked = false;
    // });
    document.getElementById("fileupload-event-modal-backdrop category").style.display = "none";
    document.getElementById("AddCategory").style.display = "none";
  }
  close_Physicalmodal() {
    document.getElementById("fileupload-event-modal-backdrop physical").style.display = "none";
    document.getElementById("projectmodalphysical").style.display = "none";
  }
  project_filter() {
    document.getElementById("project-filter").classList.add("show");
    document.getElementById("filter-icon").classList.add("active");
  }
  close_project_filter() {
    document.getElementById("project-filter").classList.remove("show");
    document.getElementById("filter-icon").classList.remove("active");
  }
  close_warehousemodal() {
    this.toggleDocumentLocation('option1');
    $('#warehousemodal').css('display', 'none');
    $('#warehousemodal-modal-backdrop').css('display', 'none');
  }

  formatSize(size: number): string {
    return formatFileSize(size);
  }
  toggle_upload_btn() {
    // document.getElementById("optional-more-upload-footer").classList.toggle("d-none");
    document.getElementById("upload-footer").classList.toggle("d-flex");
  }
  workflowmodal_open() {
    document.getElementById("workflowmodal-modal-backdrop").style.display = "block";
    document.getElementById("workflowmodal").style.display = "block";
  }

  workflowmodal_close() {
    document.getElementById("workflowmodal-modal-backdrop").style.display = "none";
    document.getElementById("workflowmodal").style.display = "none";
  }
  WorkflowLeftsectionlist: any;
  WorkflowDropdownlist() {
    this.inboxService.GetWorkFlowMasterAPI(this.EmployeeId, this.currentUserValue.organizationid)
      .subscribe(data => {

        this.WorkflowLeftsectionlist = data["Data"]["WorkFlowJson"];
        console.log(this.WorkflowLeftsectionlist, "get workflow details");
      })
  }
  selectedWorkflowId: number
  Workflowdetails: any[] = [];
  Workflow_drpvalue: any;
  selectedWorkflowName: string; // Holds the selected WorkflowName
  WorkFlowDetails(WorkFlowId: number) {
    const selectedWorkflow = this.WorkflowLeftsectionlist.find(
      item => item.WorkFlowId === WorkFlowId
    );
    if (selectedWorkflow) {
      this.selectedWorkflowName = selectedWorkflow.WorkFlowName; // Store the name
      console.log('Selected Workflow Name:', this.selectedWorkflowName);
    } else {
      this.selectedWorkflowName = '';
      console.warn('Workflow not found');
    }
    // alert(WorkFlowName);
    this.selectedWorkflowId = WorkFlowId;
    this._obj1.WorkFlowId = WorkFlowId;
    this.inboxService.GetWorkFlowDetailsAPI(this._obj1)
      .subscribe(data => {
        console.log(data, "get workflow details");
        this.Workflowdetails = data["Data"]["WorkFlowDetails"];


        console.log(this.Workflowdetails, "Selected workflow data");

        this.ObjShareUserList.forEach(element => {
          // Check if the element's UserId exists in Workflowdetails
          const isInWorkflowDetails = this.Workflowdetails && this.Workflowdetails.some(
            workflow => workflow.UserId === element.UserId
          );

          // Check if the current user should not be removed
          const isNotRemovable = element.UserId === this._LoginUserId || element.UserId === this._ReportingUserId;

          if (isInWorkflowDetails) {
            // Disable and uncheck the option only if it's removable
            if (!isNotRemovable) {
              element.disabled = true;
              element.isChecked = false; // Ensure it is unchecked
            }
          } else {
            // Enable the dropdown option if UserId does not exist in Workflowdetails
            element.disabled = false;
          }
        });

        // // Clear selected users
        // this.SelectedUsers = [];
        // // Update `disabled` property of `ObjShareUserList`
        // this.ObjShareUserList.forEach(element => {
        //   // Check if the element's UserId exists in Workflowdetails
        //   const isInWorkflowDetails = this.Workflowdetails && this.Workflowdetails.some(
        //     workflow => workflow.UserId === element.UserId
        //   );

        //   if (isInWorkflowDetails) {
        //     // Disable the dropdown option if UserId exists in Workflowdetails
        //     element.disabled = true;
        //     element.isChecked = false; // Ensure it is unchecked
        //   } else {
        //     // Enable the dropdown option if UserId does not exist in Workflowdetails
        //     element.disabled = false;
        //   }
        // });

        // Update `WorkflowLeftsectionlist` to reflect changes in dropdown
        //  this.WorkflowLeftsectionlist = this.ObjShareUserList.filter(item => !item.disabled);
        // Iterate through ObjShareUserList to update the disabled property
        // this.ObjShareUserList.forEach((element) => {
        //   // Check if the element's UserId exists in Workflowdetails
        //   const isInWorkflowDetails = this.Workflowdetails.some(
        //     (workflow) => workflow.UserId === element.UserId
        //   );

        //   if (isInWorkflowDetails) {
        //     // Disable the dropdown option if UserId exists in Workflowdetails
        //     element.disabled = true;
        //     element.isChecked = false; // Ensure it is unchecked
        //   } else {
        //     // Enable the dropdown option if UserId does not exist in Workflowdetails
        //     element.disabled = false;
        //   }
        // });
        // this.toggleSharedoc(true);
        // this.Workflowdetails.forEach((workflow) => {
        //   // Find a matching user in ObjShareUserList based on UserId
        //   // const match = this.ObjShareUserList.find((user) => user.UserId === workflow.UserId);

        //   // // If a match is found, push the complete user object to SelectedUsers array
        //   // if (match) {
        //   //   match.isChecked = true;  // Mark the checkbox as checked directly in ObjShareUserList
        //   //   this.SelectedUsers.push(match);  // Push the entire user object to SelectedUsers
        //   // }

        //   this.ObjShareUserList.forEach(element => {
        //     if (element.UserId == workflow.UserId) {
        //       element.disabled = true;
        //       element.isChecked =false;
        //     }
        //   });
        //   this.SelectedUsers = this.SelectedUsers.filter(u => u.UserId !== workflow.UserId);

        // });
        // this.ObjShareUserList.forEach((element) => {
        //   const isInWorkflowDetails = this.Workflowdetails.some(
        //     (workflow) => workflow.UserId === element.UserId
        //   );

        //   if (!isInWorkflowDetails) {
        //     element.disabled = false; // Re-enable the user
        //   }
        // });
        // console.log(this.SelectedUsers);  // Check the array of selected user objects


        // this.SelectedUsers = [];

        // // Disable dropdown options and update SelectedUsers
        // this.Workflowdetails.forEach((workflow) => {
        //   this.ObjShareUserList.forEach((element) => {
        //     if (element.UserId === workflow.UserId) {
        //       element.disabled = true; // Disable the matched user
        //       element.isChecked = false; // Uncheck the matched user
        //     }
        //   });

        //   // Remove disabled users from SelectedUsers
        //   this.SelectedUsers = this.SelectedUsers.filter(
        //     (u) => u.UserId !== workflow.UserId
        //   );
        // });








      });

  }


  hasApprovedAndRejectedNextStep(actions: any[]): boolean {
    const hasApproved = actions.some(a => a.UserAction === 'Approved' && a.SystemAction === 'Next step');
    const hasRejected = actions.some(a => a.UserAction === 'Rejected' && a.SystemAction === 'Next step');
    return hasApproved && hasRejected;
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
