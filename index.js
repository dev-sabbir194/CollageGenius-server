const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sebqjoa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


async function getCollegesData() {
  try {
    await client.connect();
    const db = client.db("collegegenious");
    const collection = db.collection("college");
    const collegesData = await collection.find({}).toArray();
    return collegesData;
  } catch (err) {
    console.error("Error getting colleges data:", err);
    return [];
  } finally {
    client.close();
  }
}

// all data

app.get("/college", async (req, res) => {
  try {
    const collegesData = await getCollegesData();
    res.json(collegesData);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// id data 
app.get("/college/:id", async (req, res) => {
  try {
    const collegeId = req.params.id;
    if (!collegeId) {
      return res.status(400).json({ error: "College ID is required." });
    }

    await client.connect();
    const db = client.db("collegegenious");
    const collection = db.collection("college");
    const collegeData = await collection.findOne({ _id: collegeId });

    if (!collegeData) {
      return res.status(404).json({ error: "College not found." });
    }

    res.json(collegeData);
  } catch (err) {
    console.error("Error getting college data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.close();
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
