import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AnimatedBackgroundComponent } from './core/components/animated-background/animated-background.component';
import { Car, CarComparison } from './core/models/car.model';
import { CarChartComponent } from './modules/car-comparison/components/car-chart/car-chart.component';
import { CarSelectorComponent } from './modules/car-comparison/components/car-selector/car-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CarSelectorComponent, CarChartComponent, AnimatedBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public firstCar: Car | null = null;
  public secondCar: Car | null = null;
  public hasHistory: boolean = false;

  constructor() {
    // Verifica se há uma comparação salva no localStorage
    const savedComparison = localStorage.getItem('lastComparison');
    this.hasHistory = !!savedComparison;
  }

  // Método chamado quando o primeiro carro é selecionado
  public onFirstCarSelected(car: Car): void {
    this.firstCar = car;
    this.saveComparison();
  }

  // Método chamado quando o segundo carro é selecionado
  public onSecondCarSelected(car: Car): void {
    this.secondCar = car;
    this.saveComparison();
  }

  // Método para determinar a cor do valor baseado na comparação
  public getValueColor(value1: string, value2: string): string {
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
  private saveComparison(): void {
    if (this.firstCar && this.secondCar) {
      const comparison: CarComparison = {
        firstCar: {
          CodigoMarca: this.firstCar.CodigoMarca!,
          CodigoModelo: this.firstCar.CodigoModelo!,
          AnoModelo: this.firstCar.AnoModelo,
        },
        secondCar: {
          CodigoMarca: this.secondCar.CodigoMarca!,
          CodigoModelo: this.secondCar.CodigoModelo!,
          AnoModelo: this.secondCar.AnoModelo,
        },
      };
      localStorage.setItem('lastComparison', JSON.stringify(comparison));
      this.hasHistory = true;
    }
  }

  // Método para restaurar a última comparação salva
  public restoreLastComparison(): void {
    const savedComparison = localStorage.getItem('lastComparison');
    if (savedComparison) {
      const comparison = JSON.parse(savedComparison) as CarComparison;

      const firstCarEvent = new CustomEvent('restoreCar', {
        detail: comparison.firstCar,
        bubbles: true,
      });
      const secondCarEvent = new CustomEvent('restoreCar', {
        detail: comparison.secondCar,
        bubbles: true,
      });

      // Dispara eventos customizados para restaurar os carros selecionados
      const selectors = document.querySelectorAll('app-car-selector');
      selectors[0].dispatchEvent(firstCarEvent);
      selectors[1].dispatchEvent(secondCarEvent);
    }
  }

  /**
   * Carrega e inicia uma comparação popular pré-definida
   * @param brand1 Marca do primeiro veículo
   * @param brand2 Marca do segundo veículo
   * @param model1 Modelo do primeiro veículo
   * @param model2 Modelo do segundo veículo
   */
  public loadPopularComparison(
    brand1: string,
    brand2: string,
    model1: string,
    model2: string
  ): void {
    // Esta é uma implementação simplificada que exibe uma mensagem
    // console.log(`Carregando comparação: ${brand1} ${model1} vs ${brand2} ${model2}`);
    alert(`Recurso em desenvolvimento: Comparação entre ${brand1} ${model1} e ${brand2} ${model2}`);
  }
}
