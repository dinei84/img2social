# 🚀 Checklist Rápido de Deploy

## ✅ Pré-Deploy (Local)

- [ ] Código commitado e atualizado no GitHub
- [ ] Testar build local: `cd client && npm run build && npm run preview`
- [ ] Testar backend local: `cd server && npm start`
- [ ] Verificar se `.env.production` está configurado (mas NÃO commitado)
- [ ] Verificar `.gitignore` (node_modules, .env, uploads, processed)

---

## 🎯 Deploy Frontend (Vercel)

### 1. Criar projeto na Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Click em **"Add New Project"**
3. Importar seu repositório

### 2. Configurar projeto
```
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

### 3. Adicionar variável de ambiente
**⚠️ ATENÇÃO**: Adicione ANTES do primeiro deploy!

```
Name: VITE_API_URL
Value: https://seu-backend.onrender.com
```

*(Você obterá esta URL depois de fazer deploy do backend)*

### 4. Deploy
- Click em **"Deploy"**
- Aguarde ~2-3 minutos
- Anote sua URL: `https://seu-app.vercel.app`

---

## 🔧 Deploy Backend (Render)

### 1. Criar Web Service no Render
1. Acesse [render.com](https://render.com) e faça login
2. Click em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub

### 2. Configurar serviço
```
Name: image-editor-api (ou seu nome preferido)
Root Directory: server
Environment: Node
Branch: main
Build Command: npm install
Start Command: npm start
```

### 3. Escolher plano
- **Free**: Boa para testes (fica em sleep após inatividade)
- **Starter ($7/mês)**: Recomendado para produção

### 4. Adicionar variáveis de ambiente

```
NODE_ENV=production
FRONTEND_URL=https://seu-app.vercel.app
PORT=3000
```

*(Use a URL que você anotou do Vercel)*

### 5. Criar Web Service
- Click em **"Create Web Service** "**
- Aguarde ~5-10 minutos (primeira vez demora)
- Anote sua URL: `https://image-editor-api.onrender.com`

---

## 🔄 Conectar Frontend e Backend

### 1. Atualizar variável no Vercel
1. Vá para o projeto na Vercel
2. Settings → Environment Variables
3. Edite `VITE_API_URL`:
   ```
   https://image-editor-api.onrender.com
   ```
   *(Use a URL do seu backend no Render)*

### 2. Redeploy do Frontend
1. Na Vercel: Deployments → Latest → ... → Redeploy

---

## ✅ Testes Finais

Acesse `https://seu-app.vercel.app` e teste:

- [ ] ✅ Página carrega sem erros
- [ ] ✅ Upload de imagens funciona
- [ ] ✅ Escolher preset funciona
- [ ] ✅ Processar imagem funciona
- [ ] ✅ Download funciona
- [ ] ✅ Não há erros de CORS no console (F12)

### Testar API diretamente:
```bash
# Health check
curl https://seu-backend.onrender.com/api/health

# Presets
curl https://seu-backend.onrender.com/api/presets
```

---

## 🐛 Problemas Comuns

### Frontend não carrega
1. Verifique logs na Vercel: Deployments → Logs
2. Certifique-se que `Root Directory` = `client`
3. Verifique se `npm run build` funciona localmente

### Erro de CORS
```
Access blocked by CORS policy
```

**Solução:**
1. Verifique `FRONTEND_URL` no Render
2. Certifique-se que a URL não tem `/` no final
3. Use exatamente a mesma URL do Vercel

### API retorna 404
```
GET /api/health 404
```

**Solução:**
1. Verifique se backend está rodando no Render
2. Certifique-se que `VITE_API_URL` está correto
3. A URL deve ser `https://...` (com HTTPS)

### Backend em "sleep" (Render Free)
O plano gratuito do Render hiberna após inatividade.
- Primeira requisição demora ~30-60 segundos
- Considere usar plano Starter ($7/mês)

---

## 📝 URLs Importantes

Anote suas URLs aqui:

```
GitHub: https://github.com/seu-usuario/seu-repositorio
Vercel (Frontend): https://_____________________.vercel.app
Render (Backend): https://_____________________.onrender.com
```

---

## 🎉 Próximos Passos (Opcional)

- [ ] Configurar domínio customizado na Vercel
- [ ] Configurar Analytics (Vercel Analytics é gratuito)
- [ ] Configurar monitoramento (Sentry, LogRocket, etc.)
- [ ] Configurar deploy automático (já está ativo!)
- [ ] Configurar preview deployments para PRs

---

**Deploy concluído! 🚀**

Se algo der errado, consulte o arquivo `DEPLOY.md` completo.
