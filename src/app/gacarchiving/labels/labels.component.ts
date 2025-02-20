import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { InboxService } from 'src/app/_service/inbox.service';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  labelId: number;
  _obj: GACFiledto;
  _LabelList:any;
  LabelSearch:string;
  LoginUserId:number;
  LabelSearchPlaceholder:string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor( private activatedRoute: ActivatedRoute,
    public service: GACFileService,
    public inboxService:InboxService,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    private renderer: Renderer2
  ) {
    this._obj = new GACFiledto();
    this.initializeLanguageSettings();
   }

  ngOnInit(): void {
    this.subscribeToLanguageChanges();
    this.LoginUserId = this.currentUserValue.createdby;
    this.activatedRoute.params.subscribe(val => {
      // put the code from `ngOnInit` here
      this.labelId = this.activatedRoute.snapshot.params.labelid;
      this.LabelList(this.labelId);
    });
  }
  
  initializeLanguageSettings(): void {
    const lang = localStorage.getItem('language') || 'en';
    this.setLanguageSettings(lang);
  }

  subscribeToLanguageChanges(): void {
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.setLanguageSettings(lang);
    });
  }

  setLanguageSettings(lang: string): void {
    this.translate.use(lang);
    this.LabelSearchPlaceholder = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang === 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang === 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  }

  LabelList(LabelId: number){
    this._LabelList = [];
    this._obj.LabelId = LabelId;
   this.service.ListInLabel(LabelId).subscribe(data =>{
    this._LabelList = data["Data"].LabelsArchiveJson;
    console.log(this._LabelList,"Label List");
   })
  }

  OnClear(){
    this.LabelSearch = "";
    this._LabelList = [];
    this.LabelList(this.labelId);
  }
  Singleselectcheckbox(DocumentId: number,ShareId:number, value: boolean) {
    // Update the IsChecked property for the specified document
    this._LabelList.forEach(element => {
      if (element.DocumentId === DocumentId && ShareId == element.ShareId) {
        element.IsTrash = value
      }
    });
  }

  removetag(Document: number) {
    let DocumentIdsArray = [];
    if (Document != 0) { DocumentIdsArray.push(Document); }
    else {
      if (this._LabelList.length == 0) {
        alert('Please select Document');
        return false;
      }
    }

  
    this._LabelList.forEach(element => {
      if (element.IsChecked) {
        DocumentIdsArray.push(element.DocumentId);
      }
    });
    
    this.inboxService.RemoveLabelToArchive(DocumentIdsArray.toString(), this.labelId, this.currentUserValue.createdby).subscribe(
      data => {
        this._snackBar.open('Memo Tagged Successfully', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
        this.LabelList(this.labelId);
      }
    )
  }

  getImageSource(item: any): string {
    if (!item || !item.FileName) {
      return 'assets/media/Img/filethumb.png'; // Default thumbnail if no filename is present
    }
  
    const fileExtension = item.FileName.split('.').pop()?.toLowerCase(); // Get file extension
  
    if (fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg') {
      return item.Url; // Return actual image URL for PNG and JPEG
    } else {
      return 'assets/media/Img/filethumb.png'; // Default thumbnail for other file types
    }
  }

  sideviw(name, documentid: string, referenceid: string, shareid: string) {
    var id = documentid + "," + referenceid + "," + shareid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}/${shareid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
}
