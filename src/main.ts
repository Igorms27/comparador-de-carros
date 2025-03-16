import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarSelectorComponent } from './app/components/car-selector.component';
import { CarChartComponent } from './app/components/car-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CarSelectorComponent, CarChartComponent],
  template: `
    <div class="container">
      <h1>Comparador de Preços FIPE</h1>
      
      <div class="history-button-container" *ngIf="hasHistory">
        <button class="history-button" (click)="restoreLastComparison()">
          <span class="icon">↺</span>
          Restaurar última comparação
        </button>
      </div>
      
      <div class="comparison-container">
        <app-car-selector
          title="Primeiro Veículo"
          (carSelected)="onFirstCarSelected($event)"
        ></app-car-selector>
        
        <app-car-selector
          title="Segundo Veículo"
          (carSelected)="onSecondCarSelected($event)"
        ></app-car-selector>
      </div>

      <div class="comparison-details" *ngIf="firstCar && secondCar">
        <h2>Comparação dos Veículos</h2>
        <table>
          <tr>
            <th>Característica</th>
            <th>{{ firstCar.Marca }}</th>
            <th>{{ secondCar.Marca }}</th>
          </tr>
          <tr>
            <td><strong>Modelo</strong></td>
            <td>{{ firstCar.Modelo }}</td>
            <td>{{ secondCar.Modelo }}</td>
          </tr>
          <tr>
            <td><strong>Ano</strong></td>
            <td>{{ firstCar.AnoModelo }}</td>
            <td>{{ secondCar.AnoModelo }}</td>
          </tr>
          <tr>
            <td><strong>Preço</strong></td>
            <td [style.color]="getValueColor(firstCar.Valor, secondCar.Valor)">
              {{ firstCar.Valor }}
            </td>
            <td [style.color]="getValueColor(secondCar.Valor, firstCar.Valor)">
              {{ secondCar.Valor }}
            </td>
          </tr>
          <tr>
            <td><strong>Combustível</strong></td>
            <td>{{ firstCar.Combustivel }}</td>
            <td>{{ secondCar.Combustivel }}</td>
          </tr>
          <tr>
            <td><strong>Código FIPE</strong></td>
            <td>{{ firstCar.CodigoFipe }}</td>
            <td>{{ secondCar.CodigoFipe }}</td>
          </tr>
          <tr>
            <td><strong>Mês Referência</strong></td>
            <td>{{ firstCar.MesReferencia }}</td>
            <td>{{ secondCar.MesReferencia }}</td>
          </tr>
        </table>
      </div>
      
      <app-car-chart 
        *ngIf="firstCar && secondCar"
        [firstCar]="firstCar"
        [secondCar]="secondCar"
      ></app-car-chart>
    </div>
  `,
  styles: [`
    .history-button-container {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .history-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }

    .history-button:hover {
      background-color: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
    }

    .history-button:active {
      transform: translateY(0);
    }

    .icon {
      font-size: 1.25rem;
    }
  `]
})
export class App {
  firstCar: any = null;
  secondCar: any = null;
  hasHistory: boolean = false;

  constructor() {
    // Verifica se há uma comparação salva no localStorage
    const savedComparison = localStorage.getItem('lastComparison');
    this.hasHistory = !!savedComparison;
  }

  // Método chamado quando o primeiro carro é selecionado
  onFirstCarSelected(car: any) {
    this.firstCar = car;
    this.saveComparison();
  }

  // Método chamado quando o segundo carro é selecionado
  onSecondCarSelected(car: any) {
    this.secondCar = car;
    this.saveComparison();
  }

  // Método para determinar a cor do valor baseado na comparação
  getValueColor(value1: string, value2: string): string {
    const val1 = parseFloat(value1.replace('R$ ', '').replace('.', '').replace(',', '.'));
    const val2 = parseFloat(value2.replace('R$ ', '').replace('.', '').replace(',', '.'));
    
    if (val1 < val2) {
      return '#16a34a'; // verde para o valor mais baixo
    } else if (val1 > val2) {
      return '#dc2626'; // vermelho para o valor mais alto
    }
    return '#1a1a1a'; // cor padrão para valores iguais
  }

  // Método para salvar a comparação no localStorage
  private saveComparison() {
    if (this.firstCar && this.secondCar) {
      const comparison = {
        firstCar: {
          CodigoMarca: this.firstCar.CodigoMarca,
          CodigoModelo: this.firstCar.CodigoModelo,
          AnoModelo: this.firstCar.AnoModelo
        },
        secondCar: {
          CodigoMarca: this.secondCar.CodigoMarca,
          CodigoModelo: this.secondCar.CodigoModelo,
          AnoModelo: this.secondCar.AnoModelo
        }
      };
      localStorage.setItem('lastComparison', JSON.stringify(comparison));
      this.hasHistory = true;
    }
  }

  // Método para restaurar a última comparação salva
  restoreLastComparison() {
    const savedComparison = localStorage.getItem('lastComparison');
    if (savedComparison) {
      const comparison = JSON.parse(savedComparison);
      
      const firstCarEvent = new CustomEvent('restoreCar', { 
        detail: comparison.firstCar,
        bubbles: true 
      });
      const secondCarEvent = new CustomEvent('restoreCar', { 
        detail: comparison.secondCar,
        bubbles: true 
      });
      
      // Dispara eventos customizados para restaurar os carros selecionados
      const selectors = document.querySelectorAll('app-car-selector');
      selectors[0].dispatchEvent(firstCarEvent);
      selectors[1].dispatchEvent(secondCarEvent);
    }
  }
}


bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
});