import { Component, OnInit, Renderer2 } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  LoginUserId:number;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  _TrashList:any = [];
  activePage: number;
  _CurrentpageRecords: number;
  TrashSearch:string = "";
  _obj: GACFiledto;
  _DeleteDocumentsIds: number[] = [];
  TrashSearchs:string;
  constructor(public service: GACFileService,
    private translate: TranslateService,
    private renderer: Renderer2
  ) { 
    this._obj = new GACFiledto();
    this.initializeLanguageSettings();
  }

  ngOnInit(): void {
    this.subscribeToLanguageChanges();
    this.activePage = 1;
    this.TrashList();
    this.LoginUserId = this.currentUserValue.createdby;
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
    this.TrashSearchs = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang === 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang === 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  }

  TrashList(){
    this.service.ListInTrash().subscribe(
      data => {
     console.log(data,"Trash List Data");
      this._TrashList = data["Data"].TrashJson;
      console.log(this._TrashList, "Trash List");
      }
    );
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

  OnClear(){
    this.TrashSearch = "";
    this.TrashList();
  }
  
  Singleselectcheckbox(DocumentId: number,ShareId:number, value: boolean) {
    // Update the IsChecked property for the specified document
    this._TrashList.forEach(element => {
      if (element.DocumentId === DocumentId && ShareId == element.ShareId) {
        element.IsTrash = value
      }
    });
  }

  DeleteDocuments(_status: boolean) {
    this._DeleteDocumentsIds = this._TrashList
    .filter(item => item.IsChecked)
    .map(item => ({
      ShareId: item.ShareId,
      DocumentId: item.DocumentId,
      IsTrash: _status
    }));

    if (this._DeleteDocumentsIds.length === 0) {
      alert('Please select Documents');
      return false;
    }
    Swal.fire({
      title: this.translate.instant('Communication.title'),
      text: this.translate.instant('Communication.deleteTextdoc'),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant('Communication.confirmButtonTextdoc'),
      cancelButtonText: this.translate.instant('Communication.cancelButtonText')
    }).then((result) => {
      if (result.isConfirmed) {
    this._obj.trashjson = JSON.stringify(this._DeleteDocumentsIds);
    console.log(JSON.stringify(this._DeleteDocumentsIds), "Delete record ");
  
    // Uncomment to make the actual delete request
    this.service.DocumentsDelete(this._obj).subscribe(
      data => {
        console.log(data, "Deleted");
        this.TrashList();
      }
    );
  }else {
    this._TrashList.forEach(elementI => {
      elementI["IsChecked"] = false;
    });
  }
  });
  }

  sideviw(name, documentid: string, referenceid: string, shareid: string) {
    var id = documentid + "," + referenceid + "," + shareid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}/${shareid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
}
