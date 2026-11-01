import express from "express";
const app = express();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send({ massage: "hello" });
});

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

connectToMongoDB();
app.listen(PORT, () => {
  console.log(`server in ruining is PORT ${PORT}`);
});
