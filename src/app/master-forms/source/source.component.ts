import { Component, OnInit,AfterViewInit, Renderer2, Inject, } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SourceDTO } from 'src/app/_models/source-dto';
import { SourceserviceService } from 'src/app/_service/sourceservice.service';
import tippy from 'tippy.js';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})
export class SourceComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  _obj: SourceDTO;
  _objSource: any[] = []
  String_status: string;
  Country: any;
  city: any;
  InActive: false;
  lstPrdcts: any;
  lstCities: any;
  SourceId: number;
  isShow: boolean;
  source: any;
  objSourceDTO: SourceDTO;
  sourceformGroup: UntypedFormGroup;
  ObjCountryCode: string;
  objsourcelist = [];
  displayedColumns = ["Source", "Note", "Address", "Email", "Contact Person", "CountryCode", "Fax", "Country", "actions", "action"]
  // FaxMinLength: boolean;
  AddressMinLength: boolean;
  PhoneNoMinLength: boolean;
  userlist: boolean;
  UserId: Number
  // ContactUserMinLength: boolean;
  SourceNameMinLength: boolean;
  dialCode: any;
  activePage: number;
  LastPage: number;
  NextPage: Boolean = false;
  TotalRecords: number;
  PageSize: number;
  AccessUsers: any;
  SourceList: any
  IsConfidential: any;
  selected: string[] = [];
  selectedSourceValue: Number;
  selectedItemList = [];
  SourceSearch:string;
  currentLang:"ar"|"en"="ar";
  SourceSearchs:string;
  SelectUsers:string;
  EnterSourceName:string;
  EnterContactPersonName:string;
  EnterPhoneNumber:string;
  EnterFaxNumber:string;
  EnterEmailAddress:string;
  EnterFullAddress:string;
  SelectCountry:string;
  SelectCity:string;
  EnterDescription:string;
  constructor(public services: SourceserviceService,
     private objFormBuilder: UntypedFormBuilder, 
     private dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private renderer: Renderer2,
      private translate:TranslateService,
          @Inject(DOCUMENT) private document: Document,
    
    ) {
    this.lstPrdcts = [];
    this.selectedSourceValue = 0;
    this.isShow = false;
    this._obj = new SourceDTO();
    this.objSourceDTO = new SourceDTO();
    this.objSourceDTO.SourceId = 0
    this.objsourcelist = [];
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.SourceSearchs = lang === 'en' ? 'Search' : 'يبحث';
    this.SelectUsers = lang === 'en' ? 'Select Users' : 'حدد المستخدمين';
    this.EnterSourceName = lang === 'en' ? 'Enter SourceName' : 'أدخل اسم المصدر';
    this.EnterContactPersonName = lang === 'en' ? 'Enter ContactPersonName' : 'أدخل اسم جهة الاتصال';
    this.EnterPhoneNumber = lang === 'en' ? 'Enter PhoneNumber' : 'أدخل رقم الهاتف';
    this.EnterFaxNumber = lang === 'en' ? 'Enter FaxNumber' : 'أدخل رقم الفاكس';
    this.EnterEmailAddress = lang === 'en' ? 'Enter EmailAddress' : 'أدخل عنوان البريد الالكتروني';
    this.EnterFullAddress = lang === 'en' ? 'Enter FullAddress' : 'أدخل عنوان البريد الالكتروني';
    this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
    this.SelectCity = lang === 'en' ? 'Select City' : 'اختر مدينة';
    this.EnterDescription = lang === 'en'? 'Enter Description' : 'أدخل الوصف';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Source Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم المصدر';
    }

    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterSource', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    let tooltipContents = '';
    if (lang === 'en') {
      tooltipContents = 'Enter Contact Person Name';
    } else if (lang === 'ar') {
      tooltipContents = 'أدخل اسم الشخص الذي يمكن الاتصال به';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterContactPerson', {
      content: tooltipContents,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    })
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  dtOptions: any = {};
  ngOnInit(): void {
    let lang: any = localStorage.getItem('language');
this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.SourceSearchs = lang === 'en' ? 'Search' : 'يبحث';
  this.SelectUsers = lang === 'en' ? 'Select Users' : 'حدد المستخدمين';
  this.EnterSourceName = lang === 'en' ? 'Enter SourceName' : 'أدخل اسم المصدر';
  this.EnterContactPersonName = lang === 'en' ? 'Enter ContactPersonName' : 'أدخل اسم جهة الاتصال';
  this.EnterPhoneNumber = lang === 'en' ? 'Enter PhoneNumber' : 'أدخل رقم الهاتف';
  this.EnterFaxNumber = lang === 'en' ? 'Enter FaxNumber' : 'أدخل رقم الفاكس';
  this.EnterEmailAddress = lang === 'en' ? 'Enter EmailAddress' : 'أدخل عنوان البريد الالكتروني';
  this.EnterFullAddress = lang === 'en' ? 'Enter FullAddress' : 'أدخل عنوان البريد الالكتروني';
  this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
  this.SelectCity = lang === 'en' ? 'Select City' : 'اختر مدينة';
  this.EnterDescription = lang === 'en'? 'Enter Description' : 'أدخل الوصف';
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
    this.activePage = 1;
    // this.sourceformGroup.control.get("address").setValue(address);
this.userlist=true;
    // this.countrycode.setValue('+1');
    // this.FaxMinLength = true;
    this.AddressMinLength = true;
    this.PhoneNoMinLength = true;
    // this.ContactUserMinLength = true;
    this.SourceNameMinLength = true;
    this.sourceformGroup = this.objFormBuilder.group({
      'SourceName': new UntypedFormControl('', [Validators.required]),
      'note': new UntypedFormControl,
      'Email': new UntypedFormControl('', [Validators.required,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]),
      'phone': new UntypedFormControl('', [Validators.required]),
      'Fax': new UntypedFormControl,
      'Address': new UntypedFormControl,
      'ContactUser': new UntypedFormControl,
      'IsArchiving': new UntypedFormControl,
      'IsCommunication': new UntypedFormControl,
      'state': new UntypedFormControl,
      'UsersList': new UntypedFormControl,
      'Country': new UntypedFormControl,
      'city': new UntypedFormControl,
      'status': new UntypedFormControl,
      'countrycode': new UntypedFormControl('', [Validators.required])
    })
    this.services.GetCountries().subscribe(a => {
      this.lstPrdcts = a;
    })
    this.getsourcelist();
    //document.getElementById("addrck").style.display = "none";
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Source Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم المصدر';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterSource', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    let tooltipContents = '';
    if (lang === 'en') {
      tooltipContents = 'Enter Contact Person Name';
    } else if (lang === 'ar') {
      tooltipContents = 'أدخل اسم الشخص الذي يمكن الاتصال به';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterContactPerson', {
      content: tooltipContents,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

    this.services._obj.CountryCode = "+1";
  }
  getsourcelist() {
    this.services.GetSourceList(this._obj).subscribe(data => {
      this._objSource = data as [];
      //this.dtTrigger.next()
      this._obj = new SourceDTO();
    })
  }
  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;
    this.LastPage = (this.TotalRecords / this.PageSize)
    if (this.activePage == 1) {
      this.NextPage = false;
    } else {
      this.NextPage = true;
    }
    // this.GetUserList();

  }
  getcities(CountryId) {
    this._obj.CountryId = CountryId;
    this.services.GetCities(this._obj).subscribe(data => {
      this.lstCities = data;
    })
  }
  onCountryChange(event) {
    // this.ObjCountryCode = "+" +event.dialCode;
    this.services._obj.CountryCode = "+" + event.dialCode.toString();
  }
  // ngAfterViewInit(): void{
  //   tippy('.tips', {
  //     arrow: true,
  //     animation: 'scale-extreme',
  //     //animation: 'tada',
  //     // theme: 'tomato',
  //     animateFill: true,
  //     inertia: true,
  //   });
  // }
  ReBindData(){
   this.SourceSearch = "";
   this.getsourcelist();
  }
  GetUsersListDrp() {
    if(this.services._obj.IsConfidential == true){
      this.userlist = false;
      this.services.GetUserList(this._obj).subscribe(data => {
        this._obj = data as SourceDTO;
        this.SourceList = this._obj.Data["UserList"];     
        tippy('.tips', {
          arrow: true,
          animation: 'scale-extreme',
          //animation: 'tada',
          // theme: 'tomato',
          animateFill: true,
          inertia: true,
        });
      });
    }
    else {
    this.userlist = true;
    }
  }
 

  get f() {
    return this.sourceformGroup.controls;
  }
  OnCreate() {

    try {
      if (this.sourceformGroup.invalid) {
        return;
      }
      this._obj.SourceId = this.SourceId;
      this._obj.SourceName = this.sourceformGroup.get('SourceName').value;
      this._obj.Description = this.sourceformGroup.get('note').value;
      if (this._obj.Description == null) {
        this._obj.Description = "";
      }
      this._obj.Address = this.sourceformGroup.get('Address').value;
      this._obj.Phone = this.sourceformGroup.get('phone').value;
      this._obj.CountryCode = this.sourceformGroup.get('countrycode').value;

      // if (this.ObjCountryCode == null) {
      //   this.ObjCountryCode = "0";
      // }
      // this._obj.CountryCode = this.ObjCountryCode;
      this._obj.Email = this.sourceformGroup.get('Email').value;
      this._obj.Fax = this.sourceformGroup.get('Fax').value;
      if (this._obj.Fax == null) {
        this._obj.Fax = "";
      }
      this._obj.CountryId = this.sourceformGroup.get('Country').value;
      if (this._obj.CountryId == null) {
        this._obj.CountryId = 0;
      }
      this._obj.CityId = this.sourceformGroup.get('city').value;
      if (this._obj.CityId == null) {
        this._obj.CityId = 0;
      }
      this._obj.ContactUser = this.sourceformGroup.get('ContactUser').value;
      if (this._obj.ContactUser == null) {
        this._obj.ContactUser = "";
      }
      this._obj.IsArchiving = this.sourceformGroup.get('IsArchiving').value;
      this._obj.IsCommunication = this.sourceformGroup.get('IsCommunication').value;
      this._obj.IsConfidential = this.sourceformGroup.get('state').value;
     
      if (this._obj.IsConfidential == true) {
        this._obj.AccessUsers = this.AccessUsers.toString();
      }
      else{
        this._obj.AccessUsers ="";
      }
      if (this.sourceformGroup.get('status').value == undefined) {
        this._obj.IsActive = false;
      }
      else {
        this._obj.IsActive = this.sourceformGroup.get('status').value;
      }
      if (this._obj.SourceId == undefined || this._obj.SourceId == 0) {
        this._obj.FlagId = 1;
      } else if (this._obj.SourceId != 0) {
        this._obj.FlagId = 2;
      }


      this.services.InsertUpdateSource(this._obj).subscribe(
        (data: any) => {
          if (data["message"] == "1") {
            this._snackBar.open('Added Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });

          }
          else if (data["message"] == "2") {
            this._snackBar.open('Updated Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
          }
          // document.getElementById("addrck").style.display = "none";
          // document.getElementById("source_add").style.display = "block";
          document.getElementById("addrck").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.getsourcelist();
          this.sourceformGroup.reset();
          this.SourceId = 0;
          this.sourceformGroup.patchValue({
            countrycode: "+1"
          })
          this.services._obj.CountryCode = "+1";
          this.GetUsersListDrp();
        }
      );
    } catch (error) {
      alert(error)
    }
    this.isShow = false;
  }
  UpdateStatus(Obj_Status: SourceDTO) {
    if (Obj_Status.IsActive === true) {
      this.String_status = "In-Active"
    }
    else {
      this.String_status = "Active"
    }
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm ',
        message: this.String_status
      }
    });
    confirmDialog.afterClosed().subscribe(result => {

      if (result === true) {
        if (Obj_Status.IsActive === true) {
          Obj_Status.IsActive = false;
          this.InActive;
        }
        else {
          Obj_Status.IsActive = true;
        }
        this.services.updatesourcestatus(Obj_Status)

      }
    });
  }
  checkSourceNameExist() {
    this._obj.SourceName = (<HTMLInputElement>document.getElementById("txtsourcename")).value;
    if (this._obj.SourceName.trim().length < 3) {
      this.SourceNameMinLength = false;
    } else {
      this.SourceNameMinLength = true;
    }
  }
  // checkContactUserExist() {
  //   this._obj.ContactUser = (<HTMLInputElement>document.getElementById("txtcontactuser")).value;
  //   if (this._obj.ContactUser.trim().length < 3) {
  //     this.ContactUserMinLength = false;
  //   } else {
  //     this.ContactUserMinLength = true;
  //   }
  // }
  checkaddressExist() {
    this._obj.Address = (<HTMLInputElement>document.getElementById("txtaddress")).value;
    if (this._obj.Address.trim().length < 3) {
      this.AddressMinLength = false;
    } else {
      this.AddressMinLength = true;
    }
  }
  checkphoneNoExist() {
    this._obj.Phone = (<HTMLInputElement>document.getElementById("txtphoneNo")).value;
    if (this._obj.Phone.trim().length < 9) {
      this.PhoneNoMinLength = false;
    } else {
      this.PhoneNoMinLength = true;
    }
  }
  // checkFax() {
  //   this._obj.Fax = (<HTMLInputElement>document.getElementById("txtfax")).value;
  //   if (this._obj.Fax.trim().length < 3) {
  //     this.FaxMinLength = false;
  //   } else {
  //     this.FaxMinLength = true;
  //   }
  // }
  CheckEmailExist() {
    let Email = (<HTMLInputElement>document.getElementById("txtemail")).value;
    var Emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (Email.match(Emailformat)) {
    } else {
      (<HTMLInputElement>document.getElementById("txtemail")).value = "";
      this._snackBar.open('Email incorrect', 'End now', {
        duration: 5000,
        horizontalPosition: "center",
        verticalPosition: "top",
        panelClass: ['red-snackbar']
      });

    }


  }
  source_add() {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("source_add").style.display = "none";
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }
   this.isShow = false;
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    this.services._obj.CountryCode = '+1'
  }
  source_edit(source: SourceDTO) {
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");

    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("source_add").style.display = "none";
    // document.getElementById("editrck").innerHTML = "Edit";
    const element = document.getElementById("editrck");
    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Edit");
    }
    this.objSourceDTO.SourceId = source.SourceId;
    this.SourceId = source.SourceId;
    this.services._obj.SourceName = source.SourceName;
    this.services._obj.Description = source.Description;
    this.services._obj.Address = source.Address;
    this.services._obj.Email = source.Email;
    this.services._obj.Fax = source.Fax;
    this.services._obj.Phone = source.Phone;
    this.services._obj.CountryCode = source.CountryCode;
    this.services._obj.ContactUser = source.ContactUser;
    this.services._obj.IsArchiving = source.IsArchiving;
    this.services._obj.IsCommunication = source.IsCommunication;
    this.services._obj.IsConfidential = source.IsConfidential;
var ids = source.AccessUsers;
this.selected = ids.split(",");
let _ary = [];
for (let index = 0; index < this.selected.length; index++) {
  const element = this.selected[index];
  _ary.push(parseInt(element))
}
this.AccessUsers = _ary;
    this.services._obj.CountryId = source.CountryId;
    this._obj.CountryId = source.CountryId;
    this.services.GetCities(this._obj)
      .subscribe(data => {
        this.lstCities = data;
        this.services._obj.CityId = source.CityId
      })
    this.services._obj.CityId = source.CityId;
    this.services._obj.IsActive = source.IsActive;
    this.GetUsersListDrp();
    this.isShow = true;
    this.userlist = false;
    
  }
  source_cl() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

    // document.getElementById("addrck").style.display = "none";
    // document.getElementById("source_add").style.display = "block";
    this.sourceformGroup.reset()
    this.SourceId = 0;
    this.isShow = false;
    this.GetUsersListDrp();
  }

  closeInfo() {
    this.sourceformGroup.reset();
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("company_add").style.display = "block";

  }

}
