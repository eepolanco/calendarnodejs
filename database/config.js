const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION);
        
        console.log('====================================');
        console.log('DB Online');
        console.log('====================================');
    } catch (error) {
        console.error(error);
        throw new Error("Error de conexion a base de datos.")

    }
}

module.exports = {
    dbConnection
}