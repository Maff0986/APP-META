const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const APP_ID = process.env.META_APP_ID;
const APP_SECRET = process.env.META_APP_SECRET;
const BASE_URL = process.env.BASE_URL;

router.get("/login",(req,res)=>{

 const redirectURI = encodeURIComponent(`${BASE_URL}/auth/callback`);

 const scope = [
  "public_profile",
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
  "instagram_content_publish"
 ].join(",");

 const url =
 `https://www.facebook.com/v19.0/dialog/oauth`+
 `?client_id=${APP_ID}`+
 `&redirect_uri=${redirectURI}`+
 `&scope=${scope}`+
 `&response_type=code`;

 console.log("OAuth URL:",url);

 res.redirect(url);

});


router.get("/callback",async(req,res)=>{

 const code=req.query.code;

 if(!code){
  return res.send("Login cancelado");
 }

 try{

  const tokenURL=`https://graph.facebook.com/v19.0/oauth/access_token`;

  const response=await axios.get(tokenURL,{
   params:{
    client_id:APP_ID,
    client_secret:APP_SECRET,
    redirect_uri:`${BASE_URL}/auth/callback`,
    code:code
   }
  });

  const token=response.data.access_token;

  console.log("ACCESS TOKEN:",token);

  res.send(`
  <h2>Meta conectado correctamente</h2>
  <p>Access Token:</p>
  <textarea style="width:600px;height:120px">${token}</textarea>
  `);

 }catch(err){

  console.error(err.response?.data || err.message);

  res.send("Error obteniendo access token");

 }

});

module.exports=router;
