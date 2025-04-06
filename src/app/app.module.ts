import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CarComparisonModule } from './modules/car-comparison/car-comparison.module';

@NgModule({
  declarations: [],
  imports: [BrowserModule, HttpClientModule, CoreModule, CarComparisonModule, AppComponent],
  providers: [],
  bootstrap: [],
})
export class AppModule {}
