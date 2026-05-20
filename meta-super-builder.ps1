# ==========================================
# META SUPER BUILDER - SHOPINISTA META
# FULL FREE AUTOMATION PLATFORM
# ==========================================

$ProjectPath="C:\Users\HP-Home\Documents\Projectos_Rosalia\App_Meta"
Set-Location $ProjectPath

Write-Host "🚀 CREANDO META SUPER APP..." -ForegroundColor Cyan

# ---------- PACKAGE ----------
@'
{
"name":"shopinista-meta-core",
"version":"1.0.0",
"main":"server.js",
"scripts":{"start":"node server.js"},
"dependencies":{
"express":"^4.19.2",
"dotenv":"^16.4.5",
"axios":"^1.7.2",
"firebase-admin":"^12.1.0",
"body-parser":"^1.20.2"
}
}
'@ | Out-File package.json

# ---------- ENV ----------
@'
PORT=3000
VERIFY_TOKEN=shopinista_verify
META_APP_ID=
META_APP_SECRET=
PAGE_ACCESS_TOKEN=
FB_CALLBACK_URL=
'@ | Out-File .env

# ---------- FOLDERS ----------
$dirs=@(
"src/routes",
"src/services",
"src/config",
"src/automation",
"public"
)

foreach($d in $dirs){New-Item -ItemType Directory -Force -Path $d | Out-Null}

# ---------- SERVER ----------
@'
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");

const webhook=require("./src/routes/webhook");
const dashboard=require("./src/routes/dashboard");

const app=express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/webhook",webhook);
app.use("/dashboard",dashboard);

app.get("/",(req,res)=>res.send("Meta Core Running ✅"));

app.listen(process.env.PORT,()=>{
console.log("Servidor activo "+process.env.PORT);
});
'@ | Out-File server.js

# ---------- WEBHOOK ----------
@'
const router=require("express").Router();
const autoReply=require("../automation/autoReply");

router.get("/",(req,res)=>{
const VERIFY_TOKEN=process.env.VERIFY_TOKEN;

if(req.query["hub.verify_token"]===VERIFY_TOKEN){
return res.send(req.query["hub.challenge"]);
}
res.sendStatus(403);
});

router.post("/",async(req,res)=>{
console.log("Evento recibido");
await autoReply.handle(req.body);
res.sendStatus(200);
});

module.exports=router;
'@ | Out-File src/routes/webhook.js

# ---------- AUTO REPLY ----------
@'
exports.handle=async(data)=>{

console.log("Procesando evento...");

if(data.entry){
console.log("Mensaje detectado");

}
};
'@ | Out-File src/automation/autoReply.js

# ---------- META SERVICE ----------
@'
const axios=require("axios");

exports.sendMessage=async(psid,text)=>{
await axios.post(
"https://graph.facebook.com/v19.0/me/messages",
{
recipient:{id:psid},
message:{text:text}
},
{
params:{access_token:process.env.PAGE_ACCESS_TOKEN}
});
};
'@ | Out-File src/services/meta.service.js

# ---------- FIREBASE SERVICE ----------
@'
const admin=require("firebase-admin");

try{
admin.initializeApp();
}catch(e){}

const db=admin.firestore();

exports.saveLead=async(data)=>{
await db.collection("leads").add(data);
};
'@ | Out-File src/services/firebase.service.js

# ---------- DASHBOARD ROUTE ----------
@'
const router=require("express").Router();

router.get("/",(req,res)=>{
res.sendFile(process.cwd()+"/public/dashboard.html");
});

module.exports=router;
'@ | Out-File src/routes/dashboard.js

# ---------- DASHBOARD UI ----------
@'
<html>
<head>
<title>Shopinista Meta Panel</title>
</head>

<body style="font-family:Arial">

<h1>🚀 Shopinista Meta Control Panel</h1>

<button onclick="alert('Publicar Post (próximo)')">
Publicar Instagram
</button>

<br><br>

<button onclick="alert('Leer mensajes')">
Ver Mensajes
</button>

<br><br>

<button onclick="alert('Leads guardados')">
Ver Leads
</button>

</body>
</html>
'@ | Out-File public/dashboard.html

# ---------- SECURITY ----------
@'
node_modules
.env
'@ | Out-File .gitignore

Write-Host "📦 Instalando dependencias..."
npm install

Write-Host ""
Write-Host "✅ META SUPER APP LISTA" -ForegroundColor Green
Write-Host ""
Write-Host "Ejecuta:"
Write-Host "npm start"
Write-Host "ngrok http 3000"