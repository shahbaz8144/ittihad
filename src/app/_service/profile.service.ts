import { Injectable,ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private isLoggedIn = new BehaviorSubject(true);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private cfr: ComponentFactoryResolver) {}

  login() {
    this.isLoggedIn.next(true);
  }

  logout() {
    this.isLoggedIn.next(false);
  }

//   async loadComponent(vcr: ViewContainerRef, isLoggedIn: boolean) {
//       debugger
//     const { DocumentviewComponent } = await import('../../app/master-forms/documentview/documentview.component');

//     vcr.clear();
//     let component : any = DocumentviewComponent;
   
//     return vcr.createComponent(
//       this.cfr.resolveComponentFactory(component))    
// }
}