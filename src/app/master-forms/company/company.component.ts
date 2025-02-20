import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyDTO } from 'src/app/_models/company-dto';
import { CompanyService } from 'src/app/_service/company.service';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { Subject } from 'rxjs';
import tippy from 'tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  _obj: CompanyDTO
  _objCompany: any[] = [];
  String_status: string;
  Country: any;
  city: any;
  InActive: false;
  lstPrdcts: any;
  lstCities: any;
  C1: any
  CompanyId: number;
  CompanyName = '';
  Email: any;
  checkemail: any;
  Fax: any;
  CountryCode:string;
  latitude: any;
  longitude: any;
  Code: any;
  index: any;
  isShow: boolean;
  objCompanyDTO: CompanyDTO
  ObjCountryCode:string;
  companyformGroup: UntypedFormGroup;
  displayedColumns = ['Company', 'Address', 'Phone','phonecode', 'Fax', 'Country', 'actions', 'action'];
  companyNameMinLength: boolean
  CodeMinLength: boolean
  // FaxMinLength: boolean
  AddressMinLength: boolean
  LatitudeMinLength: boolean
  LongitudeMinLength: boolean
  PhoneNoMinLength: boolean
  activePage: number;
  LastPage:number;
  NextPage:Boolean= false;
  TotalRecords: number;
  PageSize: number;
  _selectedcountrytxt:string;
  Comysearch:string = '';
  _CurrentpageRecords: number;
  TotalrecordsList: any;
  PageNumber:number;
  _Search: string;
  lastPagerecords:number;
  currentLang:"ar"|"en"="ar";
  CompanySearch:string;
  EnterCompanyName:string;
  EnterCompanyCode:string;
  EnterPhoneNumber:string;
  EnterFaxNumber:string;
  EnterEmailAddress:string;
  EnterFullAddress:string;
  EnterLatitude:string;
  EnterLongitude:string;
  SelectCountry:string;
  SelectCity:string;
 
  // audioList = [
  //   {
  //     url: "https://yrglobaldocuments.blob.core.windows.net/documents/DMS/226081/460848_[iSongs.info]%2001%20-%20Jai%20Balayya%20Mass%20Anthem.mp3",
  //     title: "Audio",
  //     cover: "https://i1.sndcdn.com/artworks-000249294066-uow7s0-t500x500.jpg"
  //   },
  // ];
  
  constructor(public services: CompanyService, private objFormBuilder: UntypedFormBuilder, 
    private dialog: MatDialog, 
    private _snackBar: MatSnackBar,
    private translate:TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  
  ) {
    this.lstPrdcts = [];
    this.PageSize = 10;
    this.isShow = false;
    this._obj = new CompanyDTO();
    this.objCompanyDTO = new CompanyDTO();
    this.objCompanyDTO.CompanyId = 0
    this._Search = "";
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.CompanySearch = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterCompanyName = lang === 'en' ? 'Enter CompanyName' : 'أدخل اسم الشركة';
    this.EnterCompanyCode = lang === 'en' ? 'Enter CompanyCode' : 'أدخل رمز الشركة';
    this.EnterPhoneNumber = lang === 'en' ? 'Enter PhoneNumber' : 'أدخل رقم الهاتف';
    this.EnterFaxNumber = lang === 'en' ? 'Enter FaxNumber' : 'أدخل رقم الفاكس';
    this.EnterEmailAddress = lang === 'en' ? 'Enter EmailAddress' : 'أدخل عنوان البريد الالكتروني';
    this.EnterFullAddress = lang === 'en' ? 'Enter FullAddress' : 'أدخل العنوان الكامل';
    this.EnterLatitude = lang === 'en' ? 'Enter Latitude Ex:15.000000' : 'أدخل خط العرض مثال: 15.000000';
    this.EnterLongitude = lang === 'en' ? 'Enter Longitude Ex:15.000000' : 'أدخل خط الطول مثال: 15.000000';
    this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
    this.SelectCity = lang === 'en' ? 'Select City' : 'اختر مدينة';
    if (!lang) {
      // Default language if not set in localStorage
      lang = 'en';
      localStorage.setItem('language', lang);
    }
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.translate.getTranslation(lang).subscribe(translations => {
      // Initialize Tippy.js with translated content
      const companyNameTippy = translations.Masterform.companyName;
      tippy('#myButton', {
        content: companyNameTippy,
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
        hideOnClick: true
      });
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      const companyCodeTippy = translations.Masterform.companycode;
    tippy('#myButton1', {
      content: companyCodeTippy,
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      //theme: 'tomato',
      animateFill: true,
      inertia: true,
    });
  });

  this.translate.getTranslation(lang).subscribe(translations => {
    const CompanyGeographic = translations.Masterform.CompanyGeographic;
  tippy('#myButton3', {
    content: CompanyGeographic,
    arrow: true,
    animation: 'scale-extreme',
    //animation: 'tada',
    //theme: 'tomato',
    animateFill: true,
    inertia: true,
  });
})

       })
  }

  
  getcompanydetails() { // To view list
    this._obj.Search = this.Comysearch;
    this._obj.PageSize = this.PageSize;
    this._obj.PageNumber = this.activePage;
    this.services.getcompanylist(this._obj).subscribe(data => {
      // console.log(data,"company");
      this._objCompany = data as [];
      this._obj = new CompanyDTO();
      this.TotalrecordsList = data as  [];
      this.TotalRecords = this._objCompany[0].TotalRecords
      this._CurrentpageRecords = this._objCompany.length;
      if(this.activePage == this.LastPage){
        this.lastPagerecords=10;
      } 
      let _vl = this.TotalRecords / this.PageSize;
      let _vl1 = _vl % 1;
      if (_vl1 > 0.000) {
        this.LastPage = Math.trunc(_vl) + 1;
      }
      else {
        this.LastPage = Math.trunc(_vl);
      }
    })
  }
  
  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;
   if(this.activePage == 1){
     this.NextPage = false;
    } else{
    this.NextPage = true;
    }  
    this.getcompanydetails();
  }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtMainSearch")).value;
    this._Search = newValue;
    this.activePage = 1;
    this.getcompanydetails();
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.Comysearch) {
      this.getcompanydetails();
    }
  }

  ReBindData() {
    this.Comysearch = "";
    this.getcompanydetails();
  }

  keyPress(event: any) {
    const pattern =  /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  dtOptions: any = {};
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.CompanySearch = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterCompanyName = lang === 'en' ? 'Enter CompanyName' : 'أدخل اسم الشركة';
    this.EnterCompanyCode = lang === 'en' ? 'Enter CompanyCode' : 'أدخل رمز الشركة';
    this.EnterPhoneNumber = lang === 'en' ? 'Enter PhoneNumber' : 'أدخل رقم الهاتف';
    this.EnterFaxNumber = lang === 'en' ? 'Enter FaxNumber' : 'أدخل رقم الفاكس';
    this.EnterEmailAddress = lang === 'en' ? 'Enter EmailAddress' : 'أدخل عنوان البريد الالكتروني';
    this.EnterFullAddress = lang === 'en' ? 'Enter FullAddress' : 'أدخل العنوان الكامل';
    this.EnterLatitude = lang === 'en' ? 'Enter Latitude Ex:15.000000' : 'أدخل خط العرض مثال: 15.000000';
    this.EnterLongitude = lang === 'en' ? 'Enter Longitude Ex:15.000000' : 'أدخل خط الطول مثال: 15.000000';
    this.SelectCountry = lang === 'en' ? 'Select Country' : 'حدد الدولة';
    this.SelectCity = lang === 'en' ? 'Select City' : 'اختر مدينة';
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
    // setTimeout(function() { $("#hideDiv").fadeOut(1500); }, 3000);
    this.services._obj.CountryCode="+966";
    this._selectedcountrytxt="SA";
    this.activePage = 1;
    this._CurrentpageRecords = 0;
    this.companyNameMinLength = true;
    this.CodeMinLength = true;
    // this.FaxMinLength = true;
    this.AddressMinLength = true;
    this.LatitudeMinLength = true;
    this.LongitudeMinLength = true;
    this.PhoneNoMinLength = true;
    this.companyformGroup = this.objFormBuilder.group({
      'CName': new UntypedFormControl('', [Validators.required]),
      'Code': new UntypedFormControl,
      'Email': new UntypedFormControl('', [Validators.required]),
      //,Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
      'phone': new UntypedFormControl('', [Validators.required]),
      'phonecode': new UntypedFormControl('', [Validators.required]),
      'Fax': new UntypedFormControl,
      'Address': new UntypedFormControl,
      'latitude': new UntypedFormControl,
      'longitude': new UntypedFormControl,
      'Country': new UntypedFormControl,
      'city': new UntypedFormControl,
      'status': new UntypedFormControl,
    })
    this.services.GetCountries().subscribe(a => {
      this.lstPrdcts = a;
    })
    this.getcompanydetails();
    //document.getElementById("addrck").style.display = "none";
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    // tippy('#myButton', {
    //   content: "Enter Company Name",
    //   arrow: true,
    //   animation: 'scale-extreme',
    //   //animation: 'tada',
    //   //theme: 'tomato',
    //   animateFill: true,
    //   inertia: true,
    //   hideOnClick: true,
    // });
    this.translate.getTranslation(lang).subscribe(translations => {
      // Initialize Tippy.js with translated content
      const companyNameTippy = translations.Masterform.companyName;
      tippy('#myButton', {
        content: companyNameTippy,
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
        hideOnClick: true
      });
    });

    this.translate.getTranslation(lang).subscribe(translations => {
      const companyCodeTippy = translations.Masterform.companycode;
    tippy('#myButton1', {
      content: companyCodeTippy,
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      //theme: 'tomato',
      animateFill: true,
      inertia: true,
    });
  });
    // tippy('#myButton2', {
    //   content: "Enter Company Geographic coordinate",
    //   arrow: true,
    //   animation: 'scale-extreme',
    //   //animation: 'tada',
    //   theme: 'tomato',
    //   animateFill: true,
    //   inertia: true,
    // });
    this.translate.getTranslation(lang).subscribe(translations => {
      const CompanyGeographic = translations.Masterform.CompanyGeographic;
    tippy('#myButton3', {
      content: CompanyGeographic,
      arrow: true,
      animation: 'scale-extreme',
      //animation: 'tada',
      //theme: 'tomato',
      animateFill: true,
      inertia: true,
    });
  })
  }


  
  checkcompanyemailExist() {
    this._obj.Email = (<HTMLInputElement>document.getElementById("txtEmail")).value;

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this._obj.Email.match(mailformat)) {
      this.services.Checkemail(this._obj).subscribe(data => {
        this._obj = data as CompanyDTO
        if (this._obj.message != 1) {
          const language = localStorage.getItem('language');
          // Set translations based on language preference
          if (language === 'ar') {
            this._snackBar.open('البريد الإلكتروني يخرج بالفعل  ', 'تنتهي الآن', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
              panelClass: ['red-snackbar']
            });
          } else {
            this._snackBar.open('Email Already Exits', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
              panelClass: ['red-snackbar']
            });
          }
         
          this.services._obj.Email = '';
        }
      })
    }
    else {
      const language = localStorage.getItem('language');
      // Set translations based on language preference
      if (language === 'ar') {
        this._snackBar.open('يجب أن يكون البريد الإلكتروني عنوان بريد إلكتروني صالحًا', 'تنتهي الآن', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition:'right',
          panelClass: ['red-snackbar']
        });
      } else {
        this._snackBar.open('Email must be a valid email address', 'End now', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition:'right',
          panelClass: ['red-snackbar']
        });
      }
      
      this.services._obj.Email = '';
    }
  }
  checkcodeExist() {
    this._obj.Code = (<HTMLInputElement>document.getElementById("txtCode")).value;
    if (this._obj.Code.trim().length < 3) {
      this.CodeMinLength = false;
    } else {
      this.CodeMinLength = true;
    }
  }
  // checkfaxExist() {
  //   this._obj.Fax = (<HTMLInputElement>document.getElementById("txtfax")).value;
  //   if (this._obj.Fax.trim().length < 3) {
  //     this.FaxMinLength = false;
  //   } else {
  //     this.FaxMinLength = true;
  //   }
  // }
  checklatitudeExist() {
    this._obj.latitude = (<HTMLInputElement>document.getElementById("txtlatitude")).value;
    if (this._obj.latitude.trim().length < 3) {
      this.LatitudeMinLength = false;
    } else {
      this.LatitudeMinLength = true;
    }
  }
  onCountryChange(event) {
 
    this.ObjCountryCode ="+"+ event.dialCode;
    this.services._obj.CountryCode =  this.ObjCountryCode.toString();
   
  }
  checklongitudeExist() {
    this._obj.longitude = (<HTMLInputElement>document.getElementById("txtlongitude")).value;
    if (this._obj.longitude.trim().length < 3) {
      this.LongitudeMinLength = false;
    } else {
      this.LongitudeMinLength = true;
    }
  }
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

  checkcompanynameExist() {
    this._obj.CompanyName = (<HTMLInputElement>document.getElementById("txtCompanyName")).value;
    if (this._obj.CompanyName.trim().length < 3) {
      this.companyNameMinLength = false;
    } else {
      this.companyNameMinLength = true;
    }
    this.services.CheckCompanyName(this._obj).subscribe(data => {
      this._obj = data as CompanyDTO
      if (this._obj.message != 1) {
        const language = localStorage.getItem('language');

        // Set translations based on language preference
        if (language === 'ar') {
          this._snackBar.open('اسم الشركة يخرج بالفعل', 'تنتهي الآن', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition:'right',
            panelClass: ['red-snackbar']
          });
        } else {
          this._snackBar.open('Company Name Already Exits', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition:'right',
            panelClass: ['red-snackbar']
          });
        }
        
        this.services._obj.CompanyName = '';
      }
    })
  }
  getcities(CountryId) {
    this._obj.CountryId = CountryId;
    this.services.GetCities(this._obj)
      .subscribe(data => {
        this.lstCities = data;
      })
  }
  get f() {
    return this.companyformGroup.controls;
  }
  OnCreate() {
    
    try {
      if (this.companyformGroup.invalid) {
        return;
      }
      this._obj.CompanyId = this.CompanyId;
      this._obj.CompanyName = this.companyformGroup.get('CName').value;
      this._obj.Address = this.companyformGroup.get('Address').value;
      if(this._obj.Address==null){
        this._obj.Address="";
      }
      this._obj.Phone = this.companyformGroup.get('phone').value;
      this._obj.CountryCode = this.companyformGroup.get('phonecode').value;
      // if (this.ObjCountryCode == null) {
      //   this.ObjCountryCode = "0";
      // }
      // this._obj.CountryCode = this.ObjCountryCode;
      this._obj.Email = this.companyformGroup.get('Email').value;
      this._obj.Fax = this.companyformGroup.get('Fax').value;
      if (this._obj.Fax == null) {
        this._obj.Fax = ""; 
      }
      this._obj.CountryId = this.companyformGroup.get('Country').value;
      if(this._obj.CountryId==null){
        this._obj.CountryId=0;
      }
      this._obj.CityId = this.companyformGroup.get('city').value;
      if(this._obj.CityId==null){
        this._obj.CityId=0;
      }
      this._obj.latitude = this.companyformGroup.get('latitude').value;
      if(this._obj.latitude==null){
        this._obj.latitude="0.0";
      }
      this._obj.longitude = this.companyformGroup.get('longitude').value;
      if(this._obj.longitude==null){
        this._obj.longitude="0.0";
      }
      this._obj.Code = this.companyformGroup.get('Code').value;
      if(this._obj.Code==null){
        this._obj.Code="";
      }
      if (this.companyformGroup.get('status').value == undefined) {
        this._obj.IsActive = false;
      }
      else {
        this._obj.IsActive = this.companyformGroup.get('status').value;
      }
      if (this._obj.CompanyId == undefined || this._obj.CompanyId == 0) {
        this._obj.FlagId = 1;
      } else if (this._obj.CompanyId != 0) {
        this._obj.FlagId = 2;
      }
      this.services.insertcompanydetails(this._obj).subscribe(
        (data: any) => {
          if (data["message"] == "1") {
            const language = localStorage.getItem('language');

            // Set translations based on language preference
            if (language === 'ar') {
              this._snackBar.open('اضيف بنجاح', 'تنتهي الآن', {
                duration: 5000,            
                verticalPosition: 'bottom',
                horizontalPosition:'right',
              });
            } else {
              this._snackBar.open('Added Successfully', 'End now', {
                duration: 5000,            
                verticalPosition: 'bottom',
                horizontalPosition:'right',
              });
            }
          }
          else if (data["message"] == "2") {
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
          // document.getElementById("addrck").style.display = "none";
          // document.getElementById("company_add").style.display = "block";
          document.getElementById("addrck").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.getcompanydetails();
          this.companyformGroup.reset()
          this.CompanyId = 0;
          this.companyformGroup.patchValue({
            phonecode: "+1"
          })
          this.services._obj.CountryCode="+1";
        }
      );
    } catch (error) {
      alert(error)
    }
    this.isShow = false;
  }
  UpdateStatus(Obj_Status: CompanyDTO) {

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
        this.services.UpdateCompanyStatus(Obj_Status).subscribe(data => {

        });
      }
    });
  }
  
  company_add() {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("company_add").style.display = "none";
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }
    this.isShow = false;
    this.LatitudeMinLength  = true;
    this.LongitudeMinLength = true;
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }

  company_edit(C1: CompanyDTO) {
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");

    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("company_add").style.display = "none";
    // document.getElementById("editrck").innerHTML = "Edit";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Edit");
    }
    this.objCompanyDTO.CompanyId = C1.CompanyId;
    this.CompanyId = C1.CompanyId;
    this.services._obj.CompanyName = C1.CompanyName;
    this.services._obj.Code = C1.Code;
    this.services._obj.Email = C1.Email;
    this.services._obj.Fax = C1.Fax;
    this.services._obj.Address = C1.Address;
    this.services._obj.latitude = C1.latitude;
    this.services._obj.longitude = C1.longitude;
    this.services._obj.CountryId = C1.CountryId;
    this._obj.CountryId = C1.CountryId;
    this.services.GetCities(this._obj)
      .subscribe(data => {
        this.lstCities = data;
        this.services._obj.CityId = C1.CityId
      })
    this.services._obj.CityId = C1.CityId;
    this.services._obj.Phone = C1.Phone;
    this.services._obj.CountryCode = C1.CountryCode;
    this.services._obj.IsActive = C1.IsActive;
    this.isShow = true;
  }
  company_cl() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");

    // document.getElementById("addrck").style.display = "none";
    // document.getElementById("company_add").style.display = "block";
    this.companyformGroup.reset()
    this.CompanyId = 0;
    this.isShow = false;
  }

  closeInfo() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("company_add").style.display = "block";
    this.companyformGroup.reset()
  }

}
