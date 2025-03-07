import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private actionSource = new Subject<string>();
  action$ = this.actionSource.asObservable();

  sendMessage(action: string) {
    this.actionSource.next(action);
  }
}
