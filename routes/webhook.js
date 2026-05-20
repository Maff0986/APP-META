const express=require('express');
const router=express.Router();
const logger=require('../utils/logger');

router.get('/meta',(req,res)=>{
 const VERIFY_TOKEN=process.env.META_VERIFY_TOKEN;

 const mode=req.query['hub.mode'];
 const token=req.query['hub.verify_token'];
 const challenge=req.query['hub.challenge'];

 if(mode && token===VERIFY_TOKEN){
   logger.info('Webhook verified');
   res.status(200).send(challenge);
 }else{
   logger.error('Webhook verification failed');
   res.sendStatus(403);
 }
});

router.post('/meta',(req,res)=>{
 logger.info('Webhook event received');
 res.sendStatus(200);
});

module.exports=router;
