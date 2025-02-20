// gac-archiving.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GacArchivingService {
  private reloadSubject = new Subject<void>();

  // Observable to notify component reload
  reload$ = this.reloadSubject.asObservable();

  // Method to trigger reload
  reloadComponent() {
    this.reloadSubject.next();
  }
}
