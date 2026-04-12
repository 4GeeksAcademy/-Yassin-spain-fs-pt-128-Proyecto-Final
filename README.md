# Yassine Bouzagaoui Errajy - ⚡ GadgetStore — Proyecto Final 4Geeks Academy

E-commerce de tecnología y gadgets desarrollado como proyecto final del bootcamp Full Stack de 4Geeks Academy (España, promoción fs-pt-128).

## 🚀 Demo en producción

- **Frontend:** [https://gadgetstore-l6t5.onrender.com](https://gadgetstore-l6t5.onrender.com)
- **Backend API:** [https://gadgetstore-api-a4lr.onrender.com](https://gadgetstore-api-a4lr.onrender.com)
- **Repositorio:** [https://github.com/4GeeksAcademy/-Yassin-spain-fs-pt-128-Proyecto-Final](https://github.com/4GeeksAcademy/-Yassin-spain-fs-pt-128-Proyecto-Final)

> ⚠️ El backend usa el plan gratuito de Render. Si tarda en responder, espera 30-60 segundos — el servidor se duerme tras 15 minutos de inactividad.

---

## 📋  Descripción

GadgetStore es una aplicación web de e-commerce completa que permite a los usuarios explorar un catálogo de productos tecnológicos, gestionar su carrito de compras y realizar pagos de forma segura a través de Stripe.

---

## ✅ Requisitos del proyecto cubiertos

- Registro y Login con validaciones en frontend y backend
- Vista de perfil de usuario con edición de datos y eliminación de cuenta
- Vista de catálogo de productos
- Vista de detalle de producto
- Vista de carrito conectada al backend y almacenada en base de datos
- Integración con pasarela de pago (Stripe)
- CRUD completo de productos a través de la API
- Datos almacenados en base de datos PostgreSQL (producción) / SQLite (desarrollo)
- Despliegue en Render
- Múltiples commits con mensajes descriptivos

---

## 🛠️ Tecnologías utilizadas

### Backend
- **Python 3.13** con **Flask**
- **SQLAlchemy** — ORM para la base de datos
- **Flask-Migrate** — Migraciones de base de datos
- **Flask-JWT-Extended** — Autenticación con tokens JWT
- **Flask-CORS** — Manejo de CORS entre frontend y backend
- **Werkzeug** — Hash de contraseñas
- **Stripe** — Pasarela de pago
- **SQLite** (desarrollo) / **PostgreSQL** (producción)
- **Gunicorn** — Servidor WSGI para producción

### Frontend
- **React 18** con **Vite**
- **React Router DOM v6** — Navegación entre páginas
- **useReducer + Context API** — Gestión de estado global
- **Bootstrap 5** — Estilos y componentes UI
- **Stripe.js + React Stripe.js** — Integración del formulario de pago

### Despliegue
- **Render** — Backend (Web Service) + Frontend (Static Site) + Base de datos (PostgreSQL)
- **GitHub** — Control de versiones con integración continua

---

## 🗄️ Modelos de base de datos

```
User
├── id (PK)
├── email (único)
├── password (hasheado)
├── full_name
├── phone
├── address
└── is_active

Product
├── id (PK)
├── name
├── description
├── price
├── stock
├── image_url
├── category
└── is_active

CartItem
├── id (PK)
├── user_id (FK → User)
├── product_id (FK → Product)
└── quantity
```

---

## 📡 Endpoints de la API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/register | Registro de nuevo usuario |
| POST | /api/login | Inicio de sesión |

### Usuario
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/user/profile | Obtener perfil | ✅ |
| PUT | /api/user/profile | Editar perfil | ✅ |
| DELETE | /api/user/profile | Eliminar cuenta | ✅ |

### Productos (CRUD completo)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/products | Listar productos | ❌ |
| GET | /api/products/:id | Detalle de producto | ❌ |
| POST | /api/products | Crear producto | ✅ |
| PUT | /api/products/:id | Editar producto | ✅ |
| DELETE | /api/products/:id | Eliminar producto | ✅ |

### Carrito
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/cart | Ver carrito | ✅ |
| POST | /api/cart | Agregar item | ✅ |
| PUT | /api/cart/:id | Actualizar cantidad | ✅ |
| DELETE | /api/cart/:id | Eliminar item | ✅ |
| DELETE | /api/cart | Vaciar carrito | ✅ |

### Pagos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | /api/create-payment-intent | Crear intención de pago | ✅ |
| POST | /api/payment-success | Confirmar pago exitoso | ✅ |

---

## 📁 Estructura del proyecto

```
Yassin-spain-fs-pt-128-Proyecto-Final/
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── commands.py
│   │   ├── models.py        ← Modelos SQLAlchemy
│   │   ├── routes.py        ← Todos los endpoints
│   │   └── utils.py
│   ├── front/
│   │   ├── components/
│   │   │   ├── CheckoutForm.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── hooks/
│   │   │   └── useGlobalReducer.jsx   ← Store global con useReducer
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Catalog.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── PaymentSuccess.jsx
│   │   ├── routes.jsx
│   │   └── store.js         ← Estado global (token, user, products, cart)
│   ├── app.py               ← Configuración Flask
│   └── wsgi.py
├── migrations/
├── public/
│   └── _redirects           ← Configuración de rutas para Render
├── .env                     ← Variables de entorno
├── .env.example
├── index.html               ← Título y favicon de la app
├── Pipfile
├── package.json
└── requirements.txt
```

---

## ⚙️ Instalación y configuración local

### Requisitos previos
- Python 3.13+
- Node.js 16+
- pipenv (`pip install pipenv`)

### 1. Clonar el repositorio
```bash
git clone https://github.com/4GeeksAcademy/-Yassin-spain-fs-pt-128-Proyecto-Final
cd -Yassin-spain-fs-pt-128-Proyecto-Final
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Contenido del `.env`:
```
FLASK_APP=src/app.py
FLASK_DEBUG=1
DATABASE_URL=sqlite:////tmp/test.db
JWT_SECRET_KEY=tu-clave-secreta
STRIPE_SECRET_KEY=sk_test_...
VITE_BACKEND_URL=http://localhost:3001
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_BASENAME=/
```

### 3. Instalar dependencias del backend
```bash
pipenv install
```

### 4. Instalar dependencias del frontend
```bash
npm install
```

### 5. Crear la base de datos
```bash
# Windows (PowerShell)
$env:FLASK_APP="src/app.py"; pipenv run flask db upgrade

# Mac/Linux
pipenv run flask db upgrade
```

### 6. Arrancar los servidores

**Terminal 1 — Backend:**
```bash
# Windows (PowerShell)
$env:FLASK_APP="src/app.py"; $env:FLASK_DEBUG="1"; pipenv run flask run --host=0.0.0.0 --port=3001

# Mac/Linux
pipenv run flask run --host=0.0.0.0 --port=3001
```

**Terminal 2 — Frontend:**
```bash
npm run start
```

Abre `http://localhost:3000` en el navegador.

---

## 🚀 Despliegue en Render

### 1. Base de datos PostgreSQL
- New → PostgreSQL → Free plan → Copiar **Internal Database URL**

### 2. Backend (Web Service)
| Campo | Valor |
|-------|-------|
| Environment | Python |
| Build Command | `pip install -r requirements.txt && flask db upgrade` |
| Start Command | `gunicorn --chdir src wsgi:application` |
| Region | Oregon (US West) |

Variables de entorno:
```
DATABASE_URL=<Internal Database URL de Render>
JWT_SECRET_KEY=<clave segura>
FLASK_APP=src/app.py
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Frontend (Static Site)
| Campo | Valor |
|-------|-------|
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Region | Oregon (US West) |

Variables de entorno:
```
VITE_BACKEND_URL=
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_BASENAME=/
```

### 4. Configurar Redirects en el Static Site
Render → Static Site → Settings → Redirect and Rewrite Rules:

| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | Rewrite |

---

## 🧪 Tarjetas de prueba de Stripe

| Escenario | Número | Fecha | CVC |
|-----------|--------|-------|-----|
| ✅ Pago exitoso | 4242 4242 4242 4242 | Cualquier fecha futura | Cualquier 3 dígitos |
| ❌ Pago rechazado | 4000 0000 0000 0002 | Cualquier fecha futura | Cualquier 3 dígitos |

---

## 🐛 Problemas encontrados y soluciones

### 1. Flask no encontraba la aplicación en Windows
**Error:** `Could not locate a Flask application`

**Causa:** En Windows las variables de entorno del `.env` no se cargan automáticamente.

**Solución:**
```powershell
$env:FLASK_APP="src/app.py"; $env:FLASK_DEBUG="1"; pipenv run flask run --host=0.0.0.0 --port=3001
```

---

### 2. Error CORS bloqueando las peticiones del frontend
**Error:** `has been blocked by CORS policy`

**Causa:** El `CORS(api)` en el blueprint de rutas entraba en conflicto con la configuración global.

**Solución:** Eliminar `CORS(api)` del `routes.py` y configurar en `app.py`:
```python
CORS(app, supports_credentials=True)
```

---

### 3. Gunicorn no encontraba el módulo `wsgi` en Render
**Error:** `ModuleNotFoundError: No module named 'wsgi'`

**Causa:** El `wsgi.py` estaba dentro de `src/` y el comando de inicio no especificaba la ruta.

**Solución:** Actualizar el Start Command en Render:
```
gunicorn --chdir src wsgi:application
```
Y corregir el `wsgi.py`:
```python
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from app import app as application
```

---

### 4. Rutas de React devolvían "Not Found" en producción
**Causa:** Render no redirigía las rutas de React Router a `index.html`.

**Solución:** Crear `public/_redirects`:
```
/* /index.html 200
```
Y configurar en Render → Redirect and Rewrite Rules: `/*` → `/index.html` → Rewrite.

---

### 5. Total del carrito mostraba $0.00 en checkout
**Causa:** El `STRIPE_SECRET_KEY` tenía el valor literal `sk_test_...` en vez de la clave real de Stripe.

**Solución:** Crear cuenta en [stripe.com](https://stripe.com), obtener las claves reales y configurarlas en Render.

---

### 6. Stripe bloqueado por el bloqueador de anuncios
**Error:** `POST https://r.stripe.com/b net::ERR_BLOCKED_BY_CLIENT`

**Causa:** Los bloqueadores de anuncios bloquean las peticiones de Stripe en el navegador.

**Solución:** Desactivar el bloqueador para `localhost` o usar el navegador en modo incógnito sin extensiones.

---

## 👤 Autor

**Yassin Bouzagaoui Errajy**
Full Stack Development — 4Geeks Academy España (fs-pt-128)

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos como proyecto final de certificación de 4Geeks Academy.
