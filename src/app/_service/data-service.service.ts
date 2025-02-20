import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Dataservicedto } from '../_models/dataservicedto';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private subject = new Subject<Dataservicedto>();

  // sendData(message: string) {
  //   this.subject.next(message);
  // }
  sendData(_lst: Dataservicedto) {
    this.subject.next(_lst);
  }

  clearData() {
    //this.subject.next();
  }

  getData(): Observable<Dataservicedto> {
    return this.subject.asObservable();
  }

}
