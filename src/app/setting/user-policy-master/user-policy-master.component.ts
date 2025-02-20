import { Component, OnInit, Renderer2, Inject, ChangeDetectorRef, AfterViewInit, ViewChild, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ConfirmDialogComponent } from 'src/app/master-forms/confirmdialog/confirmdialog.component';
import { UserPolicyMasterDTO } from 'src/app/_models/user-policy-master-dto';
import { UserPolicyMasterServiceService } from 'src/app/_service/user-policy-master-service.service';
import tippy from 'tippy.js';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DOCUMENT } from '@angular/common';
import * as  Editor from 'ckeditor5-custom-build/build/ckeditor';
// import * as QuillNamespace from 'quill';  // Import Quill
// import ImageResize from 'quill-image-resize-module';  // Import the image resize module
// import { QuillEditorComponent } from 'ngx-quill';
// // import 'quill-emoji/dist/quill-emoji.js';  // Import quill-emoji plugin

// const Quill: any = QuillNamespace;
// Quill.register('modules/imageResize', ImageResize);  // Register the module
// // Quill.register('modules/emoji', true);  // Register the emoji module

@Component({
  selector: 'app-user-policy-master',
  templateUrl: './user-policy-master.component.html',
  styleUrls: ['./user-policy-master.component.css']
})
export class UserPolicyMasterComponent implements OnInit, AfterViewInit {
  // @ViewChild('quillEditor') quillEditor: QuillEditorComponent;  // Reference to Quill editor
  public Editor: any = Editor;
  placeholder: any;
  placeholder1: any;
  loadAPI: Promise<any>;
  UserPolicyList: any[];
  _obj: UserPolicyMasterDTO
  status: any;
  IsActive: boolean;
  String_status: string;
  InActive = false;
  PolicyId: number;
  PolicyHeader: string;
  PolicyContent: string = 'Initial content';
  isShow: boolean;
  searchText: string;
  item: any;
  ObjgetCompanyList: any;
  ObjgetDepartmentList: any;
  ObjgetDesignationList: any;
  CompanySelectedValue = [];
  DepartmentSelectedValue = [];
  DesignationSelectedValue = [];
  IsAll: boolean;
  IsCompany: boolean;
  IsDepartment: boolean;
  IsDesignation: boolean;
  CompanyIds: string;
  DepartmentIds: string;
  DesignationIds: string;
  CompanyId: any;
  DepartmentId: any;
  DesignationId: any;
  checked: any;
  PolicySearch: string;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  // Configure the toolbar with select options
  // editorModules = {
  //   toolbar: [
  //     [{ 'font': ['serif', 'monospace'] }],  // Custom font family options
  //     [{ 'size': ['small', false, 'large', 'huge'] }],  // Font size options
  //     [{ 'header': [1, 2, 3, false] }],  // Header dropdown
  //     [{ 'align': [] }],  // Text alignment
  //     ['bold', 'italic', 'underline'],
  //     [{ 'color': [] }, { 'background': [] }],  // Color pickers
  //     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  //     ['link', 'image']  // Link and image4
  //     // ['emoji']
  //   ],
  //   // emoji: true, // Enable the emoji module
  //   imageResize: {
  //   }
  // };
  showEmojiPicker = false;  // Control visibility of emoji picker
  currentLang: "ar" | "en" = "ar";
  versionLength: any = [];
  policyheader: any;
  Company: any = [];
  Department: any = [];
  Designation: any = [];
  EnterPolicyName: string;
  EnterPolicyContent: string;
  SelectCompany: string;
  SelectDepartment: string;
  SelectDesignation: string;
  constructor(public service: UserPolicyMasterServiceService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef
  ) {
    this._obj = new UserPolicyMasterDTO();
    this.UserPolicyList = [];
    this.isShow = false;
    this.ObjgetCompanyList = [];
    this.ObjgetDepartmentList = [];
    this.ObjgetDesignationList = [];
    this.CompanySelectedValue = [];
    this.DepartmentSelectedValue = [];
    this.DesignationSelectedValue = [];
    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.PolicySearch = lang === 'en' ? 'Search' : 'يبحث';
      this.EnterPolicyContent = lang === 'en' ? 'Enter PolicyContent' : 'أدخل محتوى السياسة';
      this.EnterPolicyName = lang === 'en' ? 'Enter PolicyName' : 'أدخل اسم السياسة';
      this.SelectCompany = lang === 'en' ? 'Select Company' : 'اختر الشركة';
      this.SelectDepartment = lang === 'en' ? 'Select Department' : 'اختر القسم';
      this.SelectDesignation = lang === 'en' ? 'Select Designation' : 'حدد التعيين';
      let tooltipContent = '';
      if (lang === 'en') {
        tooltipContent = 'Enter Policy Header';
      } else if (lang === 'ar') {
        tooltipContent = 'أدخل عنوان السياسة';
      }
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }

      // Initialize Tippy.js with the appropriate tooltip content
      tippy('#PolicyHeader', {
        content: tooltipContent,
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true
      });
    })
  }
  ngAfterViewInit() {
    // After the view is initialized, trigger change detection
    this.cdr.detectChanges();
  }
  // Method called when Quill editor is fully initialized
  // onEditorReady(event: any) {
  //   alert(0);
  //   console.log('Quill Editor Initialized', event);
  //   // Add any additional logic after initialization here
  //   // Force content refresh and trigger change detection
  //   this.cdr.detectChanges();
  //   const quillEditor = document.querySelector('.ql-editor');
  //   // Ensure Quill is updated with PolicyContent
  //   if (quillEditor) {
  //     quillEditor.innerHTML = this.PolicyContent;
  //   }
  //   alert(this.PolicyContent);
  // }
  onContentChanged(event: any) {
    // Update the model when content changes
    this.PolicyContent = event.html;
  }
  // Handle emoji selection and insert it into the editor
  addEmoji(event: any) {
    const emoji = event.emoji.native;  // Get the selected emoji
    // const quillEditor = document.querySelector('.ql-editor');
    // quillEditor.innerHTML += emoji;  // Insert the emoji into the editor content
    this.PolicyContent += emoji;
    this.showEmojiPicker = false;  // Hide the emoji picker after selection
  }

  // Toggle emoji picker visibility
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  public loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
        isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = [
        environment.assetsurl + "node_modules/nestable2/jquery.nestable.js",
        environment.assetsurl + "assets/js/nestable.js" //nestedreorder
      ];

      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  }

  ngOnInit(): void {

    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.PolicySearch = lang === 'en' ? 'Search' : 'يبحث';
    this.EnterPolicyContent = lang === 'en' ? 'Enter PolicyContent' : 'أدخل محتوى السياسة';
    this.EnterPolicyName = lang === 'en' ? 'Enter PolicyName' : 'أدخل اسم السياسة';
    this.SelectCompany = lang === 'en' ? 'Select Company' : 'اختر الشركة';
    this.SelectDepartment = lang === 'en' ? 'Select Department' : 'اختر القسم';
    this.SelectDesignation = lang === 'en' ? 'Select Designation' : 'حدد التعيين';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    this.IsAll = true;
    this.IsCompany = false;
    this.IsDepartment = false;
    this.IsDesignation = false;

    this.getDropdown();

    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Enter Policy Header';
    } else if (lang === 'ar') {
      tooltipContent = 'أدخل عنوان السياسة';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#PolicyHeader', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });

    this.PolicyList();
    setTimeout(() => {
      this.loadAPI = new Promise((resolve) => {
        this.loadScript();
        resolve(true);
      });
    }, 2000);

    // $("input[name='fav_language']").click(function () {
    //   $('#compydrp').css('display', ($(this).val() === 'b') ? 'block' : 'none');
    // });
    // $("input[name='fav_language']").click(function () {
    //   $('#Depdrp').css('display', ($(this).val() === 'c') ? 'block' : 'none');
    // });
    // $("input[name='fav_language']").click(function () {
    //   $('#digdrp').css('display', ($(this).val() === 'd') ? 'block' : 'none');
    // });
  }
  rdPermissionChange(val) {
    document.getElementById("compydrp").classList.remove("d-block");
    document.getElementById("Depdrp").classList.remove("d-block");
    document.getElementById("digdrp").classList.remove("d-block");
    if (val == 1) {
      this.IsAll = true;
      this.IsCompany = false;
      this.IsDepartment = false;
      this.IsDesignation = false;
    }
    else if (val == 2) {
      this.IsAll = false;
      this.IsCompany = true;
      this.IsDepartment = false;
      this.IsDesignation = false;
      document.getElementById("compydrp").classList.add("d-block");
    }
    else if (val == 3) {
      this.IsAll = false;
      this.IsCompany = false;
      this.IsDepartment = true;
      this.IsDesignation = false;
      document.getElementById("Depdrp").classList.add("d-block");
    }
    else if (val == 4) {
      this.IsAll = false;
      this.IsCompany = false;
      this.IsDepartment = false;
      this.IsDesignation = true;
      document.getElementById("digdrp").classList.add("d-block");
    }

  }
  Onsubmit() {
    document.getElementById("policyuser").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("pol-list").classList.add("d-none");
    document.getElementById("pol-prew").classList.remove("d-none");
  }

  policy_add() {



    // this.status = true;
    document.getElementById("policyuser").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Add";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Setting.Add");
    }
    this.PolicyId = 0;
    this.placeholder = document.getElementById("demo").getAttribute("placeholder");
    document.getElementById("demo1").innerHTML = this.placeholder;
    this.placeholder1 = document.getElementById("demo2").getAttribute("placeholder");
    document.getElementById("demo3").innerHTML = this.placeholder1;
  }

  closeInfo() {
    document.getElementById("policyuser").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    this.onRest();
  }
  getDropdown() {
    this.service.GetCompanyList()
      .subscribe(data => {
        this._obj = data as UserPolicyMasterDTO;
        this.ObjgetCompanyList = this._obj.Data["CompanyList"]
        this.ObjgetDepartmentList = this._obj.Data["JDepartmentList"]
        this.ObjgetDesignationList = this._obj.Data["JDesignationList"]

        // this.ObjgetCompanyList.forEach

      })
  }
  PolicyList() { // To view list
    this.service.GetPolicyList().subscribe(data => {
      this._obj = data as UserPolicyMasterDTO;
      this.UserPolicyList = this._obj.Data["PolicyListJson"];
      // this.loadAPI = new Promise((resolve) => {
      //   setTimeout(() => {
      //     // alert(2);
      //     this.loadScript();
      //   }, 1000);
      //   resolve(true);
      // });
    });
  }
  OnCreate() { // Add Policy
    try {

      this._obj.CompanyIds = this.Company.toString();
      this._obj.DepartmentIds = this.Department.toString();
      this._obj.DesignationIds = this.Designation.toString();
      this._obj.PolicyId = this.PolicyId;
      this._obj.PolicyHeader = this.PolicyHeader;
      this._obj.PolicyContent = this.PolicyContent;
      if (this.status == undefined) {
        this._obj.IsActive = false;
      }
      else {
        this._obj.IsActive = this.status;
      }
      this._obj.IsAll = this.IsAll;
      this._obj.IsCompany = this.IsCompany;
      this._obj.IsDepartment = this.IsDepartment;
      this._obj.IsDesignation = this.IsDesignation;

      this.service.InsertPolicy(this._obj)
        .subscribe(data => {
          console.log(data, 'userregistration')
          this._obj = data as UserPolicyMasterDTO;
          if (this._obj.message == "1") {
            this._snackBar.open('User UserPolicyMaster SucessFully', 'End now', {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['blue-snackbar']
            });
          }
          this.onRest();
          document.getElementById("policyuser").classList.remove("kt-quick-panel--on");
          document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
          document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
          document.getElementById("pol-list").classList.remove("d-none");
          document.getElementById("pol-prew").classList.add("d-none");
          this.service.GetPolicyList().subscribe(data => {
            this._obj = data as UserPolicyMasterDTO;
            this.UserPolicyList = this._obj.Data["PolicyListJson"];
            this.loadAPI = new Promise((resolve) => {
              setTimeout(() => {
                var isFound = false;
                var scripts = document.getElementsByTagName("script")
                for (var i = 0; i < scripts.length; ++i) {
                  if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
                    isFound = true;
                  }
                }

                if (!isFound) {
                  var dynamicScripts = [
                    environment.assetsurl + "assets/js/nestedreorder.js"
                  ];

                  for (var i = 0; i < dynamicScripts.length; i++) {
                    let node = document.createElement('script');
                    node.src = dynamicScripts[i];
                    node.type = 'text/javascript';
                    node.async = false;
                    node.charset = 'utf-8';
                    document.getElementsByTagName('head')[0].appendChild(node);
                  }
                }
              }, 1000);
              resolve(true);
            });
          });
        });

    } catch (error) {
      alert(error)
    }

    // document.getElementById("pol-list").classList.add("d-none");
    // document.getElementById("pol-prew").classList.remove("d-none");

  }

  demoArr: any = [];
  demoArr1: any = [];
  UserPolicyMaster_edit(Edit: UserPolicyMasterDTO) { // To View Edit
    document.getElementById("policyuser").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    // document.getElementById("editrck").innerHTML = "Edit";
    const element = document.getElementById("editrck");

    if (element) {
      // Set the inner HTML content based on the selected language
      element.innerHTML = this.translate.instant("Setting.Edit");
    }
    this.PolicyHeader = Edit.PolicyHeader;
    this.PolicyContent = Edit.PolicyContent;
    this.status = Edit.IsActive;
    this.PolicyId = Edit.PolicyId;
    // this.demoArr = Edit as unknown as [];
    // this.demoArr1=(this.demoArr['VersionJson']);

    // if (this.demoArr1.length == 0) {
    //   this.PolicyHeader = Edit.PolicyHeader;
    //   this.PolicyContent = Edit.PolicyContent;
    //   this.status = Edit.IsActive;
    //   this.PolicyId = Edit.PolicyId;

    // }
    // else {
    //   this.demoArr1.forEach(element => {
    //     if (element.IsActive == true) {
    //       this.PolicyHeader = element.PolicyHeader;
    //       this.PolicyContent = element.PolicyContent;
    //       this.status = element.IsActive;
    //       this.PolicyId = element.PolicyId;
    //     }
    //   });

    // }

  }
  Ontempclose() {
    document.getElementById("pol-list").classList.remove("d-none");
    document.getElementById("pol-prew").classList.add("d-none");
    this.onRest();
  }
  opencompydrp() {
    document.getElementById("compydrp").classList.remove("d-block");
  }
  UpdateStatus(Obj_Status: UserPolicyMasterDTO) {  // To View Status
    //Obj_Status.PolicyId= Obj_Status.ParentPolicyId;

    if (Obj_Status.PolicyStatus === true) {
      this.String_status = "In-Active"
    }
    else {
      this.String_status = "Active"
    }
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm ',
        message: this.String_status
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        if (Obj_Status.PolicyStatus === true)
          Obj_Status.IsActive = false;
        else
          Obj_Status.IsActive = true;

        this.service.UpDatedialog_Status(Obj_Status).subscribe(
          (data) => {
            console.log(data, "status")
            this.service.GetPolicyList().subscribe(data => {
              this._obj = data as UserPolicyMasterDTO;
              this.UserPolicyList = this._obj.Data["PolicyListJson"];
              this.loadAPI = new Promise((resolve) => {
                setTimeout(() => {
                  var isFound = false;
                  var scripts = document.getElementsByTagName("script")
                  for (var i = 0; i < scripts.length; ++i) {
                    if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
                      isFound = true;
                    }
                  }

                  if (!isFound) {
                    var dynamicScripts = [
                      environment.assetsurl + "assets/js/nestedreorder.js"
                    ];

                    for (var i = 0; i < dynamicScripts.length; i++) {
                      let node = document.createElement('script');
                      node.src = dynamicScripts[i];
                      node.type = 'text/javascript';
                      node.async = false;
                      node.charset = 'utf-8';
                      document.getElementsByTagName('head')[0].appendChild(node);
                    }
                  }
                }, 1000);
                resolve(true);
              });
            });
          });;
      }
    });

  }
  onRest() { // To Field Clear
    this.PolicyHeader = "";
    this.PolicyContent = "";
    this.status = "";
    this.isShow = false;
    this.Company = [];
    this.Department = [];
    this.Designation = [];


    var radio1 = document.getElementById('All') as HTMLInputElement | null;
    radio1.checked = true;

    var radio1 = document.getElementById('Company1') as HTMLInputElement | null;
    radio1.checked = false;

    var radio2 = document.getElementById('Department') as HTMLInputElement | null;
    radio2.checked = false;

    var radio3 = document.getElementById('Designation') as HTMLInputElement | null;
    radio3.checked = false;

    document.getElementById("compydrp").classList.remove("d-block");
    document.getElementById("Depdrp").classList.remove("d-block");
    document.getElementById("digdrp").classList.remove("d-block");

    document.getElementById("policyuser").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("pol-list").classList.remove("d-none");
    document.getElementById("pol-prew").classList.add("d-none");
  }
  CompanyDrp(event) {
    // console.log(this.Company);
    // let companyarray = [];
    // this.Company.forEach(element => {
    //   let array = "";
    //   array = element;
    //   let _value = array + "" + element;
    //   companyarray.push(_value);
    // });
    console.log(this.Company.toString());
  }

  DepartmentDrp(event) {
    // console.log(this.Department, "DepartmentList");
    // let departmentarray = [];
    // this.Department.forEach(element => {
    //   let array = "";
    //   array = element;
    //   let _value = array + "" + element;
    //   departmentarray.push(_value);
    // });
    console.log(this.Department.toString());
  }


  DesignationDrp(event) {
    // console.log(this.Designation, "DesignationList");
    // let designationarray = [];
    // this.Designation.forEach(element => {
    //   let array = "";
    //   array = element;
    //   let _value = array + "" + element;
    //   designationarray.push(_value);
    // });
    console.log(this.Designation.toString());
  }


}
