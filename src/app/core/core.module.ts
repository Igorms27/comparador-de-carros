import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FipeService } from './services/fipe.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [FipeService],
  exports: [],
})
export class CoreModule {}
