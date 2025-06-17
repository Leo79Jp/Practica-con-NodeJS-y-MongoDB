const { connect, disconnect } = require("./db/connection");
const { ObjectId } = require("mongodb");
const express = require("express");
const { validarFruta, validarFrutaParcialmente } = require("./schemas/frutas.js");
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
    if (!frutas || frutas.length === 0) {
      res.status(404).json({ error: "No hay frutas" });
    }else{
      res.json(frutas);
    }
  } catch (err) { 
    res.status(500).json({ error: "Error al conectar a la base de datos" });
  }
});

app.post("/frutas",  async(req, res) => {
  const fruta = validarFruta(req.body)
  if (!fruta.success) {
    console.log('entro por aca');
    res.status(400).json({ error: fruta.error.message });
  }
  try {
    await req.db.insertOne(fruta.data);
    res.status(201).json(fruta.data);
  } catch (err) {
    res.status(500).json({ error: "Error al crear la fruta" });
  }
});

app.delete("/frutas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const {deletedCount} = await req.db.deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) {
      res.status(404).json({ error: "No hay fruta" });
    } else {  
      res.status(204).json({ message: "Fruta borrada" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al borrar la fruta" });
  }
});

app.patch("/frutas/:id", async (req, res) => {
  const fruta = validarFrutaParcialmente(req.body);
  const frutaNueva =  fruta.data;
  const { id } = req.params;

  if (!fruta.success) {
    res.status(400).json({ error: fruta.error.message });
  }

  try {
    const { value } = await req.db.findOneAndUpdate({ _id: new ObjectId(id) }, 
      { $set: frutaNueva });

    if (!{value}) {
      res.status(404).json({ message: "No se encontro la fruta para actualizar" });
    } else {
      const frutaModificada = await req.db.findOne({ _id: new ObjectId(id) });
      res.status(200).json({frutaModificada});
    }
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la fruta" });
  }
}); 

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
