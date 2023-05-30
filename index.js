const express = require('express');
require('dotenv').config();
const {dbConnection} = require('./database/config');
var cors = require('cors')

const app = express();

dbConnection();

// Directorio publico
app.use( express.static('public') );

// CORS
app.use(cors());

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port http://localhost:${process.env.PORT}/`)
});