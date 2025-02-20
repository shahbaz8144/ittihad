import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapToIterablePipe } from '../_service/map-to-iterable.pipe';

@NgModule({
  declarations: [MapToIterablePipe],
  imports: [
    CommonModule
  ],
  exports: [MapToIterablePipe]
})
export class PluginsModule { }
