# Centro Pokémon — Proyecto de tienda de peluches

Documento breve para ejecutar y entender este proyecto.

## Descripción
Pequeña aplicación web (Node.js + Express) que sirve páginas estáticas (HTML/CSS/JS) y una API mínima para registro/login. Incluye vistas para inicio, tienda, signup, login y verificación. Las imágenes y archivos estáticos se sirven desde la carpeta `img` y `views/home/styles`.

El proyecto es un prototipo de una tienda simple de peluches (tema Pokémon).

## Estructura principal
- `app.js` - configuración de Express y rutas estáticas / middlewares.
- `index.js` - arranca el servidor.
- `controllers/` - controladores (users, login, tienda, inicio).
- `models/` - modelos de Mongoose (`user.js`, `todos.js`).
- `views/home/` - vistas estáticas (subcarpetas: `inicio`, `tienda`, `signup`, `login`, `todos`, `Components`, `styles`, `verify`, ...).
- `img/` - imágenes usadas en las vistas.
- `package.json` - dependencias y scripts.

## Requisitos
- Node.js (v16+ recomendado)
- npm
- MongoDB (URL configurada via `.env`)

## Variables de entorno (archivo `.env`)
El proyecto usa un `.env` para credenciales y URIs. Variables esperadas:
- `MONGO_URI_TEST` - URI de MongoDB para desarrollo.
- `MONGO_URI_PROD` - URI de MongoDB para producción.
- `ACCESS_TOKEN_SECRET` - secreto para JWT.
- `EMAIL_USER`, `EMAIL_PASS` - credenciales para nodemailer (solo si deseas enviar emails).


## Instalación (local)
Desde la raíz del proyecto en PowerShell (Windows):

```powershell

npm install
```

## Desarrollo
Generar el CSS de Tailwind (si haces cambios en `src/styles.css`) y servir la app:

```powershell

npx tailwindcss -i ./src/styles.css -o ./views/home/styles/output.css --minify

# Ejecutar en modo desarrollo (usa nodemon)
npm run dev
```

El servidor escuchará en `http://localhost:3000` por defecto.

## Producción
```powershell
npm start
```

## Rutas estáticas y endpoints relevantes
- Páginas (static):
  - `/` — raíz (sirve `views/home`)
  - `/inicio/` — (vista `views/home/inicio`)
  - `/tienda/` — (vista `views/home/tienda`)
  - `/login/` — (vista `views/home/login`)
  - `/signup/` — (vista `views/home/signup`)
  - `/img/...` — imágenes (carpeta `img`)
  - `/styles/...` — estilos compilados (por ejemplo `views/home/styles/output.css`)

- API:
  - `POST /api/users` — registro de usuario
  - `POST /api/login` — login (genera cookie `accessToken`)
  - `PATCH /api/users/:id/:token` — verificación de cuenta (según controlador)
  - Rutas adicionales: `/api/inicio`, `/api/tienda` (controladores existentes)


## Ejecutar pruebas manuales rápidas
1. Arrancar servidor: `npm run dev`
2. Abrir `http://localhost:3000/` en el navegador.
3. Navegar a `/signup/` y probar registro (si tienes configuración de correo, la verificación enviará email).
4. Probar login en `/login/`.

## Contacto / Autor
- Proyecto creado por Ángel Hernández.

---

