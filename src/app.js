import express from 'express';
import config from './config.js';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin:'*',
    credentials:true
}));
app.use(cookieParser());

//condfiguracion
app.set('port', config.app.port);

export default app;