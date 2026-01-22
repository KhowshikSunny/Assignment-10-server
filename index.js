const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xuoqyn9.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("bookDB");
    const bookCollection = db.collection("bookHaven");

    
    app.get("/books", async (req, res) => {
      const sortOrder = req.query.sort === "asc" ? 1 : -1;
      const result = await bookCollection
        .find()
        .sort({ rating: sortOrder })
        .toArray();
      res.send(result);
    });

   
   
    console.log("Connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("The Book Haven Server is running"));
app.listen(port, () => console.log(`Server running on port ${port}`));
