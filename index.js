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
const usersCollection=database.collection('users');

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

// save users to database
app.post('/users',async(req,res)=>{
const user=req.body;
const result=await usersCollection.insertOne(user);
res.json(result);
})
// if user in there, we will upsert
app.put('/users',async(req,res)=>{
const user=req.body;
const filter={email:user.email}
const options={upsert:true}
const updateDoc={$set:user}
const result=await usersCollection.updateOne(filter,updateDoc,options)
res.json(result);
})
// make an admin api
app.put('/users/admin',async(req,res)=>{
const user=req.body;
const filter={email:user.email}
const updateDoc={$set:{role:'admin'}}
const result=await usersCollection.updateOne(filter,updateDoc)
res.json(result);
})

// check is admin ?
app.get('/users/:email',async(req,res)=>{
    const email= req.params.email;
    const query= {email:email};
    const user=await usersCollection.findOne(query);
    let isAdmin= false
    if(user?.role==='admin'){
        isAdmin=true
    }
    res.json({admin:isAdmin})
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
