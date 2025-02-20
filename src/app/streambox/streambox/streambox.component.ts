import { Component, OnInit, Renderer2, HostListener, EventEmitter, Output, Inject, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Folder } from '../../_models/Folder.DTO';
import { UserDTO } from '../../_models/user-dto';
import { BehaviorSubject } from 'rxjs';
import { StreamboxDTO } from '../../_models/streambox-dto';
import { StreamboxserviceService } from '../../_service/streamboxservice.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GACFiledto } from '../../_models/gacfiledto';
import { GACFileService } from '../../_service/gacfile.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { HttpEventType } from '@angular/common/http';
import tippy from '../../../../node_modules/tippy.js';
import { OsDetectionService } from '../../_service/os-detection.service'
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
declare var JSZip: any;
declare var saveAs: any;


@Component({
  selector: 'app-streambox',
  templateUrl: './streambox.component.html',
  styleUrls: ['./streambox.component.css']
})
export class StreamboxComponent implements OnInit {
  
  private progressConnectionBuilder!: HubConnection;
  StreamSearch: string = "";
  rootFolder: Folder | null = null;
  currentFolder: Folder | null = null;
  progress: number = 0;
  pathStack: Folder[] = [];
  totalSize: any;
  LoginUserId: number;
  EmployeeId: number;
  currentUser: any;
  _obj: StreamboxDTO;
  searchResult: any = [];
  _obj1: GACFiledto;
  _obj2: InboxDTO;
  RemoveFiles: boolean = false;
  currentLang: "ar" | "en" = "ar";
  _roleid: number;
  DocumentNameRequired: boolean = false;
  CompanyNameRequired: boolean = false;
  DepartmentNameRequired: boolean = false;
  isCheckboxChecked: boolean = false; // Initialize to false or true based on your requirements
  osName: string = '';
  Companyplaceholder: string;
  Departmentpalceholder: string;
  Archiveplaceholder: string;
  Search: string;
  currentUserSubject: BehaviorSubject<UserDTO>;
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  constructor(public service: StreamboxserviceService,
    private renderer: Renderer2, private _snackBar: MatSnackBar,
    public services: GACFileService,
    private osDetectionService: OsDetectionService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    public inboxService: InboxService
  ) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.LoginUserId = this.currentUserValue.createdby;
    this.EmployeeId = parseInt(this.currentUserValue.EmployeeCode);
    this._roleid = this.currentUserValue.RoleId;
    this._obj1 = new GACFiledto();
    this._obj = new StreamboxDTO();
    this._obj2 = new InboxDTO();
    this.renderer.listen('document', 'click', (event) => {
      this.onLeftClick(event);
      this.onLeftClickRes(event);
      // this.renderer.listen('document', 'mousedown', (event: MouseEvent) => this.onClickOutside(event));

    });

    HeaderComponent.languageChanged.subscribe((lang) => {
      localStorage.setItem('language', lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      this.Companyplaceholder = lang === 'en' ? 'Select Company' : 'اختر الشركة';
      this.Departmentpalceholder = lang === 'en' ? 'Select Department' : 'اختر القسم';
      this.Archiveplaceholder = lang === 'en' ? 'Enter Archive Name' : 'أدخل اسم الأرشيف';
      this.Search = lang === 'en' ? 'Search' : 'يبحث';
      if (lang == 'ar') {
        this.renderer.addClass(document.body, 'kt-body-arabic');
      } else if (lang == 'en') {
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    })
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // navigateToFolder(folder: Folder): void {
  //   if (this.currentFolder) {
  //     this.pathStack.push(this.currentFolder);
  //   }
  //   this.currentFolder = folder;
  // }

  breadcrumbFolderNames: string[] = []; // Array to store breadcrumb folder names
  breadcrumb: Folder[] = [];
  navigateToFolder(folder: Folder): void {
    console.log(folder, 'Navigated to folder');
    // Push the current folder into pathStack before navigating to the new one
    if (this.currentFolder) {
      this.pathStack.push(this.currentFolder);  // Store current folder in pathStack
    }
    // Optionally, push folder into breadcrumb trail
    if (folder && folder.name) {
      this.breadcrumb.push(folder);
      this.breadcrumbFolderNames.push(folder.name);  // Storing names for breadcrumbs
    }
    // Set the current folder to the newly navigated folder
    this.currentFolder = folder;
    const folderCount = Object.keys(this.currentFolder.folders).length;
    this.Totalcount = this.currentFolder.files.length + folderCount;
    console.log('Updated pathStack after navigating forward:', this.pathStack);
  }

  navigateBack(): void {
    this.currentFolder = this.pathStack.pop() || this.rootFolder;
    const folderCount = Object.keys(this.currentFolder.folders).length;
    this.Totalcount = this.currentFolder.files.length + folderCount;
    this.breadcrumb.pop();
    this.breadcrumbFolderNames.pop();
    this.selectedFiles = [];
  }


  SearchFileByName(inputstr: string) {
    if (inputstr) {
      this.searchResult = [];
      const searchInFolders = (folders) => {
        for (let item in folders) {
          if (item == 'folders') {
            for (let afolder in folders[item]) {
              searchInFolders(folders[item][afolder]);
            }
          }
          if (item == 'files') {
            folders[item].forEach((file) => {
              // condition
              const isMatched = file.name.toLowerCase().includes(inputstr.toLowerCase());
              if (isMatched) {
                this.searchResult.push(file);
              }
            });
          }
        }

      }
      searchInFolders(this.currentFolder);
    }
    else
      this.searchResult = [];
  }



  isRoot(): boolean {
    return this.currentFolder === this.rootFolder;
  }

  formatSize(size: number): string {
    return formatFileSize(size);
  }

  formatSizeDeletefile(size: number): string {
    return formatFileSizeDeletefiles(size);
  }

  Totalcount: any;
  isFolderAndFileEmpty: boolean = false; // Declare the property

  ngOnInit(): void {
    this.ArabicMethod();
    this.osName = this.osDetectionService.getOS();
    this._obj.EmployeeId = this.EmployeeId;
    this.service.Streamboxfile(this._obj).subscribe((data: any) => {
      console.log(data, "Emid passing data");
      const dataII: any = data;
      this.totalSize = dataII.totalSize;

      this.calculateUsedSpace(this.totalSize);
      this.rootFolder = dataII.rootFolder;//.folders[this.EmployeeId.toString()];)
      this.currentFolder = dataII.rootFolder;
      console.log(this.currentFolder, "current Folder");
      //          const folderCount = Object.keys(this.currentFolder.folders).length;
      // this.Totalcount = this.currentFolder.files.length + folderCount;

      const folderCount = Object.keys(this.currentFolder.folders || {}).length;
      const fileCount = this.currentFolder.files?.length || 0;

      this.Totalcount = fileCount + folderCount;

      // Check if both files and folders are empty
      this.isFolderAndFileEmpty = folderCount === 0 && fileCount === 0;
    });
    // Usage

  }

  removeExtension(filename: string): string {
    return filename.replace(/\.[^/.]+$/, '');  // Removes the file extension
  }


  ArabicMethod() {
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.Companyplaceholder = lang === 'en' ? 'Select Company' : 'اختر الشركة';
    this.Departmentpalceholder = lang === 'en' ? 'Select Department' : 'اختر القسم';
    this.Archiveplaceholder = lang === 'en' ? 'Enter Archive Name' : 'أدخل اسم الأرشيف';
    this.Search = lang === 'en' ? 'Search' : 'يبحث';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
  }

  ngAfterViewInit() {


    setTimeout(() => {
      this.initializeTippy()
    }, 2000);


  }
  initializeTippy() {
    const hoverElementsPF = document.querySelectorAll('.recycle-btn');
    hoverElementsPF.forEach(hoverElementINMPF => {
      tippy(hoverElementINMPF, {
        content: 'Recycle bin',
        placement: 'left',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });
  }
  list_btn() {
    document.getElementById("list-btn").classList.add("active");
    document.getElementById("grid-btn").classList.remove("active");
    document.getElementById("list-grid-view").classList.add("list-view");
    // document.getElementById("list-grid-recycle-view").classList.add("list-view");
    document.getElementById("list-action").style.display = "flex";
    // document.getElementById("list-recycle-action").style.display = "flex";
    document.getElementById("grid-action").style.display = "none";
  }

  grid_btn() {
    document.getElementById("list-btn").classList.remove("active");
    document.getElementById("grid-btn").classList.add("active");
    document.getElementById("list-grid-view").classList.remove("list-view");
    // document.getElementById("list-grid-recycle-view").classList.remove("list-view");
    document.getElementById("list-action").style.display = "none";
    // document.getElementById("list-recycle-action").style.display = "none";
    document.getElementById("grid-action").style.display = "flex";
  }



  // Outputs the total count of files
  // streambox_btn() {
  //   document.getElementById("streambox-btn").classList.add("active");
  //   document.getElementById("recycle-btn").classList.remove("active");
  //   document.getElementById("streambox-div").style.display = "block";
  //   document.getElementById("recycle-div").style.display = "none";
  // }

  // This Mehtod calculates days left from the given date
  //   calculateRemainingDays(dateStr: string): string {
  //     const startDate = new Date(dateStr);
  //     const targetDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days
  //     const currentDate = new Date();

  //     // Calculate the difference in milliseconds and convert to days
  //     const daysLeft = Math.ceil((targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  //     return daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
  // }

  calculateRemainingDays(dateStr: string): string | null {
    const startDate = new Date(dateStr);
    const targetDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days
    const currentDate = new Date();

    // Calculate the difference in milliseconds and convert to days
    const daysLeft = Math.ceil((targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    // Hide the file if it has reached or exceeded 30 days
    if (daysLeft <= 0) {
      return null;
    }

    return `${daysLeft} days left`;
  }

  close_recycle_btn() {
    this._obj.EmployeeId = this.EmployeeId;
    this.service.Streamboxfile(this._obj).subscribe((data: any) => {
      console.log(data, "Emid passing data");
      const dataII: any = data;
      this.totalSize = dataII.totalSize;
      this.calculateUsedSpace(this.totalSize);
      this.rootFolder = dataII.rootFolder;//.folders[this.EmployeeId.toString()];
      this.currentFolder = dataII.rootFolder;
      console.log(this.currentFolder, "current Folder");
    });
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("recycle-slide").classList.remove("kt-quick-panel--on");
  }

  deleteUrlFromFile(uriToDelete: string): void {
    console.log(uriToDelete, "Delete");
    const lang: any = localStorage.getItem('language');
    Swal.fire({
      title: lang === 'ar' ? "هل أنت متأكد؟" : "Are you sure?",
      text: lang === 'ar' ? "هل تريد المتابعة في حذف هذه المذكرة؟" : "Do you want to proceed with deleting this file?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: lang === 'ar' ? "نعم، احذفها!" : "Yes, delete it!",
      cancelButtonText: lang === 'ar' ? "إلغاء" : "Cancel"
    }).then((result) => {

      if (result.isConfirmed) {
        let jsonArray: any[] = [];

        // Create the JSON object with the required properties
        let jsonObject = {
          Url: decodeURIComponent(uriToDelete),
          EmployeeId: this.EmployeeId
        };

        // Add the JSON object to the array
        jsonArray.push(jsonObject);
        this._obj.json = JSON.stringify(jsonArray);

        // this._obj.filepath = decodeURIComponent(uriToDelete);
        // this._obj.employeeid = this.EmployeeId;
        this.service.StreamboxDeletefilesApi(this._obj).subscribe(
          data => {

            if (this.rootFolder) { // Ensure rootFolder is not null or undefined
              this.traverseAndDelete(this.rootFolder, uriToDelete);
            }
          },
          error => {
            console.error('Error deleting file:', error); // Handle error cases
          }
        );
      }
    });
  }

  traverseAndDelete(folder: Folder, uriToDelete: string): void {

    // Check files in the current folder
    folder.files = folder.files.filter(file => file.uri !== uriToDelete);
    // Recursively check subfolders
    for (const key in folder.folders) {
      if (folder.folders.hasOwnProperty(key)) {
        this.traverseAndDelete(folder.folders[key], uriToDelete);
      }
    }
  }

  DocumentName: string = "";
  showContextMenu = false;
  showContextFolderMenu = false;
  _RestoreshowContextMenu = false;
  rescontextMenuPosition = { x: 0, y: 0 };
  contextMenuPosition = { x: 0, y: 0 };
  selectedItem: any = null;
  selectedItemRestorefile: any = null;
  selectedType: string = ''; // To track if it's a file or folder
  // Mock for clipboard copy-paste functionality
  clipboard: any = null;
  Note: string = "";




  // Method to delete the file based on its URI
  // deleteUrlFromFile1(fileUri: string): void {
  //     if (!fileUri) {
  //         console.error('No file URI provided for deletion.');
  //         return;
  //     }

  //     Swal.fire({
  //         title: "Are you sure?",
  //         text: "Do you want to proceed with deleting this file?",
  //         showCancelButton: true,
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33",
  //         confirmButtonText: "Yes, delete it!",
  //         cancelButtonText: "Cancel"
  //     }).then((result) => {
  //         if (result.isConfirmed) {
  //             // Your deletion logic here
  //             this._obj.filepath = decodeURIComponent(fileUri);  // Assign the file's URI

  //             this.service.StreamboxDeletefilesApi(this._obj).subscribe(
  //                 (data) => {
  //                     // Handle successful deletion (update currentFolder)
  //                     this.removeFileFromCurrentFolder(fileUri);
  //                 },
  //                 (error) => {
  //                     console.error('Error deleting file:', error);
  //                 }
  //             );
  //         }
  //     });
  // }

  // // Helper function to remove file from currentFolder after deletion
  // private removeFileFromCurrentFolder(fileUri: string): void {
  //     this.currentFolder.files = this.currentFolder.files.filter((file: any) => file.uri !== fileUri);
  //     console.log('File deleted from currentFolder', this.currentFolder);
  // }

  onCopy(item: any): void {

    // this.selectedItem = item;
    navigator.clipboard.writeText(item).then(() => {
      const language = localStorage.getItem('language');

      // Display message based on language preference
      if (language === 'ar') {
        this._snackBar.open('تم نسخ الرابط إلى الحافظة', 'تنتهي الآن', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
      } else {
        this._snackBar.open('link copied to clipboard', 'End now', {
          duration: 5000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
        });
      }

      // Here you can trigger any feedback to the user, like a tooltip or a toast notification.
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
    this.showContextMenu = false;
    this.cdr.detectChanges();
  }

  archivedFile: any[] = []; // This will hold the file to be archived
  onArchive(item: any): void {
    this.showContextMenu = false;
    this.showContextFolderMenu = false;

    this.selectedFiles.forEach((item) => {
      if (item.files && Array.isArray(item.files) && item.files.length > 0) {
        // Handle the case when the item has files (folder selected)
        const folderName = item.name || "Untitled";
        const zip = new JSZip();
        const folderZip = zip.folder(folderName);
    
        // Debugging: Log the structure of item.files
        console.log("Item Files:", item.files);
    
        // Create a promise for each file in the folder
        const filePromises = item.files.map(file => new Promise<void>((resolve, reject) => {
          console.log("File Type Check:", file);
    
          // Check if the file is valid (either a File object or has a URI)
          if (!(file instanceof File) && !file.uri) {
            console.error(`Invalid file type:`, file); // Log invalid file object
            reject(new Error(`Invalid file type: ${JSON.stringify(file)}`)); // Reject if not a valid File object
            return;
          }
    
          // If it's a URI, fetch the file from the URI
          if (file.uri) {
            fetch(file.uri)
              .then(response => response.blob())
              .then(blob => {
                folderZip?.file(file.name, blob); // Add the fetched file to the zip folder
                console.log(`Added file: ${file.name} (${file.size} bytes)`); // Debug log
                resolve();
              })
              .catch(error => {
                console.error("Failed to fetch file:", file.uri, error);
                reject(new Error(`Failed to fetch file: ${file.name}`));
              });
          } else {
            // If it's a valid File object, read it as an ArrayBuffer and add it to the ZIP
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                folderZip?.file(file.name, event.target.result as ArrayBuffer);
                console.log(`Added file: ${file.name} (${file.size} bytes)`); // Debug log
                resolve();
              } else {
                reject(new Error(`Failed to read file: ${file.name}`));
              }
            };
            reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
            reader.readAsArrayBuffer(file);
          }
        }));
    
        // Wait for all files to be processed and then create the ZIP file
        Promise.all(filePromises)
          .then(() => zip.generateAsync({ type: "blob" }))
          .then((zipFile: Blob) => {
            console.log("ZIP File Blob:", zipFile);
            console.log("ZIP File Size:", zipFile.size);
            console.log("ZIP File Type:", zipFile.type);
    
            // Handle error if the ZIP file is empty or failed
            if (!zipFile || zipFile.size === 0) {
              throw new Error("ZIP file creation failed or is empty.");
            }
    
            const zipFileName = `${folderName}.zip`;
            const zipFileObj = new File([zipFile], zipFileName, {
              type: "application/x-zip-compressed",
              lastModified: Date.now(),
            });
    
            console.log("Final ZIP File Object:", zipFileObj);
    
            // Add the ZIP file object to the archivedFile array
            this.archivedFile = [
              ...this.archivedFile,
              {
                CloudName: zipFileName,
                FileName: zipFileName,
                UniqueId: Date.now(),
                Ismain: true,
                Thumbnail: "",
                Url: undefined,
                name: zipFileName,
                totalSize: zipFileObj.size,
                files: item.files.map(file => ({
                  name: file.name,
                  size: file.size,
                  uri: file.uri,
                  contentType: file.contentType,
                  dateTimeWithoutSeconds: file.dateTimeWithoutSeconds,
                  isOwner: file.isOwner,
                  isShared: file.isShared
                })),
                folders: item.folders || {} // Ensure only relevant folders are passed
              }
            ];
            saveAs(zipFile, zipFileName);
            console.log("Updated archivedFile array with folder and files:", this.archivedFile);
            this.DocumentName = this.archivedFile[0].name;
          })
          .catch(error => console.error("Error generating ZIP file:", error));
      } else if (item.contentType) {
        // Handle individual files (file selected)
        this.archivedFile = this.selectedFiles;
        this.DocumentName = this.archivedFile[0].name;
    
        this.archivedFile.forEach((element, index) => {
          let uniqueIdCounter = Date.now();
          const d = uniqueIdCounter++;
          element.UniqueId = d;
          element.Ismain = index === 0 ? true : false;
          element.Thumbnail = "";
          element.FileName = element.name;
          element.CloudName = element.name;
          element.Url = element.uri;
        });
    
        console.log(this.archivedFile, "Archive Document");
        // Handle further logic for individual files if needed
      }
    });
    
    
    
    
    
     
   
    
    // Close context menu after archiving
    this.DropdownList();
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    document.getElementById("stream-archive").classList.add("kt-quick-panel--on");

  }

  CompanyList: any;
  DepartmentList: any;
  Department: any;
  Company: any;
  DropdownList() {
    this._obj1.OrganizationId = this.currentUserValue.organizationid;
    this._obj1.CreatedBy = this.currentUserValue.createdby;
    this.services.GetDropdownList(this._obj1)
      .subscribe(data => {
        // console.log(data, "CJ and DJ and DTJ and DMJ and CJ")
        // this._obj1 = data as GACFiledto;
        this.CompanyList = data["Data"].CompanyJson;
        this.DepartmentList = data["Data"].DepartmentJson;
      });
  }

  GetCompanyId(event) {
    this.CompanyNameRequired = false;

  }

  GetDepatmentId(even) {
    this.DepartmentNameRequired = false;
  }

  onInput() {
    this.DocumentNameRequired = !this.DocumentName || this.DocumentName.trim() === '';
  }

  SubmitDocumentDocumentId: number = 0;
  AddArchive() {
    // console.log(this.archivedFile , "Add Archive array");
     
    // const extractedValues = this.archivedFile.map((file) => {
    //   // Extract filename from the URL
    //   const fileNameFromUrl = file.Url.substring(file.Url.lastIndexOf('/') + 1);
    
    //   return {
    //     FileName: file.FileName,
    //     CloudName: fileNameFromUrl, // Update CloudName with the filename
    //     IsMain: file.Ismain,
    //     Url: file.Url,
    //   };
    // });
    // const extractedValuesJson = JSON.stringify(extractedValues);
    // console.log(extractedValuesJson, "extractedValuesJson");
    const extractedValues = this.archivedFile.map((file) => {
      // Check if file.Url exists before attempting to extract the filename
      const fileNameFromUrl = file.Url ? file.Url.substring(file.Url.lastIndexOf('/') + 1) : 'Zip file';
    
      return {
        FileName: file.FileName,
        CloudName: fileNameFromUrl, // Update CloudName with the filename
        IsMain: file.Ismain,
        Url: file.Url,
      };
    });
    
  const extractedValuesJson = JSON.stringify(extractedValues);
    console.log(extractedValuesJson, "extractedValuesJson");
    this._obj1.flagId = 0;
    this._obj1.documentId = 0;
    this._obj1.documentName = this.DocumentName;
    if (this.DocumentName == "") {
      this.DocumentNameRequired = true;
      return false;
    }

    const destinationContainer = "documents"; // Set destination container value
    const jsonResult = {
      sourcePaths: extractedValues.map((file) => file.Url), // Extract URLs
      destinationContainer: destinationContainer,
      destinationFolder: 'Archive/', //mention gac folder path
    };
    console.log(JSON.stringify(jsonResult), "CopyFiles");
    
    this._obj1.createdBy = this.currentUserValue.createdby;
    this._obj1.message = "";
    this._obj1.copyFiles = JSON.stringify(jsonResult);
    this._obj1.deletedJson = '[]';
    this._obj1.extractedValuesJson = extractedValuesJson;
    this._obj1.ApprovalUserJson = '[]';
    this._obj1.ShareUserJson = '[]';
    this._obj1.ReportingUserID = 0;
    this._obj1.IsArchiveApproval = false;
    this._obj1.WorkflowJson = '[]';
    this._obj1.DocumentInfoJson = '[]';
    this._obj1.VersionName = "1.0";
    this._obj1.ParentId = "0";

    this.services.NewArchiveDocumentStreamBox(this._obj1).subscribe(data => {
      console.log(data, "Add Document API Data");
      this.SubmitDocumentDocumentId = data["documentId"];
      const language = localStorage.getItem('language');
      if (data["message"] == '1') {
        if (language === 'ar') {
          this._snackBar.open('تم إرسال المذكرة، يرجى الانتظار لتحميل الملف..', 'تنتهي الآن', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
        } else {
          this._snackBar.open('Document Upload, Please Wait to upload the file..', 'End now', {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
          });
        }
        for (let i = 0; i < this.archivedFile.length; i++) {
          if (this.RemoveFiles === true && this.archivedFile[i]) {
            const fileUri = decodeURIComponent(this.archivedFile[i].uri); // Assign the file's URI
            this._obj.filepath = fileUri; // Set file path in the object
            console.log(this.archivedFile, "this.archivedFile")
            this.removeFileFromCurrentFolders(this.archivedFile[i].UniqueId);
            this.service.StreamboxDeletefilesApi(this._obj).subscribe(
              (data) => {
                // Handle successful deletion (update currentFolder)
              },
              (error) => {
                console.error('Error deleting file:', error);
              }
            );
          } else {
            console.warn('Invalid index or archived file is undefined:', i);
          }
        }
        this.Archiveclear();
      } else {
      }
    });

    // // Validate Company and Department based on role
    // if (this._roleid === 502) {
    //   if (!this.Company) {
    //     this.CompanyNameRequired = true;
    //   }
    //   if (!this.Department) {
    //     this.DepartmentNameRequired = true;
    //   }
    // }
    if (this.DocumentName == "") {
      this.DocumentNameRequired = true;
    } else {
      // if (this._roleid == 502) {
      //   this._obj1.CompanyId = this.Company;
      // } else if (this._roleid != 502) {
      //   this._obj1.CompanyId = this.currentUserValue.CompanyId;
      // }
      // if (this._roleid == 502) {
      //   this._obj1.DepartmentId = this.Department;
      // } else if (this._roleid != 502) {
      //   this._obj1.DepartmentId = this.currentUserValue.DepartmentId;
      // }
      // this._obj1.DocumentName = this.DocumentName;
      // this._obj1.CreatedBy = this.currentUserValue.createdby;
      // this._obj1.Description = this.Note;
      // this._obj1.VersionName = "1.0";
      // this._obj1.ParentId = "0";
      // this._obj1.Isphysical = false;
      // this._obj1.IsFoodItem = false;
      // this._obj1.PhysicalJson = "";
      // this._obj1.IsAdditionalDetails = false;
      // this._obj1.AdditionalDetailsJson = "";
      // this._obj1.IsShareDocument = false;
      // this._obj1.ShareDocumentJson = "";
      // this.services.DocumentSubmit_V2(this._obj1).subscribe(data => {
      //   const _ary: any[] = [];
      //   const frmData = new FormData();
      //   for (var i = 0; i < this.archivedFile.length; i++) {
      //     var _obj: any = {};
      //     // Dynamically set properties for the object
      //     _obj["Url"] = this.archivedFile[i].uri;
      //     _obj["IsMain"] = i == 0 ? true : false;
      //     _obj["IsThumbnail"] = false;
      //     _obj["DestinationFolder"] = "";
      //     _obj["DocumentId"] = data["Data"].DocumentId;
      //     _obj["CreatedBy"] = this.currentUserValue.createdby.toString();
      //     // Push the object to the array
      //     _ary.push(_obj);
      //   }
      //   this.services.UploadArchiveDocuments_V2GACCopy(_ary)
      //     .subscribe({
      //       next: (event) => {
      //         const language = localStorage.getItem('language');
      //         switch (event.type) {
      //           case HttpEventType.Sent:
      //             // console.log('Request has been made!');
      //             break;
      //           case HttpEventType.ResponseHeader:
      //             // console.log('Response header has been received!');
      //             break;
      //           case HttpEventType.UploadProgress:
      //             this.progress = Math.round(event.loaded / event.total * 100);
      //             if (this.progress == 100) {
      //               if (this.progress == 100) {
      //                 if (language === 'ar') {
      //                   this._snackBar.open('تم رفع الملفات..', 'تنتهي الآن', {
      //                     duration: 5000,
      //                     horizontalPosition: "right",
      //                     verticalPosition: "bottom",
      //                   });
      //                 } else {
      //                   this._snackBar.open('Files Uploaded..', 'End now', {
      //                     duration: 5000,
      //                     horizontalPosition: "right",
      //                     verticalPosition: "bottom",
      //                   });
      //                 }

      //               }
      //               if (language === 'ar') {
      //                 this._snackBar.open('تم إرسال المذكرة، يرجى الانتظار لتحميل الملف..', 'تنتهي الآن', {
      //                   duration: 5000,
      //                   horizontalPosition: "right",
      //                   verticalPosition: "bottom",
      //                 });
      //               } else {
      //                 this._snackBar.open('Document Upload, Please Wait to upload the file..', 'End now', {
      //                   duration: 5000,
      //                   horizontalPosition: "right",
      //                   verticalPosition: "bottom",
      //                 });
      //               }
      //             }
      //             break;
      //           case HttpEventType.Response:
      //             $(".loader-overlay").removeClass("active");
      //             $("body").removeClass("position-fixed");
      //             $("body").removeClass("w-100");
      //             if (language === 'ar') {
      //               this._snackBar.open('هذه رسالة باللغة العربية', 'إغلاق', {
      //                 duration: 5000,
      //                 horizontalPosition: "right",
      //                 verticalPosition: "bottom",
      //               });
      //             } else {
      //               this._snackBar.open('Document Upload Successfully', 'End now', {
      //                 duration: 5000,
      //                 horizontalPosition: "right",
      //                 verticalPosition: "bottom",
      //                 panelClass: ['blue-snackbar']
      //               });
      //             }
      //             for (let i = 0; i < this.archivedFile.length; i++) {
      //               if (this.RemoveFiles === true && this.archivedFile[i]) {
      //                 const fileUri = decodeURIComponent(this.archivedFile[i].uri); // Assign the file's URI
      //                 this._obj.filepath = fileUri; // Set file path in the object
      //                 console.log(this.archivedFile, "this.archivedFile")

      //                 this.removeFileFromCurrentFolders(this.archivedFile[i].UniqueId);

      //                 this.service.StreamboxDeletefilesApi(this._obj).subscribe(
      //                   (data) => {
      //                     // Handle successful deletion (update currentFolder)
      //                   },
      //                   (error) => {
      //                     console.error('Error deleting file:', error);
      //                   }
      //                 );
      //               } else {
      //                 console.warn('Invalid index or archived file is undefined:', i);
      //               }

      //             }

      //             this.Archiveclear();
      //             setTimeout(() => {
      //               this.progress = 0;
      //             }, 2000);
      //         }
      //       },
      //       error: (e) => {
      //         console.error('Error uploading file', e);
      //       },
      //       complete: () => console.info('complete')
      //     });

      // });
      document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
      document.getElementById("stream-archive").classList.remove("kt-quick-panel--on");
    }
  }


  // private fetchUpdatedCurrentFolder(): void {
  //   this._obj.containerName = environment.Container_Name;
  //   this._obj.folderPath = "streambox/" + this.EmployeeId.toString();
  //   this.service.Streamboxfiles(this._obj).subscribe(
  //     data => {
  //       console.log(data, "streambox data");
  //       const dataII: any = data;
  //       this.totalSize = dataII.totalSize;
  //       this.rootFolder = dataII.rootFolder.folders.streambox.folders[this.EmployeeId.toString()];
  //       this.currentFolder = this.rootFolder;
  //       console.log(this.currentFolder, "FileURL");
  //     });
  // }


  private removeFileFromCurrentFolders(UniqueId: number) {

    this.currentFolder.files = this.currentFolder.files.filter((file: any) => file.UniqueId !== UniqueId);
    console.log('File deleted from currentFolder', this.currentFolder);
  }


  // Removefilesstreambox() {
  //   if (!this.RemoveFiles) {
  //     alert(this.RemoveFiles);
  //     const deletionObservables = this.archivedFile.map((fileUri) => {
  //       this._obj.filepath = decodeURIComponent(fileUri);  // Assign the decoded file URI to _obj.filepath

  //       return this.service.StreamboxDeletefilesApi(this._obj).pipe(
  //         tap(data => {
  //           // Handle successful deletion
  //           this.removeFileFromCurrentFolder1(fileUri);
  //         }),
  //         catchError(error => {
  //           console.error('Error deleting file:', error);
  //           return of(null); // Handle error gracefully
  //         })
  //       );
  //     });

  //     // Execute all delete operations in parallel and wait for them to complete
  //     forkJoin(deletionObservables).subscribe(() => {
  //       console.log('All files processed');
  //       // You can add any additional logic here after all deletions are complete
  //     });
  //   }
  // }


  // removeFileFromCurrentFolder1(fileUri: string) {
  //   // Logic to remove the file from the current folder
  //   console.log('Removed file:', fileUri);
  // }

  Archiveclear() {
    this.Company = null;
    this.Department = null;
    this.DocumentName = "";
    this.DocumentNameRequired = false;
    this.archivedFile = [];
    this.selectedFiles = [];
    this.RemoveFiles = false;
    this.Note = "";
    this.CompanyNameRequired = false;
    this.DepartmentNameRequired = false;
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
    document.getElementById("stream-archive").classList.remove("kt-quick-panel--on");
  }

  newmemofiles: any[] = [];  // Ensure this is declared
  isSMailClicked: boolean = false;
  onSMail1(item: any): void {
    
    
    // console.log(item, "Select files");
    // Check if the item is an array
    if (Array.isArray(this.selectedFiles)) {
      this.newmemofiles = this.selectedFiles;  // If it's an array, assign directly
    } else if (typeof this.selectedFiles === 'string' || typeof this.selectedFiles === 'object') {
      // If it's a single file (string or object), wrap it in an array
      this.newmemofiles = [this.selectedFiles];
    } else {
      // console.error("Invalid item type:", this.selectedFiles);  // Log an error for unsupported types
    }
    // console.log(this.newmemofiles, "Updated new memofiles in new-memo component");
    this.showContextMenu = false; 
    this.isSMailClicked = true;
    // Close context menu after archiving
    // Wait for the DOM to be ready before manipulating it

    this.waitForElement('#Kt_reply_Memo_New', (replyMemoElement: HTMLElement) => {
      replyMemoElement.classList.add("kt-quick-panel--on");

      const sideViewElement = document.getElementsByClassName("side_view")[0] as HTMLElement;
      if (sideViewElement) {
        sideViewElement.classList.add("position-fixed");
      }
      const asideMenuOverlayElement = document.getElementsByClassName("kt-aside-menu-overlay")[0] as HTMLElement;
      if (asideMenuOverlayElement) {
        asideMenuOverlayElement.classList.add("d-block");
      }
    });
    // document.getElementById("Kt_reply_Memo_New").classList.add("kt-quick-panel--on");
    // document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    // document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }



  
  onSMailFolder(item: any): void {
    
    console.log(item.name, "Mail Folder Data");
console.log("selectedFiles:::",this.selectedFiles);


    this.isSMailClicked = true;
    this.showContextFolderMenu = false; // Close context menu
    
    // ✅ Ensure item.FileName exists, else use a default name
  // const folderName = item.name ? item.name : "Untitled";
  // const zip = new JSZip();
  // const folderZip = zip.folder(folderName); // ✅ Create folder inside ZIP

  // const filePromises: Promise<void>[] = [];

  // if (item.Files && item.Files.length > 0) {
  //   item.Files.forEach((file: File) => {
  //     const reader = new FileReader();

  //     const filePromise = new Promise<void>((resolve, reject) => {
  //       reader.onload = (event) => {
  //         if (event.target && event.target.result) {
  //           const fileData = event.target.result as ArrayBuffer;
  //           folderZip?.file(file.name, fileData); // ✅ Add file inside folder
  //           resolve();
  //         } else {
  //           reject(new Error(`Failed to read file: ${file.name}`));
  //         }
  //       };

  //       reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
  //       reader.readAsArrayBuffer(file);
  //     });

  //     filePromises.push(filePromise);
  //   });
  // }

  // // Wait for all files to be added before generating the ZIP
  // Promise.all(filePromises)
  //   .then(() => zip.generateAsync({ type: "blob" }))
  //   .then((zipFile: Blob) => {
  //     const zipFileName = `${folderName}.zip`; // ✅ Use correct folder name

  //     // ✅ Create a File object from the ZIP
  //     const zipFileObj = new File([zipFile], zipFileName, {
  //       type: "application/x-zip-compressed",
  //       lastModified: Date.now(),
  //     });

  //     // this.newmemofiles = [
  //     //   {  
  //     //     UniqueId:Date.now(),
  //     //     FileName:zipFileName,
  //     //     Size:zipFileObj.size ?? 0,
  //     //     Files:{
  //     //       lastModified:zipFileObj.lastModified,
  //     //       lastModifiedDate:new Date(),
  //     //       name:zipFileObj.name,
  //     //       size:zipFileObj.size ?? 0,
  //     //       type:zipFileObj.type,
  //     //       webkitRelativePath:""
  //     //     }
  //     //   }
  //       this.newmemofiles = [
  //       {
  //         name: zipFileName,
  //         Files: [
  //           {
  //             lastModified: zipFileObj.lastModified,
  //             lastModifiedDate: new Date(),
  //             name: zipFileObj.name,
  //             size: zipFileObj.size,
  //             type: zipFileObj.type,
  //             webkitRelativePath: "",
  //             UniqueId: Date.now(),
  //           },
  //         ],
  //       },
  //     ];

  //     this.newmemofiles = [...this.newmemofiles];
  //     console.log("ZIP File stored in newmemofiles:", this.newmemofiles);

  //     // ✅ Trigger file download
  //     // saveAs(zipFile, zipFileName);
  //   })
  //   .catch(error => console.error("Error generating ZIP file:", error));




const folderName = item.name || "Untitled";
const zip = new JSZip();
const folderZip = zip.folder(folderName);

const filePromises = item.Files?.map(file => new Promise<void>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target?.result) {
      folderZip?.file(file.name, event.target.result as ArrayBuffer);
      console.log(`Added file: ${file.name} (${file.size} bytes)`);
      resolve();
    } else {
      reject(new Error(`Failed to read file: ${file.name}`));
    }
  };
  reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
  reader.readAsArrayBuffer(file);
})) || [];

Promise.all(filePromises)
  .then(() => zip.generateAsync({ type: "blob" }))
  .then((zipFile: Blob) => {   
    console.log("ZIP File Blob:", zipFile);
    console.log("ZIP File Size:", zipFile.size);
    console.log("ZIP File Type:", zipFile.type);

    if (!zipFile || zipFile.size === 0) {
      throw new Error("ZIP file creation failed or is empty.");
    }

    const zipFileName = `${folderName}.zip`;
    const zipFileObj = new File([zipFile], zipFileName, {
      type: "application/x-zip-compressed",
      lastModified: Date.now(),
    });

    console.log("Final ZIP File Object:", zipFileObj);

    this.newmemofiles = [
      {  
        UniqueId: Date.now(),
        FileName: zipFileName,
        Size: Number(zipFileObj.size), // Ensure the size is set correctly
        Files: {
          lastModified: zipFileObj.lastModified,
          lastModifiedDate: new Date(),
          name: zipFileObj.name,
          size: Number(zipFileObj.size), // Check if this is still NaN
          type: zipFileObj.type,
          webkitRelativePath: ""
        }
      }
    ];

    this.newmemofiles = [...this.newmemofiles]; // Ensure Angular detects changes

    console.log(this.newmemofiles , "Zip file Array");

    // saveAs(zipFile, zipFileName); // ✅ Trigger Download
  })
  .catch(error => console.error("Error generating ZIP file:", error));


   
    this.waitForElement('#Kt_reply_Memo_New', (replyMemoElement: HTMLElement) => {
      replyMemoElement.classList.add("kt-quick-panel--on");

      const sideViewElement = document.getElementsByClassName("side_view")[0] as HTMLElement;
      if (sideViewElement) {
        sideViewElement.classList.add("position-fixed");
      }
      const asideMenuOverlayElement = document.getElementsByClassName("kt-aside-menu-overlay")[0] as HTMLElement;
      if (asideMenuOverlayElement) {
        asideMenuOverlayElement.classList.add("d-block");
      }
    });
  }


  onSMail(){   
    this.isSMailClicked = true;
    this.showContextFolderMenu = false; 
    this.showContextMenu = false;
    this.selectedFiles.forEach((item)=>{   
         if(item.folders&&!item.contentType){
             // folder selected
             const folderName = item.name || "Untitled";
             const zip = new JSZip();
             const folderZip = zip.folder(folderName);
             const filePromises = item.Files?.map(file => new Promise<void>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  folderZip?.file(file.name, event.target.result as ArrayBuffer);
                  console.log(`Added file: ${file.name} (${file.size} bytes)`);
                  resolve();
                } else {
                  reject(new Error(`Failed to read file: ${file.name}`));
                }
              };
              reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
              reader.readAsArrayBuffer(file);
            })) || [];

            Promise.all(filePromises)
            .then(() => zip.generateAsync({ type: "blob" }))
            .then((zipFile: Blob) => {   
              console.log("ZIP File Blob:", zipFile);
              console.log("ZIP File Size:", zipFile.size);
              console.log("ZIP File Type:", zipFile.type);
          
              if (!zipFile || zipFile.size === 0) {
                throw new Error("ZIP file creation failed or is empty.");
              }
          
              const zipFileName = `${folderName}.zip`;
              const zipFileObj = new File([zipFile], zipFileName, {
                type: "application/x-zip-compressed",
                lastModified: Date.now(),
              });
          
              console.log("Final ZIP File Object:", zipFileObj);
          
              this.newmemofiles = [...this.newmemofiles,
                {  
                  UniqueId: Date.now(),
                  name: zipFileName,
                  size: Number(zipFileObj.size), // Ensure the size is set correctly
                  Files: {
                    lastModified: zipFileObj.lastModified,
                    lastModifiedDate: new Date(),
                    name: zipFileObj.name,
                    size: Number(zipFileObj.size), // Check if this is still NaN
                    type: zipFileObj.type,
                    webkitRelativePath: ""
                  }
                }
              ];
          
              this.newmemofiles = [...this.newmemofiles]; // Ensure Angular detects changes
          
              console.log(this.newmemofiles , "Zip file Array");
          
              // saveAs(zipFile, zipFileName); // ✅ Trigger Download
            })
            .catch(error => console.error("Error generating ZIP file:", error));

         }
         else if(item.contentType){
             // file selected
             this.newmemofiles = [...this.newmemofiles,item];  
         }
    })
    // for opening the sidebar.
    this.waitForElement('#Kt_reply_Memo_New', (replyMemoElement: HTMLElement) => {
      replyMemoElement.classList.add("kt-quick-panel--on");

      const sideViewElement = document.getElementsByClassName("side_view")[0] as HTMLElement;
      if (sideViewElement) {
        sideViewElement.classList.add("position-fixed");
      }
      const asideMenuOverlayElement = document.getElementsByClassName("kt-aside-menu-overlay")[0] as HTMLElement;
      if (asideMenuOverlayElement) {
        asideMenuOverlayElement.classList.add("d-block");
      }
    });

  }




  // Helper method to wait for an element to be available in the DOM
  waitForElement(selector: string, callback: (element: HTMLElement) => void) {
    const interval = setInterval(() => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        clearInterval(interval); // Stop checking once the element is found
        callback(element); // Execute the callback with the found element
      }
    }, 100); // Check every 100ms
  }


  @ViewChild('contextMenu', { static: false }) contextMenu: ElementRef | undefined;
  isFilesSelection: boolean = false;
  isFoldersSelection:boolean = false;
  onLeftClick(event: MouseEvent): void {
    if (this.isFilesSelection) {
      // Remove classes from the clicked element
      const element = this.el.nativeElement.querySelector('.file-li m-item');
      if (element) {
        this.renderer.removeClass(element, 'right-clicked');
        this.renderer.removeClass(element, 'selected');
      } else {
        console.warn('Element not found');
      }

      this.showContextMenu = false;
      this.showContextFolderMenu = false;
      this.selectedFiles = [];
      this.selectedItem = null;
      this._Isctrlclik = false;
    }
  }

  onLeftClickRes(event: MouseEvent): void {
    // Check if the click was outside the context menu
    const contextMenu = document.querySelector('.context-menures');
    if (this._RestoreshowContextMenu && contextMenu && !contextMenu.contains(event.target as Node)) {
      this._RestoreshowContextMenu = false;
    }
  }

  clickTimeout: any;
  handleClick(event: MouseEvent, uri: string): void {
    event.preventDefault(); // Prevent the default single click action
    clearTimeout(this.clickTimeout); // Clear any previous click timeout

    this.clickTimeout = setTimeout(() => {
      // Handle single click action (if needed)
      console.log('Single click detected, do nothing.');
    }, 250); // Adjust timeout as necessary
  }

  clickTimeoutRes: any;
  handleClickRes(event: MouseEvent, uri: string): void {
    event.preventDefault(); // Prevent the default single click action
    clearTimeout(this.clickTimeoutRes); // Clear any previous click timeout

    this.clickTimeoutRes = setTimeout(() => {
      // Handle single click action (if needed)
      console.log('Single click detected, do nothing.');
    }, 250); // Adjust timeout as necessary
  }

  // LoadDocument(uri: string): void {
  //   clearTimeout(this.clickTimeout); // Clear the single click timeout
  //   window.open(uri, '_blank'); // Open the link on double-click
  //   console.log('Double click detected, opening link:', uri);
  // }

  LoadDocument(path: string, filename: string) {
    let name = "Memo/ArchiveView";
    var rurl = document.baseURI + name;
    var encoder = new TextEncoder();
    let _uu = path;
    let url = encoder.encode(_uu);
    console.log(_uu);
    console.log(url);
    // let url = _uu;
    let encodeduserid = encoder.encode(this.currentUserValue.createdby.toString());
    var myurl = rurl + "/url?url=" + url + "&" + "uid=" + encodeduserid + "&" + "filename=" + encoder.encode(filename) + "&" + "IsConfidential=" + 0 + "&type=2";
    console.log(myurl);
    var myWindow = window.open(myurl, url.toString());
    myWindow.focus();
  }

  _Isctrlclik: boolean = false;
  _IsctrlclikRes: boolean = false;
  _IsShared: boolean = true;
  _isOwner: boolean = true;

  onRightClickFolder(event: MouseEvent,  item: any): void {
    this.newmemofiles = [];
    this.isFoldersSelection = false;
    // this._isOwner = item.isOwner;
    // this._IsShared = item.isShared;
    console.log('Right-clicked on:', item); // Debugging
    event.preventDefault(); // Prevent the default context menu
    this.selectedItem = item; // Set the clicked item as selected
    console.log(this.selectedItem, "Right selected files");
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    // Get the dimensions of the context menu
    const menuHeight = 200; // Set this to the maximum height you've defined in CSS
    const viewportHeight = window.innerHeight;

    // Adjust X position
    const menuWidth = 200; // Adjust this to your menu's width
    if (this.contextMenuPosition.x + menuWidth > window.innerWidth) {
      this.contextMenuPosition.x = window.innerWidth - menuWidth - 10; // 10px margin
    }

    // Check available space below the cursor
    const spaceBelow = viewportHeight - this.contextMenuPosition.y;

    // Adjust Y position if it goes out of the viewport
    if (spaceBelow < menuHeight) {
      this.contextMenuPosition.y = this.contextMenuPosition.y - menuHeight; // Move up
    }
    this.showContextFolderMenu = true; // Show the context menu
    this.cdr.detectChanges(); // Trigger Angular change detection

    if (this._Isctrlclik) {
      const index = this.selectedFiles.indexOf(item);
      if (index === -1) {
        this.selectedFiles.push(item);  // Add the file to the selected array
        console.log(this.selectedFiles, "Selected 111");
      }
    } else {
      this.selectedFiles = [item];

    }


    // console.log(this.selectedFiles, "right files");
  }


  onRightClick(event: MouseEvent, type: string, item: any): void {
    this.newmemofiles = [];
    this.isFilesSelection = false;
    this._isOwner = item.isOwner;
    this._IsShared = item.isShared;
    console.log('Right-clicked on:', item); // Debugging
    event.preventDefault(); // Prevent the default context menu
    this.selectedItem = item; // Set the clicked item as selected
    console.log(this.selectedItem, "Right selected files");
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    // Get the dimensions of the context menu
    const menuHeight = 200; // Set this to the maximum height you've defined in CSS
    const viewportHeight = window.innerHeight;

    // Adjust X position
    const menuWidth = 200; // Adjust this to your menu's width
    if (this.contextMenuPosition.x + menuWidth > window.innerWidth) {
      this.contextMenuPosition.x = window.innerWidth - menuWidth - 10; // 10px margin
    }

    // Check available space below the cursor
    const spaceBelow = viewportHeight - this.contextMenuPosition.y;

    // Adjust Y position if it goes out of the viewport
    if (spaceBelow < menuHeight) {
      this.contextMenuPosition.y = this.contextMenuPosition.y - menuHeight; // Move up
    }
    this.showContextMenu = true; // Show the context menu
    this.cdr.detectChanges(); // Trigger Angular change detection

    if (this._Isctrlclik) {
      const index = this.selectedFiles.indexOf(item);
      if (index === -1) {
        this.selectedFiles.push(item);  // Add the file to the selected array
        console.log(this.selectedFiles, "Selected 111");
      }
    } else {
      this.selectedFiles = [item];

    }


    // console.log(this.selectedFiles, "right files");
  }


  RestoreonRightClick(event: MouseEvent, type: string, item: any): void {
    event.preventDefault(); // Prevent the default context menu
    this.selectedItemRestorefile = item; // Set the clicked item as selected
    this.rescontextMenuPosition = { x: event.clientX, y: event.clientY };
    // Get the dimensions of the context menu
    const menuHeight = 100; // Set this to the maximum height you've defined in CSS
    const viewportHeight = window.innerHeight;
    // Adjust X position
    const menuWidth = 100; // Adjust this to your menu's width
    if (this.rescontextMenuPosition.x + menuWidth > window.innerWidth) {
      this.rescontextMenuPosition.x = window.innerWidth - menuWidth - 10; // 10px margin
    }

    // Check available space below the cursor
    const spaceBelow = viewportHeight - this.rescontextMenuPosition.y;

    // Adjust Y position if it goes out of the viewport
    if (spaceBelow < menuHeight) {
      this.rescontextMenuPosition.y = this.rescontextMenuPosition.y - menuHeight; // Move up
    }
    this._RestoreshowContextMenu = true; // Show the context menu
    if (this._IsctrlclikRes) {
      const index = this.selectedFilesRes.indexOf(item);
      if (index === -1) {
        this.selectedFilesRes.push(item);  // Add the file to the selected array
      }
    } else {
      this.selectedFilesRes = [item];
    }
    // console.log(this.selectedFilesRes, "restore right files");
  }

  selectedFiles: any[] = []; // Array to track selected files
  selectedFilesRes: any[] = []; // Array to track selected files
  totalSelectedSizeKB: number = 0;
  totalSelectedSize: string = ''; // Holds the formatted size string (e.g., '500 KB' or '1.5 MB')

  /**
  * Select a file with single click or Ctrl+click for multiple selection.
  * @param event Mouse event to detect Ctrl key.
  * @param file The clicked file object.
  */
  selectFile(event: MouseEvent, file: any): void {

    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      this._Isctrlclik = true;
      // Allow multiple selections
      const index = this.selectedFiles.indexOf(file);
      if (index === -1) {
        this.selectedFiles.push(file);  // Add the file to the selected array
      } else {
        this.selectedFiles.splice(index, 1);  // Remove the file if already selected
      }
    } else {
      // Single selection
      this.selectedFiles = [file];
      this._Isctrlclik = false;
    }
    console.log(this.selectedFiles, "Selected files");
    this.showContextMenu = false;
    // Recalculate total size of selected files
    this.calculateSelectedSize(this.selectedFiles);
    this.isFilesSelection = true;
  }

//   selectedFolders: any[] = [];  
//   selectFile(event: MouseEvent, item: any): void {
//     event.stopPropagation();

//     // Determine if it's a folder or a file
//     const isFolder = item && item.folders;

//     if (event.ctrlKey || event.metaKey) {
//         // Handle multiple selection with ctrl/meta key
//         if (isFolder) {
//             const index = this.selectedFolders.indexOf(item);
//             if (index === -1) {
//                 this.selectedFolders.push(item); // Add the folder to the selected array
//             } else {
//                 this.selectedFolders.splice(index, 1); // Remove the folder if already selected
//             }
//         } else {
//             const index = this.selectedFiles.indexOf(item);
//             if (index === -1) {
//                 this.selectedFiles.push(item); // Add the file to the selected array
//             } else {
//                 this.selectedFiles.splice(index, 1); // Remove the file if already selected
//             }
//         }
//     } else {
//         // Single selection
//         if (isFolder) {
//             this.selectedFolders = [item];
//             this._Isctrlclik = false;
//         } else {
//             this.selectedFiles = [item];
//             this._Isctrlclik = false;
//         }
//     }

//     console.log("Selected folders:", this.selectedFolders);
//     console.log("Selected files:", this.selectedFiles);
//     this.showContextMenu = false;

//     // Recalculate total size of selected files if necessary
//     if (!isFolder) {
//         this.calculateSelectedSize(this.selectedFiles);
//         this.isFilesSelection = true;
//     } else {
//         this.isFoldersSelection = true;
//     }
// }

  calculateSelectedSize(selectedFiles: { name: string; size: number; uri: string; contentType: string }[]) {
    // Calculate total size in bytes, only summing valid numbers
    const totalSizeInBytes = selectedFiles.reduce((acc, file) => {
      // Check if file.size is a valid number
      if (!isNaN(file.size)) {
        return acc + file.size;
      }
      return acc;
    }, 0);
  
    // If total size is 0, don't proceed with further calculations
    if (totalSizeInBytes === 0) {
      this.totalSelectedSize = '0 KB';  // Or another default value
      console.log(`Total selected size: ${this.totalSelectedSize}`);
      return;
    }
  
    // Determine whether to display in KB or MB
    if (totalSizeInBytes < 1024 * 1024) {
      // Convert to kilobytes (KB) and round to 2 decimal places
      this.totalSelectedSize = (totalSizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
      // Convert to megabytes (MB) and round to 2 decimal places
      this.totalSelectedSize = (totalSizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  
    // Log the total size
    console.log(`Total selected size: ${this.totalSelectedSize}`);
  }
  

  
  
  


  // onClickOutside(event: MouseEvent): void {
  //   // Debug: log the event to check the target
  //   if (!this.elRef.nativeElement.contains(event.target)) {
  //     // Deselect all files if clicked outside
  //     this.selectedFiles = [];
  //     this._Isctrlclik = false;
  //     this.showContextMenu = false;
  //     this.selectedItem = null;
  //   }
  // }

  @ViewChild('container') container: ElementRef;

  // @HostListener('document:mousedown', ['$event'])
  // onClickOutside(event: MouseEvent): void {
  //   if (!this.container.nativeElement.contains(event.target)) {
  //     this.selectedFiles = [];
  //     this._Isctrlclik = false;
  //     this.showContextMenu = false;
  //     this.selectedItem = null;
  //   }
  // }


  selectRestoreFile(event: MouseEvent, file: any): void {
    event.stopPropagation();
    if (event.ctrlKey || event.metaKey) {
      this._IsctrlclikRes = true;
      // Allow multiple selections
      const index = this.selectedFilesRes.indexOf(file);
      if (index === -1) {
        this.selectedFilesRes.push(file);  // Add the file to the selected array
      } else {
        this.selectedFilesRes.splice(index, 1);  // Remove the file if already selected
      }
    } else {
      // Single selection
      this.selectedFilesRes = [file];
      this._IsctrlclikRes = false;
    }
    this._RestoreshowContextMenu = false;
  }

  /**
   * Check if the file is selected.
   * @param file The file to check.
   * @returns Boolean indicating whether the file is selected.
   */
  isSelected(file: any): boolean {
    return this.selectedFiles.indexOf(file) !== -1;
  }

 
  /**
 * Check if the file is selected.
 * @param file The file to check.
 * @returns Boolean indicating whether the file is selected.
 */
  isSelectedRestorefile(file: any): boolean {
    return this.selectedFilesRes.indexOf(file) !== -1;
  }

  deleteSelectedFiles(): void {
    this.showContextMenu = false;
    const selectedFileUris = this.selectedFiles.map(file => file.uri);

    if (selectedFileUris.length === 0) {
      console.error('No files selected for deletion.');
      return;
    }
    // Call the deleteMultipleFiles method to delete all selected files
    this.deleteMultipleFiles(selectedFileUris);
  }



  deleteMultipleFiles(fileUris: string[]): void {
    if (!fileUris || fileUris.length === 0) {
      console.error('No files selected for deletion.');
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with deleting the selected files?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        let jsonArray: any[] = [];
        // Iterate through each file URI and perform deletion
        fileUris.forEach((fileUri) => {
          // this._obj.filepath = decodeURIComponent(fileUri);  // Assign the file's URI for each file
          // Create the JSON object with the required properties
          let jsonObject = {
            Url: fileUri,//decodeURIComponent(fileUri),
            EmployeeId: this.EmployeeId
          };
          // Add the JSON object to the array
          jsonArray.push(jsonObject);
        });
        this._obj.json = JSON.stringify(jsonArray);
        this.service.StreamboxDeletefilesApi(this._obj).subscribe(
          (data) => {
            // Handle successful deletion (update currentFolder)
            this.removeFileFromCurrentFolder(fileUris);
          },
          (error) => {
            console.error('Error deleting file:', error);
          }
        );
      }
    });
  }

  // Helper function to remove multiple files from currentFolder after deletion
  removeFileFromCurrentFolder(fileUris: string[]): void {
    this.currentFolder.files = this.currentFolder.files.filter((file: any) => !fileUris.includes(file.uri));
    console.log('File deleted from currentFolder', this.currentFolder);
  }
  isFolderDelete: boolean = false;
  // Method to delete selected files or folders
  // deleteSelectedItems(): void {
  //   this.showContextMenu = false;
  //   const selectedItemUris = this.selectedFiles.map(item => item.uri);

  //   if (selectedItemUris.length === 0) {
  //     console.error('No items selected for deletion.');
  //     return;
  //   }

  //   // Check if we're deleting files or folders and call the appropriate method
  //   if (this.isFolderDelete) {
  //     this.deleteMultipleFolders(selectedItemUris);
  //   } else {
  //     this.deleteMultipleFiles(selectedItemUris);
  //   }
  // }

  // // Method to delete selected files
  // deleteMultipleFiles(fileUris: string[]): void {
  //   if (!fileUris || fileUris.length === 0) {
  //     console.error('No files selected for deletion.');
  //     return;
  //   }
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to proceed with deleting the selected files?",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete them!",
  //     cancelButtonText: "Cancel"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       let jsonArray: any[] = [];
  //       fileUris.forEach((fileUri) => {
  //         let jsonObject = {
  //           Url: fileUri,
  //           EmployeeId: this.EmployeeId
  //         };
  //         jsonArray.push(jsonObject);
  //       });

  //       this._obj.json = JSON.stringify(jsonArray);
  //       this.service.StreamboxDeletefilesApi(this._obj).subscribe(
  //         (data) => {
  //           // Handle successful deletion (update currentFolder)
  //           this.removeFileFromCurrentFolder(fileUris);
  //         },
  //         (error) => {
  //           console.error('Error deleting file:', error);
  //         }
  //       );
  //     }
  //   });
  // }

  // // Method to delete selected folders
  // deleteMultipleFolders(folderUris: string[]): void {
  //   if (!folderUris || folderUris.length === 0) {
  //     console.error('No folders selected for deletion.');
  //     return;
  //   }
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to proceed with deleting the selected folders?",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete them!",
  //     cancelButtonText: "Cancel"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       let jsonArray: any[] = [];
  //       folderUris.forEach((folderUri) => {
  //         let jsonObject = {
  //           Url: folderUri,
  //           EmployeeId: this.EmployeeId
  //         };
  //         jsonArray.push(jsonObject);
  //       });

  //       this._obj.json = JSON.stringify(jsonArray);
  //       this.service.StreamboxDeletefilesApi(this._obj).subscribe(
  //         (data) => {
  //           // Handle successful deletion (update currentFolder)
  //           this.removeFolderFromCurrentFolder(folderUris);
  //         },
  //         (error) => {
  //           console.error('Error deleting folder:', error);
  //         }
  //       );
  //     }
  //   });
  // }

  // // Helper function to remove files from currentFolder after deletion
  // removeFileFromCurrentFolder(fileUris: string[]): void {
  //   this.currentFolder.files = this.currentFolder.files.filter((file: any) => !fileUris.includes(file.uri));
  //   console.log('File deleted from currentFolder', this.currentFolder);
  // }

 

  // // Helper function to remove folders from currentFolder after deletion
  // removeFolderFromCurrentFolder(folderUris: string[]): void {
  //   // Ensure currentFolder is not null and folders is an array
  //   if (this.currentFolder && Array.isArray(this.currentFolder.folders)) {
  //     this.currentFolder.folders = this.currentFolder.folders.filter(
  //       (folder: Folder) => !folderUris.includes(folder.uri)  // Access the uri property of Folder
  //     );
  //     console.log('Folder deleted from currentFolder', this.currentFolder);
  //   } else {
  //     // Handle the case where currentFolder is null or folders is not an array
  //     console.error('currentFolder is null or folders is not an array');
  //   }
  // }
  

  _Deletefile: any = [];
  recycle_btn() {
    this._obj.EmployeeId = this.EmployeeId;
    this.service.StreamBoxDeletedCloudFiles(this._obj).subscribe(
      (data: any) => {
        console.log(data, "recycle data")
        this._Deletefile = data;
        console.log(this._Deletefile, "recycle files array");
      });

    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
    document.getElementById("recycle-slide").classList.add("kt-quick-panel--on");
  }


  SelectedFilesPermalityDelete() {
    this._RestoreshowContextMenu = false;
    const selectedFileUris = this.selectedFilesRes.map(file => file.Uri);
    console.log(selectedFileUris, "perdel value");
    if (selectedFileUris.length === 0) {
      console.error('No files selected for deletion.');
      return;
    }
    // Call the PermalityDeleteMultipleFiles method to delete all selected files
    this.PermalityDeleteMultipleFiles(selectedFileUris);
  }

  PermalityDeleteMultipleFiles(fileUris: string[]): void {
    console.log(fileUris, "Permality delete url value")
    if (!fileUris || fileUris.length === 0) {
      console.error('No files selected for deletion.');
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with deleting the selected files?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        let jsonArray: any[] = [];
        // Iterate through each file URI and perform deletion
        fileUris.forEach((fileUri) => {
          // this._obj.filepath = decodeURIComponent(fileUri);  // Assign the file's URI for each file
          // Create the JSON object with the required properties
          let jsonObject = {
            fullpath: fileUri,//decodeURIComponent(fileUri),
            EmployeeId: this.EmployeeId
          };
          // Add the JSON object to the array
          jsonArray.push(jsonObject);
        });
        this._obj.json = JSON.stringify(jsonArray);
        this.service.StreamboxPermalityDeletefilesApi(this._obj).subscribe(
          (data) => {
            // Handle successful deletion (update currentFolder)
            // this.PermalityremoveFileFromCurrentFolder(fileUris);
            // this.recycle_btn();
            this.RebindingService();
          },

          (error) => {
            console.error('Error deleting file:', error);
          }

        );
        fileUris.forEach((fileUri) => {
          // this._obj.filepath = decodeURIComponent(fileUri);  // Assign the file's URI for each file
          // Create the JSON object with the required properties
          let jsonObject = {
            fullpath: fileUri,//decodeURIComponent(fileUri),
          };
          // Add the JSON object to the array
          jsonArray.push(jsonObject);
        });

        console.log(JSON.stringify(jsonArray), "JSON");


        this._obj.json = JSON.stringify(jsonArray);
        this._obj.IsRestore = false;
        console.log('Request body:', this._obj);
        this.service.RestoreFile(this._obj).subscribe(
          (data) => {
            console.log(data, "Restore");
            // Handle successful deletion (update currentFolder)
            // this.PermalityremoveFileFromCurrentFolder(fileUris);

          },
          (error) => {
            console.error('Error deleting file:', error);
          }
        );
      }
    });
  }

  SelectedFilesRestore() {
    this._RestoreshowContextMenu = false;
    console.log(this.selectedFilesRes, "Select array");
    const RestoreselectedFileUris = this.selectedFilesRes.map(file => file.Uri);
    // const RestoreselectedFileUris = this.selectedFilesRes.map(file => file.Uri || 'Uri not available');

    console.log(RestoreselectedFileUris, "perdel value");
    if (RestoreselectedFileUris.length === 0) {
      console.error('No files selected for deletion.');
      return;
    }
    // Call the PermalityDeleteMultipleFiles method to delete all selected files
    this.RestoreMultipleFiles(RestoreselectedFileUris);
  }

  RestoreMultipleFiles(fileUris: string[]): void {
    console.log(fileUris, "Permanent delete URL value");

    if (!fileUris || fileUris.length === 0) {
      console.error('No files selected for restoration.');
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with restoring the selected files?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, restore them!",  // Updated text for clarity
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        const jsonArray: any[] = fileUris.map(fileUri => ({
          fullpath: fileUri
        }));

        this._obj.json = JSON.stringify(jsonArray);
        this._obj.IsRestore = true;

        console.log('Request body:', this._obj);

        this.service.RestoreFile(this._obj).subscribe(
          (data) => {
            // Handle successful restoration (update currentFolder)
            this.removeFileFromCurrentFolder(fileUris);

            // Call RebindingService directly without setTimeout
            this.RebindingService(); // Fixed invocation

          },
          (error) => {
            console.error('Error restoring files:', error);
            Swal.fire('Error!', 'There was an error restoring the files.', 'error');
          }
        );
      }
    });
  }

  RebindingService(): void {
    this._obj.EmployeeId = this.EmployeeId;
    this.service.StreamBoxDeletedCloudFiles(this._obj).subscribe(
      data => {
        console.log(data, "Recycle data");
        this._Deletefile = data;
        console.log(this._Deletefile, "Recycle files array");
      },
      (error) => {
        console.error('Error fetching deleted files:', error);
        Swal.fire('Error!', 'There was an error fetching deleted files.', 'error');
      }
    );
  }


  //   RestoreMultipleFiles(fileUris: string[]): void {
  // console.log(fileUris,"Permality delete url value")
  //     if (!fileUris || fileUris.length === 0) {
  //       console.error('No files selected for deletion.');
  //       return;
  //     }
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "Do you want to proceed with Restore the selected files?",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete them!",
  //       cancelButtonText: "Cancel"
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         let jsonArray: any[] = [];
  //         // Iterate through each file URI and perform deletion
  //         fileUris.forEach((fileUri) => {
  //           // this._obj.filepath = decodeURIComponent(fileUri);  // Assign the file's URI for each file
  //           // Create the JSON object with the required properties
  //           let jsonObject = {
  //             fullpath: fileUri,//decodeURIComponent(fileUri),
  //           };
  //           // Add the JSON object to the array
  //           jsonArray.push(jsonObject);
  //         });

  //         this._obj.json = JSON.stringify(jsonArray);
  //         this._obj.IsRestore = true;
  //         this.service.RestoreFile(this._obj).subscribe(
  //           (data) => {
  //               this.RebindingService;
  //           },
  //           (error) => {
  //             console.error('Error deleting file:', error);
  //           }
  //         );


  //       }
  //     });
  //   }

  //   RebindingService(): void {
  //     this._obj.EmployeeId = this.EmployeeId;
  //     this.service.StreamBoxDeletedCloudFiles(this._obj).subscribe(
  //       data => {
  //         console.log(data, "Recycle data");
  //         this._Deletefile = data;
  //         alert(this._Deletefile.length);
  //         console.log(this._Deletefile, "Recycle files array");
  //       },
  //       (error) => {
  //         console.error('Error fetching deleted files:', error);
  //         Swal.fire('Error!', 'There was an error fetching deleted files.', 'error');
  //       }
  //     );
  //   }

  // Helper function to remove multiple files from currentFolder after deletion
  // PermalityremoveFileFromCurrentFolder(fileUris: string[]): void {
  //   // Check if _Deletefile and _Deletefile.files are defined
  //   if (this._Deletefile && Array.isArray(this._Deletefile.files)) {
  //     this._Deletefile.files = this._Deletefile.files.filter((file: any) => !fileUris.includes(file.Uri));
  //     console.log('File deleted from _Deletefile', this._Deletefile);
  //   } else {
  //     console.error("The files array is undefined or not an array.");
  //   }
  // }


  /**
   * Deselect all files if a click occurs outside the file list.
   * HostListener listens for clicks on the document.
   */
  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: Event): void {
  //   this.selectedFiles = []; // Clear all selected files when clicking outside
  //   this._Isctrlclik = false;
  //   this.showContextMenu = false;
  // }

  /**
  * Deselect all files if a click occurs outside the file list.
  * HostListener listens for clicks on the document.
  */
  closeMenu(): void {
    // this.showContextMenu = false;
    // this.showContextFolderMenu = false;
    const element = this.el.nativeElement.querySelector('.file-li m-item');
    if (element) {
      this.renderer.removeClass(element, 'right-clicked');
      this.renderer.removeClass(element, 'selected');
    } else {
      console.warn('Element not found');
    }

    this.showContextMenu = false;
    this.showContextFolderMenu = false;
    this.selectedFiles = [];
    this.selectedItem = null;
    this._Isctrlclik = false;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(target: HTMLElement): void {
    this.closeMenu();
    // const clickedInside = this.elRef.nativeElement.contains(target);
    // if (!clickedInside) {
    //   this.closeMenu();
    // }
  }
  onClickOutsideRes(event: Event): void {
    this.selectedFilesRes = []; // Clear all selected files when clicking outside
  }

  Downloadfiles(url, filename): void {
    fetch(url).then(function (t) {
      return t.blob().then((b) => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", filename);
        a.click();
      }
      );
    });
    this.showContextMenu = false;
    const language = localStorage.getItem('language');
    // Display message based on language preference
    if (language === 'ar') {
      this._snackBar.open('تم التنزيل بنجاح', 'انتهي الآن', {
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
      });
    } else {
      this._snackBar.open('Download Successfully', 'End now', {
        duration: 5000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
      });
    }
  }

  DownloadStreambox() {
    const url = 'https://yrglobaldocuments.blob.core.windows.net/documents/streamboxapp%20Setup%201.0.0.exe';

    // Create an anchor element
    const a = document.createElement('a');
    a.href = url; // Set the href to the URL of the file
    a.download = 'streamboxapp_Setup_1.0.0.exe'; // Specify the name for the downloaded file

    // Append the anchor to the body (not visible to the user)
    document.body.appendChild(a);

    // Programmatically click the anchor to trigger the download
    a.click();

    // Remove the anchor from the document
    document.body.removeChild(a);
  }

  FileUploadErrorlogs: boolean = false;
  _lstMultipleFiales: any;
  ShareSearch: string;
  SelectedUsers: any;
  Selected_URL: any;
  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[]; // Type assertion to File[]

    // Ensure that _lstMultipleFiales is initialized before accessing it
    if (!this._lstMultipleFiales) {
      this._lstMultipleFiales = []; // Initialize the array if it's undefined
    }

    if (files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]; // Now TypeScript knows 'file' is of type 'File'
        const fileSizeInKB = file.size / 1024; // File size in KB

        // Check if the file size is 0 KB
        if (fileSizeInKB === 0) {
          this.FileUploadErrorlogs = true; // Show error message
          console.log('The uploaded file is 0kb. Please upload a larger file.');
          continue; // Skip this file
        }

        // Check if the file is already in the array to avoid duplicates
        const existingFile = this._lstMultipleFiales.find(
          (item) => item.FileName === file.name && item.Size === file.size
        );

        if (!existingFile) {
          const uniqueId = new Date().valueOf() + index; // Ensure unique ID
          this._lstMultipleFiales.push({
            UniqueId: uniqueId,
            FileName: file.name,
            Size: file.size,
            Files: file,
          });
        }
      }

      console.log(this._lstMultipleFiales, 'Upload Files');

      // Clear the input to allow re-uploading of the same file
      event.target.value = '';
    }
  }

  ObjShareUserList: any[] = [];
  _LstToUsers: any;
  Sharingusers(uri) {
    this.Selected_URL = uri;

    this.showContextMenu = false;
    const lang: any = localStorage.getItem('language');
    this._obj2.CreatedBy = this.currentUserValue.createdby;
    this._obj2.organizationid = this.currentUserValue.organizationid;
    this._obj2.DocumentId = 0; // passing 0 because same api is used in details page,there we have pass documentid
    this.inboxService.ShareUserList(this._obj2)
      .subscribe(data => {
        // this._obj1 = data as InboxDTO;
        var _UsersLst = data["Data"].UserJson;
        this._LstToUsers = _UsersLst;
        _UsersLst.forEach(element => {
          if (this.currentUserValue.createdby != element.UserId) {
            this.ObjShareUserList.push({
              EmployeeId: element.EmployeeId,
              UserId: element.UserId,
              ContactName: element.ContactName,
              disabled: false,
              Check: false,
              isTemporary: false,
              startDate: new Date(),
              shareDocAccess: true
            });
          }
        });
        console.log(this.ObjShareUserList, "Share User Data");
      });
    this.ObjShareUserList = [];
    this.ObjShareUserList.forEach(element => {
      element.isChecked = false;
    });
    document.getElementById("fileupload-event-modal-backdrop").style.display = "block";
    document.getElementById("projectmodal").style.display = "block";
  }


  updateSelectedValues(UserId: number, event: any) {
    const isChecked = event.checked;

    // Update the isChecked property for the specific user
    this.ObjShareUserList.forEach(element => {
      if (element.UserId === UserId) {
        element.isChecked = isChecked;
      }
    });

    // Update the SelectedUsers array with only selected users
    this.SelectedUsers = this.ObjShareUserList.filter(user => user.isChecked).map(user => user.UserId);



  }

  AddSelectUser() {
    const json = this.SelectedUsers.map((userId: number | string) => ({
      FromUserId: this.EmployeeId.toString(),
      ToUserId: userId.toString(),
      URLs: this.selectedFiles.map((file: any) => file.uri).join(','),
    }));

    console.log('Generated JSON:', json);

    this.ShareSearch = "";
    document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
    document.getElementById("projectmodal").style.display = "none";
    this.selectedFiles = [];
    this.SelectedUsers = [];
    this.isFilesSelection = false;
    this._obj.json = JSON.stringify(json);
    this.service.ShareStreamboxfile(this._obj).subscribe((data: any) => {
      console.log(data, "Share data api call");
    });
  }

  close_project_filter() {
    document.getElementById("project-filter").classList.remove("show");
    document.getElementById("filter-icon").classList.remove("active");
  }

  //   AddSelectUser() {

  // //Create JSON

  // const json = this.SelectedUsers.map((userId: number | string) => ({
  //   FromUserId: this.EmployeeId.toString(),
  //   ToUserId: userId.toString(),
  //   URL: this.Selected_URL
  // }));

  // // const json = this.SelectedUsers.map((userId: number | string) => ({
  // //   FromUserId: this.EmployeeId.toString(),
  // //   ToUserId: userId.toString(),
  // //   URLs: this.selectedFiles.map((file: any) => file.uri) // Collect only URLs
  // // }));

  // console.log('Generated JSON:', json);
  // this.ShareSearch = "";
  //     document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
  //     document.getElementById("projectmodal").style.display = "none";


  //   }

  close_projectmodal() {
    document.getElementById("fileupload-event-modal-backdrop").style.display = "none";
    document.getElementById("projectmodal").style.display = "none";
  }

  ClearShareUser() {
    this.ShareSearch = "";
  }
  usedSpace: string = '';
  usedSpaceBytes: number = 0; // New variable to hold size in bytes
  calculateUsedSpace(bytes: number) {
    this.usedSpaceBytes = bytes; // Assign the raw byte value to usedSpaceBytes

    // Determine the correct unit (KB, MB, GB)
    if (bytes >= 1024 * 1024 * 1024) {
      this.usedSpace = (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    else if (bytes >= 1024 * 1024) {
      this.usedSpace = (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    else if (bytes >= 1024) {
      this.usedSpace = (bytes / 1024).toFixed(2) + ' KB';
    }
    else {
      this.usedSpace = bytes + ' Bytes';
    }
  }




}

export function formatFileSize(bytes: number): string {

  if (bytes >= 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return bytes + ' Bytes';
  }
}

export function formatFileSizeDeletefiles(bytes: number): string {

  if (bytes >= 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return bytes + ' Bytes';
  }
}
