# Каталог товаров

Редактируемый каталог магазина на React + TypeScript + Redux Toolkit.

## Запуск

### 1. API сервер

```bash
cd api-src
npm install
node app.js
```

Сервер запустится на `http://localhost:3030`

### 2. Фронтенд

Экспортируйте переменную для адреса api 
```bash
export VITE_API_URL=http://127.0.0.1:3030/api/
```
Установите нужные зависимости и запустите приложение  
```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`

## Стек

- React 19
- TypeScript
- Redux Toolkit
- Axios
- Vite
- CSS (БЭМ)
