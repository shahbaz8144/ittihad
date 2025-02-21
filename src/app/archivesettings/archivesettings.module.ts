import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivesettingsRoutingModule } from './archivesettings-routing.module';
import { CabinetComponent } from './cabinet/cabinet.component';
import { BarcodeComponent } from './barcode/barcode.component';
import { AssignusersComponent } from './assignusers/assignusers.component';


@NgModule({
  declarations: [
    CabinetComponent,
    BarcodeComponent,
    AssignusersComponent
  ],
  imports: [
    CommonModule,
    ArchivesettingsRoutingModule
  ]
})
export class ArchivesettingsModule { }
