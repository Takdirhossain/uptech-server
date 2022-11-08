const express = require("express")
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 5000
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eurlfla.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const addservice = client.db('uptech').collection('service')
        app.post('/', async (req, res) => {
            const service = req.body
            console.log(service)
            const result = await addservice.insertOne(service)
            res.send(result)
        })
        app.get('/', async (req, res) => {
            const query = {}
            const cursor = addservice.find(query).limit(3)
            const order = await cursor.toArray()
            res.send(order)

        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = addservice.find(query)
            const order = await cursor.toArray()
            res.send(order)

        })
        app.get('/services/:id', async(req, res ) => {
            const id = req.params.id 
            const query = {_id: ObjectId(id)}
            const services = await addservice.findOne(query)
            res.send(services)
        })

    }
    finally {

    }

}
run().catch(error => console.error(error))



app.listen(port, () => {
    console.log(`server is runing on ${port}`)
})