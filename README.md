# Comparador de Carros

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)

Uma aplicação web desenvolvida em Angular para comparação visual de especificações e características de veículos, permitindo aos usuários tomar decisões mais informadas na hora de escolher um carro.

## 📋 Recursos

- Interface intuitiva para seleção de veículos
- Visualização comparativa de especificações através de gráficos interativos
- Comparação lado a lado de até 4 veículos simultaneamente
- Análise detalhada de características como potência, consumo, dimensões e preço
- Design responsivo para uso em dispositivos móveis e desktop

## 🛠️ Tecnologias Utilizadas

- **Framework**: Angular 19
- **Estilização**: CSS nativo
- **Visualização de Dados**: Chart.js e ng2-charts
- **Hospedagem**: Cloudflare Workers
- **Qualidade de Código**: ESLint, Prettier, Husky

## 💻 Estrutura do Projeto

```
src/
├── app/
│   ├── core/              # Funcionalidades essenciais da aplicação
│   │   ├── components/    # Componentes compartilhados
│   │   ├── models/        # Interfaces e tipos
│   │   └── services/      # Serviços globais
│   └── modules/
│       └── car-comparison/ # Módulo de comparação de carros
│           └── components/
│               ├── car-chart/    # Componente para exibição de gráficos
│               └── car-selector/ # Componente para seleção de carros
└── assets/                # Recursos estáticos (imagens, ícones, etc.)
```

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
