import { Component, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Outsourcedto } from 'src/app/_models/outsourcedto';
import { UserDTO } from 'src/app/_models/user-dto';
import { OutsourceService } from 'src/app/_service/outsource.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';
@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {
  _obj: Outsourcedto;
  _MeeteingData: any;
  selected:any;
  MeetingSerach:string;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  pipe = new DatePipe('en-US');
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  MeetingSearch:string;
  Dateselectionrange:string;
  constructor(private outsourceService: OutsourceService,
    private renderer: Renderer2,
    private datePipe: DatePipe) {
    this._obj = new Outsourcedto();
  HeaderComponent.languageChanged.subscribe(lang => {
    this.MeetingSearch = lang === 'en' ? 'Search' : 'يبحث'; 
    this.Dateselectionrange = lang === 'en' ? 'Date selection range' : 'نطاق اختيار التاريخ';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  })
  }
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  ngOnInit(): void {
    const lang:any = localStorage.getItem('language');
    this.MeetingSearch = lang === 'en' ? 'Search' : 'يبحث'; 
    this.Dateselectionrange = lang === 'en' ? 'Date selection range' : 'نطاق اختيار التاريخ';
    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.MeetingList(1);
  }
  Searchighlight() {
    document.getElementById("search-grp").classList.add("group-active");
  }
  clearshow() {
    document.getElementById("clrr-btn").classList.remove("d-none");
  }
  clearSearch() {
    this.MeetingSerach = "";
    this.MeetingList(1);
  }
  IconSearch() {
    if (this.MeetingSerach === "") {
      (<HTMLInputElement>document.getElementById("txtSearch")).focus();
      document.getElementById("search-grp").classList.add("group-active");
    } else {
      this.MeetingList(1);
    }
  }
  onBackspace(event: KeyboardEvent) {
    if (event.key === "Backspace" && this.MeetingSerach === "") {
      this.MeetingList(1);
    }
  }
  sorttypes:number;
  MeetingList(_Val) {
    this.sorttypes = _Val;
    this._obj.Emp_No = '400162';//this.currentUserValue.EmployeeCode;
    this._obj.sorttype = _Val;
    this._obj.startdate = this._StartDate;
    this._obj.enddate = this._EndDate;
    this.outsourceService.EpMeetings(this._obj)
      .subscribe(data => {
        this._MeeteingData = data["Data"]["MeetingJSON"];
        console.log(this._MeeteingData, "MeetingData");
        this._MeeteingData.forEach(element => {
          element.usersjson = JSON.parse(element.Addguest);
        });
      });
  }
  _StartDate: string = '';
  _EndDate: string = '';
  datesUpdated($event) {
    if ($event.startDate && $event.endDate) {
      this._StartDate = this.formatDate($event.startDate, 'yyyy-MM-dd');
      this._EndDate = this.formatDate($event.endDate, 'yyyy-MM-dd');
      this.MeetingList(this.sorttypes);
    }
  }
  private formatDate(date: string, format: string, includeTime: boolean = false): string {
    const formattedDate = this.datePipe.transform(date, format);
    return includeTime ? formattedDate + ' 00:00:00' : formattedDate || '';
  }
  getAttendeesInMeeting(people) {
    if (Array.isArray(people)) {
      let total = 0;
      people.forEach((pr) => {
        if (pr.Status === "Accepted")
          total = total + 1;
      });
      return total;
    }
    return "";
  }
  // Searchighlight() {
  //   document.getElementById("search-grp").classList.add("group-active");
  // }
}
