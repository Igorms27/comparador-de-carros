import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Brand, Model, Year, Car } from '../../../../core/models/car.model';
import { CarLogoService } from '../../../../core/services/car-logo.service';
import { FipeService } from '../../../../core/services/fipe.service';

interface RestoreData {
  CodigoMarca: string;
  CodigoModelo: string;
  AnoModelo: number;
}

interface WindowWithRestoreData extends Window {
  restoreData?: RestoreData;
}

@Component({
  selector: 'app-car-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-selector.component.html',
  styleUrls: ['./car-selector.component.css'],
})
export class CarSelectorComponent implements OnInit {
  @Input() public title: string = '';
  @Output() public carSelected = new EventEmitter<Car>();

  public brands: Brand[] = [];
  public models: Model[] = [];
  public years: Year[] = [];

  public filteredBrands: Brand[] = [];
  public filteredModels: Model[] = [];
  public filteredYears: Year[] = [];

  public selectedBrand: string = '';
  public selectedModel: string = '';
  public selectedYear: string = '';

  public brandSearch: string = '';
  public modelSearch: string = '';
  public yearSearch: string = '';

  public showBrandSuggestions: boolean = false;
  public showModelSuggestions: boolean = false;
  public showYearSuggestions: boolean = false;

  public error: string = '';
  public isRestoring: boolean = false;

  constructor(
    private fipeService: FipeService,
    private carLogoService: CarLogoService
  ) {
    // Inicializa o carregamento das marcas quando o componente é criado
    this.loadBrands();
  }

  public ngOnInit(): void {
    // Adicionando event listener para restaurar o carro
    this.listenForRestoreEvents();
  }

  private listenForRestoreEvents(): void {
    if (typeof window !== 'undefined') {
      const element = document.querySelector('app-car-selector') as HTMLElement;
      if (element) {
        element.addEventListener('restoreCar', ((event: CustomEvent) => {
          if (event.detail) {
            const { CodigoMarca, CodigoModelo, AnoModelo } = event.detail;
            this.isRestoring = true;

            // Limpar seleções anteriores
            this.selectedBrand = '';
            this.selectedModel = '';
            this.selectedYear = '';

            // Carregar as marcas se necessário
            if (this.brands.length === 0) {
              this.fipeService.getBrands().subscribe(
                brands => {
                  this.brands = brands;
                  this.onBrandSelect(CodigoMarca, true);
                },
                error => {
                  this.error = 'Erro ao carregar marcas';
                  this.isRestoring = false;
                }
              );
            } else {
              this.onBrandSelect(CodigoMarca, true);
            }
          }
        }) as EventListener);
      }
    }
  }

  public loadBrands(): void {
    this.fipeService.getBrands().subscribe(
      brands => {
        this.brands = brands;
        this.filteredBrands = [...brands];
      },
      error => {
        this.error = 'Erro ao carregar marcas de veículos';
      }
    );
  }

  /**
   * Mostra todas as opções de marcas ao clicar ou focar no input
   */
  public showBrandOptions(): void {
    // Mostra todas as marcas disponíveis sem filtrar
    this.filteredBrands = [...this.brands];
    this.showBrandSuggestions = true;

    // Fechar outros dropdowns quando este abrir
    this.showModelSuggestions = false;
    this.showYearSuggestions = false;

    // Rola a página para o elemento se for mobile
    if (this.isMobileDevice()) {
      setTimeout(() => {
        const element = document.querySelector('.dropdown-open') as HTMLElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  /**
   * Mostra todas as opções de modelos ao clicar ou focar no input
   */
  public showModelOptions(): void {
    // Mostra todos os modelos disponíveis sem filtrar
    this.filteredModels = [...this.models];
    this.showModelSuggestions = true;

    // Fechar outros dropdowns quando este abrir
    this.showBrandSuggestions = false;
    this.showYearSuggestions = false;

    // Rola a página para o elemento se for mobile
    if (this.isMobileDevice()) {
      setTimeout(() => {
        const element = document.querySelector('.dropdown-open') as HTMLElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  /**
   * Mostra todas as opções de anos ao clicar ou focar no input
   */
  public showYearOptions(): void {
    // Mostra todos os anos disponíveis sem filtrar
    this.filteredYears = [...this.years];
    this.showYearSuggestions = true;

    // Fechar outros dropdowns quando este abrir
    this.showBrandSuggestions = false;
    this.showModelSuggestions = false;

    // Rola a página para o elemento se for mobile
    if (this.isMobileDevice()) {
      setTimeout(() => {
        const element = document.querySelector('.dropdown-open') as HTMLElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  // Continua o método para filtrar as marcas, mas agora apenas para input
  public filterBrands(): void {
    if (this.brandSearch) {
      this.filteredBrands = this.brands.filter(brand =>
        brand.nome.toLowerCase().includes(this.brandSearch.toLowerCase())
      );
    } else {
      this.filteredBrands = [...this.brands];
    }

    this.showBrandSuggestions = true;

    // Fechar outros dropdowns quando este abrir
    this.showModelSuggestions = false;
    this.showYearSuggestions = false;
  }

  // Continua o método para filtrar os modelos, mas agora apenas para input
  public filterModels(): void {
    if (this.modelSearch) {
      this.filteredModels = this.models.filter(model =>
        model.nome.toLowerCase().includes(this.modelSearch.toLowerCase())
      );
    } else {
      this.filteredModels = [...this.models];
    }

    this.showModelSuggestions = true;

    // Fechar outros dropdowns quando este abrir
    this.showBrandSuggestions = false;
    this.showYearSuggestions = false;
  }

  // Continua o método para filtrar os anos, mas agora apenas para input
  public filterYears(): void {
    if (this.yearSearch) {
      this.filteredYears = this.years.filter(year =>
        year.nome.toLowerCase().includes(this.yearSearch.toLowerCase())
      );
    } else {
      this.filteredYears = [...this.years];
    }

    this.showYearSuggestions = true;

    // Fechar outros dropdowns quando este abrir
    this.showBrandSuggestions = false;
    this.showModelSuggestions = false;
  }

  public selectBrand(brand: Brand): void {
    this.brandSearch = brand.nome;
    this.showBrandSuggestions = false;

    // Primeiro, fechamos o dropdown para evitar problemas de sobreposição
    setTimeout(() => {
      this.onBrandSelect(brand.codigo);

      // Ajuste para evitar o zoom em campos de entrada em dispositivos móveis
      if (this.isMobileDevice()) {
        document.activeElement instanceof HTMLElement && document.activeElement.blur();
      }
    }, 100);
  }

  public selectModel(model: Model): void {
    this.modelSearch = model.nome;
    this.showModelSuggestions = false;

    // Primeiro, fechamos o dropdown para evitar problemas de sobreposição
    setTimeout(() => {
      this.onModelSelect(model.codigo);

      // Ajuste para evitar o zoom em campos de entrada em dispositivos móveis
      if (this.isMobileDevice()) {
        document.activeElement instanceof HTMLElement && document.activeElement.blur();
      }
    }, 100);
  }

  public selectYear(year: Year): void {
    this.yearSearch = year.nome;
    this.showYearSuggestions = false;

    // Primeiro, fechamos o dropdown para evitar problemas de sobreposição
    setTimeout(() => {
      this.onYearSelect(year.codigo);

      // Ajuste para evitar o zoom em campos de entrada em dispositivos móveis
      if (this.isMobileDevice()) {
        document.activeElement instanceof HTMLElement && document.activeElement.blur();
      }
    }, 100);
  }

  public onBrandSelect(brandId: string, isRestoring: boolean = false): void {
    this.selectedBrand = brandId;
    this.selectedModel = '';
    this.selectedYear = '';
    this.models = [];
    this.years = [];
    this.filteredModels = [];
    this.filteredYears = [];
    this.modelSearch = '';
    this.yearSearch = '';
    this.error = '';

    // Fechar todos os dropdowns
    this.showBrandSuggestions = false;
    this.showModelSuggestions = false;
    this.showYearSuggestions = false;

    this.fipeService.getModels(brandId).subscribe(
      data => {
        this.models = data.modelos;
        this.filteredModels = [...this.models];

        if (isRestoring && this.isRestoring) {
          const windowWithRestore = window as WindowWithRestoreData;
          const savedModel = windowWithRestore.restoreData?.CodigoModelo;
          if (savedModel) {
            this.onModelSelect(savedModel, true);
          }
        }
      },
      error => {
        this.error = 'Erro ao carregar modelos para esta marca';
      }
    );
  }

  public onModelSelect(modelId: string, isRestoring: boolean = false): void {
    this.selectedModel = modelId;
    this.selectedYear = '';
    this.years = [];
    this.filteredYears = [];
    this.yearSearch = '';
    this.error = '';

    // Fechar todos os dropdowns
    this.showBrandSuggestions = false;
    this.showModelSuggestions = false;
    this.showYearSuggestions = false;

    this.fipeService.getYears(this.selectedBrand, modelId).subscribe(
      years => {
        this.years = years;
        this.filteredYears = [...this.years];

        if (isRestoring && this.isRestoring) {
          const windowWithRestore = window as WindowWithRestoreData;
          const savedYear = windowWithRestore.restoreData?.AnoModelo.toString();
          if (savedYear) {
            // Procure o código do ano correspondente
            const yearObj = this.years.find(y => y.nome.includes(savedYear));
            if (yearObj) {
              this.onYearSelect(yearObj.codigo, true);
            }
          }
        }
      },
      error => {
        this.error = 'Erro ao carregar anos para este modelo';
      }
    );
  }

  public onYearSelect(yearId: string, isRestoring: boolean = false): void {
    this.selectedYear = yearId;
    this.error = '';

    this.fipeService.getCarDetails(this.selectedBrand, this.selectedModel, yearId).subscribe(
      car => {
        const carWithIds = {
          ...car,
          CodigoMarca: this.selectedBrand,
          CodigoModelo: this.selectedModel,
        };
        this.carSelected.emit(carWithIds);
        if (isRestoring) {
          this.isRestoring = false;
        }
      },
      error => {
        this.error = 'Erro ao carregar detalhes do veículo';
        if (isRestoring) {
          this.isRestoring = false;
        }
      }
    );
  }

  /**
   * Retorna a URL do logo da marca
   * @param brand Nome da marca
   * @returns URL da imagem do logo
   */
  public getBrandLogo(brand: string): string {
    return this.carLogoService.getLogoUrl(brand);
  }

  // Método para fechar todos os dropdowns quando clicar fora
  @HostListener('document:click', ['$event'])
  public clickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    // Para dispositivos móveis, deixamos o backdrop lidar com o fechamento
    if (this.isMobileDevice()) {
      // Apenas verificar se clicou em algum elemento de input
      const clickedInInput = targetElement.closest('.search-input') !== null;

      // Se clicou em um input, não fazemos nada
      if (clickedInInput) {
        return;
      }

      // Se clicou em algum outro elemento que não seja o dropdown ou seus filhos
      if (
        !targetElement.closest('.suggestions-container-mobile') &&
        !targetElement.closest('.mobile-dropdown-header') &&
        !targetElement.closest('.mobile-dropdown-content')
      ) {
        // Se não for um clique no botão de fechar, fechamos todos os dropdowns
        if (!targetElement.closest('.mobile-dropdown-close')) {
          this.closeAllDropdowns();
        }
      }
    } else {
      // Comportamento para desktop
      const clickedInInput = targetElement.closest('.search-input') !== null;
      const clickedInSuggestion = targetElement.closest('.suggestion-item') !== null;
      const clickedInContainer = targetElement.closest('.suggestions-container') !== null;

      // Se não clicou em nenhum elemento relevante, feche todos os dropdowns
      if (!clickedInInput && !clickedInSuggestion && !clickedInContainer) {
        this.closeAllDropdowns();
      }
    }
  }

  // Método para verificar se a tela é mobile
  public isMobileDevice(): boolean {
    return window.innerWidth <= 768;
  }

  // Método para fechar todos os dropdowns
  public closeAllDropdowns(): void {
    this.showBrandSuggestions = false;
    this.showModelSuggestions = false;
    this.showYearSuggestions = false;
  }

  // Método para prevenir scroll do body quando o modal estiver aberto
  @HostListener('window:resize', ['$event'])
  onResize() {
    // Atualiza o status de mobile/desktop ao redimensionar
    this.closeAllDropdowns();
  }
}
