import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ShelvesDTO } from 'src/app/_models/shelves-dto';
import { UserDTO } from 'src/app/_models/user-dto';
import { ShelvesService } from 'src/app/_service/shelves.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-shelves',
  templateUrl: './shelves.component.html',
  styleUrls: ['./shelves.component.css']
})
export class ShelvesComponent implements OnInit {
  ObjshelvesList: any;
  objshelvesDTO: ShelvesDTO;
  _obj: ShelvesDTO
  ObjBlocksdrp: ShelvesDTO[]
  ObjRacksdrp: ShelvesDTO[]
  WareHouseId: any
  BlockId: any
  RackId: any;
  checked = true;
  selectedSourceValue: any;
  selectedItemList = [];
  selectedItem_List2 = [];
  _shelves: any
  shelvesdiv: number;
  _rows: number;
  _columns: number;
  Rows: number;
  Columns: number;
  MyTable: number;
  namechk: boolean;
  Warehouse: ShelvesDTO[]
  Block: ShelvesDTO[]
  Rack: ShelvesDTO[]
  Shelves: ShelvesDTO
  Lastwarehouse: any
  WareHouseName: string;
  stringJson: any;
  selected: any = [];
  Ramesh: any;
  parsed: any
  array: []
  groupList: any = [];
  _obj1: ShelvesDTO
  _shelveslist: ShelvesDTO
  ShelveJson = ShelvesDTO
  
  courseList = [
    {
      organizationid: "1015",
      CreatedBy: "31",
      RoleId: "501",
      createdby: "number",
      WareHouseId: "7",
      WareHouseName: "sir",
      BlockName: "Ramesh",
      RackName: "mateen",
      BlockId: "0",
      Rows: "0",
      Columns: "0",
      ShelveId: "0",
      RackId: "0",

      ObjRacksdrp: [
        {
          WareHouseName: "",
          BlockName: "",
          RackName: "",
          ShelveName: "",
          ShelveId: "",
          Rows: "",
          Columns: "",
          RoleId: "",

        }
      ]

    },

  ];
  _JsonArray: any
  jsonObj: string;
  ShelveName: string;
  Row: number;
  Col: number;
  IsFull: number;

  _LstCategory: ShelvesDTO[]
  shelvesarray: any;
  _arrayjson: any[];
  shelvearray: any;
  ShelvesJson: string;
  ShelveId: string;
  warehouse: string;
  Blocks: string;
  Racks: string;
  blockssdrp:any
  racksdrp:any
  currentLang:"ar"|"en"="ar";
  WarehouseSelect:string;
  BlockSelect:string;
  RackSelect:string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  // shelvearray: string;

  constructor(public service: ShelvesService,
    private translate: TranslateService,
     private _snackBar: MatSnackBar
    , private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.ObjshelvesList = [];
    this.objshelvesDTO = new ShelvesDTO();
    this._obj = new ShelvesDTO();
    this.selectedSourceValue = 0;
    this.blockssdrp=[]
    this.racksdrp=[]
    //this._rows=6;
    this._JsonArray = [];
    this.shelvearray = [];

    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.WarehouseSelect = lang === 'en' ? 'Select' : 'يختار';
    this.BlockSelect = lang === 'en' ? 'Select' : 'يختار';
    this.RackSelect  = lang === 'en' ? 'Select' : 'يختار';
    })
 

  }
  counter(i: number) {
    return new Array(i);
  }
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang)
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.WarehouseSelect = lang === 'en' ? 'Select' : 'يختار';
    this.BlockSelect = lang === 'en' ? 'Select' : 'يختار';
    this.RackSelect  = lang === 'en' ? 'Select' : 'يختار';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.service.GetwarehouseData();
    // alert(this.ObjRacksdrp.length);
    //this._rows=6;
    this._columns=0;
    (<HTMLInputElement>document.getElementById("shelvesdiv")).style.display = "none";
  }


  Onwarehousechange(WareHouseId) {
    this._obj.WareHouseId = WareHouseId;
    this.service.GetBlocks(this._obj)
      .subscribe(data => {
        // console.log(data)
        this.ObjBlocksdrp = data as [];
        this._obj = data as ShelvesDTO
        this.blockssdrp=this._obj
        this.ObjBlocksdrp =this.blockssdrp.filter(word => word.IsActive == true)
      });
  }
  OnBlockschange(BlockId) {

    this._obj.BlockId = BlockId;
   
    this.service.GetRacks(this._obj)
      .subscribe(data => {
        // this.ObjRacksdrp = data as [];
        this._obj = data as ShelvesDTO
        this.racksdrp=this._obj
        this.ObjRacksdrp =this.racksdrp.filter(word => word.IsActive == true)
       
      });
  }
  OnRackchange(RackId: number) {
    this.selectedSourceValue = RackId;
    this._obj.RackId = RackId
    this.ObjRacksdrp.forEach(element => {
      if (RackId == element.RackId) {
        this._rows = element.Rows;
        this._columns = element.Columns;
      }
    
    });
    (<HTMLInputElement>document.getElementById("shelvesdiv")).style.display = "block";
    //alert(this._rows)
    // alert(this._columns)

  }
  oncheckbox(e) {
 
    if (e.checked == true) {
      let _val = 1;
      for (let i = 1; i <= this._rows; i++) {
        for (let j = 1; j <= this._columns; j++) {
          let _id = i + "*" + j;
          (<HTMLInputElement>document.getElementById("shelve_" + _id)).value = "Shelve " + _val;
          _val = _val + 1;
        }
      }

    } else {
      let _val = 1;
      for (let i = 1; i <= this._rows; i++) {
        for (let j = 1; j <= this._columns; j++) {
          let _id = i + "*" + j;
          (<HTMLInputElement>document.getElementById("shelve_" + _id)).value = "No Name";
          _val = _val + 1;
        }

      }
    }
  
}
  jsondatatoarray() {

    this._JsonArray = [];
    let shelvesarray = [];
    let customObj = new ShelvesDTO();
    // customObj.WareHouseId = this._obj.WareHouseId;
    // customObj.BlockId = this._obj.BlockId;
    // customObj.RackId = this._obj.RackId;

    let _val = 1;
    for (let i = 1; i <= this._rows; i++) {
      for (let j = 1; j <= this._columns; j++) {
        let _id = i + "*" + j;
        (<HTMLInputElement>document.getElementById("shelve_" + _id)).value;
        _val = _val + 1;
        let shelveobj = new ShelvesDTO();
        shelveobj.ShelveId = _id;
        shelveobj.Row = i;
        shelveobj.Col = j;
        shelveobj.IsFull = 0;
        shelveobj.RackId = this.selectedSourceValue;
        shelveobj.CreatedBy = this.currentUserValue.createdby;
        shelveobj.ShelveName = (<HTMLInputElement>document.getElementById("shelve_" + _id)).value;
        shelvesarray.push(shelveobj);
      }
    }

    customObj.ShelvesJson = shelvesarray;
    this._JsonArray.push(customObj);
    //console.log(JSON.stringify(this._JsonArray));

    this.objshelvesDTO.ShelvesJson = JSON.stringify(this._JsonArray);

    this.objshelvesDTO.WareHouseName = this.warehouse
    this.objshelvesDTO.BlockName = this.Blocks
    this.objshelvesDTO.RackName = this.Racks

    this.service.onjsondata(this.objshelvesDTO)
      .subscribe(data => {
        
        this._obj = data as ShelvesDTO;

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
              horizontalPosition:'right',
          panelClass: ['red-snackbar']
        });
      }
      });
   this.Reset();
   (<HTMLInputElement>document.getElementById("shelvesdiv")).style.display = "none";
  }
  Reset() {
    this.warehouse = null;
    this.Blocks = null;
    this.Racks = null;
    (<HTMLInputElement>document.getElementById("shelvesdiv")).style.display = "none";
  }
}

