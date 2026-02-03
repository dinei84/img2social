# 🚀 Deploy na Vercel - Guia Completo

## 📋 Índice
1. [Estratégia de Deploy](#estratégia-de-deploy)
2. [Opção 1: Frontend na Vercel + Backend no Render](#opção-1-recomendada)
3. [Opção 2: Tudo na Vercel (Experimental)](#opção-2-experimental)
4. [Configuração de Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Checklist Final](#checklist-final)

---

## 🎯 Estratégia de Deploy

⚠️ **IMPORTANTE**: Este projeto usa **Sharp** (processamento de imagens com binários nativos). 

### Melhor Abordagem (Recomendada):
- **Frontend (React)**: Vercel ✅
- **Backend (Node.js + Sharp)**: Render ou Railway ✅

**Por quê?**
- Sharp precisa de binários nativos que nem sempre funcionam bem em serverless
- Upload de arquivos é melhor em servidores tradicionais
- Mais estável e performático para processamento de imagens

---

## 🌟 Opção 1: Frontend na Vercel + Backend no Render (RECOMENDADA)

### Passo 1: Deploy do Frontend na Vercel

#### 1.1. Criar conta na Vercel
- Acesse [vercel.com](https://vercel.com)
- Faça login com sua conta GitHub

#### 1.2. Importar Projeto
1. Click em **"Add New Project"**
2. Selecione seu repositório do GitHub
3. Configure o projeto:

**Build Settings:**
```
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 1.3. Variáveis de Ambiente (Frontend)
Adicione na Vercel:

```env
# URL do seu backend (será criado no próximo passo)
VITE_API_URL=https://seu-backend.onrender.com
```

⚠️ **IMPORTANTE**: Variáveis que começam com `VITE_` são expostas no frontend!

#### 1.4. Fazer Deploy
- Click em **"Deploy"**
- Aguarde o build completar
- Sua URL será algo como: `seu-app.vercel.app`

---

### Passo 2: Deploy do Backend no Render

#### 2.1. Criar conta no Render
- Acesse [render.com](https://render.com)
- Faça login com GitHub

#### 2.2. Criar Web Service
1. Click em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub
3. Configure:

**Build Settings:**
```
Name: image-editor-api
Root Directory: server
Environment: Node
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
- Free (para testes)
- Starter ($7/mês - recomendado para produção)

#### 2.3. Variáveis de Ambiente (Backend no Render)
Adicione no Render Dashboard:

```env
# Node environment
NODE_ENV=production

# CORS - URL do seu frontend na Vercel
FRONTEND_URL=https://seu-app.vercel.app

# Porta (Render define automaticamente)
PORT=3000
```

#### 2.4. Deploy
- Click em **"Create Web Service"**
- Aguarde o deploy (primeira vez demora ~5-10 min)
- Sua URL será: `https://image-editor-api.onrender.com`

---

### Passo 3: Conectar Frontend e Backend

#### 3.1. Atualizar URL da API no Frontend

No Vercel, atualize a variável de ambiente:
```env
VITE_API_URL=https://image-editor-api.onrender.com
```

#### 3.2. Configurar CORS no Backend

No arquivo `server/src/server.js`, já temos CORS configurado, mas vamos melhorar:

**CRIAR ARQUIVO**: `server/.env.production`
```env
FRONTEND_URL=https://seu-app.vercel.app
NODE_ENV=production
PORT=3000
```

#### 3.3. Atualizar Frontend para usar variável de ambiente

**CRIAR ARQUIVO**: `client/.env.production`
```env
VITE_API_URL=https://seu-backend.onrender.com
```

---

## ⚡ Opção 2: Tudo na Vercel (Experimental)

⚠️ **AVISO**: Sharp pode não funcionar bem em Vercel Serverless. Use apenas para testes!

### Estrutura do Projeto

Você precisará converter o backend para Vercel Serverless Functions.

**CRIAR**: `vercel.json` na raiz do projeto
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ]
}
```

**Problemas conhecidos:**
- Sharp pode falhar em serverless
- Limite de 50MB para funções
- Timeout de 10 segundos (plan gratuito)

---

## 🔐 Variáveis de Ambiente

### Frontend (Vercel)

**Obrigatórias:**
```env
VITE_API_URL=https://seu-backend.onrender.com
```

**Opcionais:**
```env
VITE_APP_NAME=Editor de Imagens
VITE_APP_VERSION=1.0.0
```

### Backend (Render)

**Obrigatórias:**
```env
NODE_ENV=production
FRONTEND_URL=https://seu-app.vercel.app
PORT=3000
```

**Opcionais:**
```env
# Limite de upload (em MB)
MAX_FILE_SIZE=10

# Tempo de limpeza de arquivos (em minutos)
CLEANUP_INTERVAL=10
CLEANUP_MAX_AGE=30
```

---

## 🛠️ Arquivos de Configuração Necessários

### 1. Criar `client/.env.production`
```env
VITE_API_URL=https://seu-backend.onrender.com
```

### 2. Criar `client/vite.config.js` (já existe, mas vamos atualizar)

Adicione configuração para produção:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

### 3. Criar `server/.env.production`
```env
NODE_ENV=production
FRONTEND_URL=https://seu-app.vercel.app
PORT=3000
```

### 4. Atualizar `server/src/server.js` para usar variáveis de ambiente

Adicione no topo do arquivo:
```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true
};

app.use(cors(corsOptions));
```

---

## ✅ Checklist de Deploy

### Antes de fazer deploy:

- [ ] Git e GitHub configurados ✅
- [ ] `.gitignore` atualizado (verificar se tem node_modules, .env, etc.)
- [ ] Código commitado e pushed para GitHub
- [ ] Criar arquivos `.env.production` (client e server)
- [ ] Testar build local: `cd client && npm run build`
- [ ] Testar servidor local em modo produção

### Deploy Frontend (Vercel):

- [ ] Conta Vercel criada
- [ ] Projeto importado do GitHub
- [ ] Root directory: `client`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Variável `VITE_API_URL` adicionada
- [ ] Deploy feito com sucesso
- [ ] Site acessível

### Deploy Backend (Render):

- [ ] Conta Render criada
- [ ] Web Service criado
- [ ] Root directory: `server`
- [ ] Start command: `npm start`
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy feito com sucesso
- [ ] API acessível (teste `/api/health`)

### Testes Finais:

- [ ] Frontend carrega corretamente
- [ ] Upload de imagens funciona
- [ ] Processamento funciona
- [ ] Download funciona
- [ ] Não há erros de CORS no console

---

## 🐛 Troubleshooting Comum

### 1. Erro de CORS
```
Access to fetch at 'https://backend.com' from origin 'https://frontend.com' has been blocked by CORS
```

**Solução:**
- Verifique se `FRONTEND_URL` está correto no backend
- Adicione `credentials: true` no CORS
- Certifique-se que a URL não tem `/` no final

### 2. Sharp não funciona (Vercel Serverless)
```
Error: Cannot find module '@img/sharp-libvips-...'
```

**Solução:**
- Use Render/Railway para backend (recomendado)
- OU adicione `sharp` como dependency externa no `vercel.json`

### 3. Build falha no Vercel
```
Error: Command "npm run build" exited with 1
```

**Solução:**
- Verifique se `Root Directory` está como `client`
- Certifique-se que `package.json` tem script `build`
- Verifique logs detalhados no Vercel Dashboard

### 4. API retorna 404
```
GET https://seu-app.vercel.app/api/health 404
```

**Solução:**
- Backend deve estar em servidor separado (Render)
- Configure `VITE_API_URL` corretamente
- Verifique se backend está rodando

---

## 🎯 Comandos Úteis

### Testar build local:
```bash
# Frontend
cd client
npm run build
npm run preview

# Backend
cd server
NODE_ENV=production npm start
```

### Ver logs em produção:
```bash
# Vercel CLI
vercel logs

# Render
# Acessar Dashboard → Logs
```

---

## 📚 Recursos Adicionais

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [Sharp + Serverless](https://sharp.pixelplumbing.com/install#aws-lambda)

---

## 🎉 Depois do Deploy

1. **Configure domínio customizado** (opcional)
   - Vercel: Settings → Domains
   - Render: Settings → Custom Domain

2. **Configure Analytics** (opcional)
   - Vercel Analytics (gratuito)
   - Google Analytics

3. **Monitore performance**
   - Vercel Insights
   - Render Metrics

4. **Configure CI/CD automático**
   - Deploy automático no push para `main`
   - Preview deploys para pull requests

---

**Boa sorte com o deploy! 🚀**

Se tiver problemas, consulte a seção Troubleshooting ou me avise!
