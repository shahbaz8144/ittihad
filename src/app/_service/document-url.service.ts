import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentUrlService {


  private documentUrl = new BehaviorSubject<any>(null);
  private documentContentType = new BehaviorSubject<any>(null);
  currentDocumentUrl = this.documentUrl.asObservable();
  currentDocumentContentType = this.documentContentType.asObservable();
  constructor() {

  }

  //Using any
  public editDataDetails: any = [];
  public subject = new Subject<any>();
  private messageSource = new BehaviorSubject(this.editDataDetails);
  currentMessage = this.messageSource.asObservable();
  changeMessage(message: string) {
    alert(message);
    this.messageSource.next(message)
  }

  updateDocumentUrl(url: string) {
    // setTimeout(() => {
    //   alert(url);

    // }, 1000);
    this.documentUrl.next(url);
    // this.currentDocumentUrl.subscribe(d=>{
    //   alert(d);
    // })
  }
  updateDocumentContentType(contentType: string) {
    this.documentContentType.next(contentType);
  }
}
