import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ShelvescapacityDTO } from 'src/app/_models/shelvescapacity-dto';
import { ShelvescapacityService } from 'src/app/_service/shelvescapacity.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
declare var $: any;
@Component({
  selector: 'app-shelves-capacity',
  templateUrl: './shelves-capacity.component.html',
  styleUrls: ['./shelves-capacity.component.css']
})
export class ShelvesCapacityComponent implements OnInit {
  // Objshelvescapacity_data:any[]=[]
  Objwarehousedrp: ShelvescapacityDTO[]
  objcapacityDTO: ShelvescapacityDTO
  obj: ShelvescapacityDTO;
  _obj: ShelvescapacityDTO
  WareHouseId: any
  blockssdrp: any
  searchText:string
  ShelveName:string
  Rows:Number
  Columns:Number
  isShow: boolean;
  DocumentCount:Number
  result: any;
  ObjBlocksdrp: ShelvescapacityDTO[]
  ObjRacksdrp:ShelvescapacityDTO[];
  objshelvesdata:ShelvescapacityDTO[];
  blocklist: ShelvescapacityDTO[];
  Rackslist:ShelvescapacityDTO[];
  shelvescapacitylist:ShelvescapacityDTO[]
  BlockId: any;
  ShelveId: any;
  RackId: any;
  RackName: string;
  currentLang:"ar"|"en"="ar";
  Filterbyname:string;
  constructor(public service: ShelvescapacityService,
    private _snackBar: MatSnackBar,
  private translate:TranslateService,
  @Inject(DOCUMENT) private document: Document,
  private renderer: Renderer2,
  ) {
    this.obj = new ShelvescapacityDTO();
    this.objcapacityDTO = new ShelvescapacityDTO();
    this._obj = new ShelvescapacityDTO();
    this.blockssdrp = [];
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.Filterbyname = lang === 'en' ? 'Filter by name...' : 'تصفية بالاسم...';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    })
  }

  ngOnInit() {
   



 const lang:any = localStorage.getItem('language');
    this.translate.use(lang)
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.Filterbyname = lang === 'en' ? 'Filter by name...' : 'تصفية بالاسم...';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    localStorage.setItem('language', lang); 
    if (this.currentLang === 'ar') {
      // alert(lang);
      const cssFilePath = 'assets/i18n/arabic.css';
    
      // Create a link element for the CSS file
      const link = this.renderer.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssFilePath;
    
      // Set an id attribute to identify the link element
      link.id = 'arabicCssLink';
    
      // Append the link element to the document head
      this.renderer.appendChild(document.head, link);
    } else if (this.currentLang === 'en') {
      // alert(lang);
      const linkElement = document.getElementById('arabicCssLink');
      if (linkElement && linkElement.parentNode) {
        console.log('Removing Arabic styles');
        this.renderer.removeChild(document.head, linkElement);
      } else {
        console.log('Link element not found or already removed');
      }
    }
    // this.warehousedata();
    // this.Onwarehousechange(this.WareHouseId);
    // this.OnBlockschange(this.BlockId)
    // this.shelvesdata(this.RackId)
// this.insertupdate(this.ShelveId)
// this.ontrue();
this.GetWarehouseBlockRackShelve();
  }
  GetWarehouseBlockRackShelve() {
    this.service.GetWarehouseBlockRackShelveJson().subscribe(
      (data) => {
        this._obj = data as ShelvescapacityDTO;
        this.Objwarehousedrp = this._obj.Data["WarehouseJson"];
        this.blocklist = this._obj.Data["BlockJson"];
        this.Rackslist = this._obj.Data["RackJson"];
       
      });
  }
  // warehousedata() {
  //   this.service.GetwarehouseData().subscribe(
  //     (data) => {
  //       this.Objwarehousedrp = data as [];

  //       this.blockssdrp = this.Objwarehousedrp
  //       // this.result = this.blockssdrp.filter(word => word.IsActive == true)
  //       // console.log(this.blockssdrp, 'warehouselist')

  //     });
  // }
  // Onwarehousechange(WareHouseId) {
  //   this.WareHouseId = WareHouseId;
  //   this._obj.WareHouseId = WareHouseId;
  //   this.service.GetBlocks(this._obj)
  //     .subscribe(data => {
         
  //       this.ObjBlocksdrp = data as [];
  //       this.blocklist = this.ObjBlocksdrp.filter(word => word.IsActive == true)
  //       // console.log(this.blocklist, "Blocklist")
  //     });
  // }
//   OnBlockschange(BlockId) {

// this._obj.BlockId = BlockId;
// this.BlockId = BlockId;
// this._obj.ShelveId=this.ShelveId
//     this.service.GetRacks(this._obj)
//       .subscribe(data => {
//         // console.log(data,"check123")
//         this.ObjRacksdrp = data as [];
//         this.Rackslist =this.ObjRacksdrp.filter(word => word.IsActive == true)
//        console.log(this.Rackslist,"Racklist")
//       });
//   }

  shelvesdata(RackId,RackName){
    this._obj.RackId = RackId;
    this.RackId=RackId
    this.RackName=RackName;
    this.service.Getshelves(this._obj)
    .subscribe(data => {
      // console.log(data,"objshelveslist")
      this.objshelvesdata = data as [];
    });
  }

  bindblock(val) {
   
  $('.blocksdiv').css('display','none');
  // this.Onwarehousechange(val);
    var _value = (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value = "1";
    }else{
      (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value = "0";
    }
     $('#blockdiv_' + val).toggle();
  }

  bindRacks(val){
 
    $('.racksdiv').css('display','none');
    // this.OnBlockschange(val)
    var _value = (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value = "1";
    }else{
      (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value = "0";
    }
     $('#rackdiv_' + val).toggle();
  

       
  }
  ReBindData(){
    this.searchText = "";
    this.shelvesdata(this.RackId,this.RackName);
  }
  onupdate(ShelveId){
    this._obj.ShelveId=ShelveId;
    this.service.updateracks(this._obj)
    .subscribe(data => {
      if (data["message"] == "1") {
        this._snackBar.open('Updated Successfully', 'End now', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition:'right',
        });
        // this.shelvesdata(this.RackId,this.RackName);
      }
     
    });
    
  }

}
