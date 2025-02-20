import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RacksDTO } from 'src/app/_models/racks-dto';
import { RacksService } from 'src/app/_service/racks.service';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { Subject } from 'rxjs';
import tippy from 'node_modules/tippy.js';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
// import 'node_modules/tippy.js/dist/tippy.css';

@Component({
  selector: 'app-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.css']
})


export class RacksComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  _obj: RacksDTO
  WareHouseId: any
  ObjracksList: any;
  RackSearch:string
  ObjracksList1: RacksDTO[];
  BlockId: Number
  Objracks_data: any[] = []
  objracks_DTO: RacksDTO
  selectedItemList = [];
  selectedItem_List2 = [];
  selectedSourceValue:Number;
  objracksDTO: RacksDTO
  MinracksLength:boolean;
  index: any;
  isShow: boolean;
  String_status: string;
  InActive: false;
  p: number = 1;
  blockssdrp:any
  submitted: boolean;
  RName: string;
  rows: Number;
  col: Number;
  note: string;
  status: boolean;
  ObjBlocks:RacksDTO;
  TopRackSearch:string;
  EnterRackName:string;
  EnterNote:string;
  currentLang:"ar"|"en"="ar";
  WarehouseSelect:string;
  BlockSelect:string;
  constructor(public service: RacksService,
     private dialog: MatDialog,
      private _snackBar: MatSnackBar,
    private translate:TranslateService,
private renderer: Renderer2,
@Inject(DOCUMENT) private document: Document,
    ) {
    this.ObjracksList = [];
    this._obj = new RacksDTO();
    this.objracks_DTO = new RacksDTO();
this.blockssdrp=[]
    this.selectedSourceValue = 0;
    this.objracksDTO = new RacksDTO();
    this._obj.IsActive = true;
  HeaderComponent.languageChanged.subscribe((lang) =>{
    localStorage.setItem('language', lang);
    this.translate.use(lang);
    this.TopRackSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterRackName = lang === 'en' ? 'Enter Rack Name' : 'أدخل اسم الرف';
    this.EnterNote = lang === 'en' ? 'Enter Note' : 'أدخل ملاحظة';
    this.currentLang = lang ? lang : 'en';
    this.WarehouseSelect  = lang === 'en' ? 'Select' : 'يختار';
    this.BlockSelect = lang === 'en' ? 'Select' : 'يختار';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Rack Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم الرف';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterRack', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
   
    let tooltipContents = '';
    if (lang === 'en') {
      tooltipContents = 'Row Count';
    } else if (lang === 'ar') {
      tooltipContents = 'عدد الصفوف';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#RowCount', {
      content: tooltipContents,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

    if (lang === 'en') {
      this.ColumnCount = 'Column Count';
    } else if (lang === 'ar') {
      this.ColumnCount = 'عدد الأعمدة';
    }else{
      this.ColumnCount = 'Column Count';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    
    const tooltipInstancesFilters = tippy('.ColumnCount');
    tooltipInstancesFilters.forEach(instance => {
      instance.setContent(this.ColumnCount);
    });
    tippy('#ColumnCount', {
      // content: tooltipContentC,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
  })
  }
  dtOptions: any = {};
  ColumnCount:string;
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang)
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.TopRackSearch = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterRackName = lang === 'en' ? 'Enter Rack Name' : 'أدخل اسم الرف';
    this.EnterNote = lang === 'en' ? 'Enter Note' : 'أدخل ملاحظة';
    this.currentLang = lang ? lang : 'en';
    this.WarehouseSelect  = lang === 'en' ? 'Select' : 'يختار';
    this.BlockSelect = lang === 'en' ? 'Select' : 'يختار';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.service.GetwarehouseData();
    this.MinracksLength=true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    this.OnBlockslist(this.selectedSourceValue);
     
    (<HTMLInputElement>document.getElementById("rack_add")).style.display="none";

    
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Rack Name';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل اسم الرف';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#EnterRack', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    let tooltipContents = '';
    if (lang === 'en') {
      tooltipContents = 'Row Count';
    } else if (lang === 'ar') {
      tooltipContents = 'عدد الصفوف';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#RowCount', {
      content: tooltipContents,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

   
    if (lang === 'en') {
      this.ColumnCount = 'Column Count';
    } else if (lang === 'ar') {
      this.ColumnCount = 'عدد الأعمدة';
    }else{
      this.ColumnCount = 'Column Count';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    
    const tooltipInstancesFilters = tippy('.ColumnCount');
    tooltipInstancesFilters.forEach(instance => {
      instance.setContent(this.ColumnCount);
    });
    tippy('#ColumnCount', {
      // content: tooltipContentC,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
  }
  SearchIconClear(){
    this.RackSearch = "";
    this.OnBlockslist(this.selectedSourceValue);
  }
  
  rack_add() {
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.Add");
    }

  }
  rack_edit(R1: RacksDTO) {
    document.getElementById("addrck").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Edit Rack";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Masterform.EditRack");
    }

    this.objracksDTO.RackId = R1.RackId;
    this.RName = R1.RackName;
    this.rows = R1.Rows;
    this.col = R1.Columns;
    this.note = R1.Description;
    this.status = R1.IsActive;
 
    this.isShow = true;
  }
  rack_cl() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    
    this.objracksDTO.RackId = 0
    this.RName = "";
      this.rows = null;
      this.col = null;
      this.note = "";
      this.status = false;
  }

  OnBlocks(WareHouseId) {
    this._obj.WareHouseId = WareHouseId
    this.service.GetBlocks(this._obj)
      .subscribe(data => {
        this._obj = data as RacksDTO
        this.blockssdrp=this._obj
        this.ObjracksList1 =this.blockssdrp.filter(word => word.IsActive == true)
        console.log( this.ObjracksList1)
      });
  }
  OnBlockslist(BlockId: Number) {
    this.selectedSourceValue = BlockId;
    this._obj.BlockId = BlockId;
    this.BlockId = BlockId;
    this.service.Getblockslist(this._obj).subscribe(data => {
      //this.dtTrigger.next()
      this.Objracks_data = data as [];
    })
    this.selectedItemList = [];
    this.selectedItem_List2 = [];
    (<HTMLInputElement>document.getElementById("rack_add")).style.display="block";
  }
  OnCreate() {
  
    try {
      if(this.note == undefined){
        this.note="";
      }
      this.objracksDTO.BlockId = this.BlockId;
      this.objracksDTO.RackName = this.RName
      this.objracksDTO.Rows = this.rows
      this.objracksDTO.Columns = this.col
      this.objracksDTO.Description = this.note
      if (this.status == undefined) {
        this.objracksDTO.IsActive = false;
      }
      else{
        this.objracksDTO.IsActive = this.status;
      }
      if (this.objracksDTO.RackId == undefined || this.objracksDTO.RackId == 0) {
        this.objracksDTO.flagid = 1;
      } else if (this.objracksDTO.RackId != 0) {
        this.objracksDTO.flagid = 2;
      }
      this.service.GetinsertupdateRacks(this.objracksDTO).subscribe(
        data => {
          if (data["message"] == "1") {
            this._snackBar.open('Added Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
            this.OnBlockslist(this.selectedSourceValue);
            this.rack_cl();
          }
          else if (data["message"] == "2") {

            this._snackBar.open('Updated Successfully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition:'right',
            });
            this.OnBlockslist(this.selectedSourceValue);
          }
          this.rack_cl();
          this.isShow = false;
        }
      );
    } catch (error) {
      alert(error)
    }
  }
  onReset() {
      (<HTMLInputElement>document.getElementById("addrck")).style.display="none";
      (<HTMLInputElement>document.getElementById("rack_add")).style.display="block";
  }
  UpdateStatus(Obj_Status: RacksDTO) {
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


  TriggerLengthValidationrack() {
    if (this.RName.trim().length <3) {
      //true
      this.MinracksLength=false;
    }
    else{
      //false
      this.MinracksLength=true;
    }
  }
  keyrow(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keycolumns(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  closeInfo() {
    document.getElementById("addrck").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    this.rack_cl();
  }
  

}




