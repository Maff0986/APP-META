const express = require("express");
const axios = require("axios");

const router = express.Router();

/* ======================
   STEP 1 LOGIN META
====================== */

router.get("/login",(req,res)=>{

  const url =
    "https://www.facebook.com/v19.0/dialog/oauth"+
    `?client_id=${process.env.META_APP_ID}`+
    `&redirect_uri=${process.env.META_REDIRECT_URI}`+
    "&scope=pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish"+
    "&response_type=code";

  console.log("🚀 META LOGIN REDIRECT");

  res.redirect(url);
});


/* ======================
   STEP 2 CALLBACK
====================== */

router.get("/callback", async (req,res)=>{

  try{

    const { code } = req.query;

    if(!code){
      return res.send("❌ No META code");
    }

    // intercambiar code por token
    const tokenRes = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params:{
          client_id:process.env.META_APP_ID,
          client_secret:process.env.META_APP_SECRET,
          redirect_uri:process.env.META_REDIRECT_URI,
          code
        }
      }
    );

    const access_token = tokenRes.data.access_token;

    console.log("✅ META TOKEN:",access_token);

    res.send(`
      <h1>✅ META CONECTADO</h1>
      <p>Facebook & Instagram listos</p>
    `);

  }catch(err){

    console.error(err.response?.data || err.message);

    res.send("❌ Error META OAuth");

  }

});

module.exports = router;