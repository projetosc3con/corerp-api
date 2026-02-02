import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rolesRoutes from './routes/roles';
import usersRoutes from './routes/users'; 
import clientRoutes from './routes/clientes';
import funcionariosRoutes from './routes/funcionarios';
import categoriasRoutes from './routes/categorias';
import fornecedoresRoutes from './routes/fornecedores';
import estoqueRoutes from './routes/produtos';
import marketRoutes from './routes/marketplace';
import servicosRoutes from './routes/servicos';
import petsRoutes from './routes/pets';
import agendaRoutes from './routes/agendamentos';

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
app.use('/estoque', estoqueRoutes);
app.use('/market', marketRoutes);
app.use('/servicos', servicosRoutes);
app.use('/pets', petsRoutes);
app.use('/agendamentos', agendaRoutes);

export default app; 