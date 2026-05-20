import express from "express"

const router=express.Router()

router.post("/ai",(req,res)=>{

const ideas=[
"Publica reels mostrando transformación del hogar",
"Usa iluminación cálida para muebles premium",
"Crea reels POV cliente entrando a casa nueva",
"Usa CTA: transforma tu hogar hoy"
]

res.json({
answer:ideas[Math.floor(Math.random()*ideas.length)]
})

})

export default router
