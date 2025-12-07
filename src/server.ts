import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';

import rolesRoutes from './routes/roles';
import usersRoutes from './routes/users'; // caso exista

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/roles', rolesRoutes);
app.use('/users', usersRoutes); // se tiver

export const handler = serverless(app); // <- importante
