import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InboxService } from 'src/app/_service/inbox.service';
import { MessageService } from 'src/app/_service/message.service';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsComponent } from '../documents/documents.component';

@Component({
  selector: 'app-document-inbox',
  templateUrl: './document-inbox.component.html',
  styleUrls: ['./document-inbox.component.css']
})
export class DocumentInboxComponent implements OnInit, AfterViewInit {
  _obj1: InboxDTO;
  _Lstlabels: any = [];
  labelid: number;
  LabelCount: number;
  LabelsJsondata: any[] = [];
  Document: string;
  _checkedLabelIds: any = [];
  SelectLabel: any[];
  returnUrl: string;
  Expired: any;
  Select: any;
  toggle: any;
  selectedCabinet: string = "All Documents"; // Default selection
  selectedCabinetId: number;
  currentRoute: any;
  cabinetId: number = 0;
  _CabinetList: any[] = [];
  AllDocumentsCount: number = 0;
  languageValues: any;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  private subscription!: Subscription;
  constructor(public service: GACFileService,
    public serviceL: InboxService,
    private translate: TranslateService,
    private renderer: Renderer2,
    private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this._obj1 = new InboxDTO();
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.languageValues = lang;
      this.translate.use(lang);
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    });


    this.route.firstChild?.paramMap.subscribe(params => {
      const cabinetId = params.get('cabinetid'); // `string | null`
      this.selectedCabinetId = cabinetId !== null ? Number(cabinetId) : 0; // Convert to number or default to 0
    });
  }
  ngAfterViewInit() {
  }

  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.languageValues = lang;
    this.translate.use(lang);
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.CabinetList();

    this.GetLables();

    // Listen for actions from the shared service
    this.subscription = this.messageService.action$.subscribe(action => {
      console.log('Received action:', action);
      if (action === 'menu_close') {
        $('#kt_inbox_aside').removeClass('mbl-left-zero');
      }
    });
  }



  // Function to change the selected cabinet
  selectCabinet(cabinetName: string, cabinetid: number) {
    this.selectedCabinet = cabinetName;
    this.selectedCabinetId = cabinetid;
    this.returnUrl = 'backend/Archive/Documents';
    var myurl = `${this.returnUrl}/${cabinetid}`;
    this.router.navigate([myurl]);
  }

  // Function to check if "New Document" should be disabled
  isNewDocumentDisabled(): boolean {
    return this.selectedCabinet === "All Documents" ||
      this.selectedCabinet === "Favorite" ||
      this.selectedCabinet === "Trash";;
  }

  oncolor() {
    $('#myelement').addClass('.fil-selected');
    $('#myelement').removeClass('.fil-selected');
  }


  GetLables() {
    this._obj1.UserId = this.currentUserValue.createdby;
    this.serviceL.UserLabels(this._obj1)
      .subscribe(data => {
        this._Lstlabels = data["Data"].LablesJson;
        console.log(this._Lstlabels, "Labels");
        this.LabelCount = this._Lstlabels.length;
        this.cd.detectChanges();
      });
  }

  CabinetList() {
    this.service.AssignedCabinetAPI().subscribe(data => {
      this._CabinetList = data['Data'].CabinetJson;
      console.log(data['Data'], "CabinetList");
      this.AllDocumentsCount = data['Data'].DocumentsCount;
      this.route.firstChild?.paramMap.subscribe(params => {
        this.cabinetId = Number(params.get('cabinetid')); // Convert to number if needed

        if (this.cabinetId == 0) {
          this.selectedCabinet = "All Documents";
        }
        else {
          this._CabinetList.forEach(element => {
            if (element.CabinetId == this.cabinetId) {
              this.selectedCabinet = element.CabinetName;
            }
          });
        }
      });
      this.cd.detectChanges();
    })
  }

  // async CabinetList() {
  //   try {
  //     const data: any = await this.service.AssignedCabinetAPI(); // Convert Observable to Promise
  //     debugger
  //     if (data && data['Data']) {
  //       this._CabinetList = data['Data'].CabinetJson;
  //       console.log(data['Data'], "CabinetList");
  //       this.AllDocumentsCount = data['Data'].DocumentsCount;
  //       // Trigger change detection if necessary
  //       this.cd.detectChanges();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching cabinet list:", error);
  //   }
  // }

  labelchange(LabelId) {
    let _value = $("#lbl_" + LabelId).prop('checked');
    if (_value) this._checkedLabelIds.push(LabelId);
    else {
      this._checkedLabelIds = jQuery.grep(this._checkedLabelIds, function (value) {
        return value != LabelId;
      });
    }
    this.SelectLabel = [];
    this._checkedLabelIds.forEach(element => {
      this._Lstlabels.forEach(elementI => {
        if (element == elementI.LabelId) {
          this.SelectLabel.push(elementI.LabelName);
        }
      });
    });
  }

  AddLabels() {
    var __labelname = (<HTMLInputElement>document.getElementById("txtlabels")).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelName = __labelname;
    this._obj1.LabelId = 0;
    this._obj1.FlagId = 1;
    this._obj1.IsActive = true;
    this.serviceL.AddLabels(this._obj1)
      .subscribe(data => {
        console.log(data, "Insert Label")
        if (data['Message'] == true) {
          this._Lstlabels = data['Data'].LablesJson;
          console.log(this.LabelsJsondata, "Label List");
          const language = localStorage.getItem('language');
          // Display message based on language preference
          if (language === 'ar') {
            this._snackBar.open('تم إنشاء التصنيف بنجاح', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          } else {
            this._snackBar.open('Label Create Successfully', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          }
          this.cd.detectChanges();
          this.GetLables();
          (<HTMLInputElement>document.getElementById("txtlabels")).value = "";
        }
        else if (data['Message'] == false) {
          const language = localStorage.getItem('language');
          if (language === 'ar') {
            this._snackBar.open('هناك خطأ ما', 'تنتهي الآن', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          } else {
            this._snackBar.open('Something went wrong', 'End now', {
              duration: 5000,
              horizontalPosition: "right",
              verticalPosition: "bottom"
            });
          }
        }
      });
  }

  UpdateLabel(labelid: number) {
    var __labelname = (<HTMLInputElement>document.getElementById("txteditlabels_" + labelid)).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelName = __labelname;
    this._obj1.LabelId = labelid;
    this._obj1.FlagId = 2;

    this.serviceL.AddLabels(this._obj1)
      .subscribe(data => {
        this._Lstlabels = data["Data"]["LablesJson"]
        this.cd.detectChanges();
      });
  }

  fordelete(lblid) {
    this.labelid = lblid;
  }

  LabelsRemove() {
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelId = this.labelid;
    this.serviceL.DeleteUserLabels(this._obj1)
      .subscribe(data => {
        this._Lstlabels = data["Data"]["LablesJson"];
        console.log(this._Lstlabels, "Remove Label");
        this.LabelCount = this._Lstlabels.length;
        this.cd.detectChanges();
      });
  }

  CreateNewLabel() {
    var __labelname = (<HTMLInputElement>document.getElementById("txtcreateNewLabel")).value;
    if (__labelname == "") {
      alert('Please Enter Label Name')
      return false;
    }
    this._obj1.UserId = this.currentUserValue.createdby;
    this._obj1.LabelName = __labelname;
    this._obj1.LabelId = 0;
    this._obj1.FlagId = 1;
    this.serviceL.AddLabels(this._obj1)
      .subscribe(data => {
        this._Lstlabels = data["Data"].LablesJson;
        this.cd.detectChanges();
        (<HTMLInputElement>document.getElementById("txtcreateNewLabel")).value = "";
        this.GetLables();
      });
  }

  More() {
    $('.kt-nav__item').removeClass('d-none');
    $('.kt-db-vm').addClass('d-none');
  }


  LabelActivaleclass() {
    $('.kt-cnt-v').addClass('d-none');
    $('.label-height').addClass('active');
  }
  Labelcolorremove() {
    $(".LabelsClass").removeClass("active")
    // document.getElementById("li_" + labelid).classList.remove("active");
  }

  LoadLabelMemos(labelid: number) {
    $(".LabelsClass").removeClass("active")
    document.getElementById("li_" + labelid).classList.add("active");
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'backend/Archive/Label';
    var myurl = `${this.returnUrl}/${labelid}`;
    this.router.navigate([myurl]);
  }

  opentoggle() {
    $('#kt_inbox_aside').addClass('mbl-left-zero');
    this.messageService.sendMessage('menu_open');
  }

}
