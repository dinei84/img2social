# 🎨 Editor de Imagens para Redes Sociais

Webapp completo para edição, redimensionamento e conversão de imagens, com suporte a processamento individual e em lote, focado em criação de imagens otimizadas para redes sociais.

## ✨ Funcionalidades

- 📤 **Upload drag & drop** - Interface intuitiva para upload de múltiplas imagens
- 🎯 **Presets automáticos** - Dimensões pré-configuradas para todas as principais redes sociais
- ⚡ **Processamento em lote** - Processe várias imagens simultaneamente
- 🖼️ **Múltiplos formatos** - Suporte para JPEG, PNG, WebP e AVIF
- 🎨 **Controle de qualidade** - Ajuste fino da compressão (0-100%)
- 📦 **Download em ZIP** - Baixe múltiplas imagens processadas em um único arquivo
- 🌙 **UI premium** - Interface moderna com tema escuro e animações suaves

## 🌐 Redes Sociais Suportadas

### Instagram
- Feed Quadrado: 1080x1080
- Feed Vertical: 1080x1350
- Stories/Reels: 1080x1920

### YouTube
- Thumbnail: 1280x720
- Banner de Canal: 2560x1440

### Twitter (X)
- Post Padrão: 1200x675
- Header: 1500x500

### Facebook
- Post: 1200x630
- Capa: 820x312

### LinkedIn
- Post: 1200x627
- Banner: 1584x396

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Multer** - Middleware para upload de arquivos
- **Sharp** - Biblioteca de processamento de imagens de alta performance
- **Archiver** - Criação de arquivos ZIP

### Frontend
- **React** - Biblioteca UI
- **Vite** - Build tool ultrarrápida
- **Lucide React** - Ícones modernos
- **Vanilla CSS** - Estilização customizada sem frameworks

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Backend

```bash
cd server
npm install
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Frontend

```bash
cd client
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🚀 Como Usar

1. **Inicie o servidor backend**
   ```bash
   cd server
   npm run dev
   ```

2. **Inicie o frontend** (em outro terminal)
   ```bash
   cd client
   npm run dev
   ```

3. **Acesse** `http://localhost:5173` no navegador

4. **Fluxo de trabalho:**
   - Faça upload de uma ou mais imagens
   - Escolha um preset de rede social
   - Ajuste qualidade e formato
   - Clique em "Processar e Baixar"
   - Imagens otimizadas serão baixadas automaticamente

## 📁 Estrutura do Projeto

```
Edicao de Imagens/
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── config/        # Presets de redes sociais
│   │   ├── controllers/   # Lógica de upload e processamento
│   │   ├── services/      # Serviço de processamento com Sharp
│   │   ├── utils/         # Utilidades (limpeza de arquivos)
│   │   ├── routes.js      # Definição de rotas da API
│   │   └── server.js      # Arquivo principal do servidor
│   ├── uploads/           # Diretório temporário de uploads
│   ├── processed/         # Diretório temporário de processados
│   └── package.json
│
└── client/                # Frontend React
    ├── src/
    │   ├── styles/        # CSS customizado
    │   ├── App.jsx        # Componente principal
    │   └── main.jsx       # Entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔌 API Endpoints

### `GET /api/health`
Health check do servidor

### `GET /api/presets`
Retorna todos os presets disponíveis

### `POST /api/upload`
Faz upload de imagens
- **Body**: FormData com campo `images` (múltiplos arquivos)
- **Retorna**: Array com informações dos arquivos

### `POST /api/process`
Processa imagens com base nos parâmetros
- **Body**: JSON com:
  - `files`: Array de IDs dos arquivos
  - `preset`: ID do preset (opcional)
  - `format`: Formato de saída (jpeg, png, webp, avif)
  - `quality`: Qualidade 0-100
  - `width`, `height`: Dimensões customizadas (opcional)
- **Retorna**: Arquivo único ou ZIP (download automático)

## 🔒 Segurança

- ✅ Validação de tipo MIME nos uploads
- ✅ Limite de tamanho de arquivo (10MB por imagem)
- ✅ Limpeza automática de arquivos temporários a cada 10 minutos
- ✅ Arquivos mais antigos que 30 minutos são removidos
- ✅ CORS habilitado para desenvolvimento local

## ⚡ Performance

- Processamento paralelo com `Promise.all`
- Sharp otimizado para alta performance
- Limpeza automática de arquivos temporários
- Presets pré-configurados para evitar cálculos

## 🧪 Testes

O projeto possui uma suite completa de testes automatizados:

### Backend

```bash
cd server

# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Cobertura de Testes

- **33 testes** passando ✅
- **4 suites de teste**:
  - Testes de presets (9 testes)
  - Testes de serviço de imagens (6 testes)
  - Testes de limpeza de arquivos (7 testes)
  - Testes de integração da API (10 testes)

### Tecnologias de Teste

- **Jest**: Framework de testes
- **Supertest**: Testes de API HTTP
- **@jest/globals**: Suporte a ES Modules

Para mais detalhes, consulte `server/__tests__/README.md`

## 🎨 Design

Interface premium com:
- Tema escuro moderno
- Gradientes vibrantes
- Micro-animações suaves
- Design responsivo
- Tipografia Inter (Google Fonts)
- Glassmorphism em elementos-chave

## 🔮 Melhorias Futuras

- [ ] Crop visual no frontend
- [ ] Preview em tempo real das transformações
- [ ] Mais opções de filtros e ajustes
- [ ] Histórico de processamentos
- [ ] Autenticação de usuários
- [ ] Salvamento de presets customizados
- [ ] API para integração com outras aplicações
- [ ] Deploy em produção (Docker)

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️ para criadores de conteúdo
