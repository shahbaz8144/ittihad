import { Component, OnInit, Renderer2 } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { TranslateService } from '@ngx-translate/core';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  _FavoriteList:any=[];
  FavoriteSearch:string;
  _FavoriteDocumentsIds = [] = [];
  _obj:GACFiledto;
  _CheckedDocumentsIds: number[] = [];
  IsRead: boolean = false; 
  FavoriteSearchs:string;
 
  constructor(public service: GACFileService,
    private translate: TranslateService,
    private renderer: Renderer2
  ) { 
    this._obj = new GACFiledto();
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      this.FavoriteSearchs = lang === 'en' ? 'Search....' : 'يبحث....';
    });
  }

  ngOnInit(): void {
    this.FavoriteList();
    this.ArabicContent();
  }

  ArabicContent(){
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.FavoriteSearchs = lang === 'en' ? 'Search....' : 'يبحث....';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  }

  FavoriteList(){
    this.service.ListInFavorite().subscribe(
      data => {
     console.log(data,"Favorite List Data");
      this._FavoriteList = data["Data"].FavoriteJson;
      console.log(this._FavoriteList, "Favorite List");
      }
    );
  }

  OnClear(){
    this.FavoriteSearch  = "";
    this.FavoriteList();
  }

  FavoriteDocuments(DocumentId: number,   ShareId:number,  isFavorite: boolean) {
    this._FavoriteDocumentsIds = this._FavoriteList
    .filter(document => document.DocumentId == DocumentId && ShareId == document.ShareId)
    .map(document => ({
      ShareId: document.ShareId,
      DocumentId: document.DocumentId,
      IsFavorite: isFavorite ? false : true
    }));

    this._FavoriteList.forEach(document => {
      if (document.DocumentId === DocumentId && ShareId == document.ShareId ) {
        document.IsFavorite = isFavorite ? false : true; // Toggle the favorite status
      }
    });
    this._obj.favoritejson = JSON.stringify(this._FavoriteDocumentsIds);
    console.log('Favorite Documents:', JSON.stringify(this._FavoriteDocumentsIds));
    this.service.DocumentsFavorite(this._obj).subscribe(
      data => {
        this.FavoriteList();
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

  sideviw(name, documentid: string, referenceid: string, shareid: string) {
    var id = documentid + "," + referenceid + "," + shareid;
    var url = document.baseURI + name;
    var myurl = `${url}/${documentid}/${referenceid}/${shareid}`;
    var myWindow = window.open(myurl, id);
    myWindow.focus();
  }

  
}
