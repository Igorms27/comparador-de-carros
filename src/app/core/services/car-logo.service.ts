import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarLogoService {
  private readonly logoMap: { [key: string]: string } = {
    // Marcas comuns no Brasil
    CHEVROLET: 'https://logodownload.org/wp-content/uploads/2014/04/chevrolet-logo-1.png',
    FIAT: 'https://logodownload.org/wp-content/uploads/2014/05/fiat-logo-0.png',
    VOLKSWAGEN: 'https://logodownload.org/wp-content/uploads/2014/02/volkswagen-logo-1.png',
    FORD: 'https://logodownload.org/wp-content/uploads/2014/04/ford-logo-0.png',
    HYUNDAI: 'https://logodownload.org/wp-content/uploads/2014/05/hyundai-logo-0.png',
    HONDA: 'https://logodownload.org/wp-content/uploads/2014/05/honda-logo-0.png',
    TOYOTA: 'https://logodownload.org/wp-content/uploads/2016/09/toyota-logo-0.png',
    RENAULT: 'https://logodownload.org/wp-content/uploads/2014/09/renault-logo-2.png',
    NISSAN: 'https://logodownload.org/wp-content/uploads/2014/09/nissan-logo-7.png',
    PEUGEOT: 'https://logodownload.org/wp-content/uploads/2014/09/peugeot-logo-2.png',
    CITROEN: 'https://logodownload.org/wp-content/uploads/2015/02/citroen-logo-4.png',
    MITSUBISHI: 'https://logodownload.org/wp-content/uploads/2014/09/mitsubishi-logo-1.png',
    BMW: 'https://logodownload.org/wp-content/uploads/2014/04/bmw-logo-1.png',
    'MERCEDES-BENZ': 'https://logodownload.org/wp-content/uploads/2014/04/mercedes-benz-logo-1.png',
    AUDI: 'https://logodownload.org/wp-content/uploads/2016/06/audi-logo-2.png',
    KIA: 'https://logodownload.org/wp-content/uploads/2018/09/kia-logo-0.png',
    JEEP: 'https://logodownload.org/wp-content/uploads/2017/01/jeep-logo-1.png',
    'LAND ROVER': 'https://logodownload.org/wp-content/uploads/2018/11/land-rover-logo-0.png',
    VOLVO: 'https://logodownload.org/wp-content/uploads/2016/03/volvo-logo-0.png',
    SUBARU: 'https://logodownload.org/wp-content/uploads/2018/09/subaru-logo-0.png',
    SUZUKI: 'https://logodownload.org/wp-content/uploads/2018/09/suzuki-logo-0.png',
    JAGUAR: 'https://logodownload.org/wp-content/uploads/2014/09/jaguar-logo-0.png',
    RAM: 'https://logodownload.org/wp-content/uploads/2022/01/ram-logo-0.png',
    CHERY: 'https://logodownload.org/wp-content/uploads/2022/01/chery-logo-0.png',
    'CAOA CHERY': 'https://logodownload.org/wp-content/uploads/2022/01/caoa-chery-logo-0.png',
    PORSCHE: 'https://logodownload.org/wp-content/uploads/2017/10/porsche-logo-0.png',
    FERRARI: 'https://logodownload.org/wp-content/uploads/2017/10/ferrari-logo-0.png',
  };

  private readonly defaultLogo = 'https://cdn-icons-png.flaticon.com/512/55/55283.png';

  /**
   * Retorna o URL do logo da marca de carro
   * @param brand Nome da marca
   * @returns URL da imagem do logo
   */
  public getLogoUrl(brand: string): string {
    if (!brand) return this.defaultLogo;

    const lowerBrand = brand.toLowerCase().trim();
    return this.logoMap[lowerBrand] || this.defaultLogo;
  }
}
