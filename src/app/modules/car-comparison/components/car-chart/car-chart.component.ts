import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import { Chart, registerables, TooltipItem, ChartItem } from 'chart.js';

import { Car } from '../../../../core/models/car.model';

Chart.register(...registerables);

@Component({
  selector: 'app-car-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-chart.component.html',
  styleUrls: ['./car-chart.component.css'],
})
export class CarChartComponent implements OnChanges, AfterViewInit {
  @Input() public firstCar!: Car;
  @Input() public secondCar!: Car;
  @ViewChild('chartCanvas') public chartCanvas!: ElementRef<HTMLCanvasElement>;

  public chart: Chart | null = null;
  public currentYear: number = new Date().getFullYear();
  public years: string[] = [];
  public firstCarPrices: number[] = [];
  public secondCarPrices: number[] = [];

  public ngAfterViewInit(): void {
    if (this.firstCar && this.secondCar) {
      this.prepareChartData();
      this.renderChart();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes['firstCar'] || changes['secondCar']) && this.firstCar && this.secondCar) {
      this.prepareChartData();
      if (this.chartCanvas) {
        this.renderChart();
      }
    }
  }

  private prepareChartData(): void {
    if (this.firstCar.historicalPrices && this.secondCar.historicalPrices) {
      // Obter anos para o eixo X (usando o primeiro carro como referência)
      this.years = this.firstCar.historicalPrices.map(item => item.year.toString());
      this.firstCarPrices = this.firstCar.historicalPrices.map(item => item.price);
      this.secondCarPrices = this.secondCar.historicalPrices.map(item => item.price);
    }
  }

  public renderChart(): void {
    if (!this.firstCar || !this.secondCar) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return; // Proteção contra contexto nulo

    // Se já existe um gráfico, destrua-o
    if (this.chart) {
      this.chart.destroy();
    }

    // Configurações do gráfico
    this.chart = new Chart(this.chartCanvas.nativeElement as ChartItem, {
      type: 'line',
      data: {
        labels: this.years,
        datasets: [
          {
            label: `${this.firstCar.Marca} ${this.firstCar.Modelo}`,
            data: this.firstCarPrices,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
          {
            label: `${this.secondCar.Marca} ${this.secondCar.Modelo}`,
            data: this.secondCarPrices,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 15,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: value => {
                return this.formatCurrency(Number(value));
              },
              font: {
                size: 10,
              },
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 10,
              },
            },
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        elements: {
          point: {
            radius: 3,
            hoverRadius: 5,
          },
        },
      },
    });
  }

  public getManufactureYear(car: Car): number {
    return car.historicalPrices ? car.historicalPrices[0].year : car.AnoModelo;
  }

  public formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  }

  // Helpers
  private hexToRgba(hex: string, alpha: number = 1): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private formatNumberShort(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + ' M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + ' K';
    }
    return value.toString();
  }
}
