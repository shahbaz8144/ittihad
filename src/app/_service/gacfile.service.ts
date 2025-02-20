import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { UserDTO } from '../_models/user-dto';
import { GACFiledto } from '../_models/gacfiledto';
import { LabelDTO } from '../_models/label-dto';

@Injectable({
  providedIn: 'root'
})
export class GACFileService {
  _ObjGac: GACFiledto;
  _ObjGac1: LabelDTO
  currentUserSubject: BehaviorSubject<UserDTO>;
  currentUser: any;

  constructor(private http: HttpClient, private commonUrl: ApiurlService) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._ObjGac = new GACFiledto();
    this._ObjGac1 = new LabelDTO();
  }
  readonly rootUrl = this.commonUrl.apiurl;
  readonly rootUrlII = this.commonUrl.apiurlNew;

  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }
  GetDropdownList(ObjGac: GACFiledto) {
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewDropdownListForFileUpload", ObjGac);
  }



  DocumentSubmit_V2(ObjGac: GACFiledto) {
     
    this._ObjGac.CompanyId = ObjGac.CompanyId;
    this._ObjGac.DepartmentId = ObjGac.DepartmentId;
    this._ObjGac.DocumentName = ObjGac.DocumentName;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.Description = ObjGac.Description;
    this._ObjGac.VersionName   = ObjGac.VersionName;
    this._ObjGac.ParentId   = ObjGac.ParentId;
    this._ObjGac.Isphysical = ObjGac.Isphysical;
    this._ObjGac.IsFoodItem = ObjGac.IsFoodItem;
    this._ObjGac.PhysicalJson = ObjGac.PhysicalJson;
    this._ObjGac.IsAdditionalDetails = ObjGac.IsAdditionalDetails;
    this._ObjGac.AdditionalDetailsJson = ObjGac.AdditionalDetailsJson;
    this._ObjGac.IsShareDocument  = ObjGac.IsShareDocument;
    this._ObjGac.ShareDocumentJson   = ObjGac.ShareDocumentJson;
   
    return this.http.post(this.rootUrlII + "Gac/DocumentSubmit_V2", this._ObjGac);
  }

  NewDocument(ObjGac: GACFiledto) {
    
    this._ObjGac.flagId = ObjGac.flagId;
    this._ObjGac.documentId = ObjGac.documentId;
    this._ObjGac.documentName = ObjGac.documentName;
    this._ObjGac.createdBy = this.currentUserValue.createdby;
    this._ObjGac.message = ObjGac.message;
    this._ObjGac.copyFiles   = ObjGac.copyFiles;
    this._ObjGac.deletedJson   = ObjGac.deletedJson;
    this._ObjGac.extractedValuesJson = ObjGac.extractedValuesJson;
    this._ObjGac.ApprovalUserJson = ObjGac.ApprovalUserJson;
    this ._ObjGac.ShareUserJson = ObjGac.ShareUserJson;
    this._ObjGac.ReportingUserID  = ObjGac.ReportingUserID;
    this._ObjGac.IsArchiveApproval  = ObjGac.IsArchiveApproval;
    this._ObjGac.WorkflowJson = ObjGac.WorkflowJson;
    this._ObjGac.DocumentInfoJson = ObjGac.DocumentInfoJson;
    this._ObjGac.VersionName  = ObjGac.VersionName;
    this._ObjGac.ParentId = ObjGac.ParentId;
   
    return this.http.post(this.rootUrlII + "ArchiveAPI/NewDocument", this._ObjGac);
  }

  NewArchiveDocumentStreamBox(ObjGac: GACFiledto) {
    
    this._ObjGac.flagId = ObjGac.flagId;
    this._ObjGac.documentId = ObjGac.documentId;
    this._ObjGac.documentName = ObjGac.documentName;
    this._ObjGac.createdBy = this.currentUserValue.createdby;
    this._ObjGac.message = ObjGac.message;
    this._ObjGac.copyFiles   = ObjGac.copyFiles;
    this._ObjGac.deletedJson   = ObjGac.deletedJson;
    this._ObjGac.extractedValuesJson = ObjGac.extractedValuesJson;
    this._ObjGac.ApprovalUserJson = ObjGac.ApprovalUserJson;
    this ._ObjGac.ShareUserJson = ObjGac.ShareUserJson;
    this._ObjGac.ReportingUserID  = ObjGac.ReportingUserID;
    this._ObjGac.IsArchiveApproval  = ObjGac.IsArchiveApproval;
    this._ObjGac.WorkflowJson = ObjGac.WorkflowJson;
    this._ObjGac.DocumentInfoJson = ObjGac.DocumentInfoJson;
    this._ObjGac.VersionName  = ObjGac.VersionName;
    this._ObjGac.ParentId = ObjGac.ParentId;
   
    return this.http.post(this.rootUrlII + "ArchiveAPI/NewArchiveStreamBox", this._ObjGac);
  }

  async NewReferenceDocument(ObjGac: GACFiledto) {
    try {
      // Set values for _ObjGac
      this._ObjGac.DocumentId = ObjGac.DocumentId;
      this._ObjGac.ActionId = ObjGac.ActionId;
      this._ObjGac.createdBy = this.currentUserValue.createdby;
      this._ObjGac.copyFiles = ObjGac.copyFiles;
      this._ObjGac.deletedJson = ObjGac.deletedJson;
      this._ObjGac.extractedValuesJson = ObjGac.extractedValuesJson;
  
      // Await the HTTP request
      const response = await this.http.post(this.rootUrlII + "ArchiveAPI/NewReferenceDocument", this._ObjGac).toPromise();
  
      // Optionally, you can log the response or process it further
      console.log('New reference document response:', response);
  
      return response; // Return the response from the API
    } catch (error) {
      console.error('Error creating new reference document:', error);
      throw error; // Re-throw the error to be handled elsewhere
    }
  }
  

  GetSourceDropdownList(ObjGac: GACFiledto) {
    this._ObjGac.DocumentTypeId = ObjGac.DocumentTypeId;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetSourceAng", this._ObjGac);
  }
  // GetSourceAddList(ObjGac: GACFiledto){
  //   this._ObjGac.DocumentTypeId = ObjGac.DocumentTypeId;
  //   this._ObjGac.CreatedBy=this.currentUserValue.createdby;
  //   this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
  //   return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetSource", this._ObjGac);
  // }
  GetSubCategoryDropdownList(ObjGac: GACFiledto) {
    this._ObjGac.StrCategoryId = ObjGac.StrCategoryId.toString();
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewSubCategoriesParentChildByCategoryId", this._ObjGac);
  }
  AddDocumentInfo(ObjGac: GACFiledto) {
    return this.http.post(this.rootUrl + "/DocumentsAPI/AddDocumentInfoNew", ObjGac);
  }
  UploadAttachmenst(data) {
    data.append("CreatedBy", this.currentUserValue.createdby.toString());
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGACDcoumentAng", data);
  }

  UploadReferenceAttachmenst(data) {
    data.append("CreatedBy", this.currentUserValue.createdby.toString());
    return this.http.post(this.rootUrl + "/DocumentsAPI/AddGACReferenceDocuments", data);
  }

  UploadArchiveDocuments_V2(filedata) {
    filedata.append("CreatedBy", this.currentUserValue.createdby.toString());
    try {
      return this.http.post(this.rootUrlII + "FileUploadAPI/NewPostArchivingFiles", filedata
        , {
          reportProgress: true,
          observe: 'events'
        }).pipe(
      );
    } catch (error) {

      console.log(error, "error");
    }
    //return this.http.post(this.rootUrlII + "/FileUploadAPI/NewPostArchivingFiles", data);
  }

  UploadArchiveDocuments_V2GACCopy(filedata) {
    try {
      return this.http.post(this.rootUrlII + "FileUploadAPI/NewPostArchivingFilesTest", filedata
        , {
          reportProgress: true,
          observe: 'events'
        }).pipe(
      );
    } catch (error) {

      console.log(error, "error");
    }
    //return this.http.post(this.rootUrlII + "/FileUploadAPI/NewPostArchivingFiles", data);
  }

  GetSubCategory(organizationid: number) {
    this._ObjGac.OrganizationId = organizationid;

    return this.http.post(this.rootUrlII + "ArchiveAPI/SubCategoryHierarchy", this._ObjGac);

  }
  getFileContentType(fileUrl: string): Observable<string | null> {
    // Send a HEAD request to fetch headers only
    return this.http
      .head(fileUrl, { observe: 'response', responseType: 'blob' })
      .pipe(
        // Map the response to extract the content-type header
        map((response) => {
          return response.headers.get('Content-Type');
        }),
        catchError((error) => {
          console.error('Error fetching content-type:', error);
          return of(null); // Return null on error
        })
      );
  }
  GACDocumentsSearch(ObjGac: GACFiledto) {
  
    this._ObjGac.subcatid = ObjGac.subcatid;
    this._ObjGac.DocumentTypeIds = ObjGac.DocumentTypeIds;
    this._ObjGac.DocumentSearchText = ObjGac.DocumentSearchText;
    this._ObjGac.SourceIds = ObjGac.SourceIds;
    this._ObjGac.DMIds = ObjGac.DMIds;
    this._ObjGac.PageSize = ObjGac.PageSize;
    this._ObjGac.PageNumber = ObjGac.PageNumber;
    this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.StartDate = ObjGac.StartDate;
    this._ObjGac.EndDate = ObjGac.EndDate;
    this._ObjGac.DocumentStatus = ObjGac.DocumentStatus;
    this._ObjGac.IsAll = ObjGac.IsAll;
   
    return this.http.post(this.rootUrlII + "ArchiveAPI/ArchiveDocumentList", this._ObjGac);
  }

  UnReadDocument(ObjGac: GACFiledto) {
    
   this._ObjGac.ReadUnreadjson = ObjGac.ReadUnreadjson;
    return this.http.post(this.rootUrlII + 'Gac/ArchiveReadUnRead_V2', this._ObjGac);
  }

  PinArchiveDocuments(DocumentId:number,ShareId:number,IsPin:boolean) {
    // this._ObjGac.Ispinjson = ObjGac.Ispinjson;
    this._ObjGac.DocumentId = DocumentId;
    this._ObjGac.ShareId = ShareId;
    this._ObjGac.IsPin = IsPin;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby

     return this.http.post(this.rootUrlII + 'Gac/ArchiveIspin_V2', this._ObjGac);
   }

  PinDocuments(ObjGac: GACFiledto) {
    this._ObjGac.Ispinjson = ObjGac.Ispinjson;
     return this.http.post(this.rootUrlII + 'Gac/ArchiveIspin_V2', this._ObjGac);
   }
 
   DocumentsArchiveFavorite(DocumentId:number,ShareId:number,isFavorite:boolean) {
    this._ObjGac.DocumentId = DocumentId;
    this._ObjGac.ShareId = ShareId;
    this._ObjGac.isFavorite = isFavorite
    // this._ObjGac.favoritejson = ObjGac.favoritejson;
     return this.http.post(this.rootUrlII + 'Gac/ArchiveFavorite_V2', this._ObjGac);
   }

   DocumentsFavorite(ObjGac: GACFiledto) {
    this._ObjGac.favoritejson = ObjGac.favoritejson;
     return this.http.post(this.rootUrlII + 'Gac/ArchiveFavorite_V2', this._ObjGac);
   }

   

   DocumentsDelete(ObjGac: GACFiledto) {
    this._ObjGac.trashjson = ObjGac.trashjson;
     return this.http.post(this.rootUrlII + 'Gac/ArchiveTrash_V2', this._ObjGac);
   }


   ListInTrash() {
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.Organizationid = this.currentUserValue.organizationid;
     return this.http.post(this.rootUrlII + 'Gac/ArchiveTrashList_V2', this._ObjGac);
   }

   ListInLabel(LabelId:number) {
    this._ObjGac.LabelId = LabelId;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.Organizationid = this.currentUserValue.organizationid;
    
     return this.http.post(this.rootUrlII + 'LabelsAPI/GetLabelArchives_V2', this._ObjGac);
   }

  

   ListInFavorite() {
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.Organizationid = this.currentUserValue.organizationid;
     return this.http.post(this.rootUrlII + 'Gac/ArchiveFavoriteList_V2', this._ObjGac);
   }

   ListInUnread() {
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.Organizationid = this.currentUserValue.organizationid;
     return this.http.post(this.rootUrlII + 'Gac/ArchiveUnreadList_V2', this._ObjGac);
   }

   ArchiveDocumentDetails(ObjGac: GACFiledto) {  
    this._ObjGac.DocumentId = ObjGac.DocumentId;
    this._ObjGac.ReferenceId = ObjGac.ReferenceId;
    this._ObjGac.ShareId = ObjGac.ShareId;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrlII + "ArchiveAPI/ArchiveDocumentDetails", this._ObjGac);
  }

  async ArchiveStatusAPI(ObjGac: GACFiledto) {
    try {
      this._ObjGac.SortId = ObjGac.SortId;
      this._ObjGac.ActionId = ObjGac.ActionId;
      this._ObjGac.WorkFlowId = ObjGac.WorkFlowId;
      this._ObjGac.DocumentStatus = ObjGac.DocumentStatus;
      this._ObjGac.DocumentId = ObjGac.DocumentId;
      this._ObjGac.CreatedBy = this.currentUserValue.createdby;
      this._ObjGac.comments = ObjGac.comments;
  
      // Await the HTTP request
      const response = await this.http.post(this.rootUrlII + "ArchiveAPI/UpdateArchiveStatus", this._ObjGac).toPromise();
  
      // Optionally, you can log the response or process it further
      console.log('Archive Status updated:', response);
  
      return response; // Return the response from the API
    } catch (error) {
      console.error('Error updating archive status:', error);
      throw error; // Re-throw the error to be handled elsewhere
    }
  }
  
  GACDocumentDetails(ObjGac: GACFiledto) {  
    this._ObjGac.DocumentId = ObjGac.DocumentId;
    this._ObjGac.ReferenceId = ObjGac.ReferenceId;
    this._ObjGac.ShareId = ObjGac.ShareId;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetDocumentFullDetailsAng", this._ObjGac);
  }



  GetSharedwithMeDocumentsList() {
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrlII + 'ArchiveAPI/ArchiveShareWithMeList', this._ObjGac);
  }
  GetSharebymeExpiredDocumentList() {
    this._ObjGac.FromUserId = this.currentUserValue.createdby;
    this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/DocumentsAPI/NewGetSharedByMeExpiredPhysicalDocumentsListAng", this._ObjGac);
  }
  GetSharebymeList() {
   
    this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    return this.http.post(this.rootUrlII + "ArchiveAPI/ArchiveShareByMeList", this._ObjGac);
  }
  GetAddsource(SourceName: string) {
    this._ObjGac.SourceName = SourceName;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/SourceAPI/NewAddSourceDirectly", this._ObjGac);
  }
  GetAddDM(Name: string) {
    this._ObjGac.Name = Name;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.OrganizationId = this.currentUserValue.organizationid;
    return this.http.post(this.rootUrl + "/SourceAPI/NewAddDMDirectly", this._ObjGac);
  }

  AddLabelDocuments(ObjGac: LabelDTO) {
    this._ObjGac1.labelId = ObjGac.labelId;
    this._ObjGac1.LabelName = ObjGac.LabelName;
    this._ObjGac1.UserId = this.currentUserValue.createdby;
    this._ObjGac1.FlagId = ObjGac.FlagId;
    this._ObjGac1.IsActive = true;
    return this.http.post(this.rootUrlII + "LabelsAPI/LabelsMasterDocuments", this._ObjGac1);
  }

  UserLabels(ObjGac: LabelDTO) {
    this._ObjGac1.UserId = ObjGac.UserId; //this.currentUserValue.createdby;
    return this.http.post(this.rootUrlII + 'LabelsAPI/GetLabelsMasterDocuments', this._ObjGac1);
  }

  DeleteUserLabels(ObjGac: LabelDTO) {
    this._ObjGac1.UserId = ObjGac.UserId; //this.currentUserValue.createdby;
    this._ObjGac1.labelId = ObjGac.labelId;
    return this.http.post(this.rootUrlII + 'LabelsAPI/DeleteLabelDocuments', this._ObjGac1);
  }


  UpdateDocument(ObjGac: GACFiledto) {
    this._ObjGac.DocumentInfoJson = ObjGac.DocumentInfoJson;
    this._ObjGac.CreatedBy = this.currentUserValue.createdby;
    this._ObjGac.DocumentId = ObjGac.DocumentId;
     return this.http.post(this.rootUrlII + 'ArchiveAPI/NewUpdateArchiveInfo', this._ObjGac);
   }

}
