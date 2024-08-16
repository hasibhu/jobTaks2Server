const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5007;


const app = express();
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());



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







app.get('/', async (req, res) =>{

res.send('start server')

});

app.listen(port, ()=>{

console.log('Job Task 2 server is running on:', port)

});