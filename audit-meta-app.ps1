# ==============================
# META APP FULL AUDIT SCRIPT
# ShopinistaMeta Auditor v1.0
# ==============================

$ProjectPath = "C:\Users\HP-Home\Documents\Projectos_Rosalia\App_Meta"

Write-Host ""
Write-Host "==============================="
Write-Host "INICIANDO AUDITORIA META APP"
Write-Host "===============================" -ForegroundColor Cyan

if (!(Test-Path $ProjectPath)) {
    Write-Host "❌ Ruta no encontrada" -ForegroundColor Red
    exit
}

Set-Location $ProjectPath

# -------------------------------
# 1. ESTRUCTURA GENERAL
# -------------------------------

Write-Host "`n📁 Revisando estructura..."

$importantFiles = @(
"package.json",
"firebase.json",
".env",
"index.js",
"server.js",
"app.js"
)

foreach ($file in $importantFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file encontrado"
    } else {
        Write-Host "⚠️ Falta $file"
    }
}

# -------------------------------
# 2. PACKAGE.JSON ANALISIS
# -------------------------------

if (Test-Path "package.json") {
    Write-Host "`n📦 Analizando dependencias..."

    $pkg = Get-Content package.json | ConvertFrom-Json

    $requiredDeps = @(
        "express",
        "firebase-admin",
        "dotenv",
        "axios"
    )

    foreach ($dep in $requiredDeps) {
        if ($pkg.dependencies.$dep) {
            Write-Host "✅ $dep instalado"
        } else {
            Write-Host "⚠️ Falta dependencia: $dep"
        }
    }
}

# -------------------------------
# 3. VARIABLES ENV (META)
# -------------------------------

Write-Host "`n🔐 Revisando variables META..."

if (Test-Path ".env") {

    $envContent = Get-Content ".env"

    $requiredEnv = @(
        "META_APP_ID",
        "META_APP_SECRET",
        "VERIFY_TOKEN",
        "FB_CALLBACK_URL"
    )

    foreach ($var in $requiredEnv) {
        if ($envContent -match $var) {
            Write-Host "✅ $var presente"
        } else {
            Write-Host "❌ Falta $var"
        }
    }
}
else {
    Write-Host "❌ No existe archivo .env"
}

# -------------------------------
# 4. WEBHOOK CHECK
# -------------------------------

Write-Host "`n🔔 Buscando endpoints webhook..."

$jsFiles = Get-ChildItem -Recurse -Filter *.js

foreach ($file in $jsFiles) {
    $content = Get-Content $file.FullName

    if ($content -match "webhook") {
        Write-Host "✅ Webhook encontrado en $($file.Name)"
    }
}

# -------------------------------
# 5. FIREBASE CONFIG
# -------------------------------

if (Test-Path "firebase.json") {
    Write-Host "`n🔥 Firebase configurado"
} else {
    Write-Host "⚠️ firebase.json no encontrado"
}

# -------------------------------
# 6. NGROK DETECCION
# -------------------------------

Write-Host "`n🌍 Verificando ngrok..."

$ngrok = Get-Process ngrok -ErrorAction SilentlyContinue

if ($ngrok) {
    Write-Host "✅ ngrok activo"
} else {
    Write-Host "⚠️ ngrok no está corriendo"
}

# -------------------------------
# 7. SEGURIDAD BASICA
# -------------------------------

Write-Host "`n🛡️ Revisando seguridad..."

foreach ($file in $jsFiles) {
    $content = Get-Content $file.FullName

    if ($content -match "EAAG") {
        Write-Host "❌ Token Graph API expuesto en $($file.Name)"
    }

    if ($content -match "APP_SECRET") {
        Write-Host "⚠️ Posible secret hardcodeado en $($file.Name)"
    }
}

# -------------------------------
# 8. RESUMEN FINAL
# -------------------------------

Write-Host ""
Write-Host "==============================="
Write-Host "RESUMEN AUDITORIA COMPLETADA"
Write-Host "===============================" -ForegroundColor Green

Write-Host "✔ Revisar advertencias ⚠️"
Write-Host "✔ Corregir errores ❌"
Write-Host "✔ Reiniciar servidor después de cambios"
Write-Host ""