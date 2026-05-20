const axios=require("axios");
const fs=require("fs");

setInterval(async()=>{

 try{

 const res=await axios.get("http://127.0.0.1:4040/api/tunnels");

 const url=res.data.tunnels.find(t=>t.proto==="https").public_url;

 const env=`META_APP_ID=905650291630498
BASE_URL=${url}
PORT=3000`;

 fs.writeFileSync("./backend/.env",env);

 console.log("🔄 NGROK URL ACTUALIZADA:",url);

 }catch(e){}

},15000);
