import { ChangeDetectorRef, Component, OnInit,Output,EventEmitter } from '@angular/core';
import { StreamboxDTO } from 'src/app/_models/streambox-dto';
import { StreamboxserviceService } from 'src/app/_service/streamboxservice.service';
import { environment } from 'src/environments/environment';
import { UserDTO } from 'src/app/_models/user-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { RootFolder, Folder, File } from '../../_models/Folder.DTO';
@Component({
  selector: 'app-gacarchivinglist',
  templateUrl: './gacarchivinglist.component.html',
  styleUrls: ['./gacarchivinglist.component.css']
})
export class GacarchivinglistComponent implements OnInit {
  @Output() filesSelected = new EventEmitter<any[]>(); // Define output event
  Has_ApprovalPending: string = "";
  _obj: StreamboxDTO;
  EmployeeId:number;
  totalSize: any;
  rootFolder: Folder | null = null;
  currentFolder: Folder | null = null;
  pathStack: Folder[] = [];
  forwardStack: Folder[] = [];
  StreamSearch:string = "";
  selectedFiles: any[] = [];
  Totalcount:any;
  isFolderAndFileEmpty: boolean = false;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }
  constructor(public service: StreamboxserviceService,private cdr: ChangeDetectorRef) { 
    this._obj = new StreamboxDTO();
    this.EmployeeId =parseInt(this.currentUserValue.EmployeeCode);
    
  }

  ngOnInit(): void {
    
  //   this._obj.containerName = environment.Container_Name;
  //   this._obj.folderPath = "streambox/" + this.EmployeeId.toString();
  //   this.service.Streamboxfiles(this._obj).subscribe(
  //     data => {
  //       // console.log(data, "streambox data");
  //       const dataII: any = data;
  //       this.totalSize = dataII.totalSize;
  //       this.rootFolder = dataII.rootFolder.folders.streambox.folders[this.EmployeeId.toString()];
  //       this.pathStack = [];  // Clear the pathStack
  //     this.pathStack.push(this.rootFolder);  // Push root folder to the pathStack
  //     this.currentFolder = this.rootFolder;  // Set the current folder
  //   },
  //   error => {
  //     console.error("Error fetching streambox files", error);
  //   }
  // );
  this._obj.EmployeeId = this.EmployeeId;
  this.service.Streamboxfile(this._obj).subscribe((data: any) => {
    console.log(data,"Emid passing data");
        const dataII: any = data;
      this.totalSize = dataII.totalSize;
      // this.rootFolder = dataII.rootFolder.folders.streambox.folders[this.EmployeeId.toString()];
      // this.rootFolder = dataII.rootFolder?.folders?.streambox?.folders[this.EmployeeId.toString()] || { files: [], folders: {} };
      this.currentFolder = dataII.rootFolder;
      console.log(this.currentFolder, "current Folder");
      // const folderCount = Object.keys(this.currentFolder.folders).length;
      // this.Totalcount = this.currentFolder.files.length + folderCount;
      const folderCount = Object.keys(this.currentFolder.folders || {}).length;
const fileCount = this.currentFolder.files?.length || 0;
this.Totalcount = fileCount + folderCount;
// Check if both files and folders are empty
this.isFolderAndFileEmpty = folderCount === 0 && fileCount === 0;
  });
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // navigateToFolder(folder: Folder): void {
  //   console.log(folder,"Folderssssssssssssssss");
  //   if (this.currentFolder) {
  //     this.pathStack.push(this.currentFolder);
  //   }
  //   this.currentFolder = folder;
  // }

  // Define a variable to store the folder name
folderName: string = '';

// navigateToFolder(folder: Folder): void {
//     console.log(folder, "Folderssssssssssssssss");
    
//     // Check if the folder has a 'name' property and assign it to the variable
//     if (folder && folder.name) {
//       this.folderName = folder.name;
//       console.log('Folder Name:', this.folderName);
//     }
    
//     if (this.currentFolder) {
//       this.pathStack.push(this.currentFolder);
//     }
    
//     // Update the current folder
//     this.currentFolder = folder;

// }

// navigateBack(): void {
//   this.currentFolder = this.pathStack.pop() || this.rootFolder;
//   this.folderName = "";
// }

breadcrumbFolderNames: string[] = []; // Array to store breadcrumb folder names
breadcrumb: Folder[] = [];

  // Method to navigate and add folder to breadcrumb trail
  // navigateToFolder(folder: Folder): void {
  //   console.log(folder, 'Navigated to folder');
    
  //   // Push folder into breadcrumb trail
  //   if (folder && folder.name) {
  //     this.breadcrumb.push(folder);
  //     this.breadcrumbFolderNames.push(folder.name);  // Storing names for breadcrumbs
  //   }

  //   // Set the current folder
  //   this.currentFolder = folder;
  // }

  navigateToFolder(folder: Folder): void {
      // Clear the selected files when navigating to a new folder
      this.selectedFiles = [];
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

  // Example of going back to a specific folder (optional)
  // goBackToFolder(index: number): void {
  //   // Keep the breadcrumb up to the selected index
  //   this.breadcrumb = this.breadcrumb.slice(0, index + 1);
  //   this.breadcrumbFolderNames = this.breadcrumb.map(folder => folder.name);
    
  //   // Set the current folder to the selected folder
  //   this.currentFolder = this.breadcrumb[index];
  // }

//   goBackToFolder(index: number): void {
//     // Keep the folders up to the clicked breadcrumb index
//     const newBreadcrumb = this.breadcrumb.slice(0, index + 1);
//     const newBreadcrumbNames = this.breadcrumbFolderNames.slice(0, index + 1);

//     // Update pathStack to match the breadcrumb
//     this.pathStack = this.pathStack.slice(0, index);

//     // Set the current folder to the selected breadcrumb folder
//     this.currentFolder = newBreadcrumb[index];

//     // Update breadcrumb array and names
//     this.breadcrumb = newBreadcrumb;
//     this.breadcrumbFolderNames = newBreadcrumbNames;

//     console.log('Navigated to folder via breadcrumb:', this.currentFolder.name);
//     console.log('Updated pathStack:', this.pathStack);
//     console.log('Updated breadcrumb:', this.breadcrumbFolderNames);
// }

goBackToFolder(index: number): void {
  // Ensure that the index is within the valid range
  if (index < 0 || index >= this.breadcrumb.length) return;

  // When you go back, only remove the breadcrumb items after the clicked one.
  this.breadcrumb = this.breadcrumb.slice(0, index + 1);  // Keep up to the clicked folder
  this.breadcrumbFolderNames = this.breadcrumbFolderNames.slice(0, index + 1);  // Update folder names

  // Update the pathStack and remove extra entries beyond the current breadcrumb.
  this.pathStack = this.pathStack.slice(0, index);  // Keep only up to the current folder in the stack

  // Navigate to the selected folder (based on the clicked breadcrumb index)
  this.currentFolder = this.breadcrumb[index];  // Set the current folder to the clicked folder

  
  // Log the result (optional)
  console.log('Navigated to folder via breadcrumb:', this.currentFolder.name);
  console.log('Updated pathStack:', this.pathStack);
  console.log('Updated breadcrumb:', this.breadcrumbFolderNames);
}

navigateBack(): void {
  
  if (this.pathStack.length > 0) {
    // Pop the last folder from the path stack
    const previousFolder = this.pathStack.pop();  
    if (previousFolder) {
      this.forwardStack.push(this.currentFolder);  // Push current folder to forwardStack
      this.currentFolder = previousFolder;  // Set the current folder to the previous one
      const folderCount = Object.keys(this.currentFolder.folders).length;
      this.Totalcount = this.currentFolder.files.length + folderCount;
      // Remove the last breadcrumb and breadcrumb name
      this.breadcrumb.pop();
      this.breadcrumbFolderNames.pop();
      
      this.cdr.detectChanges();
    }
  } else {
    // alert('You are already at the root folder.');
  }
}



navigateForward(): void {
  if (this.forwardStack.length > 0) {
    // Pop the last folder from the forward stack
    const nextFolder = this.forwardStack.pop();
    if (nextFolder) {
      this.pathStack.push(this.currentFolder);  // Push current folder to pathStack
      this.currentFolder = nextFolder;  // Set the current folder to the next one
      
      // Optionally push folder into breadcrumb
      this.breadcrumb.push(nextFolder);
      this.breadcrumbFolderNames.push(nextFolder.name);  // Storing names for breadcrumbs

      this.cdr.detectChanges();
    }
  } else {
    alert('No forward folder to navigate to.');
  }
}


// navigateBack(): void {
//   if (this.pathStack.length > 0) {
//       // Pop the last folder from the path stack
//       const previousFolder = this.pathStack.pop();  
//       if (previousFolder) {
//           this.currentFolder = previousFolder;  // Set the current folder to the previous one
//           // Remove the last breadcrumb and breadcrumb name
//           this.breadcrumb.pop();
//           this.breadcrumbFolderNames.pop();
//           this.cdr.detectChanges();
//       }
//   } else {
//       alert('You are already at the root folder.');
//   }
// }

DirectBack(): void {
  this.breadcrumbFolderNames = [];
  if (this.pathStack && this.pathStack.length > 0) {
    this.pathStack = [this.pathStack[0]];  // Reset to the root
    this.currentFolder = this.pathStack[0];  // Set currentFolder to root
    const folderCount = Object.keys(this.currentFolder.folders).length;
    this.Totalcount = this.currentFolder.files.length + folderCount;

     // Reset selected files
    //  this.selectedFiles = [];
    // Manually trigger change detection
    this.cdr.detectChanges();
  }
}


totalSelectedSize: string = ''; // Holds the formatted size string (e.g., '500 KB' or '1.5 MB')


  formatSize(size: number): string {
    return formatFileSize(size);
  }
  
  toggleFileSelection(file: any, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedFiles.push(file); // Add file to selected list
    } else {
      this.selectedFiles = this.selectedFiles.filter(f => f !== file); // Remove file from selected list
    }
    this.calculateSelectedSize(this.selectedFiles);
  }

  toggleRowSelection(file: any): void {
    // Toggle selection by clicking on the row
    const index = this.selectedFiles.indexOf(file);
    if (index > -1) {
      // File already selected, unselect it
      this.selectedFiles.splice(index, 1);
    } else {
      // Select the file
      this.selectedFiles.push(file);
    }
    this.calculateSelectedSize(this.selectedFiles);
  }
 
  getAllFiles(folder: any): any[] {
    let allFiles = [...(folder.files || [])];
    
    for (const key in folder.folders) {
      if (folder.folders.hasOwnProperty(key)) {
        const subFolder = folder.folders[key];
        allFiles = [...allFiles, ...this.getAllFiles(subFolder)];
      }
    }
    return allFiles;
  }
  
   // Check if all files are selected
   areAllFilesSelected(): boolean {
    // return this.currentFolder.files.every(file => this.selectedFiles.includes(file));
    const allFiles = this.getAllFiles(this.currentFolder); // Collect all files recursively
    return allFiles.every(file => this.selectedFiles.includes(file));
  }

  // Toggle "Select All" functionality
  toggleSelectAll(event: Event): void {
   
    this.selectedFiles = [];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      // Select all files
      this.selectedFiles = [...this.currentFolder.files];
    } else {
      // Deselect all files
      this.selectedFiles = [];
    }
    // this.calculateSelectedSize(this.selectedFiles);
  }

  selectFile(file: any, event: MouseEvent) {
    // if (event.ctrlKey) {
    //   // If Ctrl is held, toggle the file selection
    //   const index = this.selectedFiles.indexOf(file);
    //   if (index > -1) {
    //     this.selectedFiles.splice(index, 1); // Deselect the file
    //   } else {
    //     this.selectedFiles.push(file); // Select the file
    //   }
    // } else {
    //   // If Ctrl is not held, clear previous selection and select only the clicked file
    //   this.selectedFiles = [file];
    // }
    console.log('File selected:', file);
   
  }
  

  calculateSelectedSize(selectedFiles: { name: string; size: number; uri: string; contentType: string }[]) {
    // Calculate total size in bytes
    const totalSizeInBytes = selectedFiles.reduce((acc, file) => acc + file.size, 0);

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

  // selectFile(file: any, event: MouseEvent) {
  //   if (event.ctrlKey) {
  //     // If Ctrl is held, toggle the file selection
  //     const index = this.selectedFiles.indexOf(file);
  //     if (index > -1) {
  //       this.selectedFiles.splice(index, 1); // Deselect the file
  //     } else {
  //       this.selectedFiles.push(file); // Select the file
  //     }
  //   } else {
  //     // If Ctrl is not held, clear previous selection and select only the clicked file
  //     this.selectedFiles = [file];
  //   }
  // }
  

  // selectFile(file: any, event: MouseEvent) {
  //   if (event.ctrlKey) {
  //     // If the file is already selected, deselect it
  //     const index = this.selectedFiles.indexOf(file);
  //     if (index > -1) {
  //       this.selectedFiles.splice(index, 1); // Deselect the file
  //     } else {
  //       this.selectedFiles.push(file); // Select the file
  //     }
  //   } else {
  //     // If ctrl is not pressed, select or deselect the file
  //     const index = this.selectedFiles.indexOf(file);
  //     if (index > -1) {
  //       this.selectedFiles.splice(index, 1); // Deselect the file
  //     } else {
  //       // If the file is not selected, clear other selections and select this one
  //       this.selectedFiles = [file]; // Clear previous selection and select the current file
  //     }
  //   }
  // }
  

  searchResult:any=[];
  SearchFileByName(inputstr:string){
    if(inputstr){
      this.searchResult=[];
      const searchInFolders=(folders)=>{
      
        for(let item in folders)
          {
               if(item=='folders'){
                   
                for(let afolder in folders[item])
                {
                  searchInFolders(folders[item][afolder]);
                }  
               }
               if(item=='files'){
                    folders[item].forEach((file)=>{
                         // condition
                         const isMatched=file.name.toLowerCase().includes(inputstr.toLowerCase());
                         if(isMatched){
                          this.searchResult.push(file);
                         }    
                    }); 
               }
          }
        
      }
      searchInFolders(this.currentFolder);
    }
    else 
    this.searchResult=[];
   
  }
  // couldfiles: any[] = [];
  // CouldfilesUpload(){
  //   console.log('Selected files:', this.selectedFiles);
  //   if (Array.isArray(this.selectedFiles)) {
  //     this.couldfiles = this.selectedFiles;  // If it's an array, assign directly
  //   } else if (typeof this.selectedFiles === 'string' || typeof this.selectedFiles === 'object') {
  //     // If it's a single file (string or object), wrap it in an array
  //     this.couldfiles = [this.selectedFiles];
  //   } else {
  //     // console.error("Invalid item type:", this.selectedFiles);  // Log an error for unsupported types
  //   }
  //   document.getElementById("gacarchivelistModal").style.display = "none";
  //   document.getElementById("gacarchivelistModal").classList.remove("show");
  //   document.getElementById("gacarchivelistModalBackdrop").style.display = "none";
  //   document.getElementById("gacarchivelistModalBackdrop").classList.remove("show");
  // }

  open_filter_doc() {
    document.getElementById("filter-open").classList.add("active");
    document.getElementById("filter-doc").classList.add("show-filter");
  }
  close_filter_doc() {
    document.getElementById("filter-open").classList.remove("active");
    document.getElementById("filter-doc").classList.remove("show-filter");
  }
  label_increase(){
    document.getElementById("label-increase-icon").classList.toggle("rotate");
    document.getElementById("label-height").classList.toggle("active");
    document.getElementById("label-view-more").classList.toggle("active");
    document.getElementById("label-view-less").classList.toggle("active");
  }


  couldfiles: any[] = [];
  CouldfilesUpload() {
    if (Array.isArray(this.selectedFiles)) {
      this.couldfiles = this.selectedFiles;
    } else if (typeof this.selectedFiles === 'string' || typeof this.selectedFiles === 'object') {
      this.couldfiles = [this.selectedFiles];
    }

    // Emit the selected files to the parent component
    this.filesSelected.emit(this.couldfiles);

    // Close the modal
    document.getElementById("gacarchivelistModal").style.display = "none";
    document.getElementById("gacarchivelistModal").classList.remove("show");
    document.getElementById("gacarchivelistModalBackdrop").style.display = "none";
    document.getElementById("gacarchivelistModalBackdrop").classList.remove("show");
  }

  gacarchivelistModal_dismiss(){
    this.selectedFiles = [];
    // this.couldfiles = [];
    this.DirectBack();
    document.getElementById("gacarchivelistModal").style.display = "none";
    document.getElementById("gacarchivelistModal").classList.remove("show");
    document.getElementById("gacarchivelistModalBackdrop").style.display = "none";
    document.getElementById("gacarchivelistModalBackdrop").classList.remove("show");
  }

}

export function formatFileSize(sizeInKB: number): string {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (sizeInKB >= GB) {
    return (sizeInKB / GB).toFixed(2) + ' GB';
  } else if (sizeInKB >= MB) {
    return (sizeInKB / MB).toFixed(2) + ' MB';
  } else {
    return (sizeInKB / KB).toFixed(2) + ' KB';
  }

  
}
