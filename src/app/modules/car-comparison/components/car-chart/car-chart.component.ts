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

import { Chart, registerables, TooltipItem } from 'chart.js';

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

  public ngAfterViewInit(): void {
    if (this.firstCar && this.secondCar) {
      this.renderChart();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes['firstCar'] || changes['secondCar']) && this.firstCar && this.secondCar) {
      if (this.chartCanvas) {
        this.renderChart();
      }
    }
  }

  public renderChart(): void {
    if (!this.firstCar.historicalPrices || !this.secondCar.historicalPrices) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior se existir
    if (this.chart) {
      this.chart.destroy();
    }

    // Obter anos para o eixo X (usando o primeiro carro como referência)
    const years = this.firstCar.historicalPrices.map(item => item.year.toString());

    // Configurar cores
    const firstCarColor = '#2563eb'; // Azul
    const secondCarColor = '#16a34a'; // Verde

    // Criar novo gráfico
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: this.firstCar.Modelo,
            data: this.firstCar.historicalPrices.map(item => item.price),
            borderColor: firstCarColor,
            backgroundColor: this.hexToRgba(firstCarColor, 0.1),
            fill: true,
            tension: 0.3,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: this.secondCar.Modelo,
            data: this.secondCar.historicalPrices.map(item => item.price),
            borderColor: secondCarColor,
            backgroundColor: this.hexToRgba(secondCarColor, 0.1),
            fill: true,
            tension: 0.3,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: false,
          },
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 13,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1a1a1a',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: (tooltipItem: TooltipItem<'line'>) => {
                const value = tooltipItem.raw as number;
                return `${tooltipItem.dataset.label}: R$ ${value.toLocaleString('pt-BR')}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Ano',
              padding: { top: 10 },
              font: {
                size: 13,
                weight: 'bold',
              },
            },
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Valor (R$)',
              padding: { bottom: 10 },
              font: {
                size: 13,
                weight: 'bold',
              },
            },
            ticks: {
              callback: value => {
                return `R$ ${this.formatNumberShort(value as number)}`;
              },
            },
            grid: {
              color: '#f3f4f6',
            },
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
