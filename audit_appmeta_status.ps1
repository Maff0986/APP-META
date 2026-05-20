############################################################
# SHOPINISTA META — APP STATUS AUDIT
# Genera reporte técnico completo del proyecto
############################################################

Clear-Host

$projectPath = Get-Location
$reportFile = Join-Path $projectPath "APP_META_STATUS_REPORT.txt"

Write-Host "🔎 Analizando proyecto App_Meta..."

# =============================
# HEADER
# =============================

$report = @()
$report += "====================================================="
$report += " SHOPINISTA META — TECHNICAL STATUS REPORT"
$report += " Generated: $(Get-Date)"
$report += " Path: $projectPath"
$report += "====================================================="
$report += ""

# =============================
# CARPETAS PRINCIPALES
# =============================

$report += "📁 MAIN ARCHITECTURE"
$report += "-----------------------------------------------------"

$mainDirs = Get-ChildItem -Directory

foreach($dir in $mainDirs){
    $report += " - $($dir.Name)"

    $sub = Get-ChildItem $dir.FullName -Directory -ErrorAction SilentlyContinue
    foreach($s in $sub){
        $report += "    ↳ $($s.Name)"
    }
}

$report += ""

# =============================
# ARCHIVOS IMPORTANTES
# =============================

$report += "📄 CORE FILES DETECTED"
$report += "-----------------------------------------------------"

$coreFiles = @(
"server.js",
"package.json",
".env",
"firebase.json"
)

foreach($file in $coreFiles){
    if(Test-Path $file){
        $report += " ✅ $file"
    } else {
        $report += " ❌ Missing: $file"
    }
}

$report += ""

# =============================
# BACKEND CHECK
# =============================

$report += "⚙️ BACKEND ANALYSIS"
$report += "-----------------------------------------------------"

if(Test-Path "routes"){
    $routes = Get-ChildItem "./routes" -Filter *.js
    $report += " Routes detected: $($routes.Count)"

    foreach($r in $routes){
        $report += "   - $($r.Name)"
    }
}else{
    $report += " ❌ routes folder missing"
}

if(Test-Path "controllers"){
    $report += " ✅ controllers folder present"
}

if(Test-Path "middleware"){
    $report += " ✅ middleware detected"
}

$report += ""

# =============================
# FRONTEND CHECK
# =============================

$report += "🖥 FRONTEND ANALYSIS"
$report += "-----------------------------------------------------"

if(Test-Path "frontend/index.html"){
    $report += " ✅ index.html detected"
}else{
    $report += " ❌ index.html missing"
}

$frontFolders = Get-ChildItem "./frontend" -Directory -ErrorAction SilentlyContinue

foreach($f in $frontFolders){
    $report += "   ↳ frontend/$($f.Name)"
}

$report += ""

# =============================
# AUTH / META CHECK
# =============================

$report += "🔐 AUTH & OAUTH STATUS"
$report += "-----------------------------------------------------"

$envPath = ".env"

if(Test-Path $envPath){

    $envContent = Get-Content $envPath

    if($envContent -match "META_APP_ID"){
        $report += " ✅ META_APP_ID detected"
    }else{
        $report += " ⚠️ META_APP_ID missing"
    }

    if($envContent -match "META_APP_SECRET"){
        $report += " ✅ META_APP_SECRET detected"
    }else{
        $report += " ⚠️ META_APP_SECRET missing"
    }

}else{
    $report += " ❌ .env not found"
}

$report += ""

# =============================
# ERROR DETECTION
# =============================

$report += "🚨 STRUCTURAL WARNINGS"
$report += "-----------------------------------------------------"

if(Test-Path "backend/server.js"){
    $report += " ⚠️ Duplicate backend/server.js may cause nodemon errors"
}

$nodeModules = Test-Path "node_modules"

if(!$nodeModules){
    $report += " ❌ node_modules missing → run npm install"
}

$report += ""

# =============================
# AVANCE DEL PROYECTO
# =============================

$report += "📊 PROJECT PROGRESS ESTIMATION"
$report += "-----------------------------------------------------"

$progress = 65

if(Test-Path "routes/meta.js"){ $progress += 10 }
if(Test-Path "webhooks"){ $progress += 5 }
if(Test-Path "scheduler"){ $progress += 5 }
if(Test-Path "database"){ $progress += 5 }

$report += " Estimated completion: $progress %"

$report += ""

# =============================
# RECOMENDACIONES DEV
# =============================

$report += "🧠 CURRENT RECOMMENDATIONS (DEV)"
$report += "-----------------------------------------------------"

$report += " - Implement token persistence (DB)"
$report += " - Add centralized error handler"
$report += " - Validate OAuth callback states"
$report += " - Add logger levels (info/warn/error)"
$report += " - Secure ENV variables"

$report += ""

# =============================
# PRODUCCIÓN
# =============================

$report += "🚀 PRODUCTION READINESS"
$report += "-----------------------------------------------------"

$report += " - HTTPS required"
$report += " - Replace ngrok with domain"
$report += " - Add Redis session store"
$report += " - Rate limiting middleware"
$report += " - Deploy using PM2 or Docker"

$report += ""

# =============================
# FINALIZACIÓN
# =============================

$report += "🏁 STEPS TO FINISH APP"
$report += "-----------------------------------------------------"

$report += " 1. Complete Meta OAuth token storage"
$report += " 2. Fetch IG accounts automatically"
$report += " 3. Dashboard connection status"
$report += " 4. Reel publishing service"
$report += " 5. Scheduler automation"
$report += " 6. SaaS multi-tenant logic"

$report += ""

$report += "====================================================="
$report += " END OF REPORT"
$report += "====================================================="

# =============================
# SAVE FILE
# =============================

$report | Out-File $reportFile -Encoding UTF8

Write-Host ""
Write-Host "✅ Reporte generado:"
Write-Host $reportFile
Write-Host ""
Write-Host "📄 Listo para revisión por programador senior."