import express from "express";

const router = express.Router();

const VERIFY_TOKEN="shopinista_verify";

router.get("/",(req,res)=>{
  const mode=req.query["hub.mode"];
  const token=req.query["hub.verify_token"];
  const challenge=req.query["hub.challenge"];

  if(mode && token===VERIFY_TOKEN){
    console.log("✅ Webhook verificado");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

router.post("/",(req,res)=>{
  console.log("📩 Evento recibido:",req.body);
  res.sendStatus(200);
});

export default router;
