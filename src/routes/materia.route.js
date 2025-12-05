import express from 'express';
import {  obtenerGruposMateria, obtenerOfertaAcademica } from '../controllers/materia.controller.js';

const router = express.Router();

router.get('/oferta-academica/:idestudiante', obtenerOfertaAcademica);
router.get('/grupos/:codigoMateria', obtenerGruposMateria);

export default router;