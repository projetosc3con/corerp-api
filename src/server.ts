import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users';
import rolesRoutes from './routes/roles';

const app = express();

app.use(express.json());
app.use(cors());

// Suas rotas
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);

export default app;
