const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Haven Hub Server is Running");
});

app.listen(port, () => {
  console.log(`haven hub listening to port ${port}`);
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://haven-hub:yPRHbsnc45sbKGZB@cluster0.k9jkjo0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const addProduct = client.db("havenHub").collection("addProduct");
    const addCart = client.db("havenHub").collection("addCart");

    // product Info
    app.post("/addProducts", async (req, res) => {
      const addProducts = req.body;
      const result = await addProduct.insertOne(addProducts);
      res.send(result);
    });
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = await addProduct.find(query).toArray();
      res.send(cursor);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const productDetails = await addProduct.findOne(query);
      res.send(productDetails);
    });

    // cartDetails
    app.post("/addCart", async (req, res) => {
      const myCart = req.body;
      const query = {
        cartEmail: myCart.cartEmail,
        productId: myCart.productId,
      };
      const alreadyAdded = await addCart.find(query).toArray();
      if (alreadyAdded.length) {
        const message = "You Have Already Added";
        return res.send({ acknowledged: false, message });
      }
      const result = await addCart.insertOne(myCart);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const cartEmail = req.query.cartEmail;
      const query = { cartEmail: cartEmail };
      const result = await addCart.find(query).toArray();
      res.send(result);
    });
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCart.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((e) => console.log(e));
