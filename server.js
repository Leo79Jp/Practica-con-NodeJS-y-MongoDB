const {connect, disconnect} = require('./db/connection');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de MongoDB con NodeJS');
});

app.get('/frutas', async(req, res) => {
    const client = await connect();
    try {
        // modo mas largo
        const db = client.db('frutasDB');
        const frutas = await db.collection('frutas').find({}).toArray();
        if(!frutas) {
            res.status(404).json({error: 'No hay frutas'});
        }
        res.json(frutas);
    } catch (err) {
        res.status(500).json({error: 'Error al conectar a la base de datos'});
    }finally {
        disconnect();
    }
});

app.get('/frutas/:id', async (req, res) => {
        const client = await connect();
        const id = parseInt(req.params.id);
    try {
        // modo mas corto 
        const fruta = await client.db('frutasDB').collection('frutas').findOne({id});
        if(!fruta) {
            res.status(404).json({error: 'No hay fruta'});
        }else{
            res.json(fruta);
        }
    } catch (err) {
        res.status(500).json({error: 'Error al conectar a la base de datos'});
    }finally {
        disconnect();
    }

});

app.get('/frutas/nombre/:nombre', async(req, res) => {  
    const {nombre} = req.params;
    const regExp = new RegExp(/^[a-z]+$/);
    if(!regExp.test(nombre)) {
        res.status(400).json({error: 'Nombre no valido'});
    }
    const client = await connect();
    try {
        const db = client.db('frutasDB');
        const frutas = await db.collection('frutas').find({}).toArray();
        if(!frutas) {
            res.status(404).json({error: 'No hay frutas'});
        }
        const coincidencias = frutas.filter((fruta) =>
        fruta.nombre.toLowerCase().includes(nombre.toLowerCase()))

        res.json(coincidencias);
    } catch (err) {
        res.status(500).json({error: 'Error al conectar a la base de datos'});
    }finally {
        disconnect();
    }
});

app.get('/frutas/precio/:precio', async(req, res) => {
    const {precio} = req.params;
    const regExp = new RegExp(/^[0-9]+$/);
    if(!regExp.test(precio)) {
        res.status(400).json({error: 'Precio no valido'});
    }
    const client = await connect();
    try {
        const db = client.db('frutasDB');
        const frutas = await db.collection('frutas').find({}).toArray();
        if(!frutas) {
            res.status(404).json({error: 'No hay frutas'});
        }
        const precios = frutas.filter((fruta) =>
            fruta.precio >= parseInt(precio)
        )
        res.json(precios);
    } catch (err) {
        res.status(500).json({error: 'Error al conectar a la base de datos'});
    }finally {
        disconnect();
    }
});


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});