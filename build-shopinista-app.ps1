$ProjectPath="C:\Users\HP-Home\Documents\Projectos_Rosalia\App_Meta"
Set-Location $ProjectPath

Write-Host "Construyendo Shopinista Meta App..."

# carpetas
$dirs=@(
"src/routes",
"src/services",
"src/config",
"public",
"security"
)

foreach($d in $dirs){New-Item -ItemType Directory -Force -Path $d | Out-Null}

# package
@'
{
"name":"shopinista-meta-platform",
"version":"2.0.0",
"main":"server.js",
"scripts":{"start":"node server.js"},
"dependencies":{
"express":"^4.19.2",
"dotenv":"^16.4.5",
"axios":"^1.7.2",
"body-parser":"^1.20.2"
}
}
'@ | Out-File package.json

# env
@'
PORT=3000
VERIFY_TOKEN=shopinista_verify
META_APP_ID=
META_APP_SECRET=
PAGE_ACCESS_TOKEN=
APP_DOMAIN=
'@ | Out-File .env

# servidor
@'
require("dotenv").config()
const express=require("express")
const bodyParser=require("body-parser")

const webhook=require("./src/routes/webhook")
const api=require("./src/routes/api")

const app=express()

app.use(bodyParser.json())
app.use(express.static("public"))

app.use("/webhook",webhook)
app.use("/api",api)

app.get("/",(req,res)=>res.redirect("/dashboard"))

app.listen(process.env.PORT,()=>{
console.log("App ejecutándose en puerto "+process.env.PORT)
})
'@ | Out-File server.js

# webhook
@'
const router=require("express").Router()

router.get("/",(req,res)=>{

const VERIFY_TOKEN=process.env.VERIFY_TOKEN

const mode=req.query["hub.mode"]
const token=req.query["hub.verify_token"]
const challenge=req.query["hub.challenge"]

if(mode && token===VERIFY_TOKEN){

console.log("Webhook verificado")
return res.status(200).send(challenge)

}

res.sendStatus(403)

})

router.post("/",(req,res)=>{

console.log("Evento recibido")

console.log(JSON.stringify(req.body,null,2))

res.sendStatus(200)

})

module.exports=router
'@ | Out-File src/routes/webhook.js

# api simple
@'
const router=require("express").Router()

router.get("/status",(req,res)=>{
res.json({status:"running"})
})

router.get("/ideas",(req,res)=>{

const ideas=[
"Video mostrando resistencia de mesa marmol",
"Comparativa antes/después comedor",
"Reel ambiente restaurante elegante"
]

res.json(ideas)

})

module.exports=router
'@ | Out-File src/routes/api.js

# AI simple
@'
exports.ask=function(q){

if(q.includes("marketing"))
return "Publica reels mostrando usos reales del producto."

if(q.includes("error"))
return "Revisa variables .env y webhook."

return "Publica contenido visual mostrando calidad."
}
'@ | Out-File src/services/aiService.js

# seguridad
@'
console.log("Audit seguridad iniciado")
'@ | Out-File security/audit.js

# css futurista
@'
body{
background:#0f172a;
color:white;
font-family:Arial;
margin:0
}

header{
padding:20px;
background:#020617;
font-size:24px
}

.grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:20px;
padding:30px
}

.card{
background:#1e293b;
border-radius:12px;
padding:25px;
box-shadow:0 10px 30px rgba(0,0,0,0.4);
transition:.3s
}

.card:hover{
transform:translateY(-8px)
}

button{
padding:10px 18px;
border:none;
border-radius:8px;
background:#3b82f6;
color:white;
cursor:pointer
}

.ai{
padding:30px
}

input{
padding:10px;
width:60%
}
'@ | Out-File public/styles.css

# dashboard
@'
<!DOCTYPE html>
<html>

<head>
<title>Shopinista Meta Platform</title>
<link rel="stylesheet" href="/styles.css">
</head>

<body>

<header>
🚀 Shopinista Meta Platform
</header>

<div class="grid">

<div class="card">
<h3>📊 Analytics</h3>
<p>Estadísticas de negocio</p>
<button>Ver</button>
</div>

<div class="card">
<h3>📩 Mensajes</h3>
<p>Messenger / Instagram</p>
<button>Gestionar</button>
</div>

<div class="card">
<h3>🧾 Leads</h3>
<p>Clientes interesados</p>
<button>Ver</button>
</div>

<div class="card">
<h3>📸 Publicar</h3>
<p>Publicar contenido</p>
<button>Crear post</button>
</div>

<div class="card">
<h3>🔗 API Connections</h3>
<p>Conectar Meta APIs</p>
<button>Configurar</button>
</div>

<div class="card">
<h3>⚙ Automatización</h3>
<p>Marketing automático</p>
<button>Activar</button>
</div>

</div>

<div class="ai">

<h2>🤖 Asistente IA</h2>

<input id="q">

<button onclick="ask()">Preguntar</button>

<p id="r"></p>

</div>

<script>

async function ask(){

let q=document.getElementById("q").value

let res=await fetch("/api/ideas")

let data=await res.json()

document.getElementById("r").innerText=data.join("\n")

}

</script>

</body>
</html>
'@ | Out-File public/dashboard.html

npm install

Write-Host "APP COMPLETA GENERADA"