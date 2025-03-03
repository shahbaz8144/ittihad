import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../master-forms/confirmdialog/confirmdialog.component';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {

  CabinetName:string = "";
  Status:boolean = false;
  _Obj:GACFiledto;
  isShow: boolean;
  String_status: string;
  CabinetSerach:string = "";
  NewCabinetList:any[]=[];
  currentLang:"ar"|"en"="ar";
  Cabinet_search:string = "";
  Cabineterrormessage:boolean=false;
  Entercabinetname:string = "";
  CabinetNameArabic:string = "";
  constructor(public service: GACFileService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private translate:TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    this._Obj = new GACFiledto();
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.Cabinet_search = lang === 'en' ? 'Search...' : 'يبحث...';
    this.Entercabinetname = lang === 'en' ? 'Enter cabinet name' : 'أدخل اسم الخزانة'
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }

  

       })
   }

  ngOnInit(): void {
   this.CabinetList(); 
  }

 
  CabinetList(){
    this.service.CabinetListAPI().subscribe(data =>{
      this.NewCabinetList = data['Data']["CabinetListJSON"];
      console.log(this.NewCabinetList , "Cabinet List Array");
    })
  }


  AddCabinet(){
    if(this.CabinetName == ""){
 this.Cabineterrormessage=true;
    }
    else if(this.CabinetName != ""){
      this.Cabineterrormessage=false;
      if (this._Obj.CabinetId == undefined || this._Obj.CabinetId == 0) {
        this._Obj.FlagId = 1;
      } else if (this._Obj.CabinetId != 0) {
        this._Obj.FlagId = 2;
      }
      this._Obj.IsActive = this.Status;
      this._Obj.CabinetName = this.CabinetName;
      this._Obj.CabinetNameArabic = this.CabinetNameArabic;
      this.service.CabinetInsertAndUpdate(this._Obj).subscribe((data: any) => { 
        console.log(data, "Add Cabinet");
        if (data && data.message == '1') { 
           this._snackBar.open(('Added Successfully'), 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
           this.CabinetList();
           this.closeInfo();
        }else if(data && data.message == '2'){
          this._snackBar.open(('Updated Successfully'), 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition:'right',
          });
          this.CabinetList();
          this.closeInfo();
          this.isShow = false;
        }else if(data && data.message == '0'){
          alert("Same name already exists!");
          // this.SameNameClearfileds();
        }
     });
    } 
  }

  cabinet_add() {
    this.isShow = false;
    // document.getElementById("editrck").innerHTML = "Add Cabinet";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }
    document.getElementsByClassName("addrck")[0].classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }

  SameNameClearfileds(){
     this.CabinetName = "";
    this.Status = false;
  }

  closeInfo() {
    this._Obj = new GACFiledto();
    this.CabinetName = "";
    this.Status = false;
   document.getElementsByClassName("addrck")[0].classList.remove("kt-quick-panel--on");
   document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
   document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
 }

 EditCabinet(item){
  this.isShow = true;
  this._Obj.CabinetId = item.CabinetId;
  this.CabinetName = item.CabinetName;
  this.CabinetNameArabic = item.CabinietName_Ar;
  this.Status = item.Status;
  const element = document.getElementById("editrck");

  if (element) {
    // Set the inner HTML content based on the selected language
    element.innerHTML = this.translate.instant("Masterform.Edit");
  }
  document.getElementsByClassName("addrck")[0].classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
 }

 UpdateStatus(item) {
  this.String_status = item.Status ? "In-Active" : "Active";
  const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Confirm',
      message: this.String_status
    }
  });
  confirmDialog.afterClosed().subscribe(result => {
    if (result === true) {
      item.IsActive = !item.Status; 
      this._Obj.FlagId = 3;
      this._Obj.CabinetId = item.CabinetId;
      this._Obj.IsActive =  this.String_status === "Active" ? true : false;
      this._Obj.CabinetName = "";
      this.service.CabinetInsertAndUpdate(this._Obj).subscribe((data: any) => {
        console.log('Status updated successfully');
        this.CabinetList();
      });
    }
  });
}

ClearSearch(){
  this.CabinetSerach = "";
}
}
