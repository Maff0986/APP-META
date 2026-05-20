const axios=require("axios");

exports.sendMessage=async(psid,text)=>{
await axios.post(
"https://graph.facebook.com/v19.0/me/messages",
{
recipient:{id:psid},
message:{text:text}
},
{
params:{access_token:process.env.PAGE_ACCESS_TOKEN}
});
};
