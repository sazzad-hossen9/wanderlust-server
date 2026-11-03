import express from "express";
import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

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
const mongoClient = await connectToMongoDB();
const db = mongoClient.db("wanderlust");
const destinationCollection = db.collection("destination");
const bookingCollection = db.collection("bookings");
app.get("/", (req, res) => {
  res.send({ massage: "hello" });
});

app.post("/add-destination", async (req, res) => {
  const data = req.body;
  const result = await destinationCollection.insertOne(data);
  console.log(result);
  res.send(result);
});

app.get("/destinations", async (req, res) => {
  const result = await destinationCollection.find().toArray();
  console.log(result);
  res.send(result);
});

app.get(
  "/destination/:id",
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "user is logged in") {
      return res.status(401).send({ massage: "unauthorize" });
    }
    next();
  },
  async (req, res) => {
    const id = req.params.id;
    const result = await destinationCollection.findOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  },
);

app.patch("/destination/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await destinationCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
  res.status(200).json(result);
});

app.delete("/destination/:id", async (req, res) => {
  const id = req.params.id;
  const result = await destinationCollection.deleteOne({
    _id: new ObjectId(id),
  });
  res.json(result);
});

//booking
app.post("/booking", async (req, res) => {
  const data = req.body;
  const result = await bookingCollection.insertOne(data);
  res.send(result);
});

//http://localhost:5000/my-booking/email
app.get("/my-booking/:email", async (req, res) => {
  const { email } = req.params;
  const result = await bookingCollection.find({ email: email }).toArray();
  res.send(result);
});
app.delete("/my-booking/:id", async (req, res) => {
  const { id } = req.params;
  const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.listen(PORT, () => {
  console.log(`server in ruining is PORT ${PORT}`);
});
