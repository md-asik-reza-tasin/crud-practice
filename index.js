const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(express.json());
app.use(cors());

//MONGOD USER AND PASS

// tasinpronoy26
// dQeqVTmyHCwSEOTZ

const uri =
  "mongodb+srv://tasinpronoy26:dQeqVTmyHCwSEOTZ@cluster0.ngjfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //CREATE

    const dataBase = client.db("insertDB");
    const userInfo = dataBase.collection("userInfo");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userInfo.insertOne(user);
      res.send(result);
      console.log(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = await userInfo.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const r = req.params.id;
      console.log(r);
      const query = { _id: new ObjectId(r) };
      const result = await userInfo.deleteOne(query);
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const r = req.params.id;
      const query = { _id: new ObjectId(r) };
      const result = await userInfo.findOne(query);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const r = req.params.id;
      const b = req.body;
      // console.log(r);

      const filter = { _id: new ObjectId(r) };
      const option = { upsert: true };

      const updatedData = {
        $set: {
          name: b.name,
          age: b.age,
        },
      };

      const result = await userInfo.updateOne(filter, updatedData, option);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.log);

app.get("/", (req, res) => {
  res.send("YES");
});

app.listen(port, () => {
  console.log(`SERVER IS RUNNING ${port}`);
});
