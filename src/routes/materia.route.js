import express from 'express';
import {  obtenerOfertaAcademica } from '../controllers/materia.controller.js';

const router = express.Router();

router.get('/lista', obtenerOfertaAcademica);

export default router;