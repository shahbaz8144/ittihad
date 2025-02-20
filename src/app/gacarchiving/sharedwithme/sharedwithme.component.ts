import { Component, OnInit, Renderer2 } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sharedwithme',
  templateUrl: './sharedwithme.component.html',
  styleUrls: ['./sharedwithme.component.css']
})
export class SharedwithmeComponent implements OnInit {
  _obj: GACFiledto;
  SharedWithMeLists:any;
  SharedwithmeSearch:string;
  _FavoriteDocumentsIds = [] = [];
  _PinDocumentsIds = [] = [];
  SharedwithmeSearchPlaceholder:string;
  constructor(public service: GACFileService,
    private translate: TranslateService,
    private renderer: Renderer2
  ) {
    this._obj = new GACFiledto();
    this.initializeLanguageSettings();
   }

  ngOnInit(): void {
    this.subscribeToLanguageChanges();
  this.SharedWithMeList();
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
    this.SharedwithmeSearchPlaceholder = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang === 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang === 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  }

  SharedWithMeList() {
    this.service.GetSharedwithMeDocumentsList()
      .subscribe(data => {
        console.log(data, "SharedWithMe List");
        this._obj = data as GACFiledto;
        this.SharedWithMeLists = this._obj.Data['ArchiveJson'];
        console.log(this.SharedWithMeLists ,"SharedWithMeLists");
      });
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
    this.SharedwithmeSearch = "";
    this.SharedWithMeList();
  }
  FavoriteDocuments(DocumentId: number,   ShareId:number,  isFavorite: boolean) {
    this._FavoriteDocumentsIds = this.SharedWithMeLists
    .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    .map(document => ({
      ShareId: document.ShareId,
      DocumentId: document.DocumentId,
      IsFavorite: isFavorite ? false : true
    }));

    this.SharedWithMeLists.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId ) {
        document.IsFavorite = isFavorite ? false : true; // Toggle the favorite status
      }
    });
    this._obj.favoritejson = JSON.stringify(this._FavoriteDocumentsIds);
    console.log('Favorite Documents:', JSON.stringify(this._FavoriteDocumentsIds));
    this.service.DocumentsFavorite(this._obj).subscribe(
      data => {
        this.SharedWithMeLists = [];
        this.SharedWithMeList();
      }
    );
  }

  DocumentPin(DocumentId: number,ShareId:number, IsPin: boolean) {
    this._PinDocumentsIds = this.SharedWithMeLists
    .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    .map(document => ({
      ShareId: document.ShareId,
      DocumentId: document.DocumentId,
      IsPin: IsPin
    }));

    this.SharedWithMeLists.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId ) {
        document.IsPin = IsPin; // Toggle the favorite status
      }
    });
    this._obj.Ispinjson = JSON.stringify(this._PinDocumentsIds);
    console.log(JSON.stringify(this._PinDocumentsIds), "Pin value");
    this.service.PinDocuments(this._obj).subscribe(
      data => {
        this.SharedWithMeLists = [];
        this.SharedWithMeList();
      }
    );
  }

  sideviw(name, documentid: string, referenceid: string, shareid: string) {
    var id = documentid + "," + referenceid + "," + shareid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}/${shareid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }
}
