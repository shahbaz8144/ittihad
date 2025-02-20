import { DOCUMENT } from '@angular/common';
import { Component, OnInit , Inject, Renderer2} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';


@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;
  currentLang:"ar"|"en"="ar";
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate:TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,) { 
      HeaderComponent.languageChanged.subscribe((lang)=>{
        localStorage.setItem('language',lang);
        this.translate.use(lang);
        this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
  
         })
    }
  ngOnInit() {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
  }

}
