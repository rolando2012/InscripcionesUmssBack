import express from 'express';
import {  obtenerOfertaAcademica } from '../controllers/materia.controller.js';

const router = express.Router();

router.get('/oferta-academica/:idestudiante', obtenerOfertaAcademica);

export default router;