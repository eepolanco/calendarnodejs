/*
    Rutas de Eventos / Events
    host + /api/events
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');
const { 
    getEvents,
    createEvents,
    updateEvents,
    deleteEvents
} = require("./../controllers/events")

const router = Router();

router.use(validateFields);
router.use(validateJWT);

router.get('/',  getEvents);
router.post('/', 
[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validateFields,
],
createEvents);

router.put('/:id',
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validateFields,
updateEvents);

router.delete('/:id', deleteEvents);

module.exports = router;

