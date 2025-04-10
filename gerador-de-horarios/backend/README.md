# 🔧 Backend — Gerador de Horários

Este diretório contém o backend da aplicação, responsável por gerar populações iniciais de horários de aula de forma aleatória, utilizando lógica baseada em algoritmos genéticos.

## 📦 Tecnologias utilizadas

- Node.js
- Express
- CORS
- Nodemon (dev)

## 🚀 Como rodar

### 1. Acesse a pasta backend

```bash
cd backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Rode o servidor

```bash
npm start
```

O servidor estará disponível em: [http://localhost:3001](http://localhost:3001)

## 📡 Endpoint disponível

```
GET /api/populacao
```

Retorna uma população inicial com 5 indivíduos (soluções de horários), respeitando as restrições de alocação por período.

