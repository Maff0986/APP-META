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
