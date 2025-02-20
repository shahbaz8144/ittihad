import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GacdocumentapprovalDTO } from 'src/app/_models/gacdocumentapproval-dto';
import { GacdocumentapprovalService } from 'src/app/_service/gacdocumentapproval.service';

@Component({
  selector: 'app-gac-documents-approval',
  templateUrl: './gac-documents-approval.component.html',
  styleUrls: ['./gac-documents-approval.component.css']
})
export class GacDocumentsApprovalComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  _obj: GacdocumentapprovalDTO;
  objCompanyList: any;
  objDocumentList: any;
  CompanyId: number;
  CompanyName:string;
  DocumentStatus: string;
  obj: any;
  DocumentList: any;
  ReferenceList: any;
  UploadedList: any;
  PhysicalShareToList: any;
  PhysicalShareFromList: any;
  ShareWithMeList: any;
  ElectronicDocumentShare: any;
  ActionDisable:boolean;
  constructor(public service: GacdocumentapprovalService) {
    this._obj = new GacdocumentapprovalDTO();
    this.ActionDisable=true;
  }
  dtOptions: any = {};
  ngOnInit(): void {
    this.CompanyListDropdown();
    this.GetDocumentsByStatus('P');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
  }
  closeInfo() {
    document.getElementById("docview").classList.remove("kt-quick-panel--on");
    document.getElementById("scrd").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block", "opacity-1");
  }
  CompanyListDropdown() {
    this.service.GetCompanyList().subscribe(data => {
      this._obj = data as GacdocumentapprovalDTO;
      this.objCompanyList = this._obj.Data['CompanyList'];
    })
  }
  GetDocumentsByStatus(DocumentStatus: string) {
    if(DocumentStatus=='P'){
      this.ActionDisable=false;
    }
    else{
      this.ActionDisable=true;
    }
    jQuery('.dataTable').DataTable().destroy();
    jQuery('.dataTable').DataTable({
      searching: false
    });
    $('.nav-link').removeClass('active');
    $('#a_' + DocumentStatus).addClass('active');
    this._obj.CompanyId = this.CompanyId;
    this._obj.DocumentStatus = DocumentStatus;
    this.service.GetdocumentsbyStatus(DocumentStatus, this.CompanyId).subscribe(data => {
      //this.dtTrigger.next()
      this._obj = data as GacdocumentapprovalDTO;
      this.objDocumentList = this._obj.Data['DocumentList']
    })
  }
  DocumentChangeMethod(CompanyId) {
    this.CompanyId = CompanyId;
    this.GetDocumentsByStatus('P');
  }
  DocumentStatusChange(status,docid){
    this._obj.DocumentStatus = status;
    this._obj.DocumentId = docid;
    this.service.GACDocumentStatusChange(this._obj).subscribe(data=>{
      this._obj = data as GacdocumentapprovalDTO
    })
    document.getElementById("docview").classList.remove("kt-quick-panel--on");
    document.getElementById("scrd").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block", "opacity-1");
    this.GetDocumentsByStatus('p');
  }
  resetForm(){
    this.CompanyId=0;
    this.CompanyName = '';
    this.GetDocumentsByStatus('p');
  }
  docsideviw(documentid: number, referenceid: number) {
    this._obj.DocumentId = documentid;
    this._obj.ReferenceId = referenceid;
    this.service.GACDocumentDetails(this._obj)
      .subscribe(data => {
        this._obj = data as GacdocumentapprovalDTO;
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
  sideviw(name, documentid: string, referenceid: string) {
    var id = documentid + "," + referenceid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
}
