const express = require("express"); //importamos express
const app = express(); //creamos una instancia de express
const { productos } = require("./productos.json");
const crypto = require("node:crypto");

app.disable("x-powered-by"); //desactivamos el header x-powered-by
app.use(express.json()); //habilitamos el uso de json

//Rutas
app.get("/", (req, res) => {
  res.send("<h1>Hola mundo</h1>");
});

app.get("/productos", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json(productos);
});

app.get("/productos/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  const index = productos.find((p) => p.id === id);
  if (!index) {
    res.status(404).send("Producto no encontrado");
  } else {
    index.id = id;
    res.json(index);
  }
});

app.post("/productos", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { nombre, precio, url__img, descripcion, categoria } = req.body;
  const nuevoProducto = {
    id: crypto.randomUUID(),
    nombre,
    precio,
    url__img,
    descripcion,
    categoria,
  };
  productos.push(nuevoProducto);
  res.json(productos);
});

app.put("/productos/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  console.log("id", id);
  const { nombre, precio, url__img, descripcion, categoria } = req.body;
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    res.status(404).send("Producto no encontrado");
  } else {
    producto.nombre = nombre;
    producto.precio = precio;
    producto.url__img = url__img;
    producto.descripcion = descripcion;
    producto.categoria = categoria;
    res.status(200).json(productos);
  }
});

app.delete("/productos/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  const index = productos.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).send("Producto no encontrado");
  } else {
    productos.splice(index, 1);
    res.json(productos);
  }
});

//Habilitar CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.send();
});

//iniciamos el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
