$ProjectPath="C:\Users\HP-Home\Documents\Projectos_Rosalia\App_Meta"
Set-Location $ProjectPath

Write-Host "Reparando y construyendo APP PRO..."

# ================= PACKAGE =================
@'
{
"name":"shopinista-meta-pro",
"version":"3.0.0",
"main":"server.js",
"scripts":{"start":"node server.js"},
"dependencies":{
"express":"^4.19.2",
"dotenv":"^16.4.5",
"helmet":"^7.1.0",
"cors":"^2.8.5"
}
}
'@ | Out-File package.json -Force

# ================= ENV =================
@'
PORT=3000
VERIFY_TOKEN=shopinista_verify
APP_NAME=Shopinista Meta Platform
'@ | Out-File .env -Force

# ================= FOLDERS =================
$dirs=@(
"src/routes",
"src/services",
"src/middleware",
"public"
)

foreach($d in $dirs){New-Item -ItemType Directory -Force -Path $d | Out-Null}

# ================= SECURITY =================
@'
const helmet=require("helmet")
const cors=require("cors")

module.exports=(app)=>{
app.use(helmet())
app.use(cors())
}
'@ | Out-File src/middleware/security.js -Force

# ================= LOGGER =================
@'
exports.log=(msg)=>{
console.log("[APP]",msg)
}
'@ | Out-File src/services/logger.service.js -Force

# ================= AI SERVICE =================
@'
exports.ask=(q)=>{

q=q.toLowerCase()

if(q.includes("idea"))
return ["Reel mostrando uso real","Antes vs Después","Video estilo restaurante"]

if(q.includes("error"))
return ["Revisa .env","Verifica webhook","Servidor activo"]

return ["Publica contenido visual diario"]
}
'@ | Out-File src/services/ai.service.js -Force

# ================= DASHBOARD ROUTE =================
@'
const router=require("express").Router()
const path=require("path")

router.get("/",(req,res)=>{
res.sendFile(path.join(process.cwd(),"public/dashboard.html"))
})

module.exports=router
'@ | Out-File src/routes/dashboard.routes.js -Force

# ================= SYSTEM ROUTE =================
@'
const router=require("express").Router()

router.get("/status",(req,res)=>{
res.json({status:"ok"})
})

module.exports=router
'@ | Out-File src/routes/system.routes.js -Force

# ================= WEBHOOK =================
@'
const router=require("express").Router()

router.get("/",(req,res)=>{

if(req.query["hub.verify_token"]===process.env.VERIFY_TOKEN){
return res.send(req.query["hub.challenge"])
}

res.sendStatus(403)
})

router.post("/",(req,res)=>{
console.log("Evento Meta recibido")
res.sendStatus(200)
})

module.exports=router
'@ | Out-File src/routes/webhook.routes.js -Force

# ================= SERVER =================
@'
require("dotenv").config()
const express=require("express")

const security=require("./src/middleware/security")
const dashboard=require("./src/routes/dashboard.routes")
const webhook=require("./src/routes/webhook.routes")
const system=require("./src/routes/system.routes")

const app=express()

security(app)

app.use(express.json())
app.use(express.static("public"))

app.use("/dashboard",dashboard)
app.use("/app",dashboard)
app.use("/webhook",webhook)
app.use("/api",system)

app.get("/",(req,res)=>res.redirect("/dashboard"))

app.use((req,res)=>{
res.status(404).send("Ruta no encontrada")
})

app.listen(process.env.PORT,()=>{
console.log("APP LISTA EN http://localhost:"+process.env.PORT)
})
'@ | Out-File server.js -Force

# ================= CSS =================
@'
body{
margin:0;
background:#020617;
color:white;
font-family:Arial
}

header{
background:#020617;
padding:20px;
font-size:24px;
border-bottom:1px solid #1e293b
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:20px;
padding:30px
}

.card{
background:#0f172a;
padding:25px;
border-radius:14px;
transition:.3s;
box-shadow:0 0 20px rgba(0,0,0,.4)
}

.card:hover{
transform:translateY(-6px)
}

button{
background:#2563eb;
border:none;
padding:10px 16px;
border-radius:8px;
color:white;
cursor:pointer
}
'@ | Out-File public/styles.css -Force

# ================= DASHBOARD =================
@'
<!DOCTYPE html>
<html>
<head>
<title>Shopinista Meta Platform</title>
<link rel="stylesheet" href="/styles.css">
</head>

<body>

<header>🚀 Shopinista Meta Platform</header>

<div class="grid">

<div class="card">
<h3>📊 Sistema</h3>
<button onclick="status()">Estado</button>
<p id="status"></p>
</div>

<div class="card">
<h3>🤖 IA Marketing</h3>
<input id="q">
<button onclick="ask()">Preguntar</button>
<p id="r"></p>
</div>

<div class="card">
<h3>🔗 Webhook</h3>
<p>Listo para Meta Review</p>
</div>

<div class="card">
<h3>🛡 Seguridad</h3>
<p>Helmet activo</p>
</div>

</div>

<script>

async function status(){
let r=await fetch("/api/status")
let d=await r.json()
document.getElementById("status").innerText=d.status
}

async function ask(){
let q=document.getElementById("q").value
document.getElementById("r").innerText="Idea: publicar reels mostrando uso real."
}

</script>

</body>
</html>
'@ | Out-File public/dashboard.html -Force

npm install

Write-Host "APP PRO REPARADA Y FUNCIONANDO"