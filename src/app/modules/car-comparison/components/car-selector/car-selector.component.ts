import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Brand, Model, Year, Car } from '../../../../core/models/car.model';
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

  constructor(private fipeService: FipeService) {
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

  public filterBrands(): void {
    if (this.brandSearch) {
      this.filteredBrands = this.brands.filter(brand =>
        brand.nome.toLowerCase().includes(this.brandSearch.toLowerCase())
      );
    } else {
      this.filteredBrands = [...this.brands];
    }
  }

  public filterModels(): void {
    if (this.modelSearch) {
      this.filteredModels = this.models.filter(model =>
        model.nome.toLowerCase().includes(this.modelSearch.toLowerCase())
      );
    } else {
      this.filteredModels = [...this.models];
    }
  }

  public filterYears(): void {
    if (this.yearSearch) {
      this.filteredYears = this.years.filter(year =>
        year.nome.toLowerCase().includes(this.yearSearch.toLowerCase())
      );
    } else {
      this.filteredYears = [...this.years];
    }
  }

  public selectBrand(brand: Brand): void {
    this.brandSearch = brand.nome;
    this.showBrandSuggestions = false;
    this.onBrandSelect(brand.codigo);
  }

  public selectModel(model: Model): void {
    this.modelSearch = model.nome;
    this.showModelSuggestions = false;
    this.onModelSelect(model.codigo);
  }

  public selectYear(year: Year): void {
    this.yearSearch = year.nome;
    this.showYearSuggestions = false;
    this.onYearSelect(year.codigo);
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

    this.fipeService.getYears(this.selectedBrand, modelId).subscribe(
      years => {
        this.years = years;
        this.filteredYears = [...this.years];

        if (isRestoring && this.isRestoring) {
          const windowWithRestore = window as WindowWithRestoreData;
          const savedYear = windowWithRestore.restoreData?.AnoModelo;
          const yearItem = this.years.find(y => y.nome.includes(savedYear?.toString() || ''));
          if (yearItem) {
            this.onYearSelect(yearItem.codigo, true);
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
}
