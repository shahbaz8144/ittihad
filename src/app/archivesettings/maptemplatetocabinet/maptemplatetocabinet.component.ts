import { Component, OnInit } from '@angular/core';
import { GACFileService } from '../../_service/gacfile.service';
import { GACFiledto } from '../../_models/gacfiledto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maptemplatetocabinet',
  templateUrl: './maptemplatetocabinet.component.html',
  styleUrls: ['./maptemplatetocabinet.component.css']
})
export class MaptemplatetocabinetComponent implements OnInit {
  MapTemplateSearch:string = "";
  _CabinetArray:any;
  _CabinetJson:any;
  _TemplateJson:any;
  _TemplateArray:any;
  _MapJson:any [] = [];
  obj:GACFiledto;
  Cabineterrormessage:boolean=false;
  Templateerrormessage:boolean = false;
  Barcodeerrormessage:boolean = false;
  Barcodesequence:string = "";
  prefix:string = "";
  autoIncrementValue:string = "";
  constructor(private service:GACFileService,private _snackBar: MatSnackBar,) {
    this.obj = new GACFiledto();
   }

  ngOnInit(): void {
    this.CabinetAndTemplateList();
    this.GetMappedTemplatesList();
  }

  CabinetAndTemplateList(){
    this.service.MapTemplatetoCabinetListAPI().subscribe(data => {
      console.log(data , "Cabinet list");
      this._CabinetJson = data['Data'].CabinetJson;
      this._TemplateJson = data['Data'].TemplateJson;
    })
  }

  GetMappedTemplatesList(){
    this.service.GetMappedTemplatesListAPI().subscribe(data =>{
      this._MapJson = data['Data'].MapJson;
      console.log( this._MapJson,"GetMappedTemplatesList Data");
    })
  }


  // AddMapTemplate(){
  //   if(this._CabinetArray == undefined || this._TemplateArray == undefined || this.Barcodesequence == ""){
  //     this.Cabineterrormessage = true;
  //     this.Templateerrormessage = true;
  //     this.Barcodeerrormessage = true;
  //   }else if(this._CabinetArray != undefined || this._TemplateArray == undefined || this.Barcodesequence == "" ) {
  //     this.Cabineterrormessage = false;
  //     this.Templateerrormessage = false;
  //     this.Barcodeerrormessage = false;
  //     this.obj.TemplateId = this._TemplateArray.toString();
  //     this.obj.CabinetId = this._CabinetArray.toString();
  //     this.obj.BarcodeSequence = this.Barcodesequence;
  //     this.service.AddMapTemplateAPI(this.obj).subscribe(data => {
  //       console.log(data ,"Add MapTemplate Data");
        
  //       if(data['Message'] == '1'){
  //         this._snackBar.open(('Added Successfully'), 'End now', {
  //           duration: 5000,
  //           verticalPosition: 'bottom',
  //           horizontalPosition: 'right',
  //         });
  //         this.ClearTemplate();
  //         this.GetMappedTemplatesList()
  //       }else if(data['Message'] == '2'){
  //         alert('for Template Already Mapped to Cabinet');
  //       }else if(data['Message'] == '3'){
  //         alert('for Barcode Sequence already exist');
  //       }

  //     })
  //   }
  //   }
   
  AddMapTemplate() {
    if (!this._CabinetArray || !this._TemplateArray || !this.Barcodesequence) {
      this.Cabineterrormessage = !this._CabinetArray;
      this.Templateerrormessage = !this._TemplateArray;
      this.Barcodeerrormessage = !this.Barcodesequence;
      return; // Stop execution if validation fails
    }
  
    // Reset error messages
    this.Cabineterrormessage = false;
    this.Templateerrormessage = false;
    this.Barcodeerrormessage = false;
  
    // Prepare request object
    this.obj.TemplateId = this._TemplateArray.toString();
        this.obj.CabinetId = this._CabinetArray.toString();
        this.obj.BarcodeSequence = this.Barcodesequence;
  
    // Call API
    this.service.AddMapTemplateAPI(this.obj).subscribe(data => {
      console.log("Add MapTemplate Data:", data);
  
      switch (data['Message']) {
        case '1':
          this._snackBar.open('Added Successfully', 'Close', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this.template_cabin_map_close();
          this.GetMappedTemplatesList();
          break;
        case '2':
          alert('Template is already mapped to the cabinet.');
          break;
        case '3':
          alert('Barcode sequence already exists.');
          break;
        default:
          alert('An unknown error occurred.');
      }
    }, error => {
      console.error("API Error:", error);
      alert('An error occurred while adding the template.');
    });
  }
  
  ClearSearch(){
    this.MapTemplateSearch = "";
  }

  // ClearTemplate(){
  //   this._TemplateArray = null;
  //   this._CabinetArray = null;
  //   this.Barcodesequence = "";
  //   this.Cabineterrormessage = false;
  //   this.Templateerrormessage = false;
  //   this.Barcodeerrormessage = false;
  //   document.getElementById("template_cabin_map").classList.remove("kt-quick-panel--on");
  //   document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
  //   document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  // }


  template_cabin_map_open() {
    document.getElementById("template_cabin_map").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  template_cabin_map_close() {
    this._TemplateArray = null;
    this._CabinetArray = null;
    this.Barcodesequence = "";
    this.Cabineterrormessage = false;
    this.Templateerrormessage = false;
    this.Barcodeerrormessage = false;
    document.getElementById("template_cabin_map").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
}
