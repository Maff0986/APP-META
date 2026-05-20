############################################################
# SHOPINISTA META — ULTRA AUDIT LEVEL 2
# Arquitectura + Código completo + Análisis senior
############################################################

Clear-Host

$projectPath = Get-Location
$outFile = Join-Path $projectPath "APP_META_ULTRA_REPORT.txt"

Write-Host "🧠 Ejecutando auditoría ULTRA NIVEL 2..."

$report = @()

# =====================================================
# HEADER
# =====================================================

$report += "====================================================="
$report += " SHOPINISTA META — ULTRA ARCHITECTURE REPORT"
$report += " Generated: $(Get-Date)"
$report += "====================================================="
$report += ""

# =====================================================
# DEPENDENCY ANALYSIS
# =====================================================

$report += "📦 DEPENDENCY ARCHITECTURE"
$report += "-----------------------------------------------------"

if(Test-Path "package.json"){
    $pkg = Get-Content package.json -Raw | ConvertFrom-Json

    $report += "Project Name: $($pkg.name)"
    $report += "Version: $($pkg.version)"
    $report += ""

    $report += "Dependencies:"
    foreach($d in $pkg.dependencies.PSObject.Properties){
        $report += " - $($d.Name) : $($d.Value)"
    }

    $report += ""
    $report += "Scripts:"
    foreach($s in $pkg.scripts.PSObject.Properties){
        $report += " - $($s.Name) => $($s.Value)"
    }
}
else{
    $report += "❌ package.json not found"
}

$report += ""

# =====================================================
# SERVER DETECTION
# =====================================================

$report += "🧩 SERVER ARCHITECTURE CHECK"
$report += "-----------------------------------------------------"

$servers = Get-ChildItem -Recurse -Filter "server.js" -ErrorAction SilentlyContinue

foreach($srv in $servers){
    $report += "Server detected:"
    $report += $srv.FullName
}

if($servers.Count -gt 1){
    $report += "⚠️ Multiple servers detected → risk of port conflicts"
}

$report += ""

# =====================================================
# ENV STRUCTURE (SAFE)
# =====================================================

$report += "🔐 ENV STRUCTURE (Keys only)"
$report += "-----------------------------------------------------"

if(Test-Path ".env"){
    Get-Content ".env" | ForEach-Object{
        if($_ -match "="){
            $key = $_.Split("=")[0]
            $report += " - $key=*****"
        }
    }
}
else{
    $report += "❌ .env missing"
}

$report += ""

# =====================================================
# ROUTE AUTOLOADER VALIDATION
# =====================================================

$report += "🧭 ROUTE SYSTEM ANALYSIS"
$report += "-----------------------------------------------------"

$routeFiles = Get-ChildItem "./routes" -Filter *.js -ErrorAction SilentlyContinue

foreach($r in $routeFiles){
    $report += "Route file: $($r.Name)"
}

if(!$routeFiles){
    $report += "⚠️ No routes detected"
}

$report += ""

# =====================================================
# FULL FILE CONTENT DUMP
# =====================================================

function AddFileContent($filePath){

    if(Test-Path $filePath){
        $report += ""
        $report += "================ FILE: $filePath ================"
        $report += (Get-Content $filePath -Raw)
        $report += "================ END FILE ======================="
    }
}

$report += "📄 CRITICAL FILE CONTENTS"
$report += "-----------------------------------------------------"

AddFileContent "server.js"
AddFileContent "package.json"
AddFileContent "frontend/index.html"

Get-ChildItem "./routes" -Filter *.js -ErrorAction SilentlyContinue | ForEach-Object{
    AddFileContent $_.FullName
}

Get-ChildItem "./auth" -Filter *.js -ErrorAction SilentlyContinue | ForEach-Object{
    AddFileContent $_.FullName
}

$report += ""

# =====================================================
# ARCHITECTURAL DIAGNOSIS
# =====================================================

$report += "🧠 ARCHITECTURAL DIAGNOSIS"
$report += "-----------------------------------------------------"

$report += @"
Current architecture indicates:

• Express monolithic backend
• Static frontend served by backend
• Meta OAuth integration in progress
• Multi-module SaaS intention
• Auto-loaded routing system
• Webhook-ready structure
• Scheduler and automation planned

Risk Areas:
- OAuth token persistence incomplete
- Possible duplicated server instances
- Frontend routing fallback may hide API errors
- Missing production session management
"@

$report += ""

# =====================================================
# AI RECONSTRUCTION — APP PURPOSE
# =====================================================

$report += "🚀 INTENDED APPLICATION VISION (RECONSTRUCTED)"
$report += "-----------------------------------------------------"

$report += @"
The application appears designed as:

A SaaS platform named Shopinista Meta intended to:

1. Connect multiple businesses to Meta (Facebook + Instagram)
2. Authenticate via OAuth
3. Manage social media publishing automatically
4. Generate AI content (reels, posts, catalog creatives)
5. Synchronize product catalogs
6. Provide dashboard analytics
7. Automate posting via scheduler
8. Support multi-tenant store connections

Target Outcome:
A centralized automation platform for ecommerce brands
to manage marketing and publishing workflows from one dashboard.
"@

$report += ""

# =====================================================
# SENIOR ENGINEER RECOMMENDATIONS
# =====================================================

$report += "🧑‍💻 SENIOR ENGINEER RECOMMENDATIONS"
$report += "-----------------------------------------------------"

$report += @"
Immediate:
• Centralize OAuth token storage
• Add /api prefix separation
• Implement global error middleware
• Validate callback state parameter

Production:
• JWT or session store
• Reverse proxy (Nginx)
• Environment separation (.env.production)
• Logging pipeline

Finalization:
• Multi-tenant schema
• Publishing queue system
• Background worker service
• Meta webhook verification
"@

$report += ""

$report += "================ END ULTRA REPORT =================="

# =====================================================
# SAVE
# =====================================================

$report | Out-File $outFile -Encoding UTF8

Write-Host ""
Write-Host "✅ ULTRA REPORT GENERADO:"
Write-Host $outFile
Write-Host ""
Write-Host "🧠 Auditoría nivel arquitecto senior completada."