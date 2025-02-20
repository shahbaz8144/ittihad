import { Component, OnInit, Renderer2,Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { RoleDTO } from 'src/app/_models/role-dto';
import { RoleService } from 'src/app/_service/role.service';
import tippy from 'tippy.js';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  dtTrigger: Subject<any> = new Subject<any>();
  _obj: RoleDTO;
  _objRole: any[] = []
  RoleId: number;
  String_status: string;
  InActive: false;
  isShow: boolean;
  objRoleDTO: RoleDTO;
  roleformGroup: UntypedFormGroup;
  displayedColumns = ["Role", "Note", "Sharing Access", "actions", "action"]
  RoleNameMinLength: boolean;
  activePage: number;
  LastPage:number;
  NextPage:Boolean= false;
  TotalRecords: number;
  PageSize: number;
  RoleSearch:string = '';
  TotalrecordsList: any;
  _CurrentpageRecords: number;
  PageNumber:Number;
  _Search: string;
  lastPagerecords:number;
  currentLang:"ar"|"en"="ar";
  RoleSearchs:string;
  EnterRoleName:string;
  EnterDescription:string;
  constructor(public services: RoleService,
     private objFormBuilder: UntypedFormBuilder, 
     private dialog: MatDialog, 
     private _snackBar: MatSnackBar,
     private translate:TranslateService,
     private renderer: Renderer2,
     @Inject(DOCUMENT) private document: Document,
    ) {
    this._obj = new RoleDTO();
    this.objRoleDTO = new RoleDTO();
    this.objRoleDTO.RoleId = 0;
    this.isShow = false;
    this.PageSize = 10;
    this._Search = "";
    
    HeaderComponent.languageChanged.subscribe((lang) =>{
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.RoleSearchs = lang === 'en' ? 'Search' : 'يبحث';
      this.EnterRoleName = lang === 'en' ? 'Enter ProductsName' : 'أدخل اسم المنتجات';
     this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف';
     let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'The Shared Document Access Role Enables Users To Share Documents.';
    } else if (lang === 'ar') {
      tooltipContent = 'تمكن دور الوصول المشترك إلى المستندات المستخدمين من مشاركة المستندات.';
    }

    // Initialize Tippy.js with the tooltip content
    if (tooltipContent) {
      tippy('#SharedDocumentAccessRole', {
        content: tooltipContent,
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true
      });
    }
    })
  }
  dtOptions: any = {};
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang)
    this.currentLang = lang ? lang : 'en';
    this.RoleSearchs = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterRoleName = lang === 'en' ? 'Enter ProductsName' : 'أدخل اسم المنتجات';
    this.EnterDescription = lang === 'en' ? 'Enter Description' : 'أدخل الوصف'
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this._CurrentpageRecords = 0;
    this.activePage = 1;
    this.RoleNameMinLength = true;
    this.roleformGroup = this.objFormBuilder.group({
      'roleName': new UntypedFormControl('', [Validators.required]),
      'note': new UntypedFormControl,
      'status': new UntypedFormControl,
      'sharing': new UntypedFormControl
    })
    this.getRoleDetails();
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
      tooltipContent = 'The Shared Document Access Role Enables Users To Share Documents.';
    } else if (lang === 'ar') {
      tooltipContent = 'تمكن دور الوصول المشترك إلى المستندات المستخدمين من مشاركة المستندات.';
    }

    // Initialize Tippy.js with the tooltip content
    if (tooltipContent) {
      tippy('#SharedDocumentAccessRole', {
        content: tooltipContent,
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true
      });
    }
  }
  get f() {
    return this.roleformGroup.controls;
  }
  checkRoleNameExits() {
    this._obj.RoleName = (<HTMLInputElement>document.getElementById("txtrolename")).value;
    if (this._obj.RoleName.trim().length < 3) {
      this.RoleNameMinLength = false;
    } else {
      this.RoleNameMinLength = true;
    }
    this.services.checkrolename(this._obj).subscribe(data => {
      this._obj = data as RoleDTO
      if (this._obj.message != 1) {
        const language = localStorage.getItem('language');

        // Set translations based on language preference
        if (language === 'ar') {
          this._snackBar.open('اسم الدور يخرج بالفعل', 'تنتهي الآن', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition:'right',
            panelClass: ['red-snackbar']
          });
        } else {
          this._snackBar.open('Role Name Already Exits', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition:'right',
            panelClass: ['red-snackbar']
          });
        }
      
        this.services._obj.RoleName = '';
      }
    })
  }
  getRoleDetails() { //View Role
    this._obj.Search = this.RoleSearch;
    this._obj.PageSize = this.PageSize;
    this._obj.PageNumber = this.activePage;
    this.services.getrolelist(this._obj).subscribe(data => {
      this._objRole = data as [];
      this._obj = new RoleDTO();
      this.TotalrecordsList = data as  [];
      this.TotalRecords = this._objRole[0].TotalRecords;
      this._CurrentpageRecords = this._objRole.length;
      if(this.activePage == this.LastPage){
        this.lastPagerecords=10;
      } 
     console.log(this.lastPagerecords)
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
    this.getRoleDetails();
   
  }
  Search() {
    var newValue = (<HTMLInputElement>document.getElementById("txtMainSearch")).value;
    this._Search = newValue;
    this.activePage = 1;
    this.getRoleDetails();
  }
  
  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.RoleSearch) {
      this.getRoleDetails();
    }
  }


  ReBindData() {
    this.RoleSearch = "";
    this.getRoleDetails();
  }
  UpdateStatus(Obj_Status: RoleDTO) {
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
        this.services.updaterolestatus(Obj_Status).subscribe(data => {
        });
      }
    });
  }
  
  OnCreate() {
    try {
      if (this.roleformGroup.invalid) {
        return;
      }
      this._obj.RoleId = this.RoleId;
      
      this._obj.RoleName = this.roleformGroup.get('roleName').value;
      this._obj.Description = this.roleformGroup.get('note').value;
      if (this._obj.Description == null) {
        this._obj.Description = "";
      }
      this._obj.Sharing = this.roleformGroup.get('sharing').value;
      if (this.roleformGroup.get('status').value == undefined) {
        this._obj.IsActive = false;
      }
      else {
        this._obj.IsActive = this.roleformGroup.get('status').value;
      }
      if (this._obj.RoleId == undefined || this._obj.RoleId == 0) {
        this._obj.FlagId = 1;
      } else if (this._obj.RoleId != 0) {
        this._obj.FlagId = 2;
      }
      this.services.insertroledetails(this._obj).subscribe(
        data => {
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
           
            this.getRoleDetails();
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
            this.getRoleDetails();
          }
          // document.getElementById("addrck").style.display = "none";
          // document.getElementById("role_add").style.display = "block";
          document.getElementById("addrck").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
      
          this.roleformGroup.reset();
          this.RoleId = 0;
        }
      );
    } catch (error) {
      alert(error)
    }
    this.isShow = false;
  }
  role_add() {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("role_add").style.display = "none";
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }
   this.isShow = false;
  }
  role_edit(R1: RoleDTO) {
    // document.getElementById("addrck").style.display = "block";
    // document.getElementById("role_add").style.display = "none";
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Edit";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Edit");
    }
    this.objRoleDTO.RoleId = R1.RoleId;
    this.RoleId = R1.RoleId;
    this.services._obj.RoleName = R1.RoleName;
    this.services._obj.Description = R1.Description;
    this.services._obj.Sharing = R1.Sharing;
    this.services._obj.IsActive = R1.IsActive;
    this.isShow = true
  }
  role_cl() {
    // document.getElementById("addrck").style.display = "none";
    // document.getElementById("role_add").style.display = "block";
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    this.roleformGroup.reset()
    this.RoleId = 0;
    this.isShow = false
  }
  
  closeInfo() {
    this.roleformGroup.reset();
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("company_add").style.display = "block";

  }

}
