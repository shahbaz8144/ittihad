import { Component, OnInit } from '@angular/core';
import { DocumentsapprovalDTO } from 'src/app/_models/documentsapprovaldto';
import { DocumentsapprovalapiService } from 'src/app/_service/documentsapprovalapi.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-documents-approval',
  templateUrl: './sharingdocuments-approval.component.html',
  styleUrls: ['./sharingdocuments-approval.component.css']
})
export class sharingDocumentsApprovalComponent implements OnInit {
  
  dtTrigger: Subject<any> = new Subject<any>();
  _obj: DocumentsapprovalDTO
  objdoclist=[]
  list: any[] = [];
  check: any;
  selectedItemList = [];
  DocumentList: any;
  ReferenceList: any;
  UploadedList: any;
  PhysicalShareToList: any;
  PhysicalShareFromList: any;
  ShareWithMeList: any;
  ElectronicDocumentShare: any;
  DocumentSharedDuration: any;
  FromUserDetails: any;
  ToUserDetails: any
  isChecked: boolean = false;
  disablebutton: boolean;
  ShareId: any
  selected: any;
  Status: Number;
  ShareIds: Number;
  constructor(public service: DocumentsapprovalapiService) {
    this._obj = new DocumentsapprovalDTO();
    this.objdoclist = []
  }
  dtOptions: any = {}
  ngOnInit(): void {
    this.ontablelist();
    this.Getnewwindow(this.ShareId);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: [],
      columnDefs: [{
        'targets': [0], /* column index [0,1,2,3]*/
        'orderable': false, /* true or false */
      }],
    };
    this.disablebutton = true;
  }
  closeInfo() {
    document.getElementById("docview").classList.remove("kt-quick-panel--on");
    document.getElementById("scrd").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block", "opacity-1");
  }

  docsideviw(documentid: number, referenceid: number) {
    //  alert(documentid)
    this._obj.DocumentId = documentid;
    this._obj.ReferenceId = referenceid;
    this.service.GACDocumentDetails(this._obj)
      .subscribe(data => {
        this._obj = data as DocumentsapprovalDTO;
        this.DocumentList = this._obj.Data["DocumentList"];
        this.ReferenceList = this._obj.Data["ReferenceList"];
        this.UploadedList = this._obj.Data["UploadedList"];
        this.PhysicalShareToList = this._obj.Data["PhysicalShareToList"];
        this.PhysicalShareFromList = this._obj.Data["PhysicalShareFromList"];
        this.ShareWithMeList = this._obj.Data["ShareWithMeList"];
        this.ElectronicDocumentShare = this._obj.Data["ElectronicDocumentShare"];
        document.getElementById("docview").classList.add("kt-quick-panel--on");
        document.getElementById("scrd").classList.add("position-fixed");
        document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block", "opacity-1");
      });
  }

  Getnewwindow(ShareId) {
  
    this._obj.ShareId = ShareId;
    this.ShareId = ShareId;
    this.service.Getwindow(this._obj)
      .subscribe(data => {
        this._obj = data as DocumentsapprovalDTO;
        this.DocumentSharedDuration = this._obj.Data["DocumentSharedDuration"];
        this.FromUserDetails = this._obj.Data["FromUserDetails"];
        this.ToUserDetails = this._obj.Data["ToUserDetails"];
      });
  }
  ontablelist() {
    jQuery('.dataTable').DataTable().destroy();
    jQuery('.dataTable').DataTable({
      searching: false
    });
    this.service.Gettabledata(this._obj).subscribe(data => {
      console.log(data, "sir")
      this._obj = new DocumentsapprovalDTO();
      this.list = data as [];
      this.objdoclist = this.list['Data']['SharingDocumentList']
      // console.log(this.objdoclist, "mateenanna")
      //this.dtTrigger.next(); 
      // this.objdoclist=[];
    });
  }

  onsharingdoc(_val) {

    let shelvesarray = [];
    this.objdoclist.forEach(element => {

      if (element.state == true) {
        let array = "";
        if (element.ShareId == null) {
          array = this.ShareId
        }
        let _value = array + "" + element.ShareId
        shelvesarray.push(_value);
      }
    });
    console.log(JSON.stringify(shelvesarray))
    this._obj.ShareIds = shelvesarray;
    this._obj.Status = _val;
    this.service.GetApproval(this._obj).subscribe(data => {
      // console.log(data)
      this._obj = new DocumentsapprovalDTO();
      this.ontablelist();
    });
  }

  chkChange(ev) {
    let shelvesarray = [];
    this.objdoclist.forEach(element => {

      if (element.state == true) {
        let array = "";
        if (element.ShareId == null) {
          array = this.ShareId
        }
        let _value = array + "" + element.ShareId
        shelvesarray.push(_value);
      }
    });
    if (shelvesarray.length == 0)
      this.disablebutton = true;
    else if (shelvesarray.length != 0)
      this.disablebutton = false;
  }

  checkAll(ev) {
    this.objdoclist.forEach(x => x.state = ev.target.checked);
    let shelvesarray = [];
    this.objdoclist.forEach(element => {

      if (element.state == true) {
        let array = "";
        if (element.ShareId == null) {
          array = this.ShareId
        }
        let _value = array + "" + element.ShareId
        shelvesarray.push(_value);
      }
    });
    if (shelvesarray.length == 0)
      this.disablebutton = true;
    else if (shelvesarray.length != 0)
      this.disablebutton = false;
  }

  isAllChecked() {

    return this.objdoclist.every(_ => _.state);
  }
  checkEnable() {
    this.isChecked = true;
  }

}
