import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MovedocumentwarehouseDTO } from 'src/app/_models/movedocumentwarehouse-dto';
import { UserDTO } from 'src/app/_models/user-dto';
import { MovedocumenttowarehouseService } from 'src/app/_service/movedocumenttowarehouse.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';


declare var $: any;

@Component({
  selector: 'app-documentwarehouse',
  templateUrl: './documentwarehouse.component.html',
  styleUrls: ['./documentwarehouse.component.css']
})

export class DocumentwarehouseComponent implements OnInit {
  Objwarehousedrp: MovedocumentwarehouseDTO[]
  objcapacityDTO: MovedocumentwarehouseDTO
  obj: MovedocumentwarehouseDTO;
  _obj: MovedocumentwarehouseDTO
  WareHouseId: any
  blockssdrp: any
  ShelveName: string
  Rows: Number
  Columns: Number
  selectedItem_List2 = [];
  DocumentCount: Number
  result: any;

  ShelvesJson: string;
  ObjBlocksdrp: MovedocumentwarehouseDTO[];
  ObjRacksdrp: MovedocumentwarehouseDTO[];
  objshelvesdata: MovedocumentwarehouseDTO[];
  Objshelves: MovedocumentwarehouseDTO;
  objmovedata: MovedocumentwarehouseDTO;
  blocklist: MovedocumentwarehouseDTO[];
  Rackslist: MovedocumentwarehouseDTO[];
  shelveslist: MovedocumentwarehouseDTO[];
  shelvescapacitylist: MovedocumentwarehouseDTO[];
  objDocumentName: any;
  JsonString_List: string;
  BlockId: any;
  ShelveId: any;
  color: string = 'blue';
  array: [];
  filter: any;
  RackId: any;
  RackName: any;
  lastClickedIndex: any
  searchText: string;
  objshelvesview: any
  check: boolean = false;
  objCompanyName: any;
  objDocumentTypeName: any;
  objDimension: any;
  objContactUserName: any;
  objDocumentId: any;
  objBarcode: any;
  DocumentId: any;
  DocumentName: any;
  CompanyName: any;
  DocumentTypeName: any;
  Dimension: any;
  ContactUserName: any;
  objshelve: MovedocumentwarehouseDTO;
  selectedItemList = [];
  ObjList: any[];
  _documentTypeLst: any;
  Barcode: string;
  _JsonArray: any;
  shelvearray: any;
  Shelves: string;
  Filterbyname:string
  currentLang:"ar"|"en"="ar";

  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  constructor(public service: MovedocumenttowarehouseService,
    private translate: TranslateService,
  private renderer: Renderer2,
  @Inject(DOCUMENT) private document: Document,
  ) {
    this.obj = new MovedocumentwarehouseDTO();
    this.objcapacityDTO = new MovedocumentwarehouseDTO();
    this._obj = new MovedocumentwarehouseDTO();
    this.objshelve = new MovedocumentwarehouseDTO();
    this.blockssdrp = [];
    this.objshelvesview = [];
    this._JsonArray = [];
    this.shelvearray = [];
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.Filterbyname = lang === 'en' ? 'Filter by name' : 'تصفية حسب الاسم';
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    })

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
    this.Filterbyname = lang === 'en' ? 'Filter by name' : 'تصفية حسب الاسم';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.GetWarehouseBlockRackShelve();
    this.onshelve();
  }
  GetWarehouseBlockRackShelve() {
    this.service.GetWarehouseBlockRackShelveJson().subscribe(
      (data) => {
        this._obj = data as MovedocumentwarehouseDTO;
        this.Objwarehousedrp = this._obj.Data["WarehouseJson"];
        this.blocklist = this._obj.Data["BlockJson"];
        this.Rackslist = this._obj.Data["RackJson"];
        this.shelveslist = this._obj.Data["ShelveJson"];
      });
  }
  // warehousedata() {
  //   this.service.GetwarehouseData().subscribe(
  //     (data) => {
  //       // this.Objwarehousedrp = data as [];

  //       // this.blockssdrp = this.Objwarehousedrp
  //       // this.result = this.blockssdrp.filter(word => word.IsActive == true)
  //       // console.log(this.blockssdrp, 'warehouselist')
  //     });
  // }

  // Onwarehousechange(WareHouseId) {
  //   this.WareHouseId = WareHouseId;
  //   // this._obj.WareHouseId = WareHouseId;
  //   // this.service.GetBlocks(this._obj)
  //   //   .subscribe(data => {

  //   //     this.ObjBlocksdrp = data as [];
  //   //     this.blocklist = this.ObjBlocksdrp.filter(word => word.IsActive == true)
  //   //     // console.log(this.blocklist, "Blocklist")
  //   //   });
  // }
  // OnBlockschange(BlockId) {

  //   this._obj.BlockId = BlockId;
  //   this.BlockId = BlockId;
  //   // this._obj.ShelveId = this.ShelveId
  //   // this.service.GetRacks(this._obj)
  //   //   .subscribe(data => {
  //   //     // console.log(data,"check123")
  //   //     this.ObjRacksdrp = data as [];
  //   //     this.Rackslist = this.ObjRacksdrp.filter(word => word.IsActive == true)
  //   //     // console.log(this.Rackslist, "Racklist")
  //   //   });
  // }

  // shelvesdata(RackId) {
  //   this._obj.RackId = RackId;
  //   this.RackId = RackId;
  //   // this.service.Getshelves(this._obj)
  //   //   .subscribe(data => {
  //   //     this.shelveslist = data as [];
  //   //     // console.log(this.shelveslist, "shelves")
  //   //   });
  // }
  onshelve() {
    this.service.Getshelvesdata(this._obj)
      .subscribe(data => {
        this.Objshelves = data as MovedocumentwarehouseDTO;
        this.objshelvesview = this.Objshelves.Data['PhysicalDocuments'];
        this.selectedItemList = [];
      });
  }
  GetShelveId(ShelveId, RackId, ShelveName) {
    $('.treeview__level').removeClass('selctd_shelve')
    $('#shelve_div_' + ShelveId + RackId).addClass('selctd_shelve')
    this.ShelveId = ShelveId;
    this.ShelveName = ShelveName;
  }

  Movewarehouse() {
    let shelvesarray = [];
    this.selectedItemList.forEach(element => {
      let barcode = "";
      if (element.Barcode == null) {
        barcode = "00000000-0000-0000-0000-000000000000";
      }
      else {
        barcode = element.Barcode;
      }
      let _value = barcode + "," + element.DocumentId
      shelvesarray.push(_value);
    });
    console.log(JSON.stringify(shelvesarray))

    this._obj.DocumentIds = shelvesarray;
    this._obj.ShelveId = this.ShelveId;

    this.service.DocumentMoveToWarehouse(this._obj)
      .subscribe(data => {
        this._obj = data as MovedocumentwarehouseDTO
        this.onshelve();
      });

  }

  bindblock(val) {
    $('.blocksdiv').css('display', 'none');
    //this.Onwarehousechange(val);
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
    //this.OnBlockschange(val);
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
    //this.shelvesdata(val);
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
}