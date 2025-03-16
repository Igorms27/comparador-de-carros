import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FipeService } from '../services/fipe.service';

@Component({
  selector: 'app-car-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="car-selector">
      <h3>{{ title }}</h3>
      
      <div class="select-group">
        <label for="brandSearch">Marca do Veículo:</label>
        <div class="autocomplete-container">
          <div class="search-wrapper">
            <input
              type="text"
              id="brandSearch"
              [(ngModel)]="brandSearch"
              (input)="filterBrands()"
              (focus)="showBrandSuggestions = true"
              placeholder="Digite a marca..."
              class="search-input"
            >
            <span class="search-icon">🔍</span>
          </div>
          <div 
            class="suggestions-container" 
            *ngIf="showBrandSuggestions && filteredBrands.length > 0"
          >
            <div 
              *ngFor="let brand of filteredBrands" 
              class="suggestion-item"
              (click)="selectBrand(brand)"
              [class.active]="brand.codigo === selectedBrand"
            >
              {{ brand.nome }}
            </div>
          </div>
        </div>
      </div>

      <div class="select-group" *ngIf="selectedBrand">
        <label for="modelSearch">Modelo do Veículo:</label>
        <div class="autocomplete-container">
          <div class="search-wrapper">
            <input
              type="text"
              id="modelSearch"
              [(ngModel)]="modelSearch"
              (input)="filterModels()"
              (focus)="showModelSuggestions = true"
              placeholder="Digite o modelo..."
              class="search-input"
            >
            <span class="search-icon">🔍</span>
          </div>
          <div 
            class="suggestions-container" 
            *ngIf="showModelSuggestions && filteredModels.length > 0"
          >
            <div 
              *ngFor="let model of filteredModels" 
              class="suggestion-item"
              (click)="selectModel(model)"
              [class.active]="model.codigo === selectedModel"
            >
              {{ model.nome }}
            </div>
          </div>
        </div>
      </div>

      <div class="select-group" *ngIf="selectedModel">
        <label for="yearSearch">Ano do Veículo:</label>
        <div class="autocomplete-container">
          <div class="search-wrapper">
            <input
              type="text"
              id="yearSearch"
              [(ngModel)]="yearSearch"
              (input)="filterYears()"
              (focus)="showYearSuggestions = true"
              placeholder="Digite o ano..."
              class="search-input"
            >
            <span class="search-icon">🔍</span>
          </div>
          <div 
            class="suggestions-container" 
            *ngIf="showYearSuggestions && filteredYears.length > 0"
          >
            <div 
              *ngFor="let year of filteredYears" 
              class="suggestion-item"
              (click)="selectYear(year)"
              [class.active]="year.codigo === selectedYear"
            >
              {{ year.nome }}
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="error && !isRestoring" class="error">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .car-selector {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 20;
    }
    
    .car-selector:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
    
    .car-selector h3 {
      color: #2563eb;
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      text-align: center;
      position: relative;
      padding-bottom: 0.75rem;
    }
    
    .car-selector h3::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background: #2563eb;
      border-radius: 1.5px;
    }
    
    .select-group {
      margin-bottom: 1.5rem;
      position: relative;
    }
    
    .select-group:nth-child(2) {
      z-index: 40;
    }
    
    .select-group:nth-child(3) {
      z-index: 30;
    }
    
    .select-group:nth-child(4) {
      z-index: 20;
    }
    
    .autocomplete-container {
      position: relative;
    }

    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      right: 1rem;
      color: #9ca3af;
      font-size: 1rem;
      pointer-events: none;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    .search-input {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 1rem;
      margin: 0.5rem 0;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      color: #1a1a1a;
      transition: all 0.3s ease;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .search-input:hover {
      border-color: #d1d5db;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }
    
    .search-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .search-input:focus + .search-icon {
      opacity: 1;
      color: #2563eb;
    }
    
    .suggestions-container {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      max-height: 300px;
      overflow-y: auto;
      z-index: 50;
      backdrop-filter: blur(10px);
      animation: slideDown 0.2s ease-out;
    }
    
    .suggestion-item {
      padding: 0.875rem 1.25rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      align-items: center;
    }
    
    .suggestion-item:last-child {
      border-bottom: none;
    }
    
    .suggestion-item:hover {
      background: #f8fafc;
      transform: translateX(4px);
    }
    
    .suggestion-item.active {
      background: #e5e7eb;
      color: #2563eb;
      font-weight: 500;
    }
    
    .suggestions-container::-webkit-scrollbar {
      width: 6px;
    }
    
    .suggestions-container::-webkit-scrollbar-track {
      background: #f8fafc;
      border-radius: 12px;
    }
    
    .suggestions-container::-webkit-scrollbar-thumb {
      background: #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s ease;
    }
    
    .suggestions-container::-webkit-scrollbar-thumb:hover {
      background: #cbd5e1;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class CarSelectorComponent implements OnInit {
  @Input() title: string = '';
  @Output() carSelected = new EventEmitter<any>();

  brands: any[] = [];
  models: any[] = [];
  years: any[] = [];
  
  filteredBrands: any[] = [];
  filteredModels: any[] = [];
  filteredYears: any[] = [];
  
  selectedBrand: string = '';
  selectedModel: string = '';
  selectedYear: string = '';
  
  brandSearch: string = '';
  modelSearch: string = '';
  yearSearch: string = '';
  
  showBrandSuggestions: boolean = false;
  showModelSuggestions: boolean = false;
  showYearSuggestions: boolean = false;
  
  error: string = '';
  isRestoring: boolean = false;

  constructor(private fipeService: FipeService) {
    this.loadBrands();

    // Close suggestions when clicking outside
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.autocomplete-container')) {
        this.showBrandSuggestions = false;
        this.showModelSuggestions = false;
        this.showYearSuggestions = false;
      }
    });
  }

  ngOnInit() {
    this.listenForRestoreEvents();
  }

  private listenForRestoreEvents() {
    const element = document.querySelector(`app-car-selector[title="${this.title}"]`);
    if (element) {
      element.addEventListener('restoreCar', async (event: any) => {
        const carData = event.detail;
        this.isRestoring = true;
        
        try {
          // Restore brand
          this.selectedBrand = carData.CodigoMarca;
          const selectedBrandData = this.brands.find(b => b.codigo === carData.CodigoMarca);
          if (selectedBrandData) {
            this.brandSearch = selectedBrandData.nome;
          }
          await this.onBrandSelect(carData.CodigoMarca, true);
          
          // Restore model
          this.selectedModel = carData.CodigoModelo;
          const selectedModelData = this.models.find(m => m.codigo === carData.CodigoModelo);
          if (selectedModelData) {
            this.modelSearch = selectedModelData.nome;
          }
          await this.onModelSelect(carData.CodigoModelo, true);
          
          // Restore year
          this.selectedYear = carData.AnoModelo.toString();
          const selectedYearData = this.years.find(y => y.codigo === this.selectedYear);
          if (selectedYearData) {
            this.yearSearch = selectedYearData.nome;
          }
          await this.onYearSelect(this.selectedYear, true);
        } catch (err) {
          console.error('Error restoring car:', err);
        } finally {
          this.isRestoring = false;
        }
      });
    }
  }

  loadBrands() {
    this.fipeService.getBrands().subscribe({
      next: (data) => {
        this.brands = data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        this.filteredBrands = this.brands;
        this.error = '';
      },
      error: (err) => {
        if (!this.isRestoring) {
          this.error = 'Erro ao carregar marcas';
        }
      }
    });
  }

  filterBrands() {
    if (!this.brandSearch) {
      this.filteredBrands = this.brands;
    } else {
      this.filteredBrands = this.brands.filter(brand => 
        brand.nome.toLowerCase().includes(this.brandSearch.toLowerCase())
      );
    }
  }

  filterModels() {
    if (!this.modelSearch) {
      this.filteredModels = this.models;
    } else {
      this.filteredModels = this.models.filter(model => 
        model.nome.toLowerCase().includes(this.modelSearch.toLowerCase())
      );
    }
  }

  filterYears() {
    if (!this.yearSearch) {
      this.filteredYears = this.years;
    } else {
      this.filteredYears = this.years.filter(year => 
        year.nome.toLowerCase().includes(this.yearSearch.toLowerCase())
      );
    }
  }

  selectBrand(brand: any) {
    this.selectedBrand = brand.codigo;
    this.brandSearch = brand.nome;
    this.showBrandSuggestions = false;
    this.onBrandSelect(brand.codigo);
  }

  selectModel(model: any) {
    this.selectedModel = model.codigo;
    this.modelSearch = model.nome;
    this.showModelSuggestions = false;
    this.onModelSelect(model.codigo);
  }

  selectYear(year: any) {
    this.selectedYear = year.codigo;
    this.yearSearch = year.nome;
    this.showYearSuggestions = false;
    this.onYearSelect(year.codigo);
  }

  onBrandSelect(brandId: string, isRestoring: boolean = false) {
    if (brandId) {
      this.selectedModel = '';
      this.selectedYear = '';
      this.modelSearch = '';
      this.yearSearch = '';
      return new Promise<void>((resolve, reject) => {
        this.fipeService.getModels(brandId).subscribe({
          next: (data) => {
            this.models = data.modelos.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
            this.filteredModels = this.models;
            this.error = '';
            resolve();
          },
          error: (err) => {
            if (!isRestoring) {
              this.error = 'Erro ao carregar modelos';
            }
            reject(err);
          }
        });
      });
    }
    return Promise.resolve();
  }

  onModelSelect(modelId: string, isRestoring: boolean = false) {
    if (modelId) {
      this.selectedYear = '';
      this.yearSearch = '';
      return new Promise<void>((resolve, reject) => {
        this.fipeService.getYears(this.selectedBrand, modelId).subscribe({
          next: (data) => {
            this.years = data.sort((a: any, b: any) => b.nome.localeCompare(a.nome));
            this.filteredYears = this.years;
            this.error = '';
            resolve();
          },
          error: (err) => {
            if (!isRestoring) {
              this.error = 'Erro ao carregar anos';
            }
            reject(err);
          }
        });
      });
    }
    return Promise.resolve();
  }

  onYearSelect(yearId: string, isRestoring: boolean = false) {
    if (yearId) {
      return new Promise<void>((resolve, reject) => {
        this.fipeService.getCarDetails(this.selectedBrand, this.selectedModel, yearId).subscribe({
          next: (data) => {
            const carData = {
              ...data,
              CodigoMarca: this.selectedBrand,
              CodigoModelo: this.selectedModel
            };
            this.carSelected.emit(carData);
            this.error = '';
            resolve();
          },
          error: (err) => {
            if (!isRestoring) {
              this.error = 'Erro ao carregar detalhes do veículo';
            }
            reject(err);
          }
        });
      });
    }
    return Promise.resolve();
  }
}