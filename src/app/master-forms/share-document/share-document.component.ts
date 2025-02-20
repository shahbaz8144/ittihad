import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ShareDocumentsDTO } from 'src/app/_models/share-documents-dto';
import { DocumentsapprovalapiService } from 'src/app/_service/documentsapprovalapi.service';
import { ShareDocumentsService } from 'src/app/_service/share-documents.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-share-document',
  templateUrl: './share-document.component.html',
  styleUrls: ['./share-document.component.css']
})
export class ShareDocumentComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  _obj: ShareDocumentsDTO;
  list: any[] = [];
  user: any[] = [];
  ObjgetCompanyList: any;
  GACDocumentList: any;
  ObjgetuserList: any;
  objsharedoc: ShareDocumentsDTO
  DocumentId: number;
  CompanyId: Number;
  startdate: string;
  Enddate: string;
  AccessType: string;
  SharingType: string;
  ToUserId: number;

  constructor(public service: ShareDocumentsService, private _snackBar: MatSnackBar) {
    this._obj = new ShareDocumentsDTO();
    this.GACDocumentList = []
    this.ObjgetuserList = []
    this.objsharedoc = new ShareDocumentsDTO();
  }
  dtOptions: any = {}
  ngOnInit(): void {
    this.GetDropdown();
    this.ontablelist();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [10, 25, 50],
      processing: true,
      order: [],

    };
    const datepicker = document.getElementById('txtstartdate');
    const today = new Date();
    let date = today.getDate() > 9 ? today.getDate() :
      `0${today.getDate()}`;
    let month = today.getMonth() > 9 ? today.getMonth() + 1 :
      `0${today.getMonth() + 1}`;
    let year = today.getFullYear();

    datepicker.setAttribute('min', `${year}-${month}-${date}`);


    window.addEventListener("load", function (event) {
      var threshold = 3;
      $('.item-b').children(":nth-child(n+" + (threshold + 1) + ")").not(".show").hide();

      if ($("div.item-b").children().not(".show").length > threshold) {
        $(".show.more").css("display", "block");
      }

      $(".show.more").on("click", function () {
        $(this).parent().children().not(".show").css("display", "block");
        $(this).parent().find(".show.less").css("display", "block");
        $(this).hide();
      });

      $(".show.less").on("click", function () {
        $('.item-b').children(":nth-child(n+" + (threshold + 1) + ")").not(".show").hide();
        $(this).parent().find(".show.more").css("display", "block");
        $(this).hide();
      });

    });
  }
  onenddate() {
    const enddatepicker = document.getElementById('txtEndDate');
    let _a = this.startdate.split("-");

    let _day = parseInt(_a[2]);
    let _month = parseInt(_a[1]);
    let _year = parseInt(_a[0]);

    let date = _day > 9 ? _day :
      `0${_day}`;
    let month = _month > 9 ? _month + 1 :
      `0${_month}`;

    enddatepicker.setAttribute('min', `${_year}-${month}-${date}`);

  }
  clearenddate() {

    this.startdate = (<HTMLInputElement>document.getElementById("txtstartdate")).value;

    (<HTMLInputElement>document.getElementById("txtEndDate")).value = "";
    this.Enddate = "";
  }


  closeInfo() {
    document.getElementById("docview").classList.remove("kt-quick-panel--on");
    document.getElementById("scrd").classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block", "opacity-1");
  }

  docsideviw(DocumentId) {

    document.getElementById("docview").classList.add("kt-quick-panel--on");
    document.getElementById("scrd").classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block", "opacity-1");
    this._obj.DocumentId = DocumentId
    this.DocumentId = DocumentId
    this.service.NewGetCheckAvailibility(this._obj).subscribe(data => {
      this._obj = data as ShareDocumentsDTO;

      if (this._obj.message == "I") {
        $("input[name=rdbButtons][value='E']").prop("checked", true);
        $("input[name=rdbButtons][value='P']").prop("disabled", true);
        $("input[name=rdbButtons][value='B']").prop("disabled", true);
      }
      else {
        $("input[name=rdbButtons][value='E']").prop("checked", true);
        $("input[name=rdbButtons][value='P']").prop("disabled", true);
        $("input[name=rdbButtons][value='B']").prop("disabled", true);
      }
      this.SharingType = "Electronic";
    });
  }


  ontablelist() {
    jQuery('.dataTable').DataTable().destroy();
    jQuery('.dataTable').DataTable({
      searching: false
    });
    this.service.GettableList(this._obj).subscribe(data => {
      console.log(data, "sirrrr")
      this._obj = new ShareDocumentsDTO();
      this.list = data as [];
      this.GACDocumentList = this.list['Data']['DocumentSharingList']

      //this.dtTrigger.next();
    });
  }
  GetDropdown() {
    this.service.GetCompanyList()
      .subscribe(data => {
        this._obj = data as ShareDocumentsDTO;
        this.ObjgetCompanyList = this._obj.Data["CompanyList"];
      });
  }
  GetSelectedUserId(UserId) {
    this.ToUserId = UserId;
  }
  GetUserList(CompanyId) {
    this.CompanyId = CompanyId;
    this._obj.CompanyId = CompanyId;
    this.service.Getuser(this._obj).subscribe(data => {
      this._obj = new ShareDocumentsDTO();
      this.user = data as []
      this.ObjgetuserList = this.user['Data']["UserList"];
    });
  }
  rdPermissionChange(val) {
    this.AccessType = val;
  }
  SendShareRequest() {

    this.objsharedoc.CompanyId = this.CompanyId;
    this.objsharedoc.SharingType = this.SharingType;
    this.objsharedoc.StartDate = (<HTMLInputElement>document.getElementById("txtstartdate")).value;
    this.objsharedoc.EndDate = (<HTMLInputElement>document.getElementById("txtEndDate")).value;
    this.objsharedoc.DocumentId = this.DocumentId;
    this.objsharedoc.SharingStatus = "Pending";
    this.objsharedoc.AccessType = this.AccessType;
    this.objsharedoc.ToUserId = this.ToUserId;

    this.service.AddSharingDocumentsAng(this.objsharedoc).subscribe(data => {
      this.objsharedoc = data as ShareDocumentsDTO;
      if (this.objsharedoc.Message == "1") {
        this._snackBar.open('Request Sent Successfully', 'End now', {
          duration: 2000,
          horizontalPosition: "center",
          verticalPosition: "top",
        });
      }
      this.closeInfo();
    })
  }
}
