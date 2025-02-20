import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { HtmlSampleComponent } from './html-sample/html-sample.component';


@NgModule({
  declarations: [
    HtmlSampleComponent
  ],
  imports: [
    CommonModule,
    TestRoutingModule
  ]
})
export class TestModule { }
