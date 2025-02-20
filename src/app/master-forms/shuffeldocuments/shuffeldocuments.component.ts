import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ShuffeldocumentsDto } from 'src/app/_models/shuffeldocuments.dto';
import { ShelvescapacityService } from 'src/app/_service/shelvescapacity.service';
import { ShuffeldocumentsService } from 'src/app/_service/shuffeldocuments.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
declare var $: any;

@Component({
  selector: 'app-shuffeldocuments',
  templateUrl: './shuffeldocuments.component.html',
  styleUrls: ['./shuffeldocuments.component.css']
})
export class ShuffeldocumentsComponent implements OnInit {
  Objwarehouse:ShuffeldocumentsDto
  block:ShuffeldocumentsDto
  racks:ShuffeldocumentsDto
  shelves:ShuffeldocumentsDto
  ObjshelvesList: any;
  objshelvesDTO: ShuffeldocumentsDto;
  _obj: ShuffeldocumentsDto
  objshelvesview: any[] = []
  ObjBlocksdrp: ShuffeldocumentsDto[];
  ObjRacksdrp: ShuffeldocumentsDto[];
  Objshelvedrp: ShuffeldocumentsDto[];
  WareHouseId: any
  BlockId: any
  RackId: any;
  Objshelves: ShuffeldocumentsDto
  selectedSourceValue: Number;
  selectedItemList = [];
  selectedItem_List2 = [];
  _shelves: any
  shelvesdiv: Number;
  _rows: Number;
  _columns: Number;
  Rows: Number;
  Columns: Number;
  MyTable: Number;
  namechk: boolean;
  Warehouse: ShuffeldocumentsDto[]
  Block: ShuffeldocumentsDto[]
  Rack: ShuffeldocumentsDto[]
  Shelves: ShuffeldocumentsDto
  Lastwarehouse: any
  WareHouseName: string;
  stringJson: any;
  selected: any = [];
  Ramesh: any;
  parsed: any
  array: Number
  groupList: any = [];
  _obj1: ShuffeldocumentsDto
  ShelveName: string;
  Row: Number;
  Col: Number;
  IsFull: Number;
  _LstCategory: ShuffeldocumentsDto[]
  shelvesarray: any;
  _arrayjson: any[];
  shelvearray: any;
  ShelvesJson: string;
  ShelveId: string;
  warehouse: string;
  Blocks: string;
  Racks: string;
  blockssdrp: any
  racksdrp: any
  check: any;
  DocumentIds: Number;
  DocumentId: any;
  ShelveIds: any;
  searchText:string;
  currentLang:"ar"|"en"="ar";
  Filterbyname:string;
  WarehouseSelect:string;
  BlockSelect:string;
  RackSelect:string;
  ShelveSelect:string;
  Objwarehousedrp: ShuffeldocumentsDto[];
  constructor(public service: ShuffeldocumentsService,
    private translate:TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.Filterbyname = lang === 'en' ? 'Filter by name...' : 'تصفية بالاسم...';
    this.WarehouseSelect = lang === 'en' ? 'Select' : 'يختار';
   this.BlockSelect = lang === 'en' ? 'Select' : 'يختار';
 this.RackSelect = lang === 'en' ? 'Select' : 'يختار';
 this.ShelveSelect = lang === 'en' ? 'Select' : 'يختار';
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    })
    this.ObjshelvesList = [];
    this.objshelvesDTO = new ShuffeldocumentsDto();
    this._obj = new ShuffeldocumentsDto();
    this.selectedSourceValue = 0;
    this.blockssdrp = []
    this.racksdrp = []
    //this._rows=6;


  }

  ngOnInit(): void {
    
 const lang:any = localStorage.getItem('language');
    this.translate.use(lang)
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.Filterbyname = lang === 'en' ? 'Filter by name...' : 'تصفية بالاسم...';
    this.WarehouseSelect = lang === 'en' ? 'Select' : 'يختار';
   this.BlockSelect = lang === 'en' ? 'Select' : 'يختار';
 this.RackSelect = lang === 'en' ? 'Select' : 'يختار';
 this.ShelveSelect = lang === 'en' ? 'Select' : 'يختار';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.GetWarehouseBlockRackShelve();
    this.OnWarehouse();
    // this.shelveslist(this.ShelveId);
    // $('.treeview__level').dblclick(function() {
    //   $('ul', $(this).parent()).eq(0).toggle();
    // });
    // (<HTMLInputElement>document.getElementById("list")).style.display = "block";

  }
  OnWarehouse() {
    this.service.GetwarehouseData().subscribe(data => {
      this.Objwarehousedrp = data as [];
      // console.log(this.Objwarehousedrp, "Warehouse Data");
    })

  }
  GetWarehouseBlockRackShelve() {
    this.service.GetWarehouseBlockRackShelveJson().subscribe(
      (data) => {
        this._obj = data as ShuffeldocumentsDto;
        this.Objwarehouse = this._obj.Data["WarehouseJson"];
        this.block = this._obj.Data["BlockJson"];
        this.racks = this._obj.Data["RackJson"];
        this.shelves = this._obj.Data["ShelveJson"];
      });
  }
  OnBlocks(WareHouseId) {
    this._obj.WareHouseId = WareHouseId;
    this.service.GetBlocks(this._obj)
      .subscribe(data => {
        // console.log(data)
        this.ObjBlocksdrp = data as [];
        this._obj = data as ShuffeldocumentsDto
        this.blockssdrp = this._obj
        this.ObjBlocksdrp = this.blockssdrp.filter(word => word.IsActive == true)
      });
  }
  OnRacks(BlockId) {

    this._obj.BlockId = BlockId;

    this.service.GetRacks(this._obj)
      .subscribe(data => {
        this.ObjRacksdrp = data as [];
        this._obj = data as ShuffeldocumentsDto
        this.racksdrp = this._obj
        this.ObjRacksdrp = this.racksdrp.filter(word => word.IsActive == true)
        // console.log(this.ObjBlocksdrp,"test1066")
      });
  }
  Onshelves(RackId) {
    this._obj.RackId = RackId;
    this.service.Getshelves(this._obj)
      .subscribe(data => {
        this.Objshelvedrp = data as [];
        // this._obj = data as ShuffeldocumentsDto
      });
  }
  shelveslist(ShelveId) {

    this.selectedSourceValue = ShelveId;
    this._obj.ShelveId = ShelveId;
    this.ShelveId = ShelveId;
    this.service.Getlist(this._obj).subscribe(data => {
      this.Objshelves = data as ShuffeldocumentsDto;
      this.objshelvesview = this.Objshelves.Data['ShelveDocuments']

    })
    this.selectedItemList = [];
    this.selectedItem_List2 = [];
  }


  GetShelveId(ShelveId,RackId,ShelveName) {
   
    $('.treeview__level').removeClass('selctd_shelve')
    $('#shelve_div_'+ShelveId+RackId).addClass('selctd_shelve')
    this.ShelveId = ShelveId;
    this.ShelveName = ShelveName;
  }

  Movetowarehouse() {
    
    let shelvesarray = [];
    this.selectedItemList.forEach(element => {

      let array = "";
      if (element.DocumentId == null) {
        array = this.DocumentId
      }
      let _value = array + "" + element.DocumentId
      shelvesarray.push(_value);
    });
    console.log(JSON.stringify(shelvesarray))
    this._obj.DocumentIds = shelvesarray;
    this._obj.ShelveId = this.ShelveId
    this.service.GetmoveDocuments(this._obj)
      .subscribe(data => {
        this._obj = data as ShuffeldocumentsDto
        this.shelveslist(this.selectedSourceValue);
        this.check=false;
      });
    
  }

  bindblock(val) {

    $('.blocksdiv').css('display', 'none');
    this.OnBlocks(val);
    var _value = (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value = "1";
    } else {
      (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value = "0";
    }
    $('#blockdiv_' + val).toggle();
  }

  bindRacks(val) {

    $('.racksdiv').css('display', 'none');
    this.OnRacks(val);
    var _value = (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value = "1";
    } else {
      (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value = "0";
    }
    $('#rackdiv_' + val).toggle();
  }
  bindshelves(val) {

    $('.shelvediv').css('display', 'none');
    this.Onshelves(val);
    var _value = (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value = "1";
    } else {
      (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value = "0";
    }
    $('#shelvesdiv_' + val).toggle();
  }
  checkbox() {

    for (let value of Object.values(this.objshelvesview)) {
      value['checked'] = this.check;
    }
    this.selectedItemList = this.objshelvesview.filter((value, index) => {
      return value['checked'] == true;
    });
  }
  oncheckbox() {

    this.selectedItemList = this.objshelvesview.filter((value, index) => {
      return value.checked == true;
    })
  }


  // for (let i = 1; i <= this._rows; i++) {
  // }

}