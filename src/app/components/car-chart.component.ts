import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables, ChartOptions, TooltipItem } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-car-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" *ngIf="firstCar && secondCar">
      <h3>Comparação de Desvalorização</h3>
      
      <div class="summary-cards">
        <div class="summary-card first-car">
          <div class="depreciation-info">
            <div class="depreciation-value">{{ firstCar.depreciationPercentage.toFixed(1) }}%</div>
            <div class="depreciation-label">de desvalorização desde {{ getManufactureYear(firstCar) }}</div>
            <div class="price-comparison">
              <div class="price-item">
                <div class="price-year">{{ getManufactureYear(firstCar) }}</div>
                <div class="price-value">{{ formatCurrency(firstCar.historicalPrices[0].price) }}</div>
              </div>
              <div class="price-arrow">→</div>
              <div class="price-item">
                <div class="price-year">{{ currentYear }}</div>
                <div class="price-value">{{ firstCar.Valor }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-card second-car">
          <div class="depreciation-info">
            <div class="depreciation-value">{{ secondCar.depreciationPercentage.toFixed(1) }}%</div>
            <div class="depreciation-label">de desvalorização desde {{ getManufactureYear(secondCar) }}</div>
            <div class="price-comparison">
              <div class="price-item">
                <div class="price-year">{{ getManufactureYear(secondCar) }}</div>
                <div class="price-value">{{ formatCurrency(secondCar.historicalPrices[0].price) }}</div>
              </div>
              <div class="price-arrow">→</div>
              <div class="price-item">
                <div class="price-year">{{ currentYear }}</div>
                <div class="price-value">{{ secondCar.Valor }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="disclaimer">
        * Os percentuais de desvalorização são valores aproximados e podem conter variações em relação aos valores reais do mercado.
      </div>
      
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-top: 2rem;
    }
    
    h3 {
      color: #2563eb;
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      text-align: center;
    }
    
    canvas {
      width: 100%;
      height: 300px;
      margin-top: 1rem;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .summary-card {
      background: #f8fafc;
      border-radius: 8px;
      padding: 1.25rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border-left: 4px solid;
    }
    
    .first-car {
      border-left-color: #2563eb;
    }
    
    .second-car {
      border-left-color: #16a34a;
    }
    
    .depreciation-info {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .depreciation-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #1a1a1a;
    }
    
    .depreciation-label {
      font-size: 1rem;
      color: #6b7280;
      margin-bottom: 1rem;
    }
    
    .price-comparison {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    
    .price-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .price-year {
      font-weight: bold;
      color: #4b5563;
      font-size: 1.125rem;
    }
    
    .price-value {
      background: #e5e7eb;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin-top: 0.5rem;
      font-weight: 500;
    }
    
    .price-arrow {
      font-size: 1.5rem;
      color: #9ca3af;
      margin: 0 0.5rem;
    }

    .disclaimer {
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
      font-style: italic;
      margin: 1rem 0;
      padding: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
    }
  `]
})
export class CarChartComponent implements OnChanges, AfterViewInit {
  @Input() firstCar: any;
  @Input() secondCar: any;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  currentYear: number = new Date().getFullYear();

  ngAfterViewInit() {
    if (this.firstCar && this.secondCar) {
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['firstCar'] || changes['secondCar']) && this.firstCar && this.secondCar) {
      if (this.chartCanvas) {
        this.renderChart();
      }
    }
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.firstCar.historicalPrices.map((item: any) => item.year),
        datasets: [
          {
            label: `${this.firstCar.Modelo} (${this.getManufactureYear(this.firstCar)})`,
            data: this.firstCar.historicalPrices.map((item: any) => item.price),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: `${this.secondCar.Modelo} (${this.getManufactureYear(this.secondCar)})`,
            data: this.secondCar.historicalPrices.map((item: any) => item.price),
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems: TooltipItem<'line'>[]) => {
                return `Ano: ${tooltipItems[0].label}`;
              },
              label: (context: TooltipItem<'line'>) => {
                const value = context.raw as number;
                return `${context.dataset.label}: ${this.formatCurrency(value)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: number | string) => {
                return this.formatCurrency(Number(value));
              }
            }
          }
        }
      }
    });
  }

  getManufactureYear(car: any): number {
    return parseInt(car.AnoModelo.toString());
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  }
}