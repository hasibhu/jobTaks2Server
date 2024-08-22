const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5001;

// 
// const corsOptions = {
//     origin: ['http://localhost:5173', 'http://localhost:5174', 'https://jobtask2-49c6e.web.app' ],
//     credentials: true,
//     optionSuccessStatus: 200,
// };

const app = express();
app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qoryues.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


const dbConnect = async () => {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
};
dbConnect();

// data collections 
const productCollection = client.db("jobTask2").collection("products");


app.get("/products", async (req, res) => {
  try {
    const pages = parseInt(req.query.pages);
    const size = parseInt(req.query.size);
    const { sortPrice, sortDate } = req.query;

    const query = {};
    const option = {
      sort: {
        newPrice: sortPrice === "asc" ? 1 : -1,
        date: sortDate === "asc" ? 1 : -1,
      },
    };

    const productCount = await productCollection.estimatedDocumentCount();

    const data = await productCollection
      .find(query, option)
      .skip(pages * size)
      .limit(size)
      .toArray();
    res.status(200).send({ allProduct: data, allProductLength: productCount });
  } catch (error) {
    res.status(404).send(error.message);
  }
});


app.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    res.status(404).send({ message: "Search Query not Required" });
  }

  try {
    const filter = {
      title: { $regex: query, $options: "i" },
    };
    const searchingData = await productCollection.find(filter).toArray();

    res.status(200).send(searchingData);
  } catch (error) {
    res.status(404).send(error.message);
  }
});



app.get("/search-category", async (req, res) => {

  try {
     const { category, min, max, color, brand } = req.query;

  const query = {
    category: { $regex: category, $options: "i" }, // Case-insensitive
    newPrice: { $gt: parseInt(min), $lt: parseInt(max) },
    color: {$regex: color},
    company: {$regex: brand}
  };

  const data = await productCollection.find(query).toArray();
  res.status(200).send(data);

  } catch (error) {
    res.send(error.message)
  }
});

app.get('/details/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const product = await productCollection.findOne(query)
  res.send(product)
})

app.get('/', async (req, res) =>{

res.send('Job task 2:  server')

});

app.listen(port, ()=>{

console.log('Job Task 2 server is running on:', port)

});