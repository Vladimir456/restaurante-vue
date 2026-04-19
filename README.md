# 🍽️ Restaurante Vue

Aplicación web desarrollada con **Vue 3** para la gestión de un restaurante,
incluyendo categorías y platos con CRUD completo, autenticación y rutas protegidas.

## 🚀 Tecnologías utilizadas

- Vue 3 + Composition API
- Vue Router 4 (rutas protegidas)
- Pinia (manejo de estado)
- Axios (consumo de API)
- JSON Server + JSON Server Auth (backend simulado)
- Vite (bundler)

## ⚙️ Requisitos previos

- Node.js v20 o superior
- npm v10 o superior

## 📦 Instalación

1. Clona el repositorio:
   git clone https://github.com/TU_USUARIO/restaurante-vue.git
   cd restaurante-vue

2. Instala las dependencias:
   npm install

3. Crea el archivo de variables de entorno:
   Crea un archivo .env en la raíz con:
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=Restaurante Vue

## ▶️ Ejecución

Necesitas dos terminales:

Terminal 1 - Backend:
   npm run server

Terminal 2 - Frontend:
   npm run dev

O puedes correr ambos juntos con:
   npm run start

Luego abre: http://localhost:5173

## 👤 Crear usuario

Al abrir la app por primera vez:
1. Haz clic en "Regístrate aquí"
2. Ingresa tu email y contraseña (mínimo 6 caracteres)
3. Serás redirigido al Dashboard automáticamente

## 📁 Estructura del proyecto

src/
├── components/
│   └── NavBar.vue
├── router/
│   └── index.js
├── services/
│   ├── api.js
│   ├── categorias.js
│   └── platos.js
├── stores/
│   └── auth.js
├── views/
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── DashboardView.vue
│   ├── CategoriasView.vue
│   ├── PlatosView.vue
│   └── PlatoDetalleView.vue
└── App.vue

## ✅ Funcionalidades

- Registro e inicio de sesión con JWT
- Protección de rutas privadas
- CRUD completo de Categorías
- CRUD completo de Platos
- Filtro de platos por categoría
- Buscador en tiempo real
- Ruta dinámica: detalle de plato (/platos/:id)
- Variables de entorno con Vite
- Diseño responsivo

## 🎓 Proyecto académico

Diplomado Fullstack Developer - Universidad Simón I. Patiño
Módulo VI - Vue 3