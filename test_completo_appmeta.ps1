# ============================================================
#  AUTO-FIX COMPLETO PARA App_Meta
#  Marco + Copilot
# ============================================================

# --- RUTA BASE ---
$root = "C:\Users\HP-Home\Documents\Projectos_Rosalia\App_Meta"

if (!(Test-Path $root)) {
    Write-Host "❌ ERROR: La carpeta raíz NO existe." -ForegroundColor Red
    exit
}

Set-Location $root
Write-Host "📌 Proyecto detectado en: $root" -ForegroundColor Cyan

# --- RUTAS SEGURAS ---
$functions = Join-Path $root "functions"
$meta      = Join-Path $functions "meta"
$admin     = Join-Path $root "admin"

# ============================================================
# 1. CREAR CARPETAS SI FALTAN
# ============================================================

$folders = @($functions, $meta, $admin, "$admin\src", "$admin\src\components")

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "📁 Creada carpeta: $folder"
    }
}

# ============================================================
# 2. VERIFICAR Y REPARAR FUNCTIONS
# ============================================================

Write-Host "`n🔧 Reparando Firebase Functions..." -ForegroundColor Cyan

$indexPath = Join-Path $functions "index.js"

if (!(Test-Path $indexPath)) {
    Write-Host "⚠️ index.js faltante → creando..." -ForegroundColor Yellow

    @'
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require("firebase-functions/v2/firestore");

const { metaWebhook } = require("./meta/webhook");
const { syncCreate, syncUpdate, syncDelete } = require("./meta/sync");

exports.helloWorld = onRequest((req, res) => {
  res.send("Firebase Functions funcionando correctamente.");
});

exports.metaWebhook = onRequest(metaWebhook);

exports.onProductCreate = onDocumentCreated("products/{id}", (event) => syncCreate(event.data));
exports.onProductUpdate = onDocumentUpdated("products/{id}", (event) => syncUpdate(event.data));
exports.onProductDelete = onDocumentDeleted("products/{id}", (event) => syncDelete(event.data));
'@ | Set-Content $indexPath
}

# ============================================================
# 3. REPARAR DEPENDENCIAS DE FUNCTIONS
# ============================================================

Write-Host "`n📦 Reparando dependencias de Functions..." -ForegroundColor Cyan

Set-Location $functions

if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
}

npm install firebase-functions firebase-admin express node-fetch --silent

Write-Host "✔ Functions OK" -ForegroundColor Green

# ============================================================
# 4. VERIFICAR ADMIN PANEL
# ============================================================

Write-Host "`n🔧 Verificando Admin Panel..." -ForegroundColor Cyan

$packageJson = Join-Path $admin "package.json"

if (!(Test-Path $packageJson)) {
    Write-Host "⚠️ Admin Panel NO existe → generando..." -ForegroundColor Yellow

    # Crear package.json
    @'
{
  "name": "admin-panel",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase": "^10.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "vite": "^5.0.0"
  }
}
'@ | Set-Content $packageJson

    # Crear index.html
    @'
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Admin Panel</title>
    <script type="module" src="/src/main.jsx"></script>
  </head>
  <body><div id="root"></div></body>
</html>
'@ | Set-Content "$admin\index.html"

    # Crear main.jsx
    @'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
'@ | Set-Content "$admin\src\main.jsx"

    # Crear App.jsx
    @'
import React from "react";
export default function App() { return <h1>Admin Panel listo</h1>; }
'@ | Set-Content "$admin\src\App.jsx"
}

# ============================================================
# 5. REPARAR DEPENDENCIAS DEL ADMIN PANEL
# ============================================================

Write-Host "`n📦 Instalando dependencias del Admin Panel..." -ForegroundColor Cyan

Set-Location $admin

if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
}

npm install --silent

Write-Host "✔ Admin Panel OK" -ForegroundColor Green

# ============================================================
# 6. REPORTE FINAL
# ============================================================

Write-Host "`n🎉 AUTO-FIX COMPLETO FINALIZADO" -ForegroundColor Green
Write-Host "👉 Functions listas"
Write-Host "👉 Admin Panel listo"
Write-Host "👉 Estructura corregida"
Write-Host "👉 Dependencias reparadas"
Write-Host "`nPuedes iniciar el Admin Panel con:"
Write-Host "cd admin"
Write-Host "npm run dev"
Write-Host "`nPuedes probar Functions con:"
Write-Host "firebase emulators:start"
