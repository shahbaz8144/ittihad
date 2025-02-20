// import { Component, OnInit, ViewChild } from '@angular/core';
// import { DocumentTypeService } from 'src/app/_service/document-type.service';
// import { DocumentTypeDTO } from 'src/app/_models/document-type-dto.model';
// import { MatDialog } from '@angular/material/dialog';
// import { DocumentTypeComponent } from '../document-type/document-type.component';
// import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
// import { Subject } from 'rxjs';
// @Component({
//   selector: 'app-documentview',
//   templateUrl: './documentview.component.html',
//   styleUrls: ['./documentview.component.css']
// })
// export class DocumentviewComponent implements OnInit {
//   dtTrigger: Subject<any> = new Subject<any>();
//   _DocTypeList: DocumentTypeDTO[];
//   //Paging..
//   p: number = 1;
//   //Length of List
//   ListItems_lenght: number;
//   //Status Change For Table
//   String_status: string;
//   Active = true;
//   InActive = false;
//   enableEdit = false;
//   enableEditIndex = null;
//   inedit = false;
//   constructor(
//     public service: DocumentTypeService,
//     private dialog: MatDialog,
//     public Obj_DocTypeComponent: DocumentTypeComponent
//   ) { }
//   public filteredDocType: DocumentTypeDTO[];
//   public _searchTerm: string;
//   get searchTerm(): string {
//     return this._searchTerm;
//   }
//   set searchTerm(value: string) {
//     this._searchTerm = value;
//     alert(value)
//     this.filteredDocType = this.filteredDocTypeMethod(value);
//   }
//   filteredDocTypeMethod(searchString: string) {
//     return this.service.DocTypeList.filter(res => res.DocumentTypeName.toLocaleLowerCase().indexOf(searchString.toLowerCase()) !== -1);
//   }
//   dtOptions: any = {};
//   ngOnInit(): void {
//     this.GetDocTypeList();
//     this.dtOptions = {
//       pagingType: 'full_numbers',
//       pageLength: 5,
//       lengthMenu: [5, 10, 25],
//       processing: true,
//       order: []
//     };
//   }
//   GetDocTypeList() {
//     jQuery('.dataTable').DataTable().destroy();
//     jQuery('.dataTable').DataTable({
//       searching: false
//     });
//     this.service.getDocTypeData_2().subscribe(data => {
//       this._DocTypeList = data as DocumentTypeDTO[];
//       this.dtTrigger.next()
//     });
//   }
//   UpdateStatus(Obj_Status: DocumentTypeDTO) {
//     if (Obj_Status.IsActive === true) {
//       this.String_status = "In-Active"
//     }
//     else {
//       this.String_status = "Active"
//     }
//     const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
//       data: {
//         title: 'Confirm ',
//         message: this.String_status
//       }
//     });
//     confirmDialog.afterClosed().subscribe(result => {
//       if (result === true) {
//         if (Obj_Status.IsActive === true) {
//           Obj_Status.IsActive = false;
//           this.InActive;
//         }
//         else {
//           Obj_Status.IsActive = true;
//         }
//         this.service.UpDate_Status(Obj_Status);
//       }
//     });
//   }
//   populateForm(f1: DocumentTypeDTO) {
//     document.getElementById("addrck").style.display = "block";
//     document.getElementById("document_add").style.display = "none";
//     document.getElementById("editrck").innerHTML = "Edit Document";
//     this.service.objDocTypeDTO = Object.assign({}, f1);
//     this.Obj_DocTypeComponent.isShow = true;
//   }
// }




