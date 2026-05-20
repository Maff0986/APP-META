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
