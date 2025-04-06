import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CarChartComponent } from './components/car-chart/car-chart.component';
import { CarSelectorComponent } from './components/car-selector/car-selector.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, CarSelectorComponent, CarChartComponent],
  exports: [CarSelectorComponent, CarChartComponent],
})
export class CarComparisonModule {}
