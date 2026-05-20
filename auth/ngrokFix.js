const axios=require("axios");
const fs=require("fs");

module.exports=async()=>{

 try{

  const res=await axios.get("http://127.0.0.1:4040/api/tunnels");
  const url=res.data.tunnels.find(t=>t.proto==="https").public_url;

  let env=fs.readFileSync(".env","utf8");

  env=env.replace(/BASE_URL=.*/g,`BASE_URL=${url}`);
  env=env.replace(/REDIRECT_URI=.*/g,`REDIRECT_URI=${url}/auth/callback`);

  fs.writeFileSync(".env",env);

  console.log("🌍 NGROK AUTO UPDATE:",url);

 }catch{
  console.log("⚠️ NGROK NO ACTIVO");
 }

};
