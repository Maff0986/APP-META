const express = require("express");
const router = express.Router();
const { getAccessToken } = require("../services/tiendanube");


// STEP 1 — LOGIN
router.get("/login",(req,res)=>{

  const redirect = `https://www.tiendanube.com/apps/authorize?client_id=${process.env.TN_CLIENT_ID}`;

  console.log("🚀 Redirect OAuth:",redirect);

  res.redirect(redirect);
});


// STEP 2 — CALLBACK (TOKEN REAL)
router.get("/", async (req,res)=>{

  try{

    const { code } = req.query;

    if(!code){
      return res.send("❌ No OAuth code received");
    }

    console.log("✅ OAuth CODE:",code);

    const tokenData = await getAccessToken(code);

    console.log("🔥 ACCESS TOKEN:",tokenData.access_token);

    res.send(`
      <h1>✅ TIENDA CONECTADA</h1>
      <p>Token recibido correctamente.</p>
    `);

  }catch(err){
    console.error(err.response?.data || err.message);
    res.status(500).send("OAuth Error");
  }

});

module.exports = router;