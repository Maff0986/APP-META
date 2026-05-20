# ============================================================
#  SCRIPT COMPLETO PARA VALIDAR META WEBHOOK EN LOCAL
#  Marco + Copilot
# ============================================================

Write-Host "`n🚀 Iniciando entorno local para Meta Commerce..." -ForegroundColor Cyan

# -------------------------------
# CONFIGURAR NGROK TOKEN
# -------------------------------
$NGROK_TOKEN = "31R11tdr23zraXxkWUqaR9H5bUx_27sntKmrhtEi2NsnLtv8v"

Write-Host "🔑 Configurando ngrok authtoken..." -ForegroundColor Yellow
ngrok config add-authtoken $NGROK_TOKEN

# -------------------------------
# RUTA DEL PROYECTO
# -------------------------------
$ROOT = "C:\Users\HP-Home\Documents\Projectos_Rosalia\App_Meta"
$FUNCTIONS = Join-Path $ROOT "functions"
$META = Join-Path $FUNCTIONS "meta"

# -------------------------------
# GENERAR WEBHOOK AUTOMÁTICAMENTE
# -------------------------------
Write-Host "⚙️ Generando webhook y sync..." -ForegroundColor Yellow

# Crear carpeta meta si no existe
if (!(Test-Path $META)) { New-Item -ItemType Directory -Path $META | Out-Null }

# webhook.js
@'
exports.metaWebhook = (req, res) => {
  const VERIFY_TOKEN = "shopinista_token";

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✔ Meta Webhook VALIDADO correctamente.");
      return res.status(200).send(challenge);
    } else {
      console.log("❌ Token inválido recibido.");
      return res.status(403).send("Invalid token");
    }
  }

  console.log("📩 Webhook recibido:", req.body);
  res.status(200).send("OK");
};
'@ | Set-Content "$META\webhook.js"

# sync.js
@'
exports.syncCreate = async (data) => {
  console.log("Producto creado:", data);
};

exports.syncUpdate = async (data) => {
  console.log("Producto actualizado:", data);
};

exports.syncDelete = async (data) => {
  console.log("Producto eliminado:", data);
};
'@ | Set-Content "$META\sync.js"

# index.js
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
'@ | Set-Content "$FUNCTIONS\index.js"

Write-Host "✔ Webhook y Functions generados." -ForegroundColor Green

# -------------------------------
# INICIAR FIREBASE EMULATORS
# -------------------------------
Write-Host "`n🔥 Iniciando Firebase Emulators..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "firebase emulators:start" -WindowStyle Minimized

Start-Sleep -Seconds 5

# -------------------------------
# INICIAR NGROK
# -------------------------------
Write-Host "🌐 Iniciando túnel ngrok..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "ngrok http 5001" -WindowStyle Minimized

Start-Sleep -Seconds 5

# -------------------------------
# OBTENER URL PÚBLICA DE NGROK
# -------------------------------
Write-Host "🔍 Obteniendo URL pública de ngrok..." -ForegroundColor Yellow

$NGROK_API = "http://127.0.0.1:4040/api/tunnels"
$response = Invoke-RestMethod -Uri $NGROK_API
$public_url = $response.tunnels.public_url | Select-Object -First 1

Write-Host "`n🌍 URL PÚBLICA PARA META WEBHOOK:" -ForegroundColor Green
Write-Host "👉 $public_url/appmeta-731da/us-central1/metaWebhook" -ForegroundColor Cyan

Write-Host "`n📌 VERIFY TOKEN: shopinista_token" -ForegroundColor Yellow

Write-Host "`n💡 Copia esa URL en Meta Developers → Webhooks → Callback URL" -ForegroundColor Green
Write-Host "   Y usa el verify token: shopinista_token" -ForegroundColor Green

Write-Host "`n🎉 Todo listo para validar tu app en Meta." -ForegroundColor Magenta
