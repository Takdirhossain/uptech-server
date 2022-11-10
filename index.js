const express = require("express")
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eurlfla.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)
async function run() {
    try {
        const addservice = client.db('uptech').collection('service')
        const addreview = client.db('uptech').collection('review')
        app.post('/', async (req, res) => {
            const service = req.body
            const result = await addservice.insertOne(service)
            res.send(result)
        })
        app.get('/', async (req, res) => {
            const query = {}
            const cursor = addservice.find(query).limit(3)
            const order = await cursor.toArray()
            res.send(order)
        })

        app.post('/review', async (req, res) => {
            const service = req.body
            const result = await addreview.insertOne(service)
            res.send(result)

        })
        app.get('/review', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { email: req.query?.email }
            }
            const cursor = addreview.find(query).sort({time: -1})
            const review = await cursor.toArray()
            res.send(review)
        })


        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id 
            const query = {_id: ObjectId(id)}
            const result = await addreview.deleteOne(query)
            res.send(result)
            console.log(result)
        })
        app.get('/review/:id', async (req,  res) => {
            const id = req.params.id 
            const query = {_id: ObjectId(id)}
            const result = await addreview.findOne(query)
            res.send(result)
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = addservice.find(query)
            const order = await cursor.toArray()
            res.send(order)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const services = await addservice.findOne(query)
            res.send(services)
        })
        app.put('/review/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const data=req.body;
            const update={
                $set:{
                    review:data.review
                }
            }
            const result = await addreview.updateMany(query,update);
            res.send(result);
        })
    }
    finally {

    }

}
run().catch(error => console.error(error))



app.listen(port, () => {
    console.log(`server is runing on ${port}`)
})