const express = require("express");
const app = express();

const path = require("path");
const data = require("./data");
const products = data.products;

const authorize = require("./authorize");
const morgan = require("morgan");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./static"));
app.use(morgan("tiny")); // middleware-function

app.get("/", (req, res) => {
  res.status(200).sendFile("index.html");
});

app.post("/login", (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(403).send("Provide creditials");
  res.send(`Hello ${name}`);
});

app.get("/about", (req, res) => {
  res.status(200).send(`<h3>Node Server developed by WYPA !</h3>`);
});

//authorize is custom middleware-function
app.get("/data", authorize, (req, res) => {
  console.log(req.user);
  const productApi = products.map((product) => {
    const { name, job } = product;
    return { name, job };
  });
  res.status(200).json(productApi);
});

app.get("/data/:id", (req, res) => {
  const id = req.params.id;
  const specificProduct = products.find((p) => p.id === id);
  if (!specificProduct) return res.status(404).send("No such product");
  res.status(200).json(specificProduct);
});

app.get("/data/query/search", (req, res) => {
  console.log(req.query);
  const { namestart, limit } = req.query;
  let modifiedProduct = [...products];

  if (namestart)
    modifiedProduct = modifiedProduct.filter((p) =>
      p.name.toLowerCase().startsWith(namestart)
    );
  if (limit) modifiedProduct = modifiedProduct.splice(0, limit);
  if (modifiedProduct.length < 1) return res.send("No data with this name");
  res.json(modifiedProduct);
});

app.all("*", (req, res) => {
  res.status(404).send(`<h2>Page not found :(</h2>`);
});

const port = process.env.port || 3000;
app.listen(port, () =>
  console.log(`Node server is running on port ${port}...`)
);
