process.loadEnvFile();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI)

async function connect() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        return client;
    } catch (err) {
        console.log(err);
        return null
    }
}

async function disconnect() {
    try {
        await client.close();
        console.log('Desconectado de MongoDB');
    } catch (err) {
        console.log(err);
    }
}

module.exports = {connect, disconnect};