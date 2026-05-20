import express from "express";

const router = express.Router();

router.post("/ai",(req,res)=>{

  const ideas=[
    "Muestra antes y después del comedor",
    "Reel POV cliente entrando al hogar",
    "Usa iluminación cálida premium",
    "CTA: Transforma tu espacio hoy"
  ];

  res.json({
    answer:ideas[Math.floor(Math.random()*ideas.length)]
  });
});

export default router;
