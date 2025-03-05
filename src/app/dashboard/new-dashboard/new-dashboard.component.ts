import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
import * as momenth from 'moment-hijri';
@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.css']
})
export class NewDashboardComponent implements OnInit {
  today: string;
  images = [
    { path: 'https://yrglobaldocuments.blob.core.windows.net/documents/Banner/131/588228_Day-1_App-Banner.jpg' },
    { path: 'https://yrglobaldocuments.blob.core.windows.net/documents/Banner/44/160413_Help%20Desk_001%203.png' },
    { path: 'https://yrglobaldocuments.blob.core.windows.net/documents/Banner/147/235199_DMS-Banner.jpg' },
    { path: 'https://yrglobaldocuments.blob.core.windows.net/documents/Banner/145/690704_Magical%20Gingery.jpg' }
  ];
  currentLang: "ar" | "en" = "ar";
  constructor(private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,) {
    // this.today = new Date().toLocaleDateString('en-GB'); // Format: DD-MM-YYYY
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.today = formattedDate;
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
        this.today = this.getIslamicDate(this.today);
      } else if (lang == 'en') {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        this.today = formattedDate;
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
      const editElement = document.getElementById("editrck");
      if (editElement) {
        editElement.textContent = lang === 'ar' ? "إضافة" : "Add";
      }
    });
  }

  ngOnInit(): void {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    this.today = formattedDate;
    // HeaderComponent.languageChanged.subscribe((lang) => {
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
      this.today = this.getIslamicDate(this.today);
    } else if (lang == 'en') {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      this.today = formattedDate;
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    const editElement = document.getElementById("editrck");
    if (editElement) {
      editElement.textContent = lang === 'ar' ? "إضافة" : "Add";
    }
    // });
  }

  getIslamicDate(gregorianDate: string): string {
    return momenth(gregorianDate, 'YYYY-MM-DD').format('iYYYY/iMM/iDD');
  }

}
