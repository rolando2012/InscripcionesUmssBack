import express from 'express';
import config from './config.js';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import materiasRoutes from './routes/materia.route.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin:'*',
    credentials:true
}));
app.use(cookieParser());

//configuracion
app.set('port', config.app.port);

//rutas
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);

export default app;