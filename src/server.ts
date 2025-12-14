import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';
import rolesRoutes from './routes/roles';
import usersRoutes from './routes/users'; 
import clientRoutes from './routes/clientes';
import funcionariosRoutes from './routes/funcionarios';
import categoriasRoutes from './routes/categorias';
import fornecedoresRoutes from './routes/fornecedores';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/roles', rolesRoutes);
app.use('/users', usersRoutes);
app.use('/clientes', clientRoutes);
app.use('/funcionarios', funcionariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/fornecedores', fornecedoresRoutes);

export default app; 