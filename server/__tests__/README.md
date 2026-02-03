# 🧪 Testes - Image Editor Backend

Este diretório contém os testes unitários e de integração para o backend do Editor de Imagens.

## 📦 Dependências de Teste

- **Jest**: Framework de testes JavaScript
- **Supertest**: Biblioteca para testar APIs HTTP
- **@jest/globals**: Globais do Jest para ES Modules

## 🚀 Executando os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch (desenvolvimento)
```bash
npm run test:watch
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

## 📁 Estrutura dos Testes

```
__tests__/
├── presets.test.js          # Testes unitários dos presets
├── imageService.test.js     # Testes do serviço de imagens
├── fileCleanup.test.js      # Testes das utilidades de limpeza
└── api.integration.test.js  # Testes de integração da API
```

## ✅ Cobertura de Testes

### Testes Unitários

#### `presets.test.js`
- ✅ Verifica se todos os presets têm dimensões válidas
- ✅ Testa presets específicos do Instagram
- ✅ Testa presets específicos do YouTube
- ✅ Valida função `getPlatforms()`
- ✅ Valida função `getPresetsByPlatform()`

#### `imageService.test.js`
- ✅ Valida formatos de imagem suportados
- ✅ Testa case-insensitivity dos formatos
- ✅ Verifica modos de fit disponíveis
- ✅ Testa valores padrão do serviço

#### `fileCleanup.test.js`
- ✅ Testa criação de diretórios
- ✅ Testa remoção de arquivos únicos
- ✅ Testa remoção de múltiplos arquivos
- ✅ Testa limpeza completa de diretórios

### Testes de Integração

#### `api.integration.test.js`
- ✅ Testa endpoint `GET /api/health`
- ✅ Testa endpoint `GET /api/presets`
- ✅ Testa endpoint `POST /api/upload`
- ✅ Testa endpoint `POST /api/process`
- ✅ Valida estrutura de resposta da API
- ✅ Testa validação de parâmetros
- ✅ Testa tratamento de erros

## 📊 Exemplo de Saída

```
 PASS  __tests__/presets.test.js
  Presets Configuration
    SOCIAL_MEDIA_PRESETS
      ✓ should have all required platforms (5 ms)
      ✓ should have valid dimensions for all presets (2 ms)
      ✓ Instagram presets should have correct dimensions (1 ms)
      ✓ YouTube presets should have correct dimensions (1 ms)
    getPlatforms
      ✓ should return array of unique platforms (1 ms)
      ✓ should include all major platforms (1 ms)
    getPresetsByPlatform
      ✓ should return only Instagram presets (1 ms)
      ✓ should return only YouTube presets (1 ms)
      ✓ should return empty object for non-existent platform (1 ms)

 PASS  __tests__/api.integration.test.js
  API Integration Tests
    GET /api/health
      ✓ should return 200 and health status (25 ms)
    GET /api/presets
      ✓ should return 200 and presets list (12 ms)
      ✓ presets should have correct structure (8 ms)
      ✓ platforms should include major social media (7 ms)
```

## 🔍 Boas Práticas

1. **Isolamento**: Cada teste é independente e não depende de outros
2. **Cleanup**: Arquivos temporários são removidos após cada teste
3. **Mocks**: Use mocks quando necessário para isolar unidades
4. **Cobertura**: Mantenha cobertura acima de 80%
5. **Nomes descritivos**: Testes têm nomes claros que explicam o que testam

## 🐛 Debugging

Para debugar um teste específico:

```bash
# Executar apenas um arquivo de teste
npm test -- presets.test.js

# Executar com mais verbosidade
npm test -- --verbose

# Executar apenas testes que correspondem a um padrão
npm test -- --testNamePattern="Instagram"
```

## 📝 Adicionando Novos Testes

1. Crie um arquivo `.test.js` na pasta `__tests__`
2. Importe as funções de `@jest/globals`
3. Organize em blocos `describe()` e `test()`
4. Execute `npm test` para verificar

Exemplo:

```javascript
import { describe, test, expect } from '@jest/globals';

describe('MinhaFuncao', () => {
  test('should do something', () => {
    expect(minhaFuncao()).toBe(resultado);
  });
});
```

## ⚠️ Notas

- Testes de processamento de imagem requerem imagens de teste reais
- Alguns testes de integração podem ser mais lentos devido ao Sharp
- Mantenha os testes rápidos usando fixtures pequenas
