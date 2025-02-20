import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedwithmeDTO } from 'src/app/_models/sharedwithme-dto';
import { SharedwithmeServicesService } from 'src/app/_service/sharedwithme-services.service';

@Component({
  selector: 'app-sharedwithme',
  templateUrl: './sharedwithme.component.html',
  styleUrls: ['./sharedwithme.component.css']
})
export class SharedwithmeComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  _obj: SharedwithmeDTO ;
  SharedwithMeDocumentList: any;
  DocumentList: any;
  ReferenceList: any;
  UploadedList: any;
  PhysicalShareToList: any;
  PhysicalShareFromList: any;
  ShareWithMeList: any;
  ElectronicDocumentShare: any;
  constructor(public services: SharedwithmeServicesService) {
    this._obj = new SharedwithmeDTO();
    this.SharedwithMeDocumentList = [];
  }
  dtOptions: any = {};
  ngOnInit(): void {
    this.GetSharedwithMeDocumentList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
  }
  GetSharedwithMeDocumentList() {
    debugger
    jQuery('.dataTable').DataTable().destroy();
    jQuery('.dataTable').DataTable({
      searching: false
    });
    this.services.GetSharedwithMeDocumentsList().subscribe(data => {
      this._obj = data as SharedwithmeDTO;
      this.SharedwithMeDocumentList = this._obj.Data['SharedWithMeList']
      
      console.log(this.SharedwithMeDocumentList,'11111111')
      //this.dtTrigger.next();

    })
  }

  closeInfo() {
    document.getElementById("docview").classList.remove("kt-quick-panel--on");
    document.getElementById("scrd").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block", "opacity-1");
  }
  sideviw(name, documentid: string, referenceid: string) {
    //
    var id = documentid + "," + referenceid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
  docsideviw(documentid: number, referenceid: number) {
    // alert(documentid)
    this._obj.DocumentId = documentid;
    this._obj.ReferenceId = referenceid;
    this.services.GACDocumentDetails(this._obj)
      .subscribe(data => {
        this._obj = data as SharedwithmeDTO;
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
}
