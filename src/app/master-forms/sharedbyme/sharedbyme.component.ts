import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SharebymeDTO } from 'src/app/_models/sharebymeDTO';
import { SharebymeService } from 'src/app/_service/sharebyme.service';

@Component({
  selector: 'app-sharedbyme',
  templateUrl: './sharedbyme.component.html',
  styleUrls: ['./sharedbyme.component.css']
})
export class SharedbymeComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  GetShare_list: any;
  _obj: SharebymeDTO;
  DocumentList: any;
  ReferenceList: any;
  UploadedList: any;
  PhysicalShareToList: any;
  PhysicalShareFromList: any;
  ShareWithMeList: any;
  ElectronicDocumentShare: any;

  constructor(public services: SharebymeService) {
    this._obj = new SharebymeDTO();
  }
  dtOptions: any = {};
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: []
    };
    this.GetSharedbyme();
  }

  GetSharedbyme() {
    jQuery('.dataTable').DataTable().destroy();
    jQuery('.dataTable').DataTable({
      searching: false
    });
    this.services.GetSharebymeList().subscribe(data => {
      console.log(data, "mateenanna")
      this._obj = data as SharebymeDTO;
      this.GetShare_list = this._obj.Data['SharedByMeList'];
      //this.dtTrigger.next();
    })
  }
  sideviw(name, documentid: string, referenceid: string) {
    //
    var id = documentid + "," + referenceid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
  closeInfo() {
    document.getElementById("docview").classList.remove("kt-quick-panel--on");
    document.getElementById("scrd").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block", "opacity-1");
  }

  docsideviw(documentid: number, referenceid: number) {
    // alert(documentid)
    this._obj.DocumentId = documentid;
    this._obj.ReferenceId = referenceid;
    this.services.GACDocumentDetails(this._obj)
      .subscribe(data => {

        this._obj = data as SharebymeDTO
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
