import express from 'express'; //ESM
import 'dotenv/config';

import router from './router';
import { connectDB } from './config/db';
import { corsConfig } from "./config/cors";
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

connectDB();

//creamos servidor
const app = express();

//cors
app.use(cors(corsConfig));

//leerdatos tiene que ir antes del router
app.use(express.json());

//utilizamos el router exportado con use para que pueda acceder a cualquier tipo de peticion del router
//Aqui tambien es importante recalcar que si definimos algo en el / se sumara a las otras rutas, osea sera un prefijo
app.use('/', router);

//exportamos la app
export default app;