const router=require("express").Router()
const path=require("path")

router.get("/",(req,res)=>{
res.sendFile(path.join(process.cwd(),"public/dashboard.html"))
})

module.exports=router
