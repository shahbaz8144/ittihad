import { Component, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import * as htmlToImage from 'html-to-image';
import { HttpEvent } from '@angular/common/http';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import { AnnouncementComponent } from '../announcement/announcement.component';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css'],
})
export class SuggestionsComponent implements OnInit {
  _obj: InboxDTO;
  OrderBy: any;
  SearchSuggesstions: string;
  _LstToSuggestion = [];
  SearchPolls:string;
  _TotaluserList:InboxDTO[];
  _ReaduserLists:InboxDTO[];
  _OptionList :any = [];
  Totalusersearch:string;
  Readuserserach:string;
  SelectedSubject:string;
  CurrentRoleId:number
  _CurrentUserId:number;
  _ReadUserListII :any = [];  
  PollUserSearch:string;
  FiltersSelected: boolean;
  VoteUserSearch:string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];

  }
  constructor(private inboxService: InboxService,
     public newmemoService: NewMemoService
     ,private _announcement: AnnouncementComponent
     , private translate : TranslateService
     ,private renderer: Renderer2
     ) {
    this._obj = new InboxDTO();
    HeaderComponent.languageChanged.subscribe(lang => {
      localStorage.setItem('language',lang)
      this.translate.use(lang);
      this.SearchPolls = lang === 'en' ? 'Search Vote...' : "بحث التصويت...";
      this.PollUserSearch = lang === 'en' ? 'Serach' : 'يبحث';
      this.VoteUserSearch = lang === 'en' ? 'Serach' : 'يبحث';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    })
  }

  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.SearchPolls = lang === 'en' ? 'Search Polls...' : 'بحث في الاستطلاعات...';
    this.PollUserSearch = lang === 'en' ? 'Serach' : 'يبحث';
    this.VoteUserSearch = lang === 'en' ? 'Serach' : 'يبحث';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.CurrentRoleId = this.currentUserValue.RoleId;
    this._CurrentUserId = this.currentUserValue.createdby;
    this.SuggestionsList();
  }
  ReBindData() {
    this.SearchSuggesstions = "";
    this.SuggestionsList();
  }

  SuggestionsList() {
    this.inboxService.SuggestionsList(this.currentUserValue.organizationid, this.currentUserValue.createdby).subscribe(
      data => {
        // console.log(data,"Suggestions");
        // Old API Response
        // this._obj = data as InboxDTO;
        // this._LstToSuggestion = JSON.parse(this._obj.SuggestionJson);
        this._LstToSuggestion = data["Data"];
        this._LstToSuggestion = this._LstToSuggestion["SuggestionJson"]
        // console.log(this._LstToSuggestion,"suggestion");
        this._LstToSuggestion.forEach(element => {
            element.TotalUserJson = JSON.parse(element.TotalUserJson);
        });
        this._LstToSuggestion.forEach(element => {
          element.UserPollJson = element.UserPollJson;
      });
      }
    )
  }
  TotalUser(SuggestionId,value){
    this.SelectedSubject = value;
    this._LstToSuggestion.forEach(element => {
      if(element.SuggestionId==SuggestionId){
        this._TotaluserList = (element.TotalUserJson);
      }
    });
    this.Totalusersearch = "";
    
  }
 
  Readusers(SuggestionId,value){
    this.SelectedSubject = value;
    this._LstToSuggestion.forEach(element => {
      if(element.SuggestionId==SuggestionId){
        this._ReaduserLists = (element.UserPollJson);
        this._OptionList = element.OptionJson;
        this._ReadUserListII = element.UserPollJson;
        // console.log(this._ReaduserLists,"ReadJSON");
        console.log(this._OptionList,"FilterJSON");
      }
    });
    this.Readuserserach = "";
    // alert(this._ReaduserLists.length);
  }
  ClearText(){
    this.Totalusersearch = "";
    this.Readuserserach = "";
  }
  FilterId:number;
  FilterRaedUser(OptioinId:number){
    this.FilterId= OptioinId;
    this._ReaduserLists = this._ReadUserListII.filter(item => item.OptioinId == OptioinId );
    this.FiltersSelected = true;
    // console.log(this._ReaduserLists);
  }
  ClearFilters(){
    this.FilterId = 0;
    this.FiltersSelected = false;
    this._ReaduserLists = this._ReadUserListII;
  }
  AddSuggestionOption(suggesid: number, optionid: number) {
    this.inboxService.AddUserSuggestionOption(suggesid, optionid, this.currentUserValue.createdby, 1).subscribe(
      data => {
        console.log(data, "user suggestions");
        this._obj = data as InboxDTO;
        this._LstToSuggestion = JSON.parse(this._obj.SuggestionJson);
      }
    )
  }
  src: any;
  ShareSuggestion(SuggestionId: number) {
    (<HTMLInputElement>document.getElementById("Kt_share")).classList.add("kt-quick-panel--on");
    document.getElementsByClassName("kt-aside-share-overlay")[0].classList.add("d-block");
    htmlToImage.toPng(document.getElementById('sharediv_' + SuggestionId)).then((dataUrl) => {
      // this.src = dataUrl;
      // this.src = '<img src="' + dataUrl + '"/>'
      // download(dataUrl, 'my-node.png');
      // this.src = '<img src="' + dataUrl + '"/>'
      // var _byte = this._base64ToArrayBuffer(dataUrl);
      // alert(_byte.byteLength)
      const frmData = new FormData();
      frmData.append("fileUpload", dataUrl);
      frmData.append("SuggestionId", SuggestionId.toString());
      this.newmemoService.UploadSuggestionShareAttachment(frmData).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {

          }
        }
      )

    });
  }

  _base64ToArrayBuffer(base64) {
    debugger
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  closeshre() {
    (<HTMLInputElement>document.getElementById("Kt_share")).classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("kt-aside-share-overlay")[0].classList.remove("d-block");
  }
  closeInfo() {
    $('.kt-quick-panel').removeClass('kt-quick-panel--on');
    document.getElementsByClassName("kt-aside-share-overlay")[0].classList.remove("d-block");

  }


}
