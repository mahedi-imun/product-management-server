
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const query = require('express/lib/middleware/query');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config();

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txpss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('productsList').collection('products');
        // get  all  product
        app.get('/products', async (req, res) => {
            const q = req.query
            const cursor = productCollection.find(q);
            const product = await cursor.toArray();
            res.send(product)
        })

        // create product 
        app.post('/product', async (req, res) => {
            const doc = req.body;
            const result = await productCollection.insertOne(doc);
            res.send(result)
        })
        //delete product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })
        // update product 
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name:updateProduct.name,
                    category:updateProduct.category,
                    price:updateProduct.price
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running genius server')

})









app.listen(port, () => {
    console.log('listen port', port);
})