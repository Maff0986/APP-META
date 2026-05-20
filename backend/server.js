require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

/* =============================
   AUTO LOAD ROUTES (SAFE)
============================= */

const routesPath = path.join(__dirname,"routes");

if(fs.existsSync(routesPath)){

  fs.readdirSync(routesPath).forEach(file=>{

    if(file.endsWith(".js")){

      try{

        const route = require(`./routes/${file}`);
        const routeName = file.replace(".js","");

        app.use(`/${routeName}`,route);

        console.log("✅ Route loaded →",routeName);

      }catch(e){
        console.log("⚠️ Route error:",file,e.message);
      }

    }

  });

}

/* =============================
   HEALTH
============================= */

app.get("/health",(req,res)=>{
  res.send("SHOPINISTA META RUNNING ✅");
});

/* =============================
   FRONTEND
============================= */

app.use(express.static(path.join(__dirname,"frontend")));

app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"frontend/index.html"));
});

/* =============================
   SMART PORT START
============================= */

const startServer = (port) => {

  const server = app.listen(port,()=>{
    console.log(`🚀 APP META → http://localhost:${port}`);
  });

  server.on("error",(err)=>{
    if(err.code==="EADDRINUSE"){
      console.log(`⚠️ Puerto ${port} ocupado → ${port+1}`);
      startServer(port+1);
    }else{
      console.error(err);
    }
  });

};

startServer(process.env.PORT || 3000);