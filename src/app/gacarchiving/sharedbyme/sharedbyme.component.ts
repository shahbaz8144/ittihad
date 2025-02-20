import { Component, OnInit, Renderer2 } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-sharedbyme',
  templateUrl: './sharedbyme.component.html',
  styleUrls: ['./sharedbyme.component.css']
})
export class SharedbymeComponent implements OnInit {
  _obj: GACFiledto;
  _SharedByMeList:any;
  SharedByMeSearch:string;
  _FavoriteDocumentsIds = [] = [];
  _PinDocumentsIds = [] = [];
  SharedByMeSearchPlaceholder:string;
  constructor(public service: GACFileService,
    private translate: TranslateService,
    private renderer: Renderer2
  ) {
    this._obj = new GACFiledto();
    this.initializeLanguageSettings();
   }

  ngOnInit(): void {
    this.subscribeToLanguageChanges();
    this.SharedByMeList();
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
    this.SharedByMeSearchPlaceholder = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang === 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang === 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  }

  SharedByMeList() {
    this.service.GetSharebymeList().subscribe(data => {
      console.log(data,"SharedByMe List")
      this._obj = data as GACFiledto;
      this._SharedByMeList = this._obj.Data['ArchiveJson'];
      console.log( this._SharedByMeList,"_SharedByMeList 11");
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
    this.SharedByMeSearch = "";
    this.SharedByMeList();
  }
  FavoriteDocuments(DocumentId: number,   ShareId:number,  isFavorite: boolean) {
    this._FavoriteDocumentsIds = this._SharedByMeList
    .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    .map(document => ({
      ShareId: document.ShareId,
      DocumentId: document.DocumentId,
      IsFavorite: isFavorite ? false : true
    }));

    this._SharedByMeList.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId ) {
        document.IsFavorite = isFavorite ? false : true; // Toggle the favorite status
      }
    });
    this._obj.favoritejson = JSON.stringify(this._FavoriteDocumentsIds);
    console.log('Favorite Documents:', JSON.stringify(this._FavoriteDocumentsIds));
    this.service.DocumentsFavorite(this._obj).subscribe(
      data => {
        this._SharedByMeList = [];
        this.SharedByMeList();
      }
    );
  }

  DocumentPin(DocumentId: number,ShareId:number, IsPin: boolean) {
    this._PinDocumentsIds = this._SharedByMeList
    .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    .map(document => ({
      ShareId: document.ShareId,
      DocumentId: document.DocumentId,
      IsPin: IsPin
    }));

    this._SharedByMeList.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId ) {
        document.IsPin = IsPin; // Toggle the favorite status
      }
    });
    this._obj.Ispinjson = JSON.stringify(this._PinDocumentsIds);
    console.log(JSON.stringify(this._PinDocumentsIds), "Pin value");
    this.service.PinDocuments(this._obj).subscribe(
      data => {
        this._SharedByMeList = [];
        this.SharedByMeList();
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
