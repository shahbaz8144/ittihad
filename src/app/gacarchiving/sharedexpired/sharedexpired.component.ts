import { Component, OnInit, Renderer2 } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-sharedexpired',
  templateUrl: './sharedexpired.component.html',
  styleUrls: ['./sharedexpired.component.css']
})
export class SharedexpiredComponent implements OnInit {
  _obj: GACFiledto;
  _SharedExpired: any;
  SharedExpiredSearch: string;
  _FavoriteDocumentsIds = [] = [];
  _PinDocumentsIds = [] = [];
  SharedExpiredSearchPlaceholder: string;
  constructor(public service: GACFileService,
    private translate: TranslateService,
    private renderer: Renderer2
  ) {
    this._obj = new GACFiledto();
    this.initializeLanguageSettings();
  }

  ngOnInit(): void {
    this.subscribeToLanguageChanges();
    // this.SharedExpired();
    this._SharedExpired = [];
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
    this.SharedExpiredSearchPlaceholder = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang === 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang === 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  }

  SharedExpired() {
    this.service.GetSharebymeExpiredDocumentList().subscribe(data => {
      this._obj = data as GACFiledto;
      this._SharedExpired = this._obj.Data['SharedByMeExpiredList'];
      console.log(this._SharedExpired, "_SharedExpired");
    });
  }
  OnClear() {
    this.SharedExpiredSearch = "";
    this.SharedExpired();
  }
  FavoriteDocuments(DocumentId: number, ShareId: number, isFavorite: boolean) {
    this._FavoriteDocumentsIds = this._SharedExpired
      .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
      .map(document => ({
        ShareId: document.ShareId,
        DocumentId: document.DocumentId,
        IsFavorite: isFavorite ? false : true
      }));

    this._SharedExpired.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId) {
        document.IsFavorite = isFavorite ? false : true; // Toggle the favorite status
      }
    });
    this._obj.favoritejson = JSON.stringify(this._FavoriteDocumentsIds);
    console.log('Favorite Documents:', JSON.stringify(this._FavoriteDocumentsIds));
    this.service.DocumentsFavorite(this._obj).subscribe(
      data => {
        this._SharedExpired = [];
        this.SharedExpired();
      }
    );
  }

  DocumentPin(DocumentId: number, ShareId: number, IsPin: boolean) {
    this._PinDocumentsIds = this._SharedExpired
      .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
      .map(document => ({
        ShareId: document.ShareId,
        DocumentId: document.DocumentId,
        IsPin: IsPin
      }));

    this._SharedExpired.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId) {
        document.IsPin = IsPin; // Toggle the favorite status
      }
    });
    this._obj.Ispinjson = JSON.stringify(this._PinDocumentsIds);
    console.log(JSON.stringify(this._PinDocumentsIds), "Pin value");
    this.service.PinDocuments(this._obj).subscribe(
      data => {
        this._SharedExpired = [];
        this.SharedExpired();
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
