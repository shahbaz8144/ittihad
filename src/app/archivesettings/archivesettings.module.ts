import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBarcodeModule } from 'ngx-barcode';
import { FormsModule } from '@angular/forms';
import { ArchivesettingsRoutingModule } from './archivesettings-routing.module';
import { CabinetComponent } from './cabinet/cabinet.component';
import { BarcodeComponent } from './barcode/barcode.component';
import { AssignusersComponent } from './assignusers/assignusers.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { GeneratedTemplateComponent } from './generated-template/generated-template.component';

@NgModule({
  declarations: [
    CabinetComponent,
    BarcodeComponent,
    AssignusersComponent,
    GeneratedTemplateComponent
  ],
  imports: [
    CommonModule,
    ArchivesettingsRoutingModule,
    DragDropModule,
    ResizableModule,
    NgxBarcodeModule,
    FormsModule
  ]
})
export class ArchivesettingsModule { }
