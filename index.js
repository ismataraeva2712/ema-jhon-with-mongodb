const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middlware

app.use(cors())
app.use(express.json())

// connect database



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wexii.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//mongo connected  testing er por eta fele dite hoi 
// ================================================

// client.connect(err => {
//     const collection = client.db("emajhon").collection("product");
//     console.log("mongo is connected")
//     // perform actions on the collection object
//     client.close();
// });

// async diye kaj korbo-------------------------
// ======================================
async function run() {
    try {
        await client.connect()
        const productCollection = client.db('emajhon').collection('product')

        // get
        app.get('/product', async (req, res) => {
            console.log(req.query)
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {}
            const cursor = productCollection.find(query)
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray()
            }
            else {
                products = await cursor.toArray()
            }

            res.send(products)
        })
        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount()
            res.send({ count })
        })

        // post to get products by id

        app.post('/productBykeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id))
            const query = { _id: { $in: ids } }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray()
            console.log(keys)
            res.send(products)
        })
    }
    finally {

    }
}
run().catch(console.dir)











// testing

app.get('/', (req, res) => {
    res.send("jhon is running waiting for ema")
})

// app.listen

app.listen(port, () => {
    console.log("jhon is running", port)
})