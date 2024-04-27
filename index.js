const express = require("express");
const app = express();
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.POSTERO_USER}:${process.env.POSTERO_PASS}@cluster0.5kgqkgx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("itemsDB");
    const itemCollection = database.collection("item");
    const subItemCollection = database.collection("subitems");

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get("/items", async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    });

    app.get("/myProduct/:email", async (req, res) => {
      const result = await itemCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

app.get("/subcategory/:subcategory", async(req, res)=>{
  const result = await  itemCollection.find({subcategory:req.params.subcategory}).toArray();
  res.send(result)
})

    app.get("/subitems", async(req, res)=>{
      const cursor = subItemCollection.find();
      const result = await cursor.toArray()
      res.send(result)

    })



    app.post("/items", async (req, res) => {
      const item = req.body;
      const result = await itemCollection.insertOne(item);
      res.send(result);
    });

    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;
      const items = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = {
        $set: {
          photo: items.photo,
          item: items.item,
          subcategory: items.subcategory,
          description: items.description,
          price: items.price,
          rating: items.rating,
          Customization: items.Customization,
          time: items.time,
          Status: items.Status

        },
      };
      const result = await itemCollection.updateOne(filter, updateItem, options)
      res.send(result)

    });

    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello postero");
});

app.listen(port, () => {
  console.log(`Postero running on port ${port}`);
});
