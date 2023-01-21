const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
//connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ecmnnns.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('Vojon-Bari');
        const serviceCollection = database.collection('FoodList');
        // const myOrderCollection = database.collection('Order');
        console.log('database connected');

        // getting from database
        app.get('/foodlist', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        });
        //get single data
        app.get('/foodlist/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service)
        })
        // Load data according to user id get api
        app.get('/cart/:uid', async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid };
            const result = await myOrderCollection.find(query).toArray();
            res.json(result);
        })
        // add data to cart collection with additional info
        app.post('/order/add', async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await myOrderCollection.insertOne(order)
            res.json(result)
        })
        // Post
        app.post('/foodlist', async (req, res) => {
            const service = req.body;
            //    console.log('hitting the dating', service);
            const result = await serviceCollection.insertOne(service);
            // console.log(result);
            res.json(result)
            console.log(result);
        });

        // delete one item
        app.delete('/order/add/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myOrderCollection.deleteOne(query);
            res.json(result);
            console.log(result);
        });
    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Vojon-Bari server is running');
})

app.listen(port, () => {
    console.log("server is running", port);
})