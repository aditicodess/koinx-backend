require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const transactionRoutes = require("./routes/transactionRoutes");
const { getEthereumPrice } = require("./middlewares/getEthereumPrice");
const { getEthereumPriceTwo } = require("./middlewares/getEthereumPriceTwo");
const { NAME, PASSWORD } = process.env;

const port = process.env.PORT || 8000;

// database connection
const dbURI = `mongodb+srv://${NAME}:${PASSWORD}@cluster0.yrovkpn.mongodb.net/cryptoTransaction?retryWrites=true&w=majority`;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(port, console.log(`Listening on port ${port}...`))
  )
  .catch((err) => console.log(err));

// middlewares
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
// app.use(getEthereumPrice);
app.use(getEthereumPriceTwo);

// routes
app.use("/api", transactionRoutes);
