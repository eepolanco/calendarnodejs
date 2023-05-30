const { request, response } = require("express");
const Evento = require('../models/Evento')

const getEvents = async (req = request, res = response) => {

  const eventos = await Evento.find()
                    .populate('user', 'name');
  return res.json({
    ok: true,
    eventos
  });
};

const createEvents = async (req = request, res = response) => {

  const event = new Evento( req.body );

  try {
    event.user = req.uid;
    const eventoDb = await event.save();
    return res.status(201).json({
      ok: true,
      evento: eventoDb
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error guardando en base de datos.'
    }) 
  }
  
};

const updateEvents = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    let evento = await Evento.findById(id);

    if(!evento) {
      return res.status(400).json({
        ok: false,
        msg: 'El evento no existe.'
      }) 
    }

    if(evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No está autorizado para modificar este recurso.'
      }) 
    }

    const nuevoEvento = {
      ...req.body,
      user: req.uid
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(id, nuevoEvento, { new: true })

    return res.status(200).json({
      ok: true,
      evento: eventoActualizado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error guardando en base de datos.'
    }) 
  }
};

const deleteEvents = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    let evento = await Evento.findById(id);

    if(!evento) {
      return res.status(400).json({
        ok: false,
        msg: 'El evento no existe.'
      }) 
    }

    if(evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No está autorizado para eliminar este recurso.'
      }) 
    }

    await Evento.findByIdAndDelete(id)

    return res.status(204).json({});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hubo un error eliminando en base de datos.'
    }) 
  }
};

module.exports = {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
};
