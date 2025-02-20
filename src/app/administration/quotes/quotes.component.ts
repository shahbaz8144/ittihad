import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CompanyDTO } from 'src/app/_models/company-dto';
import { CompanyService } from 'src/app/_service/company.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  _obj: CompanyDTO;
  Quotes: string;
  _QuotesList: any = [];
  searchText: string;
  String_status: string;
  InActive = false;
  currentLang:"ar"|"en"="ar";
  EnterQuote:string;
  TableSearch:string;
  isShow: boolean;
  constructor(public services: CompanyService, private _snackBar: MatSnackBar, 
    private dialog: MatDialog,
    private translate:TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this._obj = new CompanyDTO();
    this.isShow = false;
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.EnterQuote = lang === 'en' ? 'Enter Quote' : lang === 'ar' ? 'أدخل الاقتباس' : '';
    this.TableSearch = lang === 'en' ? 'Search' : lang === 'ar' ? 'يبحث' : '';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
     })
  }
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.translate.use(lang);
  this.currentLang = lang ? lang : 'en';
  this.EnterQuote = lang === 'en' ? 'Enter Quote' : lang === 'ar' ? 'أدخل الاقتباس' : '';
  this.TableSearch = lang === 'en' ? 'Search' : lang === 'ar' ? 'يبحث' : '';
  this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  if(lang == 'ar'){
    this.renderer.addClass(document.body, 'kt-body-arabic');
  }else if (lang == 'en'){
    this.renderer.removeClass(document.body, 'kt-body-arabic');
  }
    this.QuotesList();
  }
  ReBindData(){
    this.searchText = "";
    this.QuotesList();
  }
  AddQuotes() { //Add Quotes
    this._obj.Quotes = this.Quotes;
    this.services.AddUpdateQuotes(this._obj).subscribe(data => {
      console.log(data, "Quotes");

      if (data["message"] == "1") {
        const language = localStorage.getItem('language');

            // Display message based on language preference
            if (language === 'ar') {
              this._snackBar.open('تم التحديث بنجاح', 'تنتهي الآن', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom",
              });
            } else {
              this._snackBar.open('Updated Successfully', 'End now', {
                duration: 5000,
                horizontalPosition: "right",
                verticalPosition: "bottom",
              });
            }
      }
      else {
        const language = localStorage.getItem('language');

        // Display message based on language preference
        if (language === 'ar') {
          this._snackBar.open('هناك خطأ ما', 'تنتهي الآن', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['red-snackbar']
          });
        } else {
          this._snackBar.open('Something went wrong', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['red-snackbar']
          });
        }
       
      }
      this.QuotesList();
      this.onclear();
      this.isShow = false;
    });
  }
  QuotesList() { // To view list
    this.services.GetQuotes().subscribe(data => {
      console.log(data, "Quotes");
      this._QuotesList = data as [];  
    });
  }
  Quotes_edit(Q1:CompanyDTO){ // Edit functionality 
    this.Quotes = Q1.Quotes;
    this.isShow = true;
  }
  onclear(){ // Clear Functionality 
    this.Quotes=""
  }
}
