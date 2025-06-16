const { connect, disconnect } = require("./db/connection");
const { ObjectId } = require("mongodb");
const express = require("express");
const {
  validarFruta,
  validarFrutaParcialmente,
} = require("./schemas/frutas.js");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de MongoDB con NodeJS");
});

app.use("/frutas", async (req, res, next) => {
  try {
    const client = await connect();
    req.db = client.db("frutasDB").collection("frutas");
    next();
  } catch (error) {
    console.error({ error });
  }
  res.on("finish", async () => {
    await disconnect();
  });
});

app.get("/frutas", async (req, res) => {
    try {
    const frutas = await req.db.find({}).toArray();
    if (!frutas) {
        res.status(404).json({ error: "No hay frutas" });
    }
    res.json(frutas);
    } catch (err) {
    res.status(500).json({ error: "Error al conectar a la base de datos" });
    }
});

app.get("/frutas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const fruta = await req.db.findOne({ _id: new ObjectId(id)});
    if (!fruta) {
      res.status(404).json({ error: "No hay fruta" });
    } else {
      res.json(fruta);
    }
  } catch (err) {
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});

app.get("/frutas/nombre/:nombre", async (req, res) => {
  const { nombre } = req.params;
  try {
    const frutas = await req.db.find({nombre: { $regex: nombre }}).toArray();
    if (!frutas) {
      res.status(404).json({ error: "No hay frutas" });
    }
    res.json(frutas);
  } catch (err) {
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});

app.get("/frutas/precio/:precio", async (req, res) => {
  const precio = parseInt(req.params.precio);
  try {
    const frutas = await req.db.find({ precio: { $gte: precio } }).toArray();
    if (!frutas) {
      res.status(404).json({ error: "No hay frutas" });
    }
    res.json(frutas);
  } catch (err) {
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
