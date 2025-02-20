import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import { ViewChild } from '@angular/core';
import { UserRegistrationService } from 'src/app/_service/user-registration.service';
import { UserRegistrationDTO } from 'src/app/_models/user-registration-dto';
import { UserPolicyMasterServiceService } from 'src/app/_service/user-policy-master-service.service';
import { UserPolicyMasterDTO } from 'src/app/_models/user-policy-master-dto';

import tippy from 'tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})

export class BannerComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  StartDate: any = new Date();
  EndDate: any = new Date();
  myFiles: string[] = [];
  _LstToBanner: InboxDTO[];
  _lstMultipleFiales: any;
  disablePreviousDate = new Date();
  Banner: string;
  _obj: InboxDTO;
  BannerSearch: string;
  error: string = "";
  ObjgetCompanyList: any;
  _obj1: UserPolicyMasterDTO;
  CompanyDrp: any[] = [];
  All: boolean = false
  FileName: any;
  selected: any;
  item: any;
  CompanyIds: any;
  Attachment: any = [];
  preview: boolean = false;
  isShow: boolean;
  BannerId: number;
  currentLang: "ar" | "en" = "ar";
  BannerSearchs: string;
  BannerName: string;
  Companyselect: string;
  BannerErrorlog: boolean = false;
  BannerAttachmentErrorlog: boolean = false;
  constructor(public newmemoService: NewMemoService,
    private _snackBar: MatSnackBar,
    public service: UserPolicyMasterServiceService,
    private translate: TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.myFiles = [];
    this._lstMultipleFiales = [];
    this._obj = new InboxDTO();
    this.ObjgetCompanyList = [];
    this.isShow = false;
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.BannerSearchs = lang === 'en' ? 'Search' : lang === 'ar' ? 'يبحث' : '';
      this.BannerName = lang === 'en' ? 'Banner Name' : lang === 'ar' ? 'اسم البانر' : '';
      this.Companyselect = lang === 'en' ? 'select' : lang === 'ar' ? 'يختار' : '';
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    })
  }
  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.BannerSearchs = lang === 'en' ? 'Search' : lang === 'ar' ? 'يبحث' : '';
    this.BannerName = lang === 'en' ? 'Banner Name' : lang === 'ar' ? 'اسم البانر' : '';
    this.Companyselect = lang === 'en' ? 'select' : lang === 'ar' ? 'يختار' : '';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.BannerList();
    this.GetAnnouncementDrps();


    // tippy('.cmp-nams', {
    //   content: "Company Names",
    //   arrow: true,
    //   animation: 'scale-extreme',
    //   //animation: 'tada',
    //   //theme: 'tomato',
    //   animateFill: true,
    //   inertia: true,
    // });

  }
  ReBindData() {
    this.BannerSearch = "";
    this.BannerList()
  }
  GetAnnouncementDrps() {
    this.service.GetCompanyList()
      .subscribe(data => {
        this._obj1 = data as UserPolicyMasterDTO;
        this.ObjgetCompanyList = this._obj1.Data["CompanyList"];
        // this.ObjgetDepartmentList = this._obj1.Data["JDepartmentList"];
        // this.ObjgetDesignationList = this._obj1.Data["JDesignationList"];
      })
  }
  selectStartDate(event) {
    this.StartDate = event.value;
    this.EndDate = event.value;
    console.log(this.StartDate);
    console.log(this.EndDate);
  }
  bnr_add() {
    this.BannerAttachmentErrorlog = false;
    this.BannerErrorlog = false;
    document.getElementById("addbnr").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editbnr").innerHTML = "Add Banner";
    const element = document.getElementById("editbnr");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Administration.AddBanner");
    }

  }
  bnr_edit(item: InboxDTO, i) {
    document.getElementById("addbnr").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editbnr").innerHTML = "Edit Banner";
    const element = document.getElementById("editbnr");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Administration.EditBanner");
    }
    this._obj.BannerId = item.BannerId;
    this.All = item.IsAll;
    this.Banner = item.BannerName;
    this.filesrc = item.BannerUrl;
    this.StartDate = new Date(item.StartDates);
    this.EndDate = new Date(item.EndDates);
    var ids = item.CompanyIds;
    this.selected = ids.split(",");
    let _ary = [];
    for (let index = 0; index < this.selected.length; index++) {
      const element = this.selected[index];
      _ary.push(parseInt(element))
    }
    this.CompanyDrp = _ary;
    this.preview = true;
    this.isShow = true;
  }

  bnr_cl() {
    this.CompanyDrp = null
    this.Banner = "";
    this.myFiles = [];
    this._lstMultipleFiales = [];
    this.StartDate = new Date();
    this.EndDate = new Date();
    this.All = false;
    this.CompanyDrp = [];
    this.filesrc = null;
    this.preview = false;
    this.isShow = false;
    this.BannerAttachmentErrorlog = false;
    this.BannerErrorlog = false;
    this,
      (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
    (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";
    document.getElementById("addbnr").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  closeInfo() {
    this.bnr_cl();
    document.getElementById("addbnr").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("company_add").style.display = "block";
  }
  filesrc: any;
  onFileChange(event) {
    this.BannerAttachmentErrorlog = false;
    let reader = new FileReader();
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
        
        window.URL = window.URL || window.webkitURL;
        const img = new Image();
        img.src = window.URL.createObjectURL(file);
        reader.readAsDataURL(file);

        reader.onload = () => {
          setTimeout(() => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            window.URL.revokeObjectURL(img.src);
            if (width !== 1200 || height !== 600) {
              this.error = "Image size should be 1200 x 600";
              $('#fileUpload').val('');
              $('#fileuploadtext').html('Choose file');
              alert(this.error);
            }
            else {
              this.myFiles.push(event.target.files[index].name);
              var d = new Date().valueOf();
              this._lstMultipleFiales = [...this._lstMultipleFiales, {  
                UniqueId: d,
                FileName: event.target.files[index].name,
                Size: event.target.files[index].size,
                Files: event.target.files[index]
              }];
              this.filesrc = reader.result;
              this.preview = true;
              this.BannerAttachmentErrorlog = false;
            }
          }, 100);
        }
      }
    }
  }

  RemoveSelectedFile(_id) {
    var removeIndex = this._lstMultipleFiales.map(function (item) { return item.UniqueId; }).indexOf(_id);
    this._lstMultipleFiales.splice(removeIndex, 1);
  }

  onSubjectChange() {
    if (this.Banner.trim() == "" || this.Banner.trim() == undefined) {
      $('.error-msg-pop-x').removeClass('d-none');
      this.BannerErrorlog = true;
    } else {
      $('.error-msg-pop-x').addClass('d-none');
      this.BannerErrorlog = false;
    }
  }

  OnSubmitBanner() {
    this._obj.BannerId = 0;
    this._obj.IsAll = this.All;
    this._obj.CompanyIds = this.CompanyDrp.toString();
    this._obj.StartDateTime = this.StartDate;
    this._obj.EndDateTime = this.EndDate;
    if (this.Banner === undefined || this.Banner === "") {
      this.BannerErrorlog = true;
    } else {
      this.BannerErrorlog = false;
    }

    if (!this._lstMultipleFiales.length || !this.preview) {
      this.BannerAttachmentErrorlog = true;
    } else {
      this.BannerAttachmentErrorlog = false;
    }

    if (this.BannerErrorlog || this.BannerAttachmentErrorlog) {
      return false;
    }
    this._obj.BannerName = this.Banner;
    const frmData = new FormData();
    for (let i = 0; i < this._lstMultipleFiales.length; i++) {
      frmData.append("files", this._lstMultipleFiales[i].Files);
    }
    if (this._obj.BannerId == undefined || this._obj.BannerId == 0) {
      this._obj.FlagId = 1;
    } else if (this._obj.BannerId != 0) {
      this._obj.FlagId = 2;
    }
    this.newmemoService.AddBanner(this._obj).subscribe(
      data => {
        console.log(data, "bannerdata");
        this._obj = data as InboxDTO;
        this._obj.BannerId = parseInt(data['Data'].BannerId);
        
        if (data["Message"] == "1") {
          if (this._lstMultipleFiales.length > 0) {
            const frmData = new FormData();
            for (var i = 0; i < this._lstMultipleFiales.length; i++) {
              frmData.append("fileUpload", this._lstMultipleFiales[i].Files);
            }
            frmData.append("BannerId", this._obj.BannerId.toString());
            this.newmemoService.UploadBannerAttachmenst(frmData).subscribe(
              data => {
                this._snackBar.open('Banner Added Successfully', 'End now', {
                  duration: 5000,
                  horizontalPosition: "right",
                  verticalPosition: "bottom",
                  panelClass: ['blue-snackbar']
                });
                this.myFiles = [];
                this._lstMultipleFiales = [];
                this.StartDate = new Date();
                this.EndDate = new Date();
                this.Banner = "";
                this.All = false;
                this.CompanyDrp = [];
                this.preview = false;
                (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
                (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";
                document.getElementById("addbnr").classList.remove("kt-quick-panel--on");
                document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                this.BannerList();
              });
          } else {
            this._snackBar.open('Banner Updated Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['blue-snackbar']
            });
          }
          this.myFiles = [];
          this._lstMultipleFiales = [];
          this.StartDate = new Date();
          this.EndDate = new Date();
          this.Banner = "";
          this.All = false;
          this.CompanyDrp = [];
          this.preview = false;
          this.isShow = false;
          (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
          (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";
          document.getElementById("addbnr").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          this.BannerList();
        }
      });
  }

  OnUpdateBanner() {
    this._obj.BannerId = this._obj.BannerId;
    this._obj.IsAll = this.All;
    this._obj.CompanyIds = this.CompanyDrp.toString();
    this._obj.StartDateTime = this.StartDate;
    this._obj.EndDateTime = this.EndDate;
    if (this.Banner === undefined || this.Banner === "") {
      this.BannerErrorlog = true;
      return false;
    } else {
      this.BannerErrorlog = false;
    }
    this._obj.BannerName = this.Banner;
    if (this._obj.BannerId == undefined || this._obj.BannerId == 0) {
      this._obj.FlagId = 1;
    } else if (this._obj.BannerId != 0) {
      this._obj.FlagId = 2;
    }
    this.newmemoService.AddBanner(this._obj).subscribe(
      data => {
        // console.log(data,"bannerdata");
        this._obj = data as InboxDTO;
        this._obj.BannerId = parseInt(data['Data'].BannerId);
        console.log(this._obj, "bannerdata");
        if (data["Message"] == "1") {
          if (this._lstMultipleFiales.length > 0) {
            const frmData = new FormData();
            for (var i = 0; i < this._lstMultipleFiales.length; i++) {
              frmData.append("fileUpload", this._lstMultipleFiales[i].Files);
            }
            frmData.append("BannerId", this._obj.BannerId.toString());
            this.newmemoService.UploadBannerAttachmenst(frmData).subscribe(
              data => {
                this._snackBar.open('Banner Added Successfully', 'End now', {
                  duration: 5000,
                  horizontalPosition: "right",
                  verticalPosition: "bottom",
                  panelClass: ['blue-snackbar']
                });
                this.myFiles = [];
                this._lstMultipleFiales = [];
                this.StartDate = new Date();
                this.EndDate = new Date();
                this.Banner = "";
                this.All = false;
                this.CompanyDrp = [];
                this.preview = false;
                (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
                (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";
                document.getElementById("addbnr").classList.remove("kt-quick-panel--on");
                document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
                document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
                this._obj = new InboxDTO();
                this.BannerList();
              });
          } else {
            this._snackBar.open('Banner Updated Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['blue-snackbar']
            });
            this._obj = new InboxDTO();
          }
          this.myFiles = [];
          this._lstMultipleFiales = [];
          this.StartDate = new Date();
          this.EndDate = new Date();
          this.Banner = "";
          this.All = false;
          this.CompanyDrp = [];
          this.preview = false;
          this.isShow = false;
          (<HTMLInputElement>document.getElementById("fileUpload")).value = "";
          (<HTMLInputElement>document.getElementById("fileuploadtext")).innerHTML = "Choose file";
          document.getElementById("addbnr").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          // this._obj = new InboxDTO();
          this.BannerList();
        }
      });
  }

  BannerList() {
    
    this.newmemoService.BannerList().subscribe(
      data => {
        this._obj = data as InboxDTO;
        this._LstToBanner = data["Data"].BannerJson;
        console.log(this._LstToBanner, "BannerList");
        // this._LstToBanner.forEach(element => {
        //   element.AttachmentJson = JSON.parse(element.AttachmentJson);
        // });
      }
    )
  }

}
