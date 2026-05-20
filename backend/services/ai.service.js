exports.ask=(q)=>{

q=q.toLowerCase()

if(q.includes("idea"))
return ["Reel mostrando uso real","Antes vs Después","Video estilo restaurante"]

if(q.includes("error"))
return ["Revisa .env","Verifica webhook","Servidor activo"]

return ["Publica contenido visual diario"]
}
