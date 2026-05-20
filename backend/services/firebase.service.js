const admin=require("firebase-admin");

try{
admin.initializeApp();
}catch(e){}

const db=admin.firestore();

exports.saveLead=async(data)=>{
await db.collection("leads").add(data);
};
