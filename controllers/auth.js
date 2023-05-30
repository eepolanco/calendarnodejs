const { response, request } = require("express");
const Usuario = require("../models/usuario.model");
const bcrypt = require('bcryptjs');
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req = request, res = response) => {
  
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    
    if(usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario existe con ese correo.'
      });
    }

    usuario = new Usuario(req.body);

    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    const token = await generateJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error guardando en base de datos.'
    })    
  }
};

const loginUser = async (req, res = response) =>  {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    
    if(!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Email o password incorrecto.'
      });
    }

    //Password Confirmation
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if(!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto.'
      })
    }

    const token = await generateJWT(usuario.id, usuario.name);
    console.log('====================================');
    console.log(token);
    console.log('====================================');
    return res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hubo un error guardando en base de datos.'
    })  
  }
};

const revalidateToken = async (req, res = response) => {

  const { uid, name } = req;
  const token = await generateJWT(uid, name);

    res.json({
      ok: true,
      token
    });
};

module.exports = {
  createUser,
  loginUser,
  revalidateToken,
};
