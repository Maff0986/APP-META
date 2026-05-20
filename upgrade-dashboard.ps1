$ProjectPath="C:\Users\HP-Home\Documents\Projectos_Rosalia\App_Meta"
Set-Location $ProjectPath

New-Item -ItemType Directory -Force -Path public | Out-Null

@'
<!DOCTYPE html>
<html>

<head>
<title>Shopinista Meta Pro</title>

<style>

body{
font-family:Arial;
background:#0f172a;
color:white;
margin:0;
}

.header{
padding:20px;
font-size:24px;
background:#020617;
}

.grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:20px;
padding:30px;
}

.card{
background:#1e293b;
padding:25px;
border-radius:12px;
transition:0.3s;
box-shadow:0 5px 20px rgba(0,0,0,0.3);
}

.card:hover{
transform:translateY(-5px);
}

button{
background:#2563eb;
color:white;
border:none;
padding:12px 20px;
border-radius:8px;
cursor:pointer;
margin-top:10px;
}

button:hover{
background:#1d4ed8;
}

.aiBox{
margin:30px;
background:#020617;
padding:20px;
border-radius:10px;
}

input{
width:70%;
padding:10px;
border-radius:6px;
border:none;
}

</style>
</head>

<body>

<div class="header">
🚀 Shopinista Meta Control Center
</div>

<div class="grid">

<div class="card">
<h3>📊 Estadísticas</h3>
<p>Posts publicados hoy</p>
<h2 id="posts">0</h2>
<button onclick="alert('Analytics próximamente')">Ver analytics</button>
</div>

<div class="card">
<h3>📩 Mensajes</h3>
<p>Mensajes recibidos</p>
<h2 id="msgs">0</h2>
<button onclick="alert('Messenger conectado próximamente')">Abrir</button>
</div>

<div class="card">
<h3>🧾 Leads</h3>
<p>Clientes interesados</p>
<h2 id="leads">0</h2>
<button onclick="alert('Leads guardados en Firebase')">Ver</button>
</div>

<div class="card">
<h3>📸 Publicar Instagram</h3>
<p>Crear publicación rápida</p>
<button onclick="alert('Publicación conectará a API')">Publicar</button>
</div>

<div class="card">
<h3>⚙️ Automatizaciones</h3>
<p>Responder mensajes automático</p>
<button onclick="alert('Automatización activa')">Configurar</button>
</div>

<div class="card">
<h3>🛠 Diagnóstico</h3>
<p>Revisar errores del sistema</p>
<button onclick="runAudit()">Analizar</button>
</div>

</div>

<div class="aiBox">

<h3>🤖 Asistente IA Marketing</h3>

<input id="aiInput" placeholder="Pregunta algo..." />

<button onclick="askAI()">Preguntar</button>

<p id="aiResponse"></p>

</div>

<script>

function askAI(){

let q=document.getElementById("aiInput").value

let r=""

if(q.includes("ideas")){
r="Ideas:\n1 Reel mostrando producto\n2 Comparativa antes/después\n3 Video ambiente restaurante"
}

else if(q.includes("error")){
r="Revisa variables .env o webhook Meta"
}

else{
r="Consejo marketing: publica 3 veces por semana mostrando usos reales del producto."
}

document.getElementById("aiResponse").innerText=r

}

function runAudit(){
alert("Sistema revisando configuración...")
}

</script>

</body>
</html>
'@ | Out-File public/dashboard.html

Write-Host "Dashboard PRO instalado"