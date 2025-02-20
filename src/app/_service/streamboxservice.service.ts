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
     return this.http.post(this.rootUrlII + 'FileUploadAPI/NewStreamBoxCloudFilesLogListWeb', this._ObjStream);
   }

   ShareStreamboxfile(_ObjStream: StreamboxDTO) {
    this._ObjStream.json = _ObjStream.json;
     return this.http.post(this.rootUrlII + 'FileUploadAPI/NewStreamBoxCloudFilesSharing', this._ObjStream);
   }

   StreamboxPermalityDeletefilesApi(_ObjStream: StreamboxDTO) {
    
    this._ObjStream.json = _ObjStream.json
     return this.http.post(this.rootUrlII + 'FileUploadAPI/NewDeleteAzureBlob', this._ObjStream);
   }

   RestoreFile(_ObjStream: StreamboxDTO) {
    this._ObjStream.json = _ObjStream.json;
    this._ObjStream.IsRestore = _ObjStream.IsRestore;
   
     return this.http.post(this.rootUrlII + 'FileUploadAPI/RestoreFile', this._ObjStream);
   }
  StreamboxDeletefilesApi(_ObjStream: StreamboxDTO) {
    this._ObjStream.json = _ObjStream.json
     return this.http.post(this.rootUrlII + 'FileUploadAPI/NewStreamBoxDeleteCloudFiles', this._ObjStream);
   }

   StreamBoxDeletedCloudFiles(_ObjStream: StreamboxDTO) {
    this._ObjStream.EmployeeId = _ObjStream.EmployeeId
     return this.http.post(this.rootUrlII + 'FileUploadAPI/StreamBoxDeletedCloudFiles', this._ObjStream);
   }
   
}
