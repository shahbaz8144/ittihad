//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlocksDTO } from 'src/app/_models/blocks-dto';
import { BlocksService } from 'src/app/_service/blocks.service';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { Subject } from 'rxjs';

import tippy from 'node_modules/tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
type AOA = any[][];
@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements OnInit {
 

 
  // time = new Date();
  // rxTime = new Date();
  // intervalId;
  // subscription: Subscription;
 

 

  name = 'This is XLSX TO JSON CONVERTER';
  willDownload = false;

  data: AOA = [[], []];
  //wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';


  dtTrigger: Subject<any> = new Subject<any>();
  objblocks_DTO: BlocksDTO
  _obj: BlocksDTO;
  Objblocks_data: any[] = []
  f_firstPanel = false;
  S_SecondPanel = true;
  objBlocksDTO: BlocksDTO;
  plus_btn = false;
  Blocks = '';
  MinblocksLength: boolean;
  Note = '';
  f2: any;
  index: any;
  isShow: boolean;
  String_status: string;
  BlockName = "";
  BlockSearch:string
  Active = true;
  InActive = false;
  p: number = 1;
  selectedSourceValue: number
  BtnSubmit_TextChange: string;
  selectedItemList = [];
  selectedItem_List2 = [];
  WareHouseId: Number;
  submitted: boolean;
  BName: string;
  note: string;
  IsActive: boolean;
  status: any;
  BlockId: number;
  activePage: number;
  LastPage:number;
  NextPage:Boolean= false;
  TotalRecords: number;
  PageSize: number;
  EnterBlockName:string;
  EnterNote:string;
  currentLang:"ar"|"en"="ar";
  SelectWarehouse:string;
  BlockSearchs:string;
  constructor(public service: BlocksService, private dialog: MatDialog, 
    private _snackBar: MatSnackBar,
    private translate:TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  
  ) {
    this.objblocks_DTO = new BlocksDTO();
    this._obj = new BlocksDTO();
    this.objBlocksDTO = new BlocksDTO();
    this.objBlocksDTO.BlockId = 0;
    this.objblocks_DTO = new BlocksDTO;
    this.selectedSourceValue = 0;
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.EnterBlockName = lang === 'en' ? 'Enter Block Name' : 'أدخل اسم الكتلة';
      this.EnterNote = lang === 'en' ? 'Enter Note' : 'أدخل ملاحظة';
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.SelectWarehouse = lang === 'en' ? 'Select' : 'يختار';
      this.BlockSearchs = lang === 'en' ? 'Search' : 'يبحث';
      let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Block Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم البلوك';
    }
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#myButton', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    })
  }
  dtOptions: any = {}
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang)
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.SelectWarehouse = lang === 'en' ? 'Select' : 'يختار';
    this.EnterBlockName = lang === 'en' ? 'Enter Block Name' : 'أدخل اسم الكتلة';
    this.EnterNote = lang === 'en' ? 'Enter Note' : 'أدخل ملاحظة';
    this.BlockSearchs = lang === 'en' ? 'Search' : 'يبحث';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
   
    this.activePage = 1;
    this.OnBlocksChange(this.selectedSourceValue);
    this.MinblocksLength = true;
    this.service.GetblocksData();

    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    (<HTMLInputElement>document.getElementById("block_add")).style.display = "none";
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Block Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم البلوك';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#myButton', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

  }
  // ngOnDestroy() {
  //   clearInterval(this.intervalId);
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }
  serachIconClear(){
    this.BlockSearch="";
    this.OnBlocksChange(this.selectedSourceValue);
  }
  OnBlocksChange(WareHouseId: number) {
    this.selectedSourceValue = WareHouseId;
    this._obj.WareHouseId = WareHouseId;
    this.WareHouseId = WareHouseId;
    this.service.Getrackslist(this._obj).subscribe(data => {
      //this.dtTrigger.next()
      this.Objblocks_data = data as [];
    })
    this.selectedItemList = [];
    this.selectedItem_List2 = [];
    (<HTMLInputElement>document.getElementById("block_add")).style.display = "block";
  }
  onClickPage(pageNumber: number) {
    this.activePage = pageNumber;
    this.LastPage = (this.TotalRecords/this.PageSize)
   if(this.activePage == 1){
     this.NextPage = false;
    } else{
    this.NextPage = true;
    }
    // this.GetUserList();
   
  }
  OnCreate() {
  
    try {
      if (this.note == undefined) {
        this.note = "";
      }

      this.objBlocksDTO.WareHouseId = this.WareHouseId;
      this.objBlocksDTO.BlockName = this.BName
      this.objBlocksDTO.Description = this.note

      if (this.status == undefined) {
        this.objBlocksDTO.IsActive = false;
      }
      else {
        this.objBlocksDTO.IsActive = this.status;
      }

      if (this.objBlocksDTO.BlockId == undefined || this.objBlocksDTO.BlockId == 0) {
        this.objBlocksDTO.FlagId = 1;
      } else if (this.objBlocksDTO.BlockId != 0) {
        this.objBlocksDTO.FlagId = 2;
      }
      this.service.Getinsertupdatbolck(this.objBlocksDTO).subscribe(
        data => {

          if (data["message"] == "1") {
            this._snackBar.open('Added Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
            this.OnBlocksChange(this.selectedSourceValue);
            this.onRest();
          }
          else if (data["message"] == "2") {

            this._snackBar.open('Updated Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
            this.OnBlocksChange(this.selectedSourceValue);
          }
          this.onRest();
          this.isShow = false;
        }
      );
    } catch (error) {
      alert(error)
    }
  }
  onRest() {
    this.objBlocksDTO.BlockId=0
    this.BName = "";
    this.note = "";
    this.status = false;
    this.isShow = false;
    document.getElementById("kt_wrapper122").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  blockad_fun() {
    document.getElementById("kt_wrapper122").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");

    
    // document.getElementById("editrck").innerHTML = "Add";

    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }


  }
  populateForm(f2: BlocksDTO) {

    this.objBlocksDTO.BlockId = f2.BlockId;
    this.BName = f2.BlockName;
    this.note = f2.Description
    this.status = f2.IsActive
    this.isShow = true;
    // (<HTMLInputElement>document.getElementById("editrck")).innerHTML = "Edit Block";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.EditBlock");
    }

    document.getElementById("kt_wrapper122").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }

  UpdateStatus(Obj_Status: BlocksDTO) {

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
        this.service.UpDatedialog_Status(Obj_Status);
      }
    });

  }
  TriggerLengthValidation() {
    if (this.BName.trim().length < 3) {
      //true
      this.MinblocksLength = false;
    }
    else {
      //false
      this.MinblocksLength = true;
    }
  }
  
  closeInfo() {
    document.getElementById("kt_wrapper122").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
 this.onRest();
  }
 



  // getRandomColor() {
  //   var letters = '0123456789ABCDEF';
  //   var color = '#';
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }
  
  
  
  //  setRandomColor() {
  //   $("#colorpad").css("background-color", this.getRandomColor());
  // }



}



