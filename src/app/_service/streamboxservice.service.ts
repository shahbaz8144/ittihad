import { Injectable } from '@angular/core';
import { StreamboxDTO } from '../_models/streambox-dto';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class StreamboxserviceService {
_ObjStream:StreamboxDTO
readonly rootUrlII = this.commonUrl.apiurlNew;
  constructor(private http: HttpClient, private commonUrl: ApiurlService  ) {
    this._ObjStream = new StreamboxDTO();
   }

  // Streamboxfiles(_ObjStream: StreamboxDTO) {
    
  //   this._ObjStream.containerName = _ObjStream.containerName;
  //   this._ObjStream.folderPath = _ObjStream.folderPath
  //    return this.http.post(this.rootUrlII + 'FileUploadAPI/list-blobs', this._ObjStream);
  //  }

   Streamboxfile(_ObjStream: StreamboxDTO) {
    this._ObjStream.EmployeeId = _ObjStream.EmployeeId;
     return this.http.post(this.rootUrlII + 'FileUploadAPI/NewStreamBoxCloudFilesLogListWeb', this._ObjStream,{withCredentials:true});
   }

   ShareStreamboxfile(_ObjStream: StreamboxDTO) {
    this._ObjStream.json = _ObjStream.json;
     return this.http.post(this.rootUrlII + 'FileUploadAPI/NewStreamBoxCloudFilesSharing', this._ObjStream,{withCredentials:true});
   }

   StreamboxPermalityDeletefilesApi(_ObjStream: StreamboxDTO) {
    
    this._ObjStream.json = _ObjStream.json
     return this.http.post(this.rootUrlII + 'FileUploadAPI/NewDeleteAzureBlob', this._ObjStream,{withCredentials:true});
   }

   RestoreFile(_ObjStream: StreamboxDTO) {
    this._ObjStream.json = _ObjStream.json;
    this._ObjStream.IsRestore = _ObjStream.IsRestore;
   
     return this.http.post(this.rootUrlII + 'FileUploadAPI/RestoreFile', this._ObjStream,{withCredentials:true});
   }
  StreamboxDeletefilesApi(_ObjStream: StreamboxDTO) {
    this._ObjStream.json = _ObjStream.json
     return this.http.post(this.rootUrlII + 'FileUploadAPI/NewStreamBoxDeleteCloudFiles', this._ObjStream,{withCredentials:true});
   }

   StreamBoxDeletedCloudFiles(_ObjStream: StreamboxDTO) {
    this._ObjStream.EmployeeId = _ObjStream.EmployeeId
     return this.http.post(this.rootUrlII + 'FileUploadAPI/StreamBoxDeletedCloudFiles', this._ObjStream);
   }
   
}
