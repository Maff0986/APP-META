const express = require("express");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const { loginUrl } = require("../auth/metaAuth");

const router = express.Router();

router.get("/login",(req,res)=>{
  res.redirect(loginUrl());
});

router.get("/callback", async (req,res)=>{
  try{
    const code = req.query.code;

    const token = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params:{
          client_id:process.env.META_APP_ID,
          client_secret:process.env.META_APP_SECRET,
          redirect_uri:process.env.REDIRECT_URI,
          code
        }
      }
    );

    const accessToken = token.data.access_token;

    let env = fs.readFileSync(".env","utf8");
    env = env.replace(/USER_ACCESS_TOKEN=.*/g,`USER_ACCESS_TOKEN=${accessToken}`);
    fs.writeFileSync(".env",env);

    res.send("✅ LOGIN META COMPLETADO");

  }catch(e){
    console.error(e.response?.data || e);
    res.send("❌ ERROR META LOGIN");
  }
});

module.exports = router;
