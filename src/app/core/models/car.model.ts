export interface CarPriceData {
  year: number;
  price: number;
}

export interface Car {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  CodigoMarca?: string;
  CodigoModelo?: string;
  historicalPrices?: CarPriceData[];
  depreciationPercentage?: number;
}

export interface Brand {
  codigo: string;
  nome: string;
}

export interface Model {
  codigo: string;
  nome: string;
}

export interface Year {
  codigo: string;
  nome: string;
}

export interface CarComparison {
  firstCar: {
    CodigoMarca: string;
    CodigoModelo: string;
    AnoModelo: number;
  };
  secondCar: {
    CodigoMarca: string;
    CodigoModelo: string;
    AnoModelo: number;
  };
}
