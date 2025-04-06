import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Brand, Car, CarPriceData, Model, Year } from '../models/car.model';

@Injectable({
  providedIn: 'root',
})
export class FipeService {
  private baseUrl = 'https://parallelum.com.br/fipe/api/v1';

  constructor(private http: HttpClient) {}

  public getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/carros/marcas`);
  }

  public getModels(brandId: string): Observable<{ modelos: Model[] }> {
    return this.http.get<{ modelos: Model[] }>(`${this.baseUrl}/carros/marcas/${brandId}/modelos`);
  }

  public getYears(brandId: string, modelId: string): Observable<Year[]> {
    return this.http.get<Year[]>(
      `${this.baseUrl}/carros/marcas/${brandId}/modelos/${modelId}/anos`
    );
  }

  public getCarDetails(brandId: string, modelId: string, yearId: string): Observable<Car> {
    return this.http
      .get<Car>(`${this.baseUrl}/carros/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`)
      .pipe(
        map(car => {
          const currentPrice = this.extractNumericValue(car.Valor);
          const manufacturingYear = parseInt(car.AnoModelo.toString());
          const historicalPrices = this.calculateHistoricalPrices(currentPrice, manufacturingYear);
          return {
            ...car,
            historicalPrices,
            depreciationPercentage: this.calculateDepreciationPercentage(historicalPrices),
          };
        })
      );
  }

  private extractNumericValue(priceString: string): number {
    return Number(priceString.replace('R$ ', '').replace('.', '').replace(',', '.'));
  }

  private getRandomDepreciation(min: number, max: number): number {
    return (Math.random() * (max - min) + min) / 100;
  }

  private calculateHistoricalPrices(
    currentPrice: number,
    manufacturingYear: number
  ): CarPriceData[] {
    const currentYear = new Date().getFullYear();
    const data: CarPriceData[] = [];

    // Calcular o preço original do carro no ano de fabricação
    let originalPrice = currentPrice;
    const yearsOld = currentYear - manufacturingYear;

    // Recalcular o preço original baseado nas taxas de depreciação por faixa
    for (let year = 0; year < yearsOld; year++) {
      let depreciationRate: number;

      if (year === 0) {
        // 1º ano: 15-20%
        depreciationRate = 1 / (1 - this.getRandomDepreciation(15, 20));
      } else if (year <= 2) {
        // 2º-3º ano: 10-15%
        depreciationRate = 1 / (1 - this.getRandomDepreciation(10, 15));
      } else if (year <= 4) {
        // 4º-5º ano: 5-10%
        depreciationRate = 1 / (1 - this.getRandomDepreciation(5, 10));
      } else {
        // Após 5 anos: 3-5%
        depreciationRate = 1 / (1 - this.getRandomDepreciation(3, 5));
      }

      originalPrice = originalPrice * depreciationRate;
    }

    // Gerar histórico de preços do mais antigo para o mais recente
    let currentCalculatedPrice = originalPrice;
    for (let year = manufacturingYear; year <= currentYear; year++) {
      data.push({
        year,
        price: Math.round(currentCalculatedPrice),
      });

      const yearsFromManufacture = year - manufacturingYear;
      let depreciationRate: number;

      if (yearsFromManufacture === 0) {
        // 1º ano: 15-20%
        depreciationRate = 1 - this.getRandomDepreciation(15, 20);
      } else if (yearsFromManufacture <= 2) {
        // 2º-3º ano: 10-15%
        depreciationRate = 1 - this.getRandomDepreciation(10, 15);
      } else if (yearsFromManufacture <= 4) {
        // 4º-5º ano: 5-10%
        depreciationRate = 1 - this.getRandomDepreciation(5, 10);
      } else {
        // Após 5 anos: 3-5%
        depreciationRate = 1 - this.getRandomDepreciation(3, 5);
      }

      currentCalculatedPrice = currentCalculatedPrice * depreciationRate;
    }

    return data;
  }

  private calculateDepreciationPercentage(prices: CarPriceData[]): number {
    if (prices.length < 2) return 0;
    const initialPrice = prices[0].price;
    const currentPrice = prices[prices.length - 1].price;
    return ((initialPrice - currentPrice) / initialPrice) * 100;
  }
}
