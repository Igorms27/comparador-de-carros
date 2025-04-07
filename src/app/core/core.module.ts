import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CarLogoService } from './services/car-logo.service';
import { FipeService } from './services/fipe.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [FipeService, CarLogoService],
  exports: [],
})
export class CoreModule {}
