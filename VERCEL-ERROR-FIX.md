# ❌ Erro: "Missing script: 'build'" na Vercel

## 🔍 Problema

A Vercel está tentando executar `npm run build` no diretório raiz do projeto, mas o script `build` está em `client/package.json`.

## ✅ Solução

Você precisa configurar o **Root Directory** corretamente na Vercel.

---

## 📋 Passo a Passo para Corrigir:

### Opção 1: Reconfigurar na Vercel (RECOMENDADO)

1. **Vá para o Dashboard da Vercel**
   - Acesse seu projeto na Vercel

2. **Settings → General**
   - Scroll até a seção "Build & Development Settings"

3. **Configure corretamente:**
   ```
   Framework Preset: Vite
   Root Directory: client          👈 IMPORTANTE!
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Salvar e Redeploy**
   - Click em "Save"
   - Vá para "Deployments"
   - Click no deployment que falhou
   - Click em "Redeploy"

---

### Opção 2: Deletar e Importar Novamente

Se a Opção 1 não funcionar:

1. **Delete o projeto na Vercel**
   - Settings → Scroll até o final
   - "Delete Project"

2. **Importe novamente**
   - "Add New Project"
   - Selecione seu repositório
   - **IMPORTANTE**: Configure o Root Directory como `client` ANTES de criar

3. **Configuração correta:**
   ```
   Framework Preset: Vite
   Root Directory: client          👈 MUITO IMPORTANTE!
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node.js Version: 18.x
   ```

4. **Variáveis de Ambiente:**
   - Adicione `VITE_API_URL` (se já tiver o backend no Render)
   - Ou deixe em branco por enquanto

5. **Deploy**

---

## 🎯 Configuração Visual (Copie exatamente)

Quando a Vercel perguntar "Configure Project", use:

### Build and Output Settings

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Environment Variables (pode adicionar depois)

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://seu-backend.onrender.com` |

---

## 🔍 Por que isso acontece?

Seu projeto tem esta estrutura:

```
Edicao de Imagens/          ← Raiz (sem package.json com build)
├── client/                  ← Aqui está o React + Vite
│   ├── package.json        ← Aqui está o script "build"
│   └── src/
└── server/                  ← Backend (não precisa na Vercel)
    └── package.json
```

A Vercel precisa saber que deve olhar na pasta `client/` para encontrar o package.json correto.

---

## ✅ Como Verificar se está Correto

Após configurar, você deve ver nos logs da Vercel:

```
Running "npm install" ...
✓ Dependencies installed

Running "npm run build" ...
✓ Build completed
```

Se ver `npm error Missing script: "build"`, o Root Directory ainda está errado.

---

## 🚨 Erro Comum

**NÃO deixe Root Directory vazio ou como `.`**

❌ Root Directory: `.` ou vazio
✅ Root Directory: `client`

---

## 📱 Screenshot de Referência

A configuração deve parecer assim:

```
┌─────────────────────────────────────────┐
│ Root Directory                          │
│ client                            [Edit]│
│                                         │
│ Build Command                           │
│ npm run build                           │
│                                         │
│ Output Directory                        │
│ dist                                    │
│                                         │
│ Install Command                         │
│ npm install                             │
└─────────────────────────────────────────┘
```

---

## 💡 Dica Extra

Se você quer evitar esse tipo de configuração manual, você pode:

1. **Mover tudo do `client/` para a raiz** do projeto (mais trabalhoso)
2. **Usar monorepo tools** como Turborepo (avançado)
3. **Configurar corretamente uma vez** e pronto! ✅ (recomendado)

---

## ✅ Depois de Corrigir

Você pode deletar o arquivo `vercel.json` da raiz se não precisar de configurações customizadas.

---

**Agora tente novamente com a configuração correta!** 🚀

Se o erro persistir, me mostre o novo log!
