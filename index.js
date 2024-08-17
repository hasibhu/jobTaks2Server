const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5007;

// 
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://jobtask2-49c6e.web.app' ],
    credentials: true,
    optionSuccessStatus: 200,
};

const app = express();
app.use(express.json())
app.use(cors(corsOptions))
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



app.get('/products', async(req, res) => {
    try {
        const data = parseInt(req.query.page);
      const price = req.query.price;
      const company = req.query.brand;
      const newest = req.query.new;
      const category = req.query.category;
      const search = req.query.search;
      const brandArr = brand ? brand.split(",") : [];
      const categoryArr = category ? category.split(",") : [];
      const priceRange = parseInt(req.query.range);

      let query = {};

      if (brandArr?.length > 0) {
        query.brandName = { $in: brandArr };
      }
      if (categoryArr?.length > 0) {
        query.category = { $in: categoryArr };
      }

      if (priceRange !== null) {
        query.price = { $gte: priceRange - 49, $lte: priceRange };
      }

      if (search) {
        query.productName = { $regex: search, $options: "i" };
      }
      
      // sort by price
      let sortOption = {};
      if (price === "Low_To_High") {
        sortOption.price = 1;
      } else if (price === "High_To_Low") {
        sortOption.price = -1;
      }
      if (newest) {
        sortOption.dateTime = -1;
      }

      const limit = 9;
      const skip = (page - 1) * limit;

      try {
        const count = await products.find(query).sort(sortOption).toArray();

        const allProducts = await products
          .find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .toArray();
        res.status(200).json({ allProducts, totalCount: count.length });
﻿

    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})



app.get('/', async (req, res) =>{

res.send('Job task 2:  server')

});

app.listen(port, ()=>{

console.log('Job Task 2 server is running on:', port)

});