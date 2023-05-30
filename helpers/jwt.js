const jwt = require('jsonwebtoken');

function generateJWT( uid, name ) {
    return new Promise( (resolve, reject) => {
        const payload = { uid, name };
        console.log('====================================');
        console.log(payload);
        console.log('====================================');
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {
            if(err) {
                console.error(err);
                reject("No se pudo generar el token");
            }

            resolve( token )
        });
    })
}

module.exports = {
    generateJWT
}