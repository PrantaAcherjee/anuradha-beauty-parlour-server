const express=require('express');
const { MongoClient } = require('mongodb');
const app=express();
const port=process.env.PORT||5000;
const cors=require('cors');
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId;
 
// middle ware
app.use(cors())
app.use(express.json());
 
// connect to Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rrj86.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);
 
async function run (){
try{
await client.connect();
console.log('database connected successfully');

const database=client.db('jerinsParlour');
const servicesCollcetion=database.collection('services');
const reviewsCollection=database.collection('reviews'); 

 // post services api
app.post ('/services',async(req,res)=>{
const services=req.body;
const result=await servicesCollcetion.insertOne(services);
res.json(result);    
})

// get services api
app.get('/services',async(req,res)=>{
const cursor=servicesCollcetion.find({})
const services=await cursor.toArray();
res.json(services);
})

// post reviews api
app.post('/reviews',async(req,res)=>{
const reviews=req.body;
const result=await reviewsCollection.insertOne(reviews);
res.json(result);
})

// get reviews api 
app.get('/reviews',async(req,res)=>{
const cursor= reviewsCollection.find({});
const reviews= await cursor.toArray();
res.json(reviews);
})

}
finally{
 
    //await client.close();  
}
 
}
 
run().catch(console.dir); 
 
app.get('/',(req,res)=>{
    res.send("Hello Bangladesh")
});
app.listen(port,()=>{
    console.log('server is okay',port)
});
