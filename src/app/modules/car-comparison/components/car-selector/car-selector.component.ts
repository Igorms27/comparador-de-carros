import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
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
export class CarSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('brandInput') brandInput!: ElementRef;
  @ViewChild('modelInput') modelInput!: ElementRef;
  @ViewChild('yearInput') yearInput!: ElementRef;

  @Input() public title: string = '';
  @Output() public carSelected = new EventEmitter<Car>();

  // Listas de dados
  public brands: Brand[] = [];
  public models: Model[] = [];
  public years: Year[] = [];

  // Listas filtradas
  public filteredBrands: Brand[] = [];
  public filteredModels: Model[] = [];
  public filteredYears: Year[] = [];

  // Valores selecionados
  public selectedBrand: string = '';
  public selectedModel: string = '';
  public selectedYear: string = '';

  // Valores de pesquisa
  public brandSearch: string = '';
  public modelSearch: string = '';
  public yearSearch: string = '';

  // Estado dos dropdowns
  public visibleDropdown: 'brand' | 'model' | 'year' | null = null;

  // Estado de erro e restauração
  public error: string = '';
  public isRestoring: boolean = false;

  // Click fora para fechar
  private documentClickListener: (event: Event) => void;

  constructor(
    private fipeService: FipeService,
    private carLogoService: CarLogoService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializa o carregamento das marcas quando o componente é criado
    this.loadBrands();

    // Configurar o listener global para cliques fora
    this.documentClickListener = this.handleDocumentClick.bind(this);
  }

  ngOnInit(): void {
    // Configura os event listeners
    document.addEventListener('click', this.documentClickListener);

    // Configurar o evento de restauração
    this.listenForRestoreEvents();

    // Escutar evento global para fechar dropdowns
    document.addEventListener('closeAllDropdowns', () => {
      this.closeDropdowns();
    });
  }

  ngOnDestroy(): void {
    // Remover os event listeners
    document.removeEventListener('click', this.documentClickListener);
    document.removeEventListener('closeAllDropdowns', () => {
      this.closeDropdowns();
    });
  }

  // MANIPULAÇÃO DE DROPDOWNS

  private handleDocumentClick(event: Event): void {
    // Se clicar no botão de fechar, não faz nada pois já tem handler próprio
    const target = event.target as HTMLElement;
    if (target.className === 'close-button' || target.closest('.close-button')) {
      return;
    }

    // Ignorar se o clique foi dentro do componente e não foi em um item da lista
    if (this.elementRef.nativeElement.contains(target) && !target.closest('.dropdown-item')) {
      return;
    }

    // Fechar os dropdowns se o clique foi fora ou em um item
    this.closeDropdowns();
  }

  public closeDropdowns(): void {
    // Fechar todos os dropdowns
    this.visibleDropdown = null;

    // Forçar a detecção de mudanças
    this.cdr.detectChanges();
  }

  public openDropdown(dropdown: 'brand' | 'model' | 'year'): void {
    // Fechar outros dropdowns em outros componentes
    document.dispatchEvent(new CustomEvent('closeAllDropdowns'));

    // Abrir o dropdown selecionado
    this.visibleDropdown = dropdown;

    // Forçar a detecção de mudanças
    this.cdr.detectChanges();
  }

  // MANIPULAÇÃO DE DADOS E FILTROS

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
    // Garantir que a lista sempre seja exibida ao receber foco, mesmo sem digitar
    this.filteredBrands = [...this.brands];

    // Se houver texto digitado, filtra os resultados
    if (this.brandSearch && this.brandSearch.trim().length > 0) {
      this.filteredBrands = this.brands.filter(brand =>
        brand.nome.toLowerCase().includes(this.brandSearch.toLowerCase())
      );
    }

    this.openDropdown('brand');
  }

  public filterModels(): void {
    // Garantir que a lista sempre seja exibida ao receber foco, mesmo sem digitar
    this.filteredModels = [...this.models];

    // Se houver texto digitado, filtra os resultados
    if (this.modelSearch && this.modelSearch.trim().length > 0) {
      this.filteredModels = this.models.filter(model =>
        model.nome.toLowerCase().includes(this.modelSearch.toLowerCase())
      );
    }

    this.openDropdown('model');
  }

  public filterYears(): void {
    // Garantir que a lista sempre seja exibida ao receber foco, mesmo sem digitar
    this.filteredYears = [...this.years];

    // Se houver texto digitado, filtra os resultados
    if (this.yearSearch && this.yearSearch.trim().length > 0) {
      this.filteredYears = this.years.filter(year =>
        year.nome.toLowerCase().includes(this.yearSearch.toLowerCase())
      );
    }

    this.openDropdown('year');
  }

  // SELEÇÃO DE ITENS

  public selectBrand(brand: Brand): void {
    this.brandSearch = brand.nome;

    // Fechar o dropdown primeiro para evitar flicker na interface
    this.closeDropdowns();

    // Pequeno atraso para dar feedback visual ao usuário antes de carregar os modelos
    setTimeout(() => {
      this.onBrandSelect(brand.codigo);
    }, 150);
  }

  public selectModel(model: Model): void {
    this.modelSearch = model.nome;

    // Fechar o dropdown primeiro para evitar flicker na interface
    this.closeDropdowns();

    // Pequeno atraso para dar feedback visual ao usuário antes de carregar os anos
    setTimeout(() => {
      this.onModelSelect(model.codigo);
    }, 150);
  }

  public selectYear(year: Year): void {
    this.yearSearch = year.nome;

    // Fechar o dropdown primeiro para evitar flicker na interface
    this.closeDropdowns();

    // Pequeno atraso para dar feedback visual ao usuário antes de carregar os detalhes
    setTimeout(() => {
      this.onYearSelect(year.codigo);
    }, 150);
  }

  // LÓGICA DE NEGÓCIO

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

  // UTILITÁRIOS

  /**
   * Retorna a URL do logo da marca
   * @param brand Nome da marca
   * @returns URL da imagem do logo
   */
  public getBrandLogo(brand: string): string {
    return this.carLogoService.getLogoUrl(brand);
  }

  // EVENTOS DO TECLADO

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.closeDropdowns();
  }
}
