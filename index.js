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

    app.get("/latest-books", async (req, res) => {
      const result = await bookCollection
        .find()
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bookCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/add-book", async (req, res) => {
      const book = req.body;
      const result = await bookCollection.insertOne(book);
      res.send(result);
    });

    app.get("/my-books/:email", async (req, res) => {
      const email = req.params.email;
      const result = await bookCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    app.delete("/delete-book/:id", async (req, res) => {
      const result = await bookCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });



    app.put("/update-book/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBook = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedBook };
      const result = await bookCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    
    app.patch("/add-comment/:id", async (req, res) => {
      const id = req.params.id;
      const comment = req.body;
      const result = await bookCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { comments: comment } },
      );
      res.send(result);
    });


    console.log("Connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("The Book Haven Server is running"));
app.listen(port, () => console.log(`Server running on port ${port}`));
