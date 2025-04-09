import { Component, OnInit, Renderer2,Inject } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-generate-barcode',
  templateUrl: './generate-barcode.component.html',
  styleUrls: ['./generate-barcode.component.css']
})
export class GenerateBarcodeComponent implements OnInit {
  obj:GACFiledto;
  BarCodeListJson :any[];
  BarcodeSearch:string = "";
  currentLang: "ar" | "en" = "ar";
  _BarcodeName:string = "";
  SearchBarcode:string = "";
  EnterBarcodeName:string = "";
  Enterprefix:string = "";
  EnterSeed:string = "";
  EnterIncrement:string = "";
  constructor(public service: GACFileService,
    private translate: TranslateService,
        @Inject(DOCUMENT) private document: Document,
            private renderer: Renderer2,
            private _snackBar: MatSnackBar,
  ) { 
this.obj = new GACFiledto();
HeaderComponent.languageChanged.subscribe((lang) => {
  localStorage.setItem('language', lang);
  this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  this.SearchBarcode = lang === 'en' ? 'Search...' : 'يبحث...';
  this.EnterBarcodeName = lang === 'en' ? 'Enter Barcode Name' : 'أدخل اسم الرمز الشريطي'
  this.Enterprefix = lang === 'en' ? 'Enter prefix' : 'أدخل البادئة'
  this.EnterSeed = lang === 'en' ? 'Enter Seed' : 'أدخل البذور'
  this.EnterIncrement = lang === 'en' ? 'Enter Increment' : 'أدخل الزيادة'

  if (lang == 'ar') {
    this.renderer.addClass(document.body, 'kt-body-arabic');
  } else if (lang == 'en') {
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
  const editElement = document.getElementById("editrck");
  if (editElement) {
    editElement.textContent = lang === 'ar' ? "إضافة" : "Add";
  }
});
  }
  togglebarcode(option: string) {
    this.selectedOption = option;
    this.Seederrormessage = false;
    this.Incrementerrormessage = false;
    this.IIncrementDurationerrormessage = false;
    this.ShownAddandhideAdd = false;
  
  }
  ngOnInit(): void {
    // Add event listener for the edit button click to add 'active' class
    document.querySelectorAll('.barcode-edit').forEach(function(editButton) {
      editButton.addEventListener('click', function() {
        // Find the nearest parent .barcode-seq-item and add 'active' class
        var barcodeSeqItem = editButton.closest('.barcode-seq-item');
        if (barcodeSeqItem) {
          barcodeSeqItem.classList.add('active');
        }
      });
    });

    // Add event listener for the submit button to remove 'active' class
    document.querySelectorAll('.btn-chng').forEach(function(submitButton) {
      submitButton.addEventListener('click', function() {
        // Find the nearest parent .barcode-seq-item and remove 'active' class
        var barcodeSeqItem = submitButton.closest('.barcode-seq-item');
        if (barcodeSeqItem) {
          barcodeSeqItem.classList.remove('active');
        }
      });
    });

    // Add event listener for the cancel button to remove 'active' class
    document.querySelectorAll('.btn-cncl').forEach(function(cancelButton) {
      cancelButton.addEventListener('click', function() {
        // Find the nearest parent .barcode-seq-item and remove 'active' class
        var barcodeSeqItem = cancelButton.closest('.barcode-seq-item');
        if (barcodeSeqItem) {
          barcodeSeqItem.classList.remove('active');
        }
      });
    });
      // HeaderComponent.languageChanged.subscribe((lang) => {
        const lang: any = localStorage.getItem('language');
        this.translate.use(lang);
        localStorage.setItem('language', lang);
        this.translate.use(lang);
        this.currentLang = lang ? lang : 'en';
        this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        this.SearchBarcode = lang === 'en' ? 'Search...' : 'يبحث...';
        this.EnterBarcodeName = lang === 'en' ? 'Enter Barcode Name' : 'أدخل اسم الرمز الشريطي'
        this.Enterprefix = lang === 'en' ? 'Enter prefix' : 'أدخل البادئة'
        this.EnterSeed = lang === 'en' ? 'Enter Seed' : 'أدخل البذور'
        this.EnterIncrement = lang === 'en' ? 'Enter Increment' : 'أدخل الزيادة'
        if (lang == 'ar') {
          this.renderer.addClass(document.body, 'kt-body-arabic');
        } else if (lang == 'en') {
          this.renderer.removeClass(document.body, 'kt-body-arabic');
        }
        const editElement = document.getElementById("editrck");
        if (editElement) {
          editElement.textContent = lang === 'ar' ? "إضافة" : "Add";
        }
    this.BarCodeList();
  }

  BarCodeList(){
    this.service.BarcodeListAPI().subscribe(data => {
      console.log(data , "Barcodelist");
      this.BarCodeListJson = data['Data'].BarcodeJson;
      console.log(this.BarCodeListJson,"BarcodeList");
    })
  }
  generate_barcode_open() {
    document.getElementById("generate_barcode").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  generate_barcode_close() {
    this._BarcodeName = "";
    this.Prefix_Value = "";
    this.Seed_Value = "";
  this.IncrementDuration_Value = null;
  this.Increment_Value = "";
  // this.selectedOption= 'Prefix';
  this.togglebarcode('Prefix')
  this.BarcodeJson = "";
  this.BarcodeList = []; 
  this.ShownAddandhideAdd = false;
  this.Prefixerrormessage = false;
  this.Seederrormessage = false;
  this.Incrementerrormessage = false;
  this.IIncrementDurationerrormessage = false;
    document.getElementById("generate_barcode").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }

  Prefix_Value:any;
  Seed_Value:any;
  IncrementDuration_Value:any;
  Increment_Value:any;
  selectedOption: string = 'Prefix';
  BarcodeJson:any;
  BarcodeList: any[] = []; 
  ShownAddandhideAdd: boolean = false;
  editOrderId: number | null = null;
  BarcodeNameerrormessage:boolean = false;
  Prefixerrormessage:boolean = false;
  Seederrormessage:boolean = false;
  Incrementerrormessage:boolean = false;
  IIncrementDurationerrormessage:boolean = false;
  AddBarcodeSequence() {
    // 1. Reset all error flags before validation
    this.Prefixerrormessage = false;
    this.Seederrormessage = false;
    this.Incrementerrormessage = false;
    this.IIncrementDurationerrormessage = false;
  
    // 2. Validation for 'Prefix' type
    if (this.selectedOption === 'Prefix') {
      if (!this.Prefix_Value || this.Prefix_Value.trim() === "") {
        this.Prefixerrormessage = true;
        return; // Stop here if invalid
      }
    }
  
    // 3. Validation for 'Auto Increment' or other types
    if (this.selectedOption !== 'Prefix') {
      if (!this.Seed_Value || this.Seed_Value.toString().trim() === "") {
        this.Seederrormessage = true;
      }
      if (!this.Increment_Value || this.Increment_Value.toString().trim() === "") {
        this.Incrementerrormessage = true;
      }
      if (!this.IncrementDuration_Value || this.IncrementDuration_Value.toString().trim() === "") {
        this.IIncrementDurationerrormessage = true;
      }
  
      // If any error found, stop execution
      if (this.Seederrormessage || this.Incrementerrormessage || this.IIncrementDurationerrormessage) {
        return;
      }
    }

    const newBarcode = {
      OrderId: this.BarcodeList.length + 1,
      Type: this.selectedOption,
      Seed: this.selectedOption === 'Prefix' ? this.Prefix_Value : this.Seed_Value,
      Increment: this.selectedOption !== 'Prefix' ? this.Increment_Value : null,
      IncrementDuration: this.selectedOption !== 'Prefix' ? this.IncrementDuration_Value : null,
      IsActive: 1
    };
  
    this.BarcodeList.push(newBarcode);
    console.log('Current BarcodeList:', this.BarcodeList);
  
    // Reset form values
    this.Prefix_Value = "";
    this.Seed_Value = "";
    this.Increment_Value = "";
    this.IncrementDuration_Value = null;
  
   
  }

  createBarcode() {
    this.obj.BarcodeName = this._BarcodeName;
    this.obj.PartsJson = JSON.stringify(this.BarcodeList); // Use BarcodeList
  // alert("API Call")
    this.service.InsertBarcodeAPI(this.obj).subscribe(data => {
      console.log('Insert Barcode API Data:', data);
      this._snackBar.open(('Generate Barcode Successfully'), 'End now', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
      this.BarCodeList();
      this.generate_barcode_close();
    });

    document.getElementById("generate_barcode").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  
    // Optionally reset the selected option
    // this.selectedOption = "";
  }
  

//   AddBarcodeSequence() {
//     // Reset error flags
//     this.Prefixerrormessage = false;
//     this.Seederrormessage = false;
//     this.Incrementerrormessage = false;
//     this.IIncrementDurationerrormessage = false;
  
//     // Validation logic
//     if (this.selectedOption === 'Prefix') {
//       if (!this.Prefix_Value || this.Prefix_Value.trim() === "") {
//         this.Prefixerrormessage = true;
//         return;
//       }
//     } else {
//       if (!this.Seed_Value || this.Seed_Value.toString().trim() === "") {
//         this.Seederrormessage = true;
//       }
//       if (!this.Increment_Value || this.Increment_Value.toString().trim() === "") {
//         this.Incrementerrormessage = true;
//       }
//       if (!this.IncrementDuration_Value || this.IncrementDuration_Value.toString().trim() === "") {
//         this.IIncrementDurationerrormessage = true;
//       }
  
//       // Stop if any field is invalid
//       if (this.Seederrormessage || this.Incrementerrormessage || this.IIncrementDurationerrormessage) {
//         return;
//       }
//     }
//     if (this.selectedOption === 'Prefix') {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to proceed with out Auto-Increment",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes"
//     }).then((result) => {
//       if (result.isConfirmed) {
//       }
//     })
//   }else{
//  // Create new barcode object
//  const newBarcode = {
//   OrderId: this.BarcodeList.length + 1,
//   Type: this.selectedOption,
//   Seed: this.selectedOption === 'Prefix' ? this.Prefix_Value : this.Seed_Value,
//   Increment: this.selectedOption !== 'Prefix' ? this.Increment_Value : null,
//   IncrementDuration: this.selectedOption !== 'Prefix' ? this.IncrementDuration_Value : null,
//   IsActive: 1
// };

// this.BarcodeList.push(newBarcode);
// console.log('Current BarcodeList:', this.BarcodeList);

// // Clear input fields after adding
// this.Prefix_Value = "";
// this.Seed_Value = "";
// this.Increment_Value = "";
// this.IncrementDuration_Value = null;

// // Optional: Reset selected option if needed
// // this.selectedOption = "";
//   }

   
//   }
  
//   AddBarcodeSequence() {
// if(this.selectedOption === 'Prefix'){
//   if (!this.Prefix_Value || this.Prefix_Value.trim() === "") {
//     this.Prefixerrormessage = true;
//     return; // Prevent API call if invalid
//   } else {
//     this.Prefixerrormessage = false;
//   }
// }else if(this.selectedOption !== 'Prefix'){
//   if (!this.Seed_Value || this.Seed_Value.trim() === "" ||
//   !this.Increment_Value || this.Increment_Value.trim() === "" ||
//   !this.IncrementDuration_Value || this.IncrementDuration_Value.trim() === "" ) {
//     this.Seederrormessage = true;
//     this.Incrementerrormessage = true;
//     this.IIncrementDurationerrormessage = true;
//     return; // Prevent API call if invalid
//   } else {
//     this.Seederrormessage = false;
//     this.Incrementerrormessage = false;
//     this.IIncrementDurationerrormessage = false;
//   }
// }

//     const newBarcode = {
//       OrderId: this.BarcodeList.length + 1,
//       Type: this.selectedOption,
//       Seed: this.selectedOption === 'Prefix' ? this.Prefix_Value : this.Seed_Value,
//       Increment: this.Increment_Value || null,
//       IncrementDuration: this.IncrementDuration_Value || null,
//       IsActive: 1
//     };
  
//     this.BarcodeList.push(newBarcode);
//     console.log('Current BarcodeList:', this.BarcodeList);

//     this.Prefix_Value = "";
//     this.Seed_Value = "";
//   }
  
  // Final submission to API
  AddBarcode() {

    if (!this._BarcodeName || this._BarcodeName.trim() === "") {
      this.BarcodeNameerrormessage = true;
      return; // Prevent API call if invalid
    } else {
      this.BarcodeNameerrormessage = false;
    }
     // 4. SweetAlert confirmation only for 'Prefix' type
     if (this.selectedOption === 'Prefix') {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to proceed without Auto-Increment?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          this.createBarcode(); // Proceed to create barcode
        }
      });
    } else {
      this.createBarcode(); // Directly add barcode for other types
    }
    
  }

  get mergedBarcodeSeed(): string {
    return this.BarcodeList
      .filter(item => item.Type === 'Prefix' || item.Type === 'Auto Increment')
      .map(item => item.Seed)
      .join('');
  }
  selectedOrderId: number | null = null;
  EditBarcodesequence(orderId:number){
    // $('.barcode-seq-info-li').addClass('bar-focus');
    this.selectedOrderId = orderId;
    const selectedItem = this.BarcodeList.find(item => item.OrderId === orderId);

    if (selectedItem) {
      this.selectedOption = selectedItem.Type;
  
      if (selectedItem.Type === 'Prefix') {
        this.Prefix_Value = selectedItem.Seed;
        this.Seed_Value = null;
      } else {
        this.Seed_Value = selectedItem.Seed;
        this.Prefix_Value = null;
      }
  }
  this.ShownAddandhideAdd = true;
  this.editOrderId = orderId;
}

UpdateBarcodeSequence() {
  if (this.editOrderId !== null) {
    const index = this.BarcodeList.findIndex(item => item.OrderId === this.editOrderId);

    if (index !== -1) {
      this.BarcodeList[index] = {
        OrderId: this.editOrderId,
        Type: this.selectedOption,
        Seed: this.selectedOption === 'Prefix' ? this.Prefix_Value : this.Seed_Value,
        Increment: this.Increment_Value || null,
        IncrementDuration: this.IncrementDuration_Value || null,
        IsActive: 1
      };

      // Reset edit mode
      this.ShownAddandhideAdd = false;
      this.editOrderId = null;
  this.Prefix_Value = '';
      this.Seed_Value = '';
      // Optional: Reset form fields
      // this.selectedOption = '';
      // this.Prefix_Value = '';
      // this.Seed_Value = '';
      // this.Increment_Value = null;
      // this.IncrementDuration_Value = null;
    }
  }
}

allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  // Allow only digits (0–9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

Deletebarcode(orderIdToDelete: number) {
  // Step 1: Remove the selected item
  this.BarcodeList = this.BarcodeList.filter(item => item.OrderId !== orderIdToDelete);

  // Step 2: Reassign OrderIds sequentially
  this.BarcodeList.forEach((item, index) => {
    item.OrderId = index + 1;
  });

  console.log(this.BarcodeList ,"Delete after barcode list");
}

//   AddBarcodeSequence(){
//     const newBarcode = {
//       OrderId: this.BarcodeList.length + 1,
//       Type: this.selectedOption,
//       Seed: this.selectedOption === 'Prefix' ? this.Prefix_Value : this.Seed_Value,
//       Increment: this.Increment_Value || null,
//       IncrementDuration: this.IncrementDuration_Value || null,
//       IsActive: 1
//     };
  
//     this.BarcodeList.push(newBarcode);
  
//     // Store the list as JSON string
//     this.obj.PartsJson = JSON.stringify(this.BarcodeList);
  
//     console.log(this.obj.PartsJson); // To see the full array output
//   }
//   AddBarcode(){
//    this.obj.BarcodeName = this._BarcodeName;
//     this.obj.PartsJson = JSON.stringify(this.BarcodeJson);

//     this.service.InsertBarcodeAPI(this.obj).subscribe(data =>{
// console.log(data , "Insert Baecode API Data")
//     })
//   }
}
